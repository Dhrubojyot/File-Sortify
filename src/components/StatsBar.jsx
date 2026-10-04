import React from 'react';
import { Files, HardDrive, Layers, Zap } from 'lucide-react';
import { formatBytes } from '../utils/organizerEngine';

export default function StatsBar({ totalFiles, totalSize, categoriesCount, isOrganized }) {
  return (
    <div className="stats-grid">
      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
          <Files size={24} />
        </div>
        <div>
          <div className="stat-val">{totalFiles}</div>
          <div className="stat-lbl">Total Files Detected</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
          <HardDrive size={24} />
        </div>
        <div>
          <div className="stat-val">{formatBytes(totalSize)}</div>
          <div className="stat-lbl">Total Storage Size</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
          <Layers size={24} />
        </div>
        <div>
          <div className="stat-val">{categoriesCount}</div>
          <div className="stat-lbl">Target Folders</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
          <Zap size={24} />
        </div>
        <div>
          <div className="stat-val" style={{ color: isOrganized ? '#10b981' : '#f59e0b' }}>
            {isOrganized ? '100%' : '0%'}
          </div>
          <div className="stat-lbl">{isOrganized ? 'Status: Organized' : 'Status: Unorganized'}</div>
        </div>
      </div>
    </div>
  );
}
