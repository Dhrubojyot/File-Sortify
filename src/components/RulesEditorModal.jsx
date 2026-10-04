import React, { useState } from 'react';
import { Plus, Trash2, Edit3, RotateCcw, Check, X, Shield, Tags } from 'lucide-react';
import { DEFAULT_RULES } from '../utils/organizerEngine';

export default function RulesEditorModal({ rules, setRules }) {
  const [editingId, setEditingId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: '📁',
    color: '#8b5cf6',
    extensions: ''
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.name.trim() || !newCategory.extensions.trim()) return;

    const extArray = newCategory.extensions
      .split(',')
      .map(ext => ext.trim())
      .filter(ext => ext.length > 0)
      .map(ext => ext.startsWith('.') ? ext : `.${ext}`);

    const created = {
      id: `custom-${Date.now()}`,
      name: newCategory.name.trim(),
      icon: newCategory.icon || '📁',
      color: newCategory.color || '#8b5cf6',
      bgColor: `${newCategory.color}25`,
      extensions: extArray
    };

    setRules([...rules, created]);
    setNewCategory({ name: '', icon: '📁', color: '#8b5cf6', extensions: '' });
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Reset all rules back to default factory settings?')) {
      setRules(DEFAULT_RULES);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Category Rules & Extension Mappings</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Configure target folders and associated file extensions for automatic sorting.
          </p>
        </div>
        <button className="btn-danger" onClick={handleRestoreDefaults}>
          <RotateCcw size={16} /> Restore Defaults
        </button>
      </div>

      {/* Add New Rule Form */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} style={{ color: 'var(--primary)' }} /> Create Custom Folder Category
        </h3>
        <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px 2fr auto', gap: '12px', alignItems: 'end' }}>
          <div>
            <label className="form-label">Category Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 3D Assets"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Icon</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="📦"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Color</label>
            <input 
              type="color" 
              className="form-input" 
              style={{ padding: '4px', height: '42px', cursor: 'pointer' }}
              value={newCategory.color}
              onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Extensions (comma separated)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder=".fbx, .obj, .blend, .stl"
              value={newCategory.extensions}
              onChange={(e) => setNewCategory({ ...newCategory, extensions: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ height: '42px' }}>
            Add Category
          </button>
        </form>
      </div>

      {/* Rules List Grid */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tags size={18} style={{ color: 'var(--secondary)' }} /> Active Rule Definitions ({rules.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {rules.map((rule) => (
            <div 
              key={rule.id} 
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{rule.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: rule.color }}>{rule.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rule.extensions.length} extensions</span>
                  </div>
                </div>
                <button 
                  className="btn-danger" 
                  style={{ padding: '6px 10px' }} 
                  onClick={() => handleDeleteRule(rule.id)}
                  title="Delete category rule"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Extensions Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {rule.extensions.map((ext, i) => (
                  <span 
                    key={i} 
                    style={{
                      background: rule.bgColor || 'rgba(255, 255, 255, 0.06)',
                      color: rule.color,
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${rule.color}40`
                    }}
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
