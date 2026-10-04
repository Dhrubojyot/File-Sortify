import React, { useState } from 'react';
import { 
  UploadCloud, FileText, Folder, CheckCircle, ArrowRight, Eye, RefreshCw, 
  Search, ShieldAlert, Sparkles, ChevronDown, ChevronRight, Layers, Calendar, Scale, FolderKanban
} from 'lucide-react';
import { formatBytes, getExtension } from '../utils/organizerEngine';

export default function FileOrganizerView({
  files,
  groupedFiles,
  sortMode,
  setSortMode,
  onDropFiles,
  onLoadPreset,
  onExecuteOrganize,
  isOrganized,
  dryRun,
  setDryRun,
  currentPreset,
  directoryName
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState({});

  const toggleFolder = (folderName) => {
    setCollapsedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getExtension(f.name).includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Control Banner & Strategy Picker */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort Strategy:</span>
            <div className="tab-navigation">
              <button
                className={`tab-button ${sortMode === 'extension' ? 'active' : ''}`}
                onClick={() => setSortMode('extension')}
              >
                <Layers size={15} /> By Extension
              </button>
              <button
                className={`tab-button ${sortMode === 'date' ? 'active' : ''}`}
                onClick={() => setSortMode('date')}
              >
                <Calendar size={15} /> By Date (YYYY-MM)
              </button>
              <button
                className={`tab-button ${sortMode === 'size' ? 'active' : ''}`}
                onClick={() => setSortMode('size')}
              >
                <Scale size={15} /> By Size (Small/Large)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Presets:</span>
            <select 
              className="form-select" 
              style={{ padding: '6px 12px', width: 'auto' }}
              value={currentPreset}
              onChange={(e) => onLoadPreset(e.target.value)}
            >
              <option value="downloads">Messy Downloads Folder</option>
              <option value="creative">Creative Studio & Photos</option>
              <option value="codebase">Developer Workspace</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
            <input 
              type="checkbox" 
              checked={dryRun} 
              onChange={(e) => setDryRun(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <span>Dry Run (Preview Mode)</span>
          </label>

          <button className="btn-primary" onClick={onExecuteOrganize}>
            {dryRun ? <Eye size={18} /> : <Sparkles size={18} />}
            {dryRun ? 'Preview Moves' : 'Organize Files Now'}
          </button>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div 
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDropFiles}
      >
        <div className="dropzone-icon-container">
          <UploadCloud size={36} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
          Drag & Drop Files / Folders Here
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Current Active Location: <span className="glow-badge">{directoryName || 'Virtual Sandbox'}</span>
        </p>
        <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
          <input 
            type="file" 
            multiple 
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const loaded = Array.from(e.target.files).map(f => ({
                  name: f.name,
                  size: f.size,
                  date: new Date(f.lastModified).toISOString().split('T')[0]
                }));
                onDropFiles({ preventDefault: () => {}, dataTransfer: { files: loaded } });
              }
            }} 
          />
          Browse Files from Computer
        </label>
      </div>

      {/* Split View: Before vs After */}
      <div className="split-view">
        
        {/* Left Side: Unorganized File List */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div className="panel-title">
              <Folder size={18} style={{ color: '#f59e0b' }} />
              <span>Before: Unorganized Files ({filteredFiles.length})</span>
            </div>
            <div style={{ position: 'relative', width: '180px' }}>
              <input 
                type="text" 
                placeholder="Search..."
                className="form-input"
                style={{ padding: '6px 10px 6px 28px', fontSize: '0.8rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={14} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="file-tree-container">
            {filteredFiles.length === 0 ? (
              <div className="empty-state">No files match your search criteria.</div>
            ) : (
              filteredFiles.map((file, idx) => (
                <div key={idx} className="file-item">
                  <div className="file-info">
                    <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatBytes(file.size)} • {file.date || 'Today'}</div>
                    </div>
                  </div>
                  <span 
                    className="category-tag" 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-light)' 
                    }}
                  >
                    {getExtension(file.name) || 'RAW'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Organized Folder Hierarchy */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <div className="panel-title">
              <FolderKanban size={18} style={{ color: '#10b981' }} />
              <span>After: Organized Target Structure</span>
            </div>
            <span className="glow-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              {Object.keys(groupedFiles).length} Subfolders
            </span>
          </div>

          <div className="file-tree-container">
            {Object.keys(groupedFiles).length === 0 ? (
              <div className="empty-state">Add or select files to preview folder sorting.</div>
            ) : (
              Object.entries(groupedFiles).map(([folderName, group]) => {
                const isCollapsed = collapsedFolders[folderName];
                const cat = group.category;

                return (
                  <div key={folderName} className="folder-group">
                    <div 
                      className="folder-header"
                      onClick={() => toggleFolder(folderName)}
                    >
                      <div className="folder-title">
                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                        <span style={{ fontSize: '1.1rem' }}>{cat.icon || '📁'}</span>
                        <span style={{ color: cat.color || '#fff' }}>{folderName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="file-size">{formatBytes(group.totalSize)}</span>
                        <span className="folder-files-count">{group.files.length} items</span>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div style={{ padding: '8px 12px 12px 28px', background: 'rgba(0, 0, 0, 0.2)' }}>
                        {group.files.map((file, idx) => (
                          <div key={idx} className="file-item" style={{ padding: '6px 10px', background: 'transparent' }}>
                            <div className="file-info">
                              <ArrowRight size={14} style={{ color: cat.color || 'var(--text-muted)' }} />
                              <span className="file-name" style={{ fontSize: '0.84rem' }}>{file.name}</span>
                            </div>
                            <span className="file-size">{formatBytes(file.size)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
