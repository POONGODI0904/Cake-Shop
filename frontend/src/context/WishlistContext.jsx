import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetcrumb_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    localStorage.setItem('sweetcrumb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from Wishlist.`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added "${product.name}" to Wishlist! ❤️`, 'success');
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed from Wishlist.', 'info');
  };

  const moveWishlistToCart = (product) => {
    addToCart(product, {
      weight: product.weights?.[0]?.weight || '500g',
      price: product.price,
      quantity: 1
    });
    removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveWishlistToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
