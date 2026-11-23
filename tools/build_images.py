#!/usr/bin/env python3
"""
Build web-sized images + assets/projects.js from the original project folders.

Usage:  python3 tools/build_images.py
Needs:  macOS `sips` (already installed) — no other dependency.

Edit PROJECTS below to change which photos appear, their order, titles, etc.
Numbers in `imgs` / `cover` are indexes into tools/manifest.json (the list of
original files in /Users/anhjolie/Documents/PORTFOLIO/PORT 2025). The original
files are only read, never modified or copied as-is.
"""
import json, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = json.load(open(os.path.join(ROOT, "tools", "manifest.json")))
OUT = os.path.join(ROOT, "assets", "img")

THUMB_W = 900     # grid cards
FULL_MAX = 2000   # lightbox (longest side)

# cat keys: fashion | jewelry | beauty | editorial | design
PROJECTS = [
    dict(slug="jemmia", title="JEMMIA", cats=["jewelry"], tags=["Jewelry", "Campaign"],
         blurb="Campaign imagery for a fine-jewelry house — editorial portraits, product stills and seasonal key visuals.",
         cover=242, imgs=[238, 239, 240, 242, 244, 246, 248, 250, 251, 253, 254, 257, 261, 266, 267, 270, 283, 286, 290, 292]),
    dict(slug="hublot", title="HUBLOT", cats=["jewelry", "editorial"], tags=["Watches", "Still life"],
         blurb="Conceptual watch visuals — lava, ash and cracked stone worlds built around each timepiece.",
         cover=54, imgs=[51, 52, 53, 54, 55, 56, 62, 63]),
    dict(slug="harpers-bazaar", title="Harper's Bazaar", cats=["editorial"], tags=["Editorial", "Still life"],
         blurb="Surreal accessory still lifes for the magazine — bags, shoes, eyewear and jewelry staged as small dreamscapes.",
         cover=38, imgs=[34, 38, 40, 39, 42, 36, 37, 35, 31]),
    dict(slug="anjo", title="ANJO", cats=["fashion"], tags=["Couture", "Lookbook"],
         blurb="Couture collection imagery — sculpted gowns and tailoring against moody painterly backdrops.",
         cover=9, imgs=[0, 1, 2, 4, 7, 9, 10, 12, 15, 16, 17, 18, 19, 21, 22, 25]),
    dict(slug="cao-fine", title="CAO Fine Jewellery", cats=["jewelry"], tags=["Jewelry", "Retouch"],
         blurb="High-jewelry portraits and product retouching in a deep emerald palette.",
         cover=84, imgs=[80, 83, 84, 85, 88, 90, 91, 92, 94, 95, 100, 102, 103, 105, 107]),
    dict(slug="nhu-nguyet", title="Như Nguyệt", cats=["fashion", "editorial"], tags=["Concept", "Editorial"],
         blurb="A fantasy editorial — red silk, sculpted armor and chain-mail under a burning sky.",
         cover=173, imgs=[169, 171, 173, 175, 176, 178, 180, 181, 184, 187, 189, 191, 195, 196, 197]),
    dict(slug="le-thanh-hoa", title="Lê Thanh Hoà", cats=["fashion", "editorial"], tags=["Lookbook", "Show"],
         blurb="Lookbook, runway-show and editorial images for the designer's seasonal collections.",
         cover=313, imgs=[313, 314, 315, 316, 317, 319, 320, 322, 323, 326, 327, 328, 296, 297, 298, 299, 301, 302, 304, 307, 310, 311]),
    dict(slug="glamdoll", title="Glamdoll", cats=["fashion"], tags=["Fashion", "Retouch"],
         blurb="Fashion e-commerce and campaign images across two seasons — studio reds and garden pinks.",
         cover=206, imgs=[200, 201, 202, 204, 206, 207, 209, 210, 212, 213, 215, 216, 217, 219, 221, 223, 224, 225]),
    dict(slug="tonny-show", title="TONNY Show", cats=["fashion", "design"], tags=["Show", "Event design"],
         blurb="Winter–Spring show: model-casting poster, invitation, LED standees and catwalk imagery.",
         cover=383, imgs=[374, 383, 384, 386, 387, 390, 391, 392, 394, 397, 407, 408, 410, 412, 413, 415, 416]),
    dict(slug="dana-phuong-oanh", title="Giao Thừa · Dana & Phương Oanh", cats=["fashion", "editorial"], tags=["Editorial", "Concept"],
         blurb="A New Year's-Eve editorial with dramatic red-and-black staging and sculptural couture.",
         cover=157, imgs=list(range(154, 169))),
    dict(slug="datt", title="DATT", cats=["fashion"], tags=["Lookbook", "Studio"],
         blurb="Studio lookbook in warm neutrals — a full women's collection, look by look.",
         cover=138, imgs=[111, 112, 113, 114, 118, 121, 122, 123, 126, 127, 131, 133, 134, 136, 137, 138, 139, 140, 145, 147, 150]),
    dict(slug="mooris", title="MOORIS", cats=["fashion"], tags=["Fashion", "Accessories"],
         blurb="Evening-wear and accessory imagery with sculptural gold details.",
         cover=333, imgs=list(range(333, 346))),
    dict(slug="that", title="THAT", cats=["fashion"], tags=["Menswear", "Studio"],
         blurb="Clean studio imagery for a tailoring label — 2025 and 2026 collections.",
         cover=471, imgs=[441, 444, 446, 448, 449, 451, 452, 453, 455, 457, 461, 463, 465, 466, 468, 469, 471, 474, 477, 481, 483]),
    dict(slug="thuy-design", title="Thuy Design", cats=["fashion"], tags=["Áo dài", "Fashion"],
         blurb="Printed and embroidered áo dài, staged against saturated backdrops.",
         cover=487, imgs=[484, 485, 486, 487, 488, 491, 493, 494, 495, 496, 497, 498, 500, 501, 502, 503, 504, 505, 506, 507, 508]),
    dict(slug="chi-pu-beauty", title="Beauty · Chi Pu", cats=["beauty"], tags=["Beauty", "Retouch"],
         blurb="Beauty portraits on a deep red set — skin, light and colour carefully retouched.",
         cover=66, imgs=list(range(64, 72))),
    dict(slug="ngoc-tham", title="Ngọc Thẩm Jewelry", cats=["jewelry", "beauty"], tags=["Jewelry", "Beauty"],
         blurb="Delicate everyday jewelry on hands, necks and faces.",
         cover=348, imgs=list(range(346, 352))),
    dict(slug="paulas-choice", title="Paula's Choice", cats=["beauty", "design"], tags=["Skincare", "Product"],
         blurb="Skincare product imagery and campaign layouts in a soft lilac palette.",
         cover=356, imgs=[353, 354, 355, 356, 352]),
    dict(slug="pnj", title="PNJ", cats=["jewelry"], tags=["Jewelry", "Campaign"],
         blurb="Family-themed jewelry campaign portraits.",
         cover=358, imgs=[357, 358, 359]),
    dict(slug="cocolens", title="Cocolens", cats=["beauty", "design"], tags=["Beauty", "Social"],
         blurb="Contact-lens launch visuals — close-up beauty crops and product shades.",
         cover=510, imgs=list(range(509, 514))),
    dict(slug="test-shoots", title="Test Shoots", cats=["fashion", "editorial"], tags=["Photography", "Editorial"],
         blurb="Personal test shoots — hard light, black tailoring and minimal interiors.",
         cover=435, imgs=[420, 421, 424, 425, 427, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440]),
    dict(slug="brian", title="Portrait Retouch · Brian", cats=["editorial"], tags=["Retouch", "Before / After"],
         blurb="Portrait retouching. Each pair shows the original frame followed by the finished image.",
         cover=77, imgs=[72, 76, 73, 77, 74, 78, 75, 79]),
    dict(slug="social-key-visuals", title="Social & Key Visuals", cats=["design"], tags=["Social", "Graphic design"],
         blurb="Campaign posts, recruitment visuals and promotional layouts for brands and a production studio.",
         cover=360, imgs=[360, 361, 362, 366, 367, 368, 372, 373, 109, 110]),
    dict(slug="red-obsession", title="Red Obsession · Storyboard", cats=["design"], tags=["Storyboard", "Film"],
         blurb="Storyboard frames for a fashion-film concept built around red.",
         cover=417, imgs=[417, 418, 419]),
]

