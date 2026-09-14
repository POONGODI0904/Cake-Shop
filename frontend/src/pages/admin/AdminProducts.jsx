import React, { useState, useEffect } from 'react';
import {
  Cake,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Eye,
  Star,
  Layers,
  Sparkles
} from 'lucide-react';
import { productsAPI, categoriesAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { showToast } = useToast();

  // Form State
  const initialForm = {
    name: '',
    category: 'Chocolate Cakes',
    description: '',
    ingredients: 'Pure Belgian Cocoa, Farm Cream, Butter, Flour',
    flavour: 'Chocolate',
    weight: '500g',
    price: 699,
    originalPrice: 799,
    discountPercentage: 13,
    stock: 20,
    sku: 'SWT-CHK-001',
    eggType: 'Eggless',
    images: {
      front: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
      side: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&auto=format&fit=crop',
      top: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop',
      closeup: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop'
    },
    featured: true,
    bestseller: false,
    status: 'active'
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProducts = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      sku: `SWT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    });
    setShowModal(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : prod.ingredients,
      flavour: prod.flavour,
      weight: prod.weights?.[0]?.weight || '500g',
      price: prod.price,
      originalPrice: prod.originalPrice || Math.round(prod.price * 1.15),
      discountPercentage: prod.discountPercentage || 0,
      stock: prod.stock,
      sku: prod.sku,
      eggType: prod.eggType || 'Eggless',
      images: prod.images || initialForm.images,
      featured: Boolean(prod.featured),
      bestseller: Boolean(prod.bestseller),
      status: prod.status || 'active'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        showToast(`"${formData.name}" updated successfully!`, 'success');
      } else {
        await productsAPI.create(formData);
        showToast(`New cake "${formData.name}" added to catalog!`, 'success');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await productsAPI.delete(id);
        showToast(`Cake "${name}" deleted from catalog.`, 'info');
        fetchProducts();
      } catch (err) {
        showToast('Failed to delete cake: ' + err.message, 'error');
      }
    }
  };

  const handleToggleStatus = async (prod) => {
    const nextStatus = prod.status === 'active' ? 'disabled' : 'active';
    try {
      await productsAPI.update(prod.id, { status: nextStatus });
      showToast(`Status changed to ${nextStatus}`, 'success');
      fetchProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Product Management</h1>
          <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
            Add, update, or remove cakes. Updates immediately reflect in the customer catalog!
          </p>
        </div>

        <button onClick={openAddModal} className="btn-gold" style={{ padding: '12px 24px' }}>
          <Plus size={18} />
          <span>Add New Cake</span>
        </button>
      </div>

      {/* Toolbar */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px 20px',
        border: '1px solid #EFE8DE',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <input
            type="text"
            placeholder="Search cakes by name, category, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: '8px', border: '1.5px solid #EFE8DE', outline: 'none' }}
          />
          <Search size={16} color="#A4978E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <span style={{ fontSize: '0.85rem', color: '#73645C', fontWeight: 600 }}>
          Total Catalog: {filteredProducts.length} Cakes
        </span>
      </div>

      {/* Product Table (Section 25 of Spec) */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EFE8DE', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#FAF7F2', borderBottom: '2px solid #EFE8DE', textAlign: 'left', color: '#8C532B', fontSize: '0.78rem' }}>
                <th style={{ padding: '14px 16px' }}>CAKE</th>
                <th style={{ padding: '14px 16px' }}>CATEGORY</th>
                <th style={{ padding: '14px 16px' }}>PRICE / WEIGHT</th>
                <th style={{ padding: '14px 16px' }}>STOCK</th>
                <th style={{ padding: '14px 16px' }}>BADGES</th>
                <th style={{ padding: '14px 16px' }}>STATUS</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid #F4ECE1' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={prod.images?.front || prod.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'}
                        alt={prod.name}
                        style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#2A170E' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#73645C' }}>SKU: {prod.sku} • {prod.eggType}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#8C532B', fontWeight: 600 }}>
                    {prod.category}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#2A170E' }}>₹{prod.price}</div>
                    <div style={{ fontSize: '0.75rem', color: '#73645C' }}>Base: {prod.weights?.[0]?.weight || '500g'}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontWeight: 700,
                      color: prod.stock <= 5 ? '#E11D48' : '#16A34A',
                      background: prod.stock <= 5 ? '#FFF1F2' : '#F0FDF4',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {prod.stock} left
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {prod.bestseller && <span className="badge-gold">Best</span>}
                      {prod.featured && <span className="badge-gold" style={{ background: '#FAF7F2' }}>Featured</span>}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleToggleStatus(prod)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: prod.status === 'active' ? '#E8F5E9' : '#FEE2E2',
                        color: prod.status === 'active' ? '#2E7D32' : '#DC2626'
                      }}
                    >
                      {prod.status === 'active' ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(prod)}
                        className="btn-outline"
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        title="Edit cake"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        style={{ padding: '6px 10px', borderRadius: '999px', border: '1px solid #FDA4AF', color: '#E11D48' }}
                        title="Delete cake"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Cake Modal Form (Section 25 & 26) */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            maxWidth: '780px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #EFE8DE',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#2A170E' }}>
                {editingProduct ? `Edit Cake: ${editingProduct.name}` : 'Add New Luxury Cake'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ color: '#73645C' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Cake Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Artisan Description</label>
                <textarea
                  rows={2}
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Inventory Stock</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SKU</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Flavour</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.flavour}
                    onChange={(e) => setFormData({ ...formData, flavour: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Egg Preference</label>
                  <select
                    className="form-input"
                    value={formData.eggType}
                    onChange={(e) => setFormData({ ...formData, eggType: e.target.value })}
                  >
                    <option value="Eggless">100% Eggless</option>
                    <option value="With Egg">With Egg</option>
                  </select>
                </div>
              </div>

              {/* Multiple Images (Section 26 of Spec: Front, Side, Top, Close-up) */}
              <div style={{ background: '#FAF7F2', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #EFE8DE' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#2A170E', marginBottom: '10px' }}>
                  Product Images (Front, Side, Top, Close-up Gallery)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <input
                    type="url"
                    placeholder="Front View Image URL"
                    className="form-input"
                    value={formData.images?.front || ''}
                    onChange={(e) => setFormData({ ...formData, images: { ...formData.images, front: e.target.value } })}
                  />
                  <input
                    type="url"
                    placeholder="Side View Image URL"
                    className="form-input"
                    value={formData.images?.side || ''}
                    onChange={(e) => setFormData({ ...formData, images: { ...formData.images, side: e.target.value } })}
                  />
                  <input
                    type="url"
                    placeholder="Top View Image URL"
                    className="form-input"
                    value={formData.images?.top || ''}
                    onChange={(e) => setFormData({ ...formData, images: { ...formData.images, top: e.target.value } })}
                  />
                  <input
                    type="url"
                    placeholder="Close-up View Image URL"
                    className="form-input"
                    value={formData.images?.closeup || ''}
                    onChange={(e) => setFormData({ ...formData, images: { ...formData.images, closeup: e.target.value } })}
                  />
                </div>
              </div>

              {/* Switches */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ accentColor: '#C6923E' }}
                  />
                  <span>Featured on Home</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    style={{ accentColor: '#C6923E' }}
                  />
                  <span>Bestseller Badge</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ padding: '12px 28px' }}>
                  <span>{editingProduct ? 'Save Changes' : 'Create Cake Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
