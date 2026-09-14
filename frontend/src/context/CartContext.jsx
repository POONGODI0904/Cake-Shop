import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponsAPI } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetcrumb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetcrumb_saved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('sweetcrumb_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('sweetcrumb_saved', JSON.stringify(savedForLater));
  }, [savedForLater]);

  // Calculate pricing
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal > 1200 ? 0 : 50; // Free delivery over ₹1200
  const tax = Math.round(subtotal * 0.05); // 5% GST on bakery items
  const total = Math.max(0, subtotal - couponDiscount + deliveryFee + tax);

  // Recalculate coupon discount if subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      if (subtotal < (appliedCoupon.minimumAmount || 0)) {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        showToast(`Coupon removed: Minimum order of ₹${appliedCoupon.minimumAmount} required.`, 'info');
      } else {
        let disc = 0;
        if (appliedCoupon.discountType === 'percentage') {
          disc = Math.round((subtotal * appliedCoupon.discountValue) / 100);
          if (appliedCoupon.maximumDiscount && disc > appliedCoupon.maximumDiscount) {
            disc = appliedCoupon.maximumDiscount;
          }
        } else {
          disc = appliedCoupon.discountValue;
        }
        setCouponDiscount(disc);
      }
    } else {
      setCouponDiscount(0);
    }
  }, [subtotal, appliedCoupon]);

  const addToCart = (product, options = {}) => {
    const {
      weight = '500g',
      price = product.price,
      quantity = 1,
      messageOnCake = '',
      isCustom = false,
      customDetails = null
    } = options;

    const cartKey = isCustom
      ? `custom-${Date.now()}`
      : `${product.id}-${weight}-${messageOnCake.trim()}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.cartKey === cartKey);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        const newItem = {
          cartKey,
          productId: product.id,
          name: product.name,
          image: product.images?.front || product.image || (typeof product.images === 'string' ? product.images : ''),
          category: product.category,
          weight,
          price: Number(price),
          quantity,
          eggType: product.eggType || 'Eggless',
          messageOnCake,
          isCustom,
          customDetails
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.name}" (${weight}) to your cart! 🎂`, 'success');
  };

  const updateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
    showToast('Item removed from cart.', 'info');
  };

  const saveForLaterItem = (cartKey) => {
    const item = cartItems.find((i) => i.cartKey === cartKey);
    if (!item) return;
    setCartItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
    setSavedForLater((prev) => [...prev, item]);
    showToast(`"${item.name}" moved to Save For Later.`, 'info');
  };

  const moveToCartFromSaved = (cartKey) => {
    const item = savedForLater.find((i) => i.cartKey === cartKey);
    if (!item) return;
    setSavedForLater((prev) => prev.filter((i) => i.cartKey !== cartKey));
    setCartItems((prev) => [...prev, item]);
    showToast(`"${item.name}" moved back to Cart!`, 'success');
  };

  const removeSavedItem = (cartKey) => {
    setSavedForLater((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  const applyCoupon = async (code) => {
    try {
      const res = await couponsAPI.validate({ code, cartTotal: subtotal });
      setAppliedCoupon(res.data.coupon);
      setCouponDiscount(res.data.discountAmount);
      showToast(res.data.message, 'success');
      return { success: true, message: res.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon removed.', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const totalItemsCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedForLater,
        totalItemsCount,
        subtotal,
        deliveryFee,
        tax,
        total,
        appliedCoupon,
        couponDiscount,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLaterItem,
        moveToCartFromSaved,
        removeSavedItem,
        applyCoupon,
        removeCoupon,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
