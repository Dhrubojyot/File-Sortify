import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, Code2, FileCode, Play, ExternalLink } from 'lucide-react';

export default function CodeExporterView({ rules, sortMode }) {
  const [copiedScript, setCopiedScript] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [customDir, setCustomDir] = useState('C:/Users/YourName/Downloads');

  const getPythonSnippet = () => {
    return `# Run in terminal to organize "${customDir}"
python organizer.py --dir "${customDir}" --sort ${sortMode}`;
  };

  const getNodeSnippet = () => {
    return `// Run in terminal to organize "${customDir}"
node organizer.js --dir "${customDir}" --sort ${sortMode}`;
  };

  const getPowershellSnippet = () => {
    return `# Native PowerShell snippet
$dir = "${customDir}"
Get-ChildItem -Path $dir -File | ForEach-Object {
    $ext = $_.Extension.ToLower()
    $target = "Others"
    if ($ext -in @('.pdf','.docx','.txt')) { $target = "Documents" }
    elseif ($ext -in @('.jpg','.png','.gif')) { $target = "Images" }
    elseif ($ext -in @('.mp4','.mkv')) { $target = "Videos" }
    elseif ($ext -in @('.zip','.7z','.rar')) { $target = "Archives" }
    
    $dest = Join-Path -Path $dir -ChildPath $target
    if (!(Test-Path -Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }
    Move-Item -Path $_.FullName -Destination $dest
}`;
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(type);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const exportConfigJson = () => {
    const configMap = {};
    rules.forEach(r => {
      configMap[r.name] = r.extensions;
    });
    const blob = new Blob([JSON.stringify(configMap, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'organizer_rules.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Overview Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>CLI Scripts & Command Generator</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Run file sorting directly in your native Command Prompt, PowerShell, or Terminal.
          </p>
        </div>
        <button className="btn-secondary" onClick={exportConfigJson}>
          <Download size={16} /> Export Rules JSON
        </button>
      </div>

      {/* Interactive Command Builder */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} style={{ color: 'var(--secondary)' }} /> Local Execution Command
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label className="form-label">Target Directory Path</label>
            <input 
              type="text" 
              className="form-input"
              value={customDir}
              onChange={(e) => setCustomDir(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Script Environment</label>
            <select 
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="python">Python 3 (organizer.py)</option>
              <option value="node">Node.js (organizer.js)</option>
              <option value="powershell">Windows PowerShell</option>
            </select>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="code-block">
          <button 
            className="btn-secondary" 
            style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px 12px', fontSize: '0.78rem' }}
            onClick={() => {
              const script = selectedLanguage === 'python' ? getPythonSnippet() :
                             selectedLanguage === 'node' ? getNodeSnippet() : getPowershellSnippet();
              handleCopy(script, 'main');
            }}
          >
            {copiedScript === 'main' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
            {copiedScript === 'main' ? 'Copied!' : 'Copy Command'}
          </button>

          <pre>
            {selectedLanguage === 'python' && getPythonSnippet()}
            {selectedLanguage === 'node' && getNodeSnippet()}
            {selectedLanguage === 'powershell' && getPowershellSnippet()}
          </pre>
        </div>
      </div>

      {/* Included CLI Tools Download Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '10px', color: '#3b82f6' }}>
              <FileCode size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700 }}>Python Organizer Script</h4>
              <span className="file-size">organizer.py (Supports --dry-run & --undo)</span>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Includes colorized terminal outputs, filename collision resolution, and JSON logging history for instant 1-click reversal.
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <a href="/organizer.py" download="organizer.py" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                <Download size={14} /> Download organizer.py
              </button>
            </a>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', color: '#10b981' }}>
              <Code2 size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700 }}>Node.js Organizer Script</h4>
              <span className="file-size">organizer.js (Cross-platform CLI)</span>
            </div>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Zero external npm dependency script. Runs natively on Node v14+ with built-in argument parsing.
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
            <a href="/organizer.js" download="organizer.js" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                <Download size={14} /> Download organizer.js
              </button>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
