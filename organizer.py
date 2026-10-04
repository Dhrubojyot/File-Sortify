#!/usr/bin/env python3
"""
File Sortify - Automatic File Organizer CLI
Sorts files in a directory into subfolders based on file extension, date, or size.
Supports Dry Run mode and Undo functionality.
"""

import os
import sys
import shutil
import json
import argparse
from datetime import datetime
from pathlib import Path

# Default Category Mapping
DEFAULT_RULES = {
    "Images": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".tiff", ".heic"],
    "Documents": [".pdf", ".docx", ".doc", ".txt", ".xlsx", ".xls", ".pptx", ".ppt", ".csv", ".md", ".epub", ".rtf"],
    "Videos": [".mp4", ".mkv", ".mov", ".avi", ".webm", ".flv", ".wmv", ".m4v"],
    "Audio": [".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a", ".wma"],
    "Archives": [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".iso"],
    "Code & Dev": [".js", ".jsx", ".ts", ".tsx", ".py", ".html", ".css", ".json", ".sql", ".java", ".cpp", ".c", ".cs", ".php", ".sh", ".yaml", ".yml"],
    "Executables": [".exe", ".msi", ".apk", ".dmg", ".deb", ".bat", ".cmd"],
    "Design & 3D": [".psd", ".ai", ".fig", ".blend", ".obj", ".stl", ".fbx"]
}

# ANSI Colors
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

LOG_FILE_NAME = ".file_organizer_history.json"

def get_category_for_extension(ext, custom_rules):
    ext = ext.lower()
    for category, extensions in custom_rules.items():
        if ext in [e.lower() for e in extensions]:
            return category
    return "Others"

def get_date_folder(filepath):
    mtime = os.path.getmtime(filepath)
    dt = datetime.fromtimestamp(mtime)
    return os.path.join("By_Date", dt.strftime("%Y-%m"))

def get_size_folder(filepath):
    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    if size_mb < 1:
        return os.path.join("By_Size", "Small (< 1MB)")
    elif size_mb < 100:
        return os.path.join("By_Size", "Medium (1MB - 100MB)")
    elif size_mb < 1000:
        return os.path.join("By_Size", "Large (100MB - 1GB)")
    else:
        return os.path.join("By_Size", "Huge (> 1GB)")

