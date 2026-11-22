# Portfolio website

Static portfolio site (HTML / CSS / JS — no build step).

- Open `index.html` in a browser, or run `python3 -m http.server 8080` and visit http://localhost:8080
- Edit name, email, socials and brand list in `assets/config.js`
- Colors live at the top of `assets/style.css` (`--accent-1`, `--accent-2`)
- Photos: edit `PROJECTS` in `tools/build_images.py` and rerun `python3 tools/build_images.py`
  (private tool: needs macOS `sips`, the original project folders and a local `tools/manifest.json`; generates `assets/img/` and `assets/projects.js`)
