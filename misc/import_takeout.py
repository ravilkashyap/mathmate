import argparse
import json
import os
from pathlib import Path
from typing import List, Dict

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
VIDEO_EXTS = {".mp4", ".webm", ".mov"}


def find_media(root: Path) -> List[Path]:
    return [p for p in root.rglob("*") if p.suffix.lower() in IMAGE_EXTS.union(VIDEO_EXTS) and p.is_file()]


def find_post_json(root: Path) -> List[Path]:
    names = {"posts.json", "posts.jsonl", "LocalPosts.json", "Posts.json"}
    files: List[Path] = []
    for p in root.rglob("*.json"):
        pn = p.name.lower()
        pp = p.as_posix().lower()
        if p.name in names or "post" in pn or "/localpost-" in pp:
            files.append(p)
    for p in root.rglob("*.jsonl"):
        files.append(p)
    return files


def load_posts(json_paths: List[Path], src_root: Path) -> List[Dict]:
    posts: List[Dict] = []
    for p in json_paths:
        try:
            # Handle localPost-*/data.json specially to capture siblings
            if p.parent.name.lower().startswith("localpost-") and p.name == "data.json":
                data = json.loads(p.read_text(encoding="utf-8", errors="ignore"))
                text = (data.get("summary") or data.get("text") or data.get("body") or data.get("caption") or "").strip()
                date = data.get("updateTime") or data.get("createTime") or ""
                # collect sibling media in same folder
                media = []
                for m in p.parent.iterdir():
                    if m.is_file() and m.suffix.lower() in IMAGE_EXTS.union(VIDEO_EXTS):
                        rel = m.relative_to(src_root)
                        media.append(rel.as_posix())
                posts.append({"title": data.get("topic") or data.get("headline") or "Update", "text": text, "time": date, "media": media})
                continue

            if p.suffix.lower() == ".jsonl":
                for line in p.read_text(encoding="utf-8", errors="ignore").splitlines():
                    if not line.strip():
                        continue
                    try:
                        posts.append(json.loads(line))
                    except Exception:
                        continue
            else:
                data = json.loads(p.read_text(encoding="utf-8", errors="ignore"))
                if isinstance(data, dict) and "posts" in data:
                    posts.extend(data["posts"])
                elif isinstance(data, list):
                    posts.extend(data)
                else:
                    for key in ("localPosts", "items", "entries"):
                        if isinstance(data, dict) and key in data and isinstance(data[key], list):
                            posts.extend(data[key])
                            break
        except Exception:
            continue
    return posts


def main():
    ap = argparse.ArgumentParser(description="Import Google Takeout media into the site")
    ap.add_argument("--src", required=True, help="Path to Google Takeout folder")
    args = ap.parse_args()

    project = Path(__file__).resolve().parents[1]
    src = Path(args.src).expanduser().resolve()
    if not src.exists():
        raise SystemExit(f"Source folder not found: {src}")

    gallery_dir = project / "assets/img/gallery"
    updates_dir = project / "assets/img/updates"
    data_dir = project / "assets/data"
    gallery_dir.mkdir(parents=True, exist_ok=True)
    updates_dir.mkdir(parents=True, exist_ok=True)
    data_dir.mkdir(parents=True, exist_ok=True)

    # Copy ALL media to gallery
    media = find_media(src)
    gallery_items = []
    for p in sorted(media, key=lambda x: (x.suffix.lower() not in IMAGE_EXTS, x.name.lower())):
        dest = gallery_dir / p.name
        try:
            if dest.resolve() != p.resolve():
                dest.write_bytes(p.read_bytes())
            item = {"type": "video" if p.suffix.lower() in VIDEO_EXTS else "image", "src": f"/assets/img/gallery/{dest.name}"}
            gallery_items.append(item)
        except Exception:
            continue

    (data_dir / "gallery.json").write_text(json.dumps(gallery_items, indent=2))

    # Build updates.json with detailed text + media
    posts_paths = find_post_json(src)
    posts = load_posts(posts_paths, src)

    updates = []
    for i, post in enumerate(posts, 1):
        title = (post.get("title") or post.get("summary") or post.get("headline") or f"Update #{i}")
        text = (post.get("text") or post.get("body") or post.get("caption") or post.get("summary") or "").strip()
        date = (post.get("time") or post.get("createTime") or post.get("updateTime") or "")
        media_list = []
        raw_media = []
        for key in ("media", "media_paths", "photos", "images", "attachments"):
            val = post.get(key)
            if isinstance(val, list):
                raw_media = val
                break
        for m in raw_media:
            try:
                mp = Path(m)
                if not mp.is_absolute():
                    mp = src / mp
                if mp.exists() and mp.suffix.lower() in IMAGE_EXTS.union(VIDEO_EXTS):
                    dest = updates_dir / mp.name
                    if dest.resolve() != mp.resolve():
                        dest.write_bytes(mp.read_bytes())
                    media_list.append({
                        "type": "video" if mp.suffix.lower() in VIDEO_EXTS else "image",
                        "src": f"/assets/img/updates/{dest.name}"
                    })
            except Exception:
                continue
        updates.append({
            "id": f"u-{i}",
            "title": title,
            "date": date,
            "excerpt": text[:160],
            "text": text,
            "media": media_list
        })

    (data_dir / "updates.json").write_text(json.dumps(updates, indent=2))

    # Slides: first 3 images from gallery
    slide_imgs = [g["src"] for g in gallery_items if g["type"] == "image"][:3]
    slides = [{"image": src, "title": "From our classes", "description": "", "link": "/pages/updates.html"} for src in slide_imgs]
    (data_dir / "slides.json").write_text(json.dumps(slides, indent=2))

    print(f"Imported {len(gallery_items)} gallery media and {len(updates)} updates.")


if __name__ == "__main__":
    main()
