#!/usr/bin/env node

/**
 * File Sortify - Automatic File Organizer Node.js CLI
 * Usage: node organizer.js [--dir ./path] [--dry-run] [--sort extension|date|size] [--undo]
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_RULES = {
  "Images": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".tiff", ".heic"],
  "Documents": [".pdf", ".docx", ".doc", ".txt", ".xlsx", ".xls", ".pptx", ".ppt", ".csv", ".md", ".epub", ".rtf"],
  "Videos": [".mp4", ".mkv", ".mov", ".avi", ".webm", ".flv", ".wmv", ".m4v"],
  "Audio": [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma"],
  "Archives": [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".iso"],
  "Code & Dev": [".js", ".jsx", ".ts", ".tsx", ".py", ".html", ".css", ".json", ".sql", ".java", ".cpp", ".c", ".cs", ".php", ".sh", ".yaml", ".yml"],
  "Executables": [".exe", ".msi", ".apk", ".dmg", ".deb", ".bat", ".cmd"],
  "Design & 3D": [".psd", ".ai", ".fig", ".blend", ".obj", ".stl", ".fbx"]
};

const LOG_FILE_NAME = ".file_organizer_history.json";

function getCategory(ext, rules = DEFAULT_RULES) {
  ext = ext.toLowerCase();
  for (const [category, exts] of Object.entries(rules)) {
    if (exts.map(e => e.toLowerCase()).includes(ext)) {
      return category;
    }
  }
  return "Others";
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { dir: '.', dryRun: false, sort: 'extension', undo: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' || args[i] === '-d') config.dir = args[++i] || '.';
    else if (args[i] === '--dry-run') config.dryRun = true;
    else if (args[i] === '--sort') config.sort = args[++i] || 'extension';
    else if (args[i] === '--undo') config.undo = true;
  }
  return config;
}

function runOrganizer() {
  const options = parseArgs();
  const targetDir = path.resolve(options.dir);

  if (!fs.existsSync(targetDir)) {
    console.error(`\x1b[31mError: Directory "${targetDir}" does not exist.\x1b[0m`);
    process.exit(1);
  }

  const logPath = path.join(targetDir, LOG_FILE_NAME);

  if (options.undo) {
    if (!fs.existsSync(logPath)) {
      console.log(`\x1b[31mNo undo log found at ${logPath}\x1b[0m`);
      return;
    }
    const history = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    if (!history.length) {
      console.log(`\x1b[33mHistory is empty.\x1b[0m`);
      return;
    }
    const lastSession = history.pop();
    console.log(`\x1b[36m=== Reverting Session (${lastSession.timestamp}) ===\x1b[0m`);
    let count = 0;
    for (const move of [...lastSession.moves].reverse()) {
      if (fs.existsSync(move.to)) {
        fs.mkdirSync(path.dirname(move.from), { recursive: true });
        fs.renameSync(move.to, move.from);
        console.log(`\x1b[32m[RESTORED]\x1b[0m ${path.basename(move.to)} -> ${move.from}`);
        count++;
      }
    }
    fs.writeFileSync(logPath, JSON.stringify(history, null, 2));
    console.log(`\x1b[32m✓ Successfully reverted ${count} file(s).\x1b[0m`);
    return;
  }

  console.log(`\x1b[36m\x1b[1m=== Automatic File Organizer (Node.js) ===\x1b[0m`);
  console.log(`Directory : ${targetDir}`);
  console.log(`Sort Mode : ${options.sort}`);
  console.log(`Mode      : ${options.dryRun ? '\x1b[33mDRY RUN (Preview)\x1b[0m' : '\x1b[32mLIVE EXECUTION\x1b[0m'}\n`);

  const entries = fs.readdirSync(targetDir, { withFileTypes: true });
  const files = entries.filter(e => e.isFile() && e.name !== LOG_FILE_NAME && !e.name.startsWith('.'));

  if (!files.length) {
    console.log(`\x1b[33mNo unorganized files found.\x1b[0m`);
    return;
  }

  const moves = [];
  let moveCount = 0;

  for (const file of files) {
    const filePath = path.join(targetDir, file.name);
    const ext = path.extname(file.name);
    let targetSubfolder = 'Others';

    if (options.sort === 'date') {
      const stats = fs.statSync(filePath);
      const date = new Date(stats.mtime);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      targetSubfolder = path.join('By_Date', `${yyyy}-${mm}`);
    } else if (options.sort === 'size') {
      const stats = fs.statSync(filePath);
      const mb = stats.size / (1024 * 1024);
      if (mb < 1) targetSubfolder = path.join('By_Size', 'Small (<1MB)');
      else if (mb < 100) targetSubfolder = path.join('By_Size', 'Medium (1-100MB)');
      else targetSubfolder = path.join('By_Size', 'Large (>100MB)');
    } else {
      targetSubfolder = getCategory(ext);
    }

    const destDir = path.join(targetDir, targetSubfolder);
    let destPath = path.join(destDir, file.name);

    if (fs.existsSync(destPath) && destPath !== filePath) {
      const nameWithoutExt = path.basename(file.name, ext);
      let counter = 1;
      while (fs.existsSync(destPath)) {
        destPath = path.join(destDir, `${nameWithoutExt}_(${counter})${ext}`);
        counter++;
      }
    }

    console.log(`\x1b[32m[MOVE]\x1b[0m ${file.name} -> ${targetSubfolder}/${path.basename(destPath)}`);

    if (!options.dryRun) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.renameSync(filePath, destPath);
      moves.push({ from: filePath, to: destPath });
    }
    moveCount++;
  }

  if (!options.dryRun) {
    let history = [];
    if (fs.existsSync(logPath)) {
      try { history = JSON.parse(fs.readFileSync(logPath, 'utf8')); } catch (e) {}
    }
    history.push({ timestamp: new Date().toISOString(), moves });
    fs.writeFileSync(logPath, JSON.stringify(history, null, 2));
    console.log(`\n\x1b[32m✓ Successfully organized ${moveCount} file(s)!\x1b[0m`);
  } else {
    console.log(`\n\x1b[33mDry run finished. ${moveCount} file(s) would be organized.\x1b[0m`);
  }
}

runOrganizer();
