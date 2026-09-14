import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Calendar,
  Clock,
  Truck,
  ShieldCheck,
  Check,
  Share2,
  ChevronRight,
  Upload,
  MessageSquare
} from 'lucide-react';
import { productsAPI, reviewsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedEggType, setSelectedEggType] = useState('Eggless');
  const [selectedFlavour, setSelectedFlavour] = useState('');
  const [messageOnCake, setMessageOnCake] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState('Evening (4:00 PM - 8:00 PM)');
  const [activeTab, setActiveTab] = useState('description');
  const [addedAnim, setAddedAnim] = useState(false);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewPhoto, setNewReviewPhoto] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getById(id);
        const prod = res.data.product;
        setProduct(prod);
        setRelated(res.data.related || []);
        setReviews(res.data.reviews || []);

        const initialWeight = prod.weights?.[0] || { weight: '500g', price: prod.price };
        setSelectedWeight(initialWeight);
        setSelectedEggType(prod.eggType || 'Eggless');
        setSelectedFlavour(prod.flavour || 'Chocolate');

        const initialImg = prod.images?.front || (typeof prod.images === 'string' ? prod.images : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop');
        setActiveImage(initialImg);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '3px solid #EFE8DE',
          borderTopColor: '#C6923E',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Cake Not Found</h2>
        <p style={{ color: '#73645C', margin: '12px 0 24px' }}>The cake you're looking for may have been retired.</p>
        <Link to="/cakes" className="btn-primary">Browse All Cakes</Link>
      </div>
    );
  }

  const currentPrice = selectedWeight?.price || product.price;
  const isFavorited = isInWishlist(product.id);

  const imagesMap = typeof product.images === 'object' && product.images !== null ? product.images : {
    front: product.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
    side: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&auto=format&fit=crop',
    top: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop',
    closeup: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop'
  };

  const handleAddToCart = () => {
    addToCart(product, {
      weight: selectedWeight?.weight || '500g',
      price: currentPrice,
      quantity,
      messageOnCake,
      eggType: selectedEggType,
      flavour: selectedFlavour,
      deliveryDate,
      deliverySlot
    });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    try {
      const res = await reviewsAPI.create({
        productId: product.id,
        rating: newRating,
        review: newReviewText,
        userName: newReviewAuthor || 'Happy Customer',
        image: newReviewPhoto || null
      });
      setReviews((prev) => [res.data.review, ...prev]);
      showToast('Thank you! Your verified review has been published.', 'success');
      setShowReviewForm(false);
      setNewReviewText('');
    } catch (err) {
      showToast('Failed to post review: ' + err.message, 'error');
    }
  };

  return (
    <div style={{ background: '#FAF7F2', padding: '32px 0 80px' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#73645C', marginBottom: '28px' }}>
          <Link to="/" style={{ color: '#8C532B' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/cakes" style={{ color: '#8C532B' }}>Cakes</Link>
          <ChevronRight size={14} />
          <Link to={`/cakes?category=${encodeURIComponent(product.category)}`} style={{ color: '#8C532B' }}>{product.category}</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#2A170E', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Hero Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '48px',
          background: '#FFFFFF',
          borderRadius: '28px',
          padding: '40px',
          border: '1px solid #EFE8DE',
          boxShadow: '0 8px 30px rgba(42, 23, 14, 0.05)',
          marginBottom: '56px'
        }}>
          {/* Left Column: Image Gallery (Front, Side, Top, Close-up) */}
          <div>
            <div style={{
              height: '420px',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#FAF7F2',
              position: 'relative',
              marginBottom: '16px',
              border: '1px solid #EFE8DE'
            }}>
              <img
                src={activeImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {product.discountPercentage > 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  <span className="badge-discount">{product.discountPercentage}% OFF</span>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isFavorited ? '#E11D48' : '#73645C',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <Heart size={20} fill={isFavorited ? '#E11D48' : 'transparent'} />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {Object.entries(imagesMap).map(([angle, url]) => (
                <button
                  key={angle}
                  onClick={() => setActiveImage(url)}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    height: '80px',
                    border: activeImage === url ? '2.5px solid #C6923E' : '1px solid #EFE8DE',
                    padding: '2px',
                    background: '#FAF7F2',
                    position: 'relative'
                  }}
                >
                  <img src={url} alt={angle} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <span style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '2px',
                    right: '2px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    textTransform: 'capitalize',
                    borderRadius: '0 0 6px 6px'
                  }}>
                    {angle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Customizations & Purchase */}
          <div>
            {/* Category & Veg Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#8C532B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {product.category}
              </span>
              <span className="badge-veg">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2E7D32', display: 'inline-block' }}></span>
                {product.eggType || 'Eggless'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#73645C' }}>SKU: {product.sku}</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', color: '#2A170E', marginBottom: '12px', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF3C7', padding: '4px 10px', borderRadius: '8px', color: '#B45309', fontWeight: 700, fontSize: '0.88rem' }}>
                <Star size={15} fill="#B45309" />
                <span>{product.rating || '4.9'}</span>
              </div>
              <span style={{ fontSize: '0.88rem', color: '#73645C' }}>
                ({product.reviewsCount || 86} Verified Buyer Reviews)
              </span>
            </div>

            {/* Dynamic Price Display */}
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              padding: '16px 20px',
              borderRadius: '16px',
              background: '#FAF7F2',
              marginBottom: '24px'
            }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#2A170E' }}>
                ₹{currentPrice}
              </span>
              {product.originalPrice > currentPrice && (
                <span style={{ fontSize: '1.2rem', color: '#A4978E', textDecoration: 'line-through' }}>
                  ₹{Math.round(currentPrice * 1.15)}
                </span>
              )}
              <span style={{ fontSize: '0.85rem', color: '#16A34A', fontWeight: 700 }}>
                Save ₹{Math.round(currentPrice * 0.15)} (15% OFF)
              </span>
            </div>

            {/* Weight Options (Dynamic Price Recalculator) */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2A170E', marginBottom: '10px' }}>
                Select Cake Weight (Price updates dynamically):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                {(product.weights || [
                  { weight: '500g', price: 699, serves: '4-5 people' },
                  { weight: '1kg', price: 1299, serves: '8-10 people' },
                  { weight: '1.5kg', price: 1899, serves: '12-14 people' },
                  { weight: '2kg', price: 2499, serves: '16-18 people' },
                  { weight: '3kg', price: 3699, serves: '24-28 people' },
                  { weight: '5kg', price: 5999, serves: '40-45 people' }
                ]).map((w) => (
                  <button
                    key={w.weight}
                    onClick={() => setSelectedWeight(w)}
                    style={{
                      padding: '10px',
                      borderRadius: '12px',
                      border: selectedWeight?.weight === w.weight ? '2px solid #C6923E' : '1.5px solid #EFE8DE',
                      background: selectedWeight?.weight === w.weight ? 'rgba(198, 146, 62, 0.12)' : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#2A170E' }}>{w.weight}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#8C532B', marginTop: '2px' }}>₹{w.price}</div>
                    <div style={{ fontSize: '0.7rem', color: '#73645C' }}>{w.serves}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Egg / Eggless Preference */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#2A170E', marginBottom: '8px' }}>
                Cake Base Preference:
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setSelectedEggType('Eggless')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: selectedEggType === 'Eggless' ? '2px solid #2E7D32' : '1px solid #EFE8DE',
                    background: selectedEggType === 'Eggless' ? '#E8F5E9' : '#FFFFFF',
                    color: selectedEggType === 'Eggless' ? '#2E7D32' : '#73645C',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  🌱 100% Eggless
                </button>
                <button
                  onClick={() => setSelectedEggType('With Egg')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: selectedEggType === 'With Egg' ? '2px solid #C6923E' : '1px solid #EFE8DE',
                    background: selectedEggType === 'With Egg' ? '#FEF3C7' : '#FFFFFF',
                    color: selectedEggType === 'With Egg' ? '#B45309' : '#73645C',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  🥚 Classic (With Egg)
                </button>
              </div>
            </div>

            {/* Message on Cake Input */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#2A170E', marginBottom: '6px' }}>
                Message on Cake (Complimentary Golden Sugar Piping):
              </label>
              <input
                type="text"
                placeholder="e.g. Happy 25th Birthday Sonia!"
                maxLength={40}
                value={messageOnCake}
                onChange={(e) => setMessageOnCake(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid #EFE8DE',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Delivery Date & Time Slot Picker */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              padding: '18px',
              borderRadius: '16px',
              background: '#FAF7F2',
              marginBottom: '26px',
              border: '1px solid #EFE8DE'
            }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#2A170E', marginBottom: '6px' }}>
                  <Calendar size={14} color="#8C532B" />
                  <span>Delivery Date</span>
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #EFE8DE',
                    fontSize: '0.85rem',
                    background: '#FFFFFF'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#2A170E', marginBottom: '6px' }}>
                  <Clock size={14} color="#8C532B" />
                  <span>Delivery Slot</span>
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #EFE8DE',
                    fontSize: '0.85rem',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12 PM - 4 PM)</option>
                  <option value="Evening (4:00 PM - 8:00 PM)">Evening (4 PM - 8 PM)</option>
                  <option value="Midnight (11:00 PM - 12:00 AM)">Midnight (11 PM - 12 AM) 🌙</option>
                </select>
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              {/* Quantity Counter */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #EFE8DE',
                borderRadius: '999px',
                padding: '4px'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', fontWeight: 700, color: '#2A170E' }}
                >
                  -
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 700 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', fontWeight: 700, color: '#2A170E' }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '14px',
                  background: addedAnim ? '#16A34A' : undefined
                }}
              >
                {addedAnim ? <Check size={18} /> : <ShoppingBag size={18} />}
                <span>{addedAnim ? 'Added to Cart!' : `Add to Cart • ₹${currentPrice * quantity}`}</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="btn-gold"
                style={{ flex: 1, padding: '14px' }}
              >
                <Zap size={18} />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed Info: Description, Ingredients, Allergens, Reviews */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '36px',
          border: '1px solid #EFE8DE',
          marginBottom: '60px'
        }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1.5px solid #EFE8DE', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                fontSize: '1rem',
                fontWeight: activeTab === 'description' ? 800 : 500,
                color: activeTab === 'description' ? '#C6923E' : '#73645C',
                borderBottom: activeTab === 'description' ? '2.5px solid #C6923E' : 'none',
                paddingBottom: '8px'
              }}
            >
              Artisan Description
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              style={{
                fontSize: '1rem',
                fontWeight: activeTab === 'ingredients' ? 800 : 500,
                color: activeTab === 'ingredients' ? '#C6923E' : '#73645C',
                borderBottom: activeTab === 'ingredients' ? '2.5px solid #C6923E' : 'none',
                paddingBottom: '8px'
              }}
            >
              Gourmet Ingredients
            </button>
            <button
              onClick={() => setActiveTab('allergens')}
              style={{
                fontSize: '1rem',
                fontWeight: activeTab === 'allergens' ? 800 : 500,
                color: activeTab === 'allergens' ? '#C6923E' : '#73645C',
                borderBottom: activeTab === 'allergens' ? '2.5px solid #C6923E' : 'none',
                paddingBottom: '8px'
              }}
            >
              Allergen & Storage Info
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                fontSize: '1rem',
                fontWeight: activeTab === 'reviews' ? 800 : 500,
                color: activeTab === 'reviews' ? '#C6923E' : '#73645C',
                borderBottom: activeTab === 'reviews' ? '2.5px solid #C6923E' : 'none',
                paddingBottom: '8px'
              }}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div style={{ color: '#73645C', lineHeight: 1.8, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '14px' }}>{product.description}</p>
              <p>
                Handcrafted under the strict supervision of our French-trained Master Pâtissiers. We use zero preservatives, zero artificial trans-fats, and only fresh whole dairy butter and farm cream.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Ingredients Sourced with Care</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(product.ingredients || ['Belgian Chocolate', 'Vanilla Extract', 'Cream Cheese', 'Organic Wheat']).map((ing, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '8px 16px',
                      background: '#FAF7F2',
                      border: '1px solid #EFE8DE',
                      borderRadius: '999px',
                      fontSize: '0.88rem',
                      color: '#2A170E',
                      fontWeight: 600
                    }}
                  >
                    ✓ {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'allergens' && (
            <div style={{ color: '#73645C', fontSize: '0.95rem', lineHeight: 1.8 }}>
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#2A170E' }}>Contains:</strong>{' '}
                {(product.allergens || ['Dairy', 'Gluten']).join(', ')}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: '#2A170E' }}>Storage & Shelf Life:</strong><br />
                Store refrigerated between 2°C to 5°C. For optimal texture and mouthfeel, let sit at room temperature for 15 minutes before cutting. Best enjoyed within 48 hours of delivery.
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: '#2A170E' }}>Customer Feedback</h4>
                  <p style={{ fontSize: '0.85rem', color: '#73645C' }}>Only verified purchasers can leave reviews.</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-outline"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  <MessageSquare size={16} />
                  <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
                </button>
              </div>

              {/* Review submission form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  style={{
                    background: '#FAF7F2',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px',
                    border: '1px solid #EFE8DE'
                  }}
                >
                  <h5 style={{ fontSize: '1.05rem', marginBottom: '14px' }}>Share Your Experience</h5>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Rating:</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setNewRating(s)}
                          style={{ color: s <= newRating ? '#B45309' : '#D1D5DB' }}
                        >
                          <Star size={24} fill={s <= newRating ? '#B45309' : 'transparent'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Your Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Radhika Sen"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #EFE8DE' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Photo URL (Optional):</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newReviewPhoto}
                        onChange={(e) => setNewReviewPhoto(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #EFE8DE' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Your Review:</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="How was the taste, packaging, and delivery?"
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #EFE8DE', fontSize: '0.9rem' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                    Submit Verified Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.length === 0 ? (
                  <p style={{ color: '#73645C', fontStyle: 'italic' }}>Be the first sweet lover to review this masterpiece!</p>
                ) : (
                  reviews.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        padding: '18px',
                        borderRadius: '14px',
                        background: '#FAF7F2',
                        border: '1px solid #EFE8DE'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 700, color: '#2A170E' }}>{r.userName}</div>
                        <div style={{ display: 'flex', gap: '2px', color: '#B45309' }}>
                          {[...Array(r.rating || 5)].map((_, i) => (
                            <Star key={i} size={14} fill="#B45309" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.92rem', color: '#73645C', lineHeight: 1.6 }}>{r.review}</p>
                      {r.image && (
                        <img
                          src={r.image}
                          alt="Customer review photo"
                          style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', marginTop: '10px' }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section: "Customers who bought this also liked..." */}
        {related.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ color: '#8C532B', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Personalized Recommendations
              </span>
              <h3 style={{ fontSize: '2rem', color: '#2A170E', marginTop: '4px' }}>
                Customers Who Bought This Also Liked
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}>
              {related.map((cake) => (
                <ProductCard key={cake.id} product={cake} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
