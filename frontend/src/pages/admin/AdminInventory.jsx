import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Plus, Minus, Search, Check, RefreshCw } from 'lucide-react';
import { productsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const fetchInventory = async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    try {
      await productsAPI.updateStock(product.id, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
      );
      showToast(`Stock for "${product.name}" updated to ${newStock}`, 'success');
    } catch (err) {
      showToast('Failed to adjust stock', 'error');
    }
  };

  const handleSetStock = async (product, value) => {
    const num = Math.max(0, Number(value));
    try {
      await productsAPI.updateStock(product.id, { stock: num });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: num } : p))
      );
      showToast(`Stock updated to ${num}`, 'success');
    } catch (err) {
      showToast('Failed to set stock', 'error');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = products.filter((p) => (p.stock || 0) <= 8);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#2A170E', marginBottom: '4px' }}>Inventory Management</h1>
          <p style={{ color: '#73645C', fontSize: '0.9rem' }}>
            Live stock monitor. Automatically decrements upon checkout; alerts on low levels.
          </p>
        </div>

        <button onClick={fetchInventory} className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
          <RefreshCw size={15} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Low Stock Warning Banner if any items low */}
      {lowStockItems.length > 0 && (
        <div style={{
          background: '#FFF1F2',
          borderRadius: '16px',
          padding: '18px 24px',
          border: '1.5px solid #FDA4AF',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <AlertTriangle size={28} color="#E11D48" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, color: '#9F1239', fontSize: '1rem' }}>
              ⚠️ Low Stock Alert: {lowStockItems.length} Cakes Require Kitchen Restocking!
            </div>
            <div style={{ fontSize: '0.85rem', color: '#9F1239' }}>
              {lowStockItems.map((c) => `${c.name} (${c.stock} left)`).join(' • ')}
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
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
            placeholder="Search inventory by cake or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: '8px', border: '1.5px solid #EFE8DE', outline: 'none' }}
          />
          <Search size={16} color="#A4978E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <span style={{ fontSize: '0.85rem', color: '#73645C', fontWeight: 600 }}>
          Tracking {filtered.length} Items
        </span>
      </div>

      {/* Inventory Grid / Cards (Section 27 of Spec) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filtered.map((prod) => {
          const isLow = (prod.stock || 0) <= 8;
          return (
            <div
              key={prod.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '20px',
                border: isLow ? '1.5px solid #FDA4AF' : '1px solid #EFE8DE',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img
                    src={prod.images?.front || prod.image}
                    alt={prod.name}
                    style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', color: '#2A170E', marginBottom: '2px' }}>
                      {prod.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#8C532B', fontWeight: 600 }}>
                      {prod.category} • SKU: {prod.sku}
                    </div>
                  </div>
                </div>

                {/* Section 27 Requirement: Display "Chocolate Cake — 12 available" */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isLow ? '#FFF1F2' : '#FAF7F2',
                  marginBottom: '16px'
                }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2A170E' }}>
                    {prod.name} — <strong style={{ color: isLow ? '#E11D48' : '#16A34A' }}>{prod.stock} available</strong>
                  </span>
                  {isLow && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#FFE4E6',
                      color: '#E11D48',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <AlertTriangle size={12} /> Low Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F4ECE1', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.82rem', color: '#73645C', fontWeight: 600 }}>Manual Adjustment:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleAdjustStock(prod, -1)}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FAF7F2', border: '1px solid #EFE8DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={prod.stock}
                    onChange={(e) => handleSetStock(prod, e.target.value)}
                    style={{ width: '56px', padding: '6px', textAlign: 'center', borderRadius: '8px', border: '1.5px solid #EFE8DE', fontWeight: 800 }}
                  />
                  <button
                    onClick={() => handleAdjustStock(prod, 1)}
                    style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FAF7F2', border: '1px solid #EFE8DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
