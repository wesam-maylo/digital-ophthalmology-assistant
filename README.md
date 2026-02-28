# Digital Ophthalmology Assistant (Frontend UI)

## 1) Project Overview
Digital Ophthalmology Assistant is a production-style frontend portal for educational anterior-eye triage workflows.

The product focuses on:
- Clinical-style case intake UI
- Simulated AI result rendering
- Structured disease education (English + Arabic)
- Safety-first communication and escalation guidance

### Pages
- `index.html`: Product landing page, value proposition, workflow, disease highlights.
- `diagnose.html`: Upload, validation, simulated predictions, structured result cards, local history preview.
- `diseases.html`: Dynamic disease knowledge base rendered from JSON, with quick navigation + search.
- `education.html`: Patient education modules (image capture, urgency, hygiene/prevention).
- `safety.html`: Limitations, safety scope, disclaimers, data handling statement.
- `about.html`: Academic/project information and team details.
- `history.html`: Full local history list with filters and item removal.

## 2) Folder Structure

```text
.
├─ index.html
├─ diagnose.html
├─ diseases.html
├─ education.html
├─ safety.html
├─ about.html
├─ history.html
├─ styles.css
├─ app.js
├─ README.md
├─ assets/
│  └─ icons.js
└─ data/
   └─ diseases.json
```

### File Roles
- `styles.css`: Global design system (spacing scale, grid utilities, typography, components, motion system).
- `app.js`: Shared runtime logic (theme, nav, reveals, parallax, diagnose flow, history, disease rendering).
- `assets/icons.js`: Inline SVG icon provider (`getIcon(name)`), no external icon library needed.
- `data/diseases.json`: Disease content source, including Arabic blocks and risk metadata.

## 3) How to Run
Open `index.html` directly in any modern browser.

No build step, no package manager, no server required.

### file:// and fetch limitations
Some browsers restrict `fetch()` from `file://` for local JSON files.
This project handles that with a fallback dataset in `app.js` (`fallbackDiseases()`), so the site still works if JSON fetch fails.

## 4) Diagnose Flow (Frontend Demo)

### Upload Handling
- Entry points:
  - Click upload dropzone
  - Keyboard (`Enter` / `Space`) on dropzone
  - Drag and drop file
- Accepted types: `image/png`, `image/jpeg`
- Max size: `10MB`
- Invalid cases show inline message + toast (no `alert()` usage)

### Simulated Prediction
- On Analyze:
  - Shows status + skeleton + progress line
  - Waits 900ms (simulation)
  - Generates random normalized probabilities
  - Sorts classes descending

### Result Rendering
Maps top result to disease content from `diseases.json`:
- Top prediction
- Confidence
- Risk badge (`risk_level`)
- Arabic summary (`short_ar`) in dedicated RTL container
- “What this may mean” block
- “What you can do now” from `safe_tips_ar`
- Urgent signs from `red_flags_ar`
- When to see doctor from `when_to_see_doctor_ar`
- Probability bars with staggered width animation
- Accordion details

### LocalStorage History Schema
History key: `doa-history`

Example item:
```json
{
  "id": "8d3f...",
  "thumbnail": "data:image/jpeg;base64,...",
  "date": "3/15/2026, 11:32:10 AM",
  "topClass": "Keratitis",
  "confidence": 92.1,
  "probabilities": [
    { "id": "keratitis", "value": 92.1 },
    { "id": "conjunctivitis", "value": 4.6 },
    { "id": "pterygium", "value": 2.1 },
    { "id": "normal", "value": 1.2 }
  ]
}
```

## 5) Motion System

### Motion Tokens
Defined in `styles.css`:
- `--ease: cubic-bezier(.2,.8,.2,1)`
- `--dur-fast: 140ms`
- `--dur: 240ms`
- `--dur-slow: 520ms`

### Reveal Classes
- Base: `.reveal`
- Variants: `.reveal-up`, `.reveal-left`, `.reveal-right`, `.reveal-scale`
- JS uses `IntersectionObserver` to add `.in-view`

### Stagger
- Wrap children in `.stagger`
- On entry, JS sets incremental transition delay per child (`index * 70ms`)