def organize(directory, dry_run=False, sort_mode="extension", config_file=None):
    target_dir = Path(directory).resolve()
    if not target_dir.exists() or not target_dir.is_dir():
        print(f"{RED}Error: Directory '{directory}' does not exist.{RESET}")
        return

    rules = DEFAULT_RULES
    if config_file and os.path.exists(config_file):
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                rules = json.load(f)
            print(f"{CYAN}Loaded custom configuration from {config_file}{RESET}")
        except Exception as e:
            print(f"{YELLOW}Warning: Failed to parse config file. Using defaults. ({e}){RESET}")

    print(f"\n{BOLD}{CYAN}=== Automatic File Organizer ==={RESET}")
    print(f"Target Directory : {BOLD}{target_dir}{RESET}")
    print(f"Sort Strategy    : {BOLD}{sort_mode.upper()}{RESET}")
    print(f"Mode             : {YELLOW}DRY RUN (Preview Only){RESET}" if dry_run else f"{GREEN}LIVE EXECUTION{RESET}")
    print("=" * 40 + "\n")

    history_log = {
        "timestamp": datetime.now().isoformat(),
        "directory": str(target_dir),
        "moves": []
    }

    files = [f for f in target_dir.iterdir() if f.is_file() and f.name != LOG_FILE_NAME and not f.name.startswith('.')]
    
    if not files:
        print(f"{YELLOW}No unorganized files found in target directory.{RESET}")
        return

    moved_count = 0
    skipped_count = 0

    for file_path in files:
        if sort_mode == "date":
            rel_folder = get_date_folder(file_path)
        elif sort_mode == "size":
            rel_folder = get_size_folder(file_path)
        else:
            category = get_category_for_extension(file_path.suffix, rules)
            rel_folder = category

        dest_dir = target_dir / rel_folder
        dest_path = dest_dir / file_path.name

        # Resolve filename collision
        counter = 1
        stem = file_path.stem
        suffix = file_path.suffix
        while dest_path.exists() and dest_path != file_path:
            dest_path = dest_dir / f"{stem}_({counter}){suffix}"
            counter += 1

        print(f"[{GREEN}MOVE{RESET}] {file_path.name} -> {BOLD}{rel_folder}/{dest_path.name}{RESET}")

        if not dry_run:
            dest_dir.mkdir(parents=True, exist_ok=True)
            shutil.move(str(file_path), str(dest_path))
            history_log["moves"].append({
                "from": str(file_path),
                "to": str(dest_path)
            })
        
        moved_count += 1

    print("\n" + "=" * 40)
    if dry_run:
        print(f"{YELLOW}Dry run completed. {moved_count} file(s) would be moved.{RESET}")
        print(f"To execute these moves, run without the {BOLD}--dry-run{RESET} flag.")
    else:
        log_path = target_dir / LOG_FILE_NAME
        # Append to log history
        existing_history = []
        if log_path.exists():
            try:
                with open(log_path, 'r', encoding='utf-8') as f:
                    existing_history = json.load(f)
            except Exception:
                existing_history = []
        
        existing_history.append(history_log)
        with open(log_path, 'w', encoding='utf-8') as f:
            json.dump(existing_history, f, indent=2)

        print(f"{GREEN}✓ Successfully organized {moved_count} file(s)!{RESET}")
        print(f"Undo log saved to {BOLD}{LOG_FILE_NAME}{RESET}")

def undo(directory):
    target_dir = Path(directory).resolve()
    log_path = target_dir / LOG_FILE_NAME

    if not log_path.exists():
        print(f"{RED}No organization history log found in {target_dir}. Cannot undo.{RESET}")
        return

    try:
        with open(log_path, 'r', encoding='utf-8') as f:
            history = json.load(f)
    except Exception as e:
        print(f"{RED}Failed to read history log: {e}{RESET}")
        return

    if not history:
        print(f"{YELLOW}History is empty.{RESET}")
        return

    last_session = history.pop()
    moves = last_session.get("moves", [])

    print(f"\n{BOLD}{CYAN}=== Reverting Organization Session ({last_session.get('timestamp')}) ==={RESET}\n")
    reverted_count = 0

    for move in reversed(moves):
        src = Path(move["to"])
        dest = Path(move["from"])

        if src.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(src), str(dest))
            print(f"[{CYAN}RESTORE{RESET}] {src.name} -> {dest}")
            reverted_count += 1
        else:
            print(f"[{RED}MISSING{RESET}] Could not find {src.name} to revert.")

    # Save remaining history
    with open(log_path, 'w', encoding='utf-8') as f:
        json.dump(history, f, indent=2)

    print(f"\n{GREEN}✓ Reverted {reverted_count} file movement(s).{RESET}")

def main():
    parser = argparse.ArgumentParser(description="Automatic File Organizer CLI")
    parser.add_argument("--dir", "-d", default=".", help="Target directory to organize (default: current directory)")
    parser.add_argument("--dry-run", action="store_true", help="Preview moves without actually relocating files")
    parser.add_argument("--sort", choices=["extension", "date", "size"], default="extension", help="Sorting criteria")
    parser.add_argument("--config", "-c", help="Path to custom JSON config rules file")
    parser.add_argument("--undo", action="store_true", help="Undo the last organization run in the target directory")

    args = parser.parse_args()

    if args.undo:
        undo(args.dir)
    else:
        organize(args.dir, dry_run=args.dry_run, sort_mode=args.sort, config_file=args.config)

if __name__ == "__main__":
    main()
