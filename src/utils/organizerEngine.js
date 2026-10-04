/**
 * File Sortify - Core Organizer Engine & Rules Database
 */

export const DEFAULT_RULES = [
  {
    id: 'images',
    name: 'Images',
    icon: '🖼️',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.heic', '.raw']
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: '📄',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    extensions: ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.xls', '.pptx', '.ppt', '.csv', '.md', '.epub', '.rtf']
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: '🎬',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    extensions: ['.mp4', '.mkv', '.mov', '.avi', '.webm', '.flv', '.wmv', '.m4v']
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: '🎵',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma']
  },
  {
    id: 'archives',
    name: 'Archives',
    icon: '📦',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.iso']
  },
  {
    id: 'code',
    name: 'Code & Dev',
    icon: '💻',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.json', '.sql', '.java', '.cpp', '.c', '.cs', '.php', '.sh', '.yaml', '.yml']
  },
  {
    id: 'executables',
    name: 'Executables',
    icon: '⚙️',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    extensions: ['.exe', '.msi', '.apk', '.dmg', '.deb', '.bat', '.cmd']
  },
  {
    id: 'design',
    name: 'Design & 3D',
    icon: '🎨',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    extensions: ['.psd', '.ai', '.fig', '.blend', '.obj', '.stl', '.fbx']
  }
];

export const OTHER_CATEGORY = {
  id: 'others',
  name: 'Others',
  icon: '📁',
  color: '#6b7280',
  bgColor: 'rgba(107, 114, 128, 0.15)',
  extensions: []
};

// Preset Mock File Datasets for Instant Demonstration
export const MOCK_PRESETS = {
  downloads: [
    { name: 'Financial_Report_Q3_2025.pdf', size: 2450000, date: '2025-09-14' },
    { name: 'Screenshot_2025-10-01_143022.png', size: 1120000, date: '2025-10-01' },
    { name: 'NodeJS_v20_Installer.msi', size: 34500000, date: '2025-08-20' },
    { name: 'Vacation_Beach_Photo.jpg', size: 4800000, date: '2025-07-11' },
    { name: 'Project_Backup_v2.zip', size: 142000000, date: '2025-09-28' },
    { name: 'Product_Demo_Video.mp4', size: 85000000, date: '2025-09-30' },
    { name: 'Podcast_Episode_42.mp3', size: 28000000, date: '2025-08-15' },
    { name: 'App_Config_Settings.json', size: 4500, date: '2025-10-02' },
    { name: 'Script_Automation.py', size: 12400, date: '2025-09-25' },
    { name: 'UI_Design_System.fig', size: 18400000, date: '2025-09-19' },
    { name: 'Quarterly_Expenses.xlsx', size: 850000, date: '2025-09-05' },
    { name: 'Presentation_Pitch_Deck.pptx', size: 14500000, date: '2025-09-12' },
    { name: 'Setup_Driver_v4.exe', size: 54000000, date: '2025-08-30' },
    { name: 'Raw_Audio_Track.wav', size: 65000000, date: '2025-07-22' },
    { name: 'Notes_Meeting.txt', size: 2300, date: '2025-10-03' }
  ],
  creative: [
    { name: 'Logo_Vector_Final.ai', size: 12500000, date: '2025-09-10' },
    { name: 'Banner_Hero_Edit.psd', size: 180000000, date: '2025-09-22' },
    { name: '3D_Character_Rig.blend', size: 340000000, date: '2025-08-14' },
    { name: 'Portrait_RAW_001.raw', size: 45000000, date: '2025-09-18' },
    { name: 'Showreel_Cut_4K.mov', size: 750000000, date: '2025-09-29' },
    { name: 'Icon_Set_Export.svg', size: 48000, date: '2025-10-01' },
    { name: 'Asset_Texture_Wood.png', size: 8900000, date: '2025-09-04' },
    { name: 'Model_Mesh_Head.obj', size: 24000000, date: '2025-07-30' }
  ],
  codebase: [
    { name: 'App.jsx', size: 6800, date: '2025-10-03' },
    { name: 'index.css', size: 4200, date: '2025-10-03' },
    { name: 'database_dump.sql', size: 45000000, date: '2025-09-15' },
    { name: 'deploy_script.sh', size: 1200, date: '2025-09-20' },
    { name: 'README.md', size: 3400, date: '2025-09-01' },
    { name: 'package.json', size: 1800, date: '2025-10-02' },
    { name: 'organizer.py', size: 5200, date: '2025-10-03' },
    { name: 'build_output.zip', size: 28000000, date: '2025-09-29' }
  ]
};

// Format Bytes helper
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Get File Extension
export function getExtension(filename) {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return '.' + parts.pop().toLowerCase();
}

// Match Category for Extension
export function matchCategory(filename, rules = DEFAULT_RULES) {
  const ext = getExtension(filename);
  if (!ext) return OTHER_CATEGORY;

  for (const rule of rules) {
    if (rule.extensions.map(e => e.toLowerCase()).includes(ext)) {
      return rule;
    }
  }
  return OTHER_CATEGORY;
}

// Organize Files Array according to mode
export function organizeFiles(fileList, rules = DEFAULT_RULES, mode = 'extension') {
  const grouped = {};

  fileList.forEach(file => {
    let folderName = 'Others';
    let categoryObj = OTHER_CATEGORY;

    if (mode === 'date') {
      const d = new Date(file.date || Date.now());
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      folderName = `By_Date/${yyyy}-${mm}`;
      categoryObj = {
        id: `date-${yyyy}-${mm}`,
        name: `${yyyy}-${mm}`,
        icon: '📅',
        color: '#6366f1',
        bgColor: 'rgba(99, 102, 241, 0.15)'
      };
    } else if (mode === 'size') {
      const mb = (file.size || 0) / (1024 * 1024);
      if (mb < 1) folderName = 'By_Size/Small (< 1MB)';
      else if (mb < 100) folderName = 'By_Size/Medium (1 - 100MB)';
      else if (mb < 1000) folderName = 'By_Size/Large (100MB - 1GB)';
      else folderName = 'By_Size/Huge (> 1GB)';

      categoryObj = {
        id: `size-${folderName}`,
        name: folderName.replace('By_Size/', ''),
        icon: '⚖️',
        color: '#06b6d4',
        bgColor: 'rgba(6, 182, 212, 0.15)'
      };
    } else {
      categoryObj = matchCategory(file.name, rules);
      folderName = categoryObj.name;
    }

    if (!grouped[folderName]) {
      grouped[folderName] = {
        category: categoryObj,
        folderName: folderName,
        files: [],
        totalSize: 0
      };
    }

    grouped[folderName].files.push({
      ...file,
      targetFolder: folderName,
      category: categoryObj
    });
    grouped[folderName].totalSize += (file.size || 0);
  });

  return grouped;
}