### Other Motion
- Hero blobs parallax on scroll (`.hero-blob-a`, `.hero-blob-b`)
- Buttons: hover lift + active press + click ripple
- Cards: subtle cursor tilt (desktop only)
- Analyze loading: skeleton shimmer + progress line scan
- Result bars: staggered width animation

## 6) Styling System

### Spacing Scale
`styles.css` defines:
- `--s-1`..`--s-10` = 4, 8, 12, 16, 20, 24, 32, 40, 56, 72

Use these tokens for:
- `padding`
- `gap`
- layout spacing

### Grid Utilities
- `.grid`: base grid container
- `.grid-2`, `.grid-3`, `.grid-4`: responsive columns

Behavior:
- `<520px`: 1 column
- `520px - 899px`: 2 columns
- `>=900px`: 2/3/4 columns based on utility class

### Theme
- Light/Dark controlled by `data-theme` on `<html>`
- Saved in localStorage key: `doa-theme`

## 7) Direction System (LTR / RTL)
- Base document direction is LTR across all pages:
  - `<html lang="en" dir="ltr">`
- Global layout (nav, grids, cards, spacing) stays LTR.
- Arabic text is always wrapped in dedicated RTL containers:
  - `<div class="rtl" lang="ar" dir="rtl">...</div>`
- Utilities:
  - `.rtl { direction: rtl; text-align: right; }`
  - `.ltr { direction: ltr; text-align: left; }`
- Logical CSS properties are used where possible (`padding-inline-*`, `margin-inline-*`, `inset-inline-*`) to avoid directional breakage.
- Reveal animation respects document direction:
  - `html[dir="rtl"] .reveal-left` and `.reveal-right` are direction-aware.

### Adding new Arabic content correctly
1. Keep component layout in normal LTR wrappers.
2. Wrap only Arabic text blocks/lists inside `.rtl` containers.
3. Do not set `dir="rtl"` on `<html>` or large layout wrappers.

## 8) Future Backend Integration (Flask)
Current predictions are simulated in `app.js`.

### Expected API Contract
**POST** `/predict`
- Content-Type: `multipart/form-data`
- Field name: `image`

**Response JSON**
```json
{
  "predictions": [
    { "class": "keratitis", "prob": 0.92 },
    { "class": "conjunctivitis", "prob": 0.04 },
    { "class": "pterygium", "prob": 0.03 },
    { "class": "normal", "prob": 0.01 }
  ],
  "top": "keratitis",
  "confidence": 0.92
}
```

### Where to Replace Simulation
In `app.js`, inside `initDiagnosePage()` -> Analyze button handler:
- Replace `generateProbabilities(...)` call with `fetch('/predict', ...)`
- Convert backend classes to IDs matching `diseases.json`
- Keep the existing render pipeline (`renderResultContent(sorted, detail)`) unchanged

## 9) Contribution Guidelines

### Naming
- CSS classes: kebab-case (`.result-header`, `.hero-blob-a`)
- JS functions: camelCase (`initRevealSystem`, `renderResultContent`)
- Data IDs: lowercase stable keys (`normal`, `keratitis`)

### Adding a New Disease
1. Add disease object in `data/diseases.json` with all required fields:
   - `id`, `name`, `name_ar`, `short`, `short_ar`, `symptoms_ar`, `red_flags_ar`, `safe_tips_ar`, `when_to_see_doctor_ar`, `risk_level`
2. Ensure `id` is unique and used consistently.
3. Confirm Arabic blocks are UTF-8 and rendered inside `lang="ar" dir="rtl"` containers.

### Responsive Testing Checklist
- Test at:
  - Mobile `<520px`
  - Tablet `~768px`
  - Desktop `>=900px`
- Verify:
  - No horizontal scroll
  - Cards do not overflow
  - Diagnose layout stacks correctly on mobile
  - Nav collapses/expands correctly

### Accessibility Checklist
- Keyboard reachable controls
- Visible `:focus-visible`
- `aria-live` for status/toasts/history updates
- Modal close with `Escape`
- Reduced motion respected via `prefers-reduced-motion`

---
If you extend interactions, keep transitions subtle, GPU-friendly, and clinically readable first.
