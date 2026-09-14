import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Trash2, X } from 'lucide-react';
import { categoriesAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'
  });
  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'
    });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
        showToast('Category updated!', 'success');
      } else {
        await categoriesAPI.create(formData);
        showToast('Category created!', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      showToast('Error saving category: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await categoriesAPI.delete(id);
        showToast('Category deleted.', 'info');
        fetchCategories();
      } catch (err) {
        showToast('Failed to delete category', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Category Management</h1>
          <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
            Manage storefront cake categories, cover photos, and occasion collections.
          </p>
        </div>
        <button onClick={openAdd} className="btn-gold" style={{ padding: '12px 24px' }}>
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories (Section 30 of Spec) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #EFE8DE',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
              <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255,255,255,0.92)',
                color: '#8C532B',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '999px'
              }}>
                {cat.productCount || 0} Products
              </span>
            </div>

            <div style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#2A170E', marginBottom: '6px' }}>{cat.name}</h3>
              <p style={{ fontSize: '0.82rem', color: '#73645C', lineHeight: 1.5, marginBottom: '16px' }}>
                {cat.description || 'Artisan cake collection.'}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #F4ECE1', paddingTop: '12px' }}>
                <button
                  onClick={() => openEdit(cat)}
                  className="btn-outline"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #FDA4AF', color: '#E11D48' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '520px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#2A170E' }}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Description</label>
                <textarea
                  rows={2}
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Image URL</label>
                <input
                  type="url"
                  required
                  className="form-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ padding: '10px 24px' }}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
