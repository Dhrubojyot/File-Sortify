import React from 'react';
import { FolderCheck, Settings, Code, History, Play, Sparkles, FolderSearch } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onPickRealDirectory, supportsPicker, onResetMock }) {
  return (
    <header className="app-header">
      <div className="app-brand">
        <div className="app-brand-logo">
          <FolderCheck size={26} />
        </div>
        <div>
          <h1 className="app-title">File Sortify Pro</h1>
          <p className="app-subtitle">Intelligent Automatic File Organizer & Rule Manager</p>
        </div>
      </div>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'organize' ? 'active' : ''}`}
          onClick={() => setActiveTab('organize')}
        >
          <Sparkles size={16} />
          Organize Workspace
        </button>
        <button
          className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <Settings size={16} />
          Category Rules
        </button>
        <button
          className={`tab-button ${activeTab === 'cli' ? 'active' : ''}`}
          onClick={() => setActiveTab('cli')}
        >
          <Code size={16} />
          CLI & Scripts
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={16} />
          Activity Log
        </button>
      </nav>

      <div style={{ display: 'flex', gap: '10px' }}>
        {supportsPicker ? (
          <button className="btn-primary" onClick={onPickRealDirectory}>
            <FolderSearch size={18} />
            Pick Disk Folder
          </button>
        ) : null}
        <button className="btn-secondary" onClick={onResetMock}>
          <Play size={16} />
          Load Demo Preset
        </button>
      </div>
    </header>
  );
}