# Projects shown first (in this order); everything else keeps the order above
FIRST = ["cao-fine", "jemmia", "harpers-bazaar", "ngoc-tham", "paulas-choice", "le-thanh-hoa"]
PROJECTS.sort(key=lambda p: FIRST.index(p["slug"]) if p["slug"] in FIRST else len(FIRST))

CATEGORIES = [("all", "All"), ("fashion", "Fashion"), ("jewelry", "Jewelry & Watches"),
              ("beauty", "Beauty"), ("editorial", "Editorial"), ("design", "Design & Social")]


def sips(*args):
    return subprocess.run(["sips", *args], capture_output=True, text=True)


def dims(path):
    r = sips("-g", "pixelWidth", "-g", "pixelHeight", path).stdout
    w = int(re.search(r"pixelWidth: (\d+)", r).group(1))
    h = int(re.search(r"pixelHeight: (\d+)", r).group(1))
    return w, h


def make(job):
    src, thumb, full = job
    if os.path.exists(thumb) and os.path.exists(full):
        return dims(full)
    w, h = dims(src)
    # full (lightbox)
    args = ["-s", "format", "jpeg", "-s", "formatOptions", "78"]
    if max(w, h) > FULL_MAX:
        args += ["-Z", str(FULL_MAX)]
    sips(*args, src, "--out", full)
    # thumbnail (grid)
    args = ["-s", "format", "jpeg", "-s", "formatOptions", "72"]
    if w > THUMB_W:
        args += ["--resampleWidth", str(THUMB_W)]
    sips(*args, src, "--out", thumb)
    return dims(full)


