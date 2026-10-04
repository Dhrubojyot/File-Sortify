import React from 'react';
import { History, RotateCcw, Trash2, CheckCircle2, Folder, Clock } from 'lucide-react';

export default function HistoryLogView({ history, onUndoSession, onClearHistory }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Organization Activity Log</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Review past file organization sessions and revert changes if needed.
          </p>
        </div>
        {history.length > 0 && (
          <button className="btn-danger" onClick={onClearHistory}>
            <Trash2 size={16} /> Clear History
          </button>
        )}
      </div>

      {/* Sessions List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        {history.length === 0 ? (
          <div className="empty-state">
            <History size={42} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>No Organization History Yet</h3>
            <p style={{ fontSize: '0.84rem' }}>Organize your workspace files to create session restore points.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((session, index) => (
              <div 
                key={session.id || index}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Session #{history.length - index}
                      <span className="glow-badge" style={{ fontSize: '0.7rem' }}>{session.sortMode}</span>
                      {session.isDryRun && (
                        <span className="glow-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                          Dry Run
                        </span>
                      )}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {session.timestamp}</span>
                      <span>• {session.movesCount} files organized</span>
                      <span>• Target: {session.directoryName}</span>
                    </p>
                  </div>
                </div>

                {!session.isDryRun && (
                  <button 
                    className="btn-secondary" 
                    style={{ gap: '6px', fontSize: '0.84rem' }}
                    onClick={() => onUndoSession(session)}
                  >
                    <RotateCcw size={14} style={{ color: '#06b6d4' }} /> Undo Session
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
