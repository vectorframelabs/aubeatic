# Aube Research & Analytics — Static Site

A pure HTML/CSS/vanilla-JS rebuild of the Next.js marketing site. No build step,
no Node, no package manager — open `index.html` directly or serve the folder
with any static file server.

## Running it

```
cd aube-static
python3 -m http.server 8000      # or any static server / VS Code Live Server
```

Then visit `http://localhost:8000/`. Opening `index.html` directly by
double-clicking also works — all asset paths are relative.

## Structure

```
index.html
products/          index + prior-art, claim-charting, portfolio-analytics, classification-engine
solutions/         index + fto, sep, litigation, landscape
industries/        index + deep-tech, biotech, telecom, academia
resources/         index + insights, case-studies, guides
company/  contact/  pricing/  login/
css/               global.css, components.css, animations.css, pages.css
js/                icons.js, navbar.js, animations.js, main.js
assets/            icons/favicon.svg (images/fonts folders included for future use)
```

Every route is a real, separate `index.html` file — nothing is generated
client-side, so all pages are directly crawlable and linkable.

## Deviations from the conversion brief

The brief's example folder tree used generic names (`about/`, `services/`,
`reports/`, `articles/`). Since this is a **migration of an existing site**,
the actual page set and URLs follow the real Next.js app's routes instead
(`/company/` rather than `/about/`, `/products/` + `/solutions/` rather than
a single `/services/`, etc.) so links, bookmarks, and SEO equity carry over
exactly. There is no blog/article system in the source app (Insights is a
static card grid, not individual posts), so no `articles/` folder was
invented.

## Notes

- **Icons**: the source used `lucide-react`. Since this build has no npm
  step, `js/icons.js` ships a small hand-authored set of inline SVGs in the
  same 24×24 stroke style, injected via `<i data-icon="...">` placeholders.
- **Forms**: the contact and login forms show a client-side confirmation
  state (`js/main.js`) but aren't wired to a backend — connect them to
  whatever endpoint/provider you use for form submissions.
- **Fonts**: the design uses the system font stack (no web fonts to load),
  matching the original `globals.css`.
- **This build was generated from a small set of shared Python templates**
  (not hand-duplicated per page) to guarantee the navbar, footer, and SEO
  head block are byte-identical across all 24 pages.
