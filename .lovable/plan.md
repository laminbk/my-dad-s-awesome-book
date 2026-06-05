## All About My Dad — Build Plan

A child-friendly digital worksheet (ages 4–12) in the chosen "Hand-drawn crayon studio" direction. Single SPA flow, no accounts, autosave to localStorage, PDF export.

### Routes (TanStack Start, file-based)
- `/` — landing page (hero + "Start my Dad's Story" CTA, accessibility bar, footer)
- `/worksheet` — the full stepper experience (5 steps in one route, state-driven)
- `/preview` — final preview + export/share screen with confetti

A shared layout component renders the sticky accessibility bar (Read Aloud, Dyslexia Friendly, High Contrast, Progress Saved indicator).

### Step flow (inside `/worksheet`)
1. **Dad's name** — large hand-written input with example chip ("Try: Super Dave")
2. **Fun facts about Dad** — 5 short prompts with icons (favorite food, superpower, makes me laugh when…, best memory, age). Text inputs with autosave.
3. **Decorate / Draw** — HTML5 `<canvas>` drawing area + crayon color picker + sticker tray (drag-and-drop emoji/SVG stickers onto the canvas). Undo + clear.
4. **Preview** — renders the assembled worksheet (name, answers, drawing, stickers) as a printable card; "Edit" links jump back to any step.
5. **Export** — Download PDF, Print, Copy shareable link (encodes worksheet state in URL hash for privacy — no server). Confetti animation on arrival.

### Components
- `AccessibilityBar` — toggles for read-aloud (uses `speechSynthesis`), dyslexia mode (toggles `font-dyslexic` class swapping to OpenDyslexic via Google Fonts fallback), high-contrast (toggles `.hc` class).
- `Stepper` — top tab indicator + bottom Back/Next buttons. Validates required fields with gentle inline prompts (no harsh errors).
- `DrawingCanvas` — pointer-events based canvas with color, line width, undo stack, clear. Returns dataURL.
- `StickerTray` — draggable sticker items; canvas overlay tracks placed stickers (position, rotation).
- `WorksheetPreview` — shared render used in step 4 and PDF export.
- `ExportPanel` — buttons: Download PDF (`html2canvas` + `jspdf` or `react-to-print`), Print (`window.print`), Copy Link (encodes state to compressed base64 hash).
- `Confetti` — lightweight canvas confetti on export arrival.

### State & persistence
- Single Zustand store (or React context) `useWorksheet()` holding: `{ dadName, answers[], drawingDataUrl, stickers[], currentStep }`.
- Autosave: debounced `useEffect` writes store to `localStorage` under `aamd:worksheet`. Restores on mount. Shows "Progress Saved" pulse on each save.
- Shareable links: serialize store → `lz-string` compress → URL hash. Hydrate on `/preview#…` load.

### Design system (`src/styles.css`)
Port the prototype tokens verbatim using `oklch` equivalents:
- `--canvas` (warm paper), `--ink`, `--crayon-red`, `--crayon-blue`, `--crayon-yellow`, `--crayon-green`
- Fonts: Schoolbell (display/hand) + Inter (body) via Google Fonts `<link>` in `__root.tsx` head.
- High-contrast variant via `.hc` class on `<html>`. Dyslexia variant swaps body font.

### Dependencies to add
- `zustand` — state
- `jspdf` + `html2canvas` — PDF export
- `lz-string` — share-link compression
- `canvas-confetti` — celebration
- `lucide-react` — already typical; for export/share icons

### Accessibility & UX
- Buttons min 44×44, large tap targets, focus-visible rings in crayon-blue.
- All inputs labeled; sticker drag has keyboard alt (arrow keys after focus).
- Read-aloud reads the current prompt via `speechSynthesis.speak`.
- No destructive errors — incomplete-step prompt is gentle ("Add Dad's name first so we can finish his story!").

### File additions
```
src/routes/index.tsx                 (replace placeholder — landing)
src/routes/worksheet.tsx             (stepper)
src/routes/preview.tsx               (final preview + export)
src/routes/__root.tsx                (add fonts, <main>, AccessibilityBar)
src/components/AccessibilityBar.tsx
src/components/Stepper.tsx
src/components/DrawingCanvas.tsx
src/components/StickerTray.tsx
src/components/WorksheetPreview.tsx
src/components/ExportPanel.tsx
src/components/Confetti.tsx
src/store/worksheet.ts               (zustand + localStorage)
src/lib/share-link.ts                (encode/decode state)
src/styles.css                       (crayon tokens, fonts, hc/dyslexia variants)
```

### SEO / head metadata
Each route gets its own title + description + og tags (landing's gets og:image of a hero crayon illustration generated to `src/assets/`).

### Out of scope (no backend)
- No accounts, no Lovable Cloud, no analytics. Pure client-side with localStorage + share URL hash.
