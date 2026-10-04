import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import FileOrganizerView from './components/FileOrganizerView';
import RulesEditorModal from './components/RulesEditorModal';
import CodeExporterView from './components/CodeExporterView';
import HistoryLogView from './components/HistoryLogView';
import { 
  DEFAULT_RULES, MOCK_PRESETS, organizeFiles, getExtension, matchCategory 
} from './utils/organizerEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('organize');
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem('organizer_rules');
    return saved ? JSON.parse(saved) : DEFAULT_RULES;
  });

  const [currentPreset, setCurrentPreset] = useState('downloads');
  const [files, setFiles] = useState(MOCK_PRESETS.downloads);
  const [sortMode, setSortMode] = useState('extension');
  const [dryRun, setDryRun] = useState(true);
  const [isOrganized, setIsOrganized] = useState(false);
  const [directoryName, setDirectoryName] = useState('Demo: Messy Downloads');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('organizer_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState(null);
  const [realDirectoryHandle, setRealDirectoryHandle] = useState(null);

  // Check if browser supports showDirectoryPicker
  const supportsPicker = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

  // Persist rules to local storage
  useEffect(() => {
    localStorage.setItem('organizer_rules', JSON.stringify(rules));
  }, [rules]);

  // Persist history log to local storage
  useEffect(() => {
    localStorage.setItem('organizer_history', JSON.stringify(history));
  }, [history]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load Preset Files
  const handleLoadPreset = (presetKey) => {
    setCurrentPreset(presetKey);
    setRealDirectoryHandle(null);
    if (presetKey === 'downloads') {
      setFiles(MOCK_PRESETS.downloads);
      setDirectoryName('Demo: Messy Downloads');
    } else if (presetKey === 'creative') {
      setFiles(MOCK_PRESETS.creative);
      setDirectoryName('Demo: Creative Studio & Photos');
    } else if (presetKey === 'codebase') {
      setFiles(MOCK_PRESETS.codebase);
      setDirectoryName('Demo: Developer Workspace');
    }
    setIsOrganized(false);
    showToast(`Loaded ${presetKey.toUpperCase()} demo file preset!`);
  };

  // Handle Pick Real Directory on Computer (File System Access API)
  const handlePickRealDirectory = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      setRealDirectoryHandle(handle);
      setDirectoryName(`Disk: ${handle.name}`);

      const realFiles = [];
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && !entry.name.startsWith('.')) {
          const fileData = await entry.getFile();
          realFiles.push({
            name: fileData.name,
            size: fileData.size,
            date: new Date(fileData.lastModified).toISOString().split('T')[0],
            handle: entry
          });
        }
      }

      setFiles(realFiles);
      setIsOrganized(false);
      showToast(`Loaded ${realFiles.length} file(s) from real directory "${handle.name}"!`, 'info');
    } catch (err) {
      if (err.name !== 'AbortError') {
        showToast(`Directory access failed: ${err.message}`, 'error');
      }
    }
  };

  // Drag and drop files upload
  const handleDropFiles = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles).map(f => ({
        name: f.name,
        size: f.size,
        date: new Date(f.lastModified || Date.now()).toISOString().split('T')[0]
      }));
      setFiles(newFiles);
      setDirectoryName('Custom Uploaded Workspace');
      setIsOrganized(false);
      showToast(`Imported ${newFiles.length} dropped file(s)!`);
    }
  };

  // Compute grouped folders based on current sorting engine
  const groupedFiles = organizeFiles(files, rules, sortMode);
  const totalFiles = files.length;
  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const categoriesCount = Object.keys(groupedFiles).length;

  // Execute Organize Operation
  const handleExecuteOrganize = async () => {
    if (files.length === 0) {
      showToast('No files to organize.', 'error');
      return;
    }

    // Real Directory Disk Modification (if real handle is active and not dry run)
    if (realDirectoryHandle && !dryRun) {
      try {
        for (const [folderName, group] of Object.entries(groupedFiles)) {
          const subDirHandle = await realDirectoryHandle.getDirectoryHandle(folderName, { create: true });
          for (const fileObj of group.files) {
            if (fileObj.handle) {
              const fileData = await fileObj.handle.getFile();
              const newFileHandle = await subDirHandle.getFileHandle(fileObj.name, { create: true });
              const writable = await newFileHandle.createWritable();
              await writable.write(fileData);
              await writable.close();
              // Remove original file if supported
              if (realDirectoryHandle.removeEntry) {
                await realDirectoryHandle.removeEntry(fileObj.name).catch(() => {});
              }
            }
          }
        }
      } catch (err) {
        console.warn('Real disk write notice:', err);
      }
    }

    // Create session history log
    const sessionLog = {
      id: `session-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sortMode: sortMode.toUpperCase(),
      directoryName,
      movesCount: files.length,
      isDryRun: dryRun,
      previousFiles: [...files]
    };

    setHistory(prev => [sessionLog, ...prev]);

    if (dryRun) {
      showToast(`[DRY RUN] Previewed organizing ${files.length} files into ${categoriesCount} subfolders!`, 'info');
    } else {
      setIsOrganized(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      showToast(`🎉 Successfully organized ${files.length} file(s) into ${categoriesCount} subfolders!`);
    }
  };

  // Undo Session
  const handleUndoSession = (session) => {
    if (session.previousFiles) {
      setFiles(session.previousFiles);
      setIsOrganized(false);
      showToast(`Reverted organization session from ${session.timestamp}!`, 'info');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('Activity log history cleared.', 'info');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Banner */}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            background: toast.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 
                        toast.type === 'info' ? 'rgba(6, 182, 212, 0.95)' : 'rgba(16, 185, 129, 0.95)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.88rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPickRealDirectory={handlePickRealDirectory}
        supportsPicker={supportsPicker}
        onResetMock={() => handleLoadPreset('downloads')}
      />

      {/* Main Workspace */}
      <main className="main-container">
        
        {/* Top Metrics Stats */}
        <StatsBar
          totalFiles={totalFiles}
          totalSize={totalSize}
          categoriesCount={categoriesCount}
          isOrganized={isOrganized}
        />

        {/* Tab 1: Organize Workspace View */}
        {activeTab === 'organize' && (
          <FileOrganizerView
            files={files}
            groupedFiles={groupedFiles}
            sortMode={sortMode}
            setSortMode={setSortMode}
            onDropFiles={handleDropFiles}
            onLoadPreset={handleLoadPreset}
            onExecuteOrganize={handleExecuteOrganize}
            isOrganized={isOrganized}
            dryRun={dryRun}
            setDryRun={setDryRun}
            currentPreset={currentPreset}
            directoryName={directoryName}
          />
        )}

        {/* Tab 2: Category Rules Editor */}
        {activeTab === 'rules' && (
          <RulesEditorModal
            rules={rules}
            setRules={setRules}
          />
        )}

        {/* Tab 3: CLI & Command Scripts Exporter */}
        {activeTab === 'cli' && (
          <CodeExporterView
            rules={rules}
            sortMode={sortMode}
          />
        )}

        {/* Tab 4: Activity Log & Undo */}
        {activeTab === 'history' && (
          <HistoryLogView
            history={history}
            onUndoSession={handleUndoSession}
            onClearHistory={handleClearHistory}
          />
        )}

      </main>
    </div>
  );
}