def main():
    jobs, plan = [], []
    for p in PROJECTS:
        d = os.path.join(OUT, p["slug"])
        os.makedirs(d, exist_ok=True)
        for n, idx in enumerate(p["imgs"], 1):
            src = MANIFEST[idx]
            assert os.path.exists(src), src
            thumb = os.path.join(d, f"{n:02d}-t.jpg")
            full = os.path.join(d, f"{n:02d}.jpg")
            jobs.append((src, thumb, full))
            plan.append((p["slug"], n, idx))
    with ThreadPoolExecutor(6) as ex:
        sizes = list(ex.map(make, jobs))
    size_of = {(s, n): wh for (s, n, _), wh in zip(plan, sizes)}

    out = []
    for p in PROJECTS:
        images = []
        for n, idx in enumerate(p["imgs"], 1):
            w, h = size_of[(p["slug"], n)]
            images.append(dict(t=f"assets/img/{p['slug']}/{n:02d}-t.jpg",
                               f=f"assets/img/{p['slug']}/{n:02d}.jpg", w=w, h=h))
        ci = p["imgs"].index(p["cover"])
        out.append(dict(slug=p["slug"], title=p["title"], cats=p["cats"], tags=p["tags"],
                        blurb=p["blurb"], cover=ci, images=images))
    by_index = {}
    for p, o in zip(PROJECTS, out):
        for idx, im in zip(p["imgs"], o["images"]):
            by_index.setdefault(str(idx), im)
    js = "window.IMG = " + json.dumps(by_index, ensure_ascii=False) + ";\n"
    js += "window.PROJECTS = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n"
    js += "window.CATEGORIES = " + json.dumps([list(c) for c in CATEGORIES], ensure_ascii=False) + ";\n"
    open(os.path.join(ROOT, "assets", "projects.js"), "w").write(js)
    print(f"{len(jobs)} images, {len(PROJECTS)} projects")


if __name__ == "__main__":
    main()
