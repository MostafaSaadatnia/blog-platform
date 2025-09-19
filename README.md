Blog Platform — Angular 20, Material 3, SSR

A clean, scalable, and production-ready RealWorld client with modern Angular patterns.

This repository demonstrates a senior-level Angular application: SSR-ready, Material 3 themed (light/dark + brand variants), scalable feature boundaries, NgRx Signals Store for state, clean separation of concerns, and a polished UX.
API: RealWorld Conduit

✨ Highlights

Angular 20 standalone components + SSR with Vite dev server

Material 3 (MDC) design system, theming (light/dark) + runtime theme switcher

NgRx Signals Store: minimal boilerplate, explicit state transitions, composable

Reactive Forms: create/edit posts, server-side error mapping, strong validation

Comments thread: modular service + store + UI (read/add/delete when auth available)

Performance: lazy routes, OnPush, tracked @for, SSR-safe services

Tooling: Vitest unit tests, ESLint + Prettier, Husky pre-push (CI safety)

🚀 Getting Started
Prerequisites

Node.js ≥ 18

PNPM or NPM (examples use NPM)

Git Bash (Windows) recommended for Husky shell hooks

Install
npm i

Development (SSR)
npm start
# Local: http://localhost:4200

Build
npm run build         # client build (SSR output mode)
npm run build:ssr     # client + server bundle

Serve SSR (dev)
npm run serve:ssr

Tests
npm test          # vitest watch
npm run test:ci   # CI mode with coverage


Husky: a pre-push hook runs npm run test:ci.
If you’re on Windows/PowerShell, ensure the hook exists at .husky/pre-push and uses LF line endings.

🧭 Project Structure & Architecture
src/
 ┣ app/
 ┃ ┣ core/                     # singletons & cross-cutting concerns
 ┃ ┃ ┣ interceptors/
 ┃ ┃ ┗ services/
 ┃ ┃    ┣ api.service.ts       # HTTP boundary to RealWorld API
 ┃ ┃    ┗ theme.service.ts     # SSR-safe theme toggling (light/dark/brand)
 ┃ ┣ features/
 ┃ ┃ ┣ posts/                  # listing feature (read)
 ┃ ┃ ┃ ┣ components/
 ┃ ┃ ┃ ┣ pages/
 ┃ ┃ ┃ ┗ store/                # NgRx Signals store for list/paging
 ┃ ┃ ┗ post/                   # single post feature (details/editor/comments)
 ┃ ┃    ┣ components/comments-thread/
 ┃ ┃    ┣ pages/post-details/
 ┃ ┃    ┣ pages/editor/
 ┃ ┃    ┗ services/            # article/comments services (HTTP only)
 ┃ ┣ shared/
 ┃ ┃ ┣ components/             # UI atoms (e.g., confirm-dialog)
 ┃ ┃ ┣ models/                 # DTOs
 ┃ ┃ ┣ pipes/                  # markdown pipe
 ┃ ┃ ┗ utils/                  # form error mapper, cover util, etc.
 ┃ ┗ store/                    # (optional) app-wide store/meta
 ┣ styles.scss                 # tokens + global polish + M3 theme use
 ┣ material-theme.scss         # Material 3 theme definitions (light/dark)

Layering & Separation of Concerns

Core: singletons (API client, theme), HTTP interceptors.

Features: each domain has Service (HTTP) → Store (state/effects) → UI (pages/components).
No business logic in components, no UI in services. Stores orchestrate async & state transitions.

Shared: reusable atoms (dialog), DTOs, pipes (Markdown), utilities (server error mapper).

This yields:

Modularity: features are self-contained and easy to evolve.

Testability: services and stores are independently testable.

Scalability: adding features means cloning a proven pattern.

🧩 Technology Choices & Rationale
Angular 20 (Standalone + SSR)

Standalone components simplify module overhead and improve tree-shaking.

SSR improves first meaningful paint & SEO. We carefully guarded browser-only APIs with isPlatformBrowser and DI for DOCUMENT.

Material 3 (MDC) Theming

M3 tokens and palettes (light/dark) provide accessibility-compliant colors.

Class-scoped color layers allow runtime theme switching (e.g., theme-ink, theme-sunset) without recompiling styles.

Global tokens (--app-surface, --app-border, --app-radius) keep a consistent visual language across cards, panels, paginators.

NgRx Signals Store

Minimal boilerplate, fully typed, predictable state via withState + withMethods.

Explicit side-effects in stores: loadPage, loadOne, createOne, updateOne, deleteOne.

Signals provide fine-grained reactivity and work perfectly with OnPush.

Reactive Forms + Server Error Mapping

Complex validation UX needs Reactive Forms (sync rules and server 422 mapping).

A small utility maps server errors into form controls and a global form error—clean and reusable.

Markdown Rendering

marked + Angular sanitizer via [innerHTML] for safe, SSR-friendly content rendering.

Typography .prose styles keep headings, lists, code blocks compact and legible.

Performance

Lazy loaded routes with loadComponent.

ChangeDetectionStrategy.OnPush across pages/components.

Angular 20 control-flow (@if, @for) + track by slug / id.

SSR-safe theme & localStorage initialization.

Tooling & DX

Vitest for fast unit tests (services/components).

ESLint + Prettier for consistent style.

Husky pre-push to prevent shipping broken tests.

🧪 Testing Strategy (Snapshot)

Unit

ArticleService with HttpClientTestingModule (happy path & error cases).

PostEditorComponent minimal validation spec.

Stores can be tested by mocking services and asserting state transitions.

Why Vitest?

Lightweight, modern, and fast—great feedback loop for component/service tests.

🖌️ UX / UI

Material 3 components themed with soft surfaces and subtle elevation.

Responsive grid for cards (mobile → 1 col, tablet → 2, desktop → 3).

Polished paginator (outlined container), cards hover elevation.

Dark mode done right: foreground colors, surfaces, and borders all switch; inputs do not double-border (Tailwind/Material adjustments included).

Post detail:

Markdown content with .prose typography

Placeholder cover image derived from slug

Author meta & creation date

Editor:

Reactive form (title/description/body/tags)

Field-level messages (required/minlength) + server errors

Progress bar while submitting; snackbar feedback

Delete confirmation via MatDialog

🔐 Comments (Clean & Modular)

CommentsService (HTTP boundary only)

CommentsStore (signal store: load, add, remove)

CommentsThreadComponent (UI + reactive form)

Props: slug, canPost, allowDelete so it’s reusable in any page.

🛠️ Setup & Runbook
Environment

The API base URL is configured inside ApiService:

private readonly baseUrl = 'https://api.realworld.show/api'; // or realworld.build


Switch here if your reviewer asks for a different RealWorld host.

ThemING & Tailwind Compatibility

styles.scss imports material-theme.scss via @use './material-theme';.

Tailwind preflight can add borders to inputs; this repo includes MDC outline overrides to avoid double borders.

Theme toggling is SSR-safe (no document/localStorage at top-level).

Husky on Windows

If you ever see husky.sh: No such file or directory, recreate hooks:

npm run prepare
# then write .husky/pre-push with LF line endings and:
# . "$(dirname "$0")/_/husky.sh"

🧱 Architectural Decisions (Short ADRs)

Signals over Classic NgRx
Scope and complexity didn’t justify actions/reducers/effects boilerplate. Signals Store provides determinism and ergonomics while keeping growth paths open.

SSR First
For perceived performance and SEO, but guarded browser APIs with isPlatformBrowser to prevent SSR crashes. Theming/LS initialization happen only in the browser.

M3 Theming via Sass API
Consistent tokens/density and class-scoped color layers enable runtime theme changes (brand variants) without rebuilding.

Service ↔ Store ↔ UI Separation
Each layer has a single responsibility. Stores own orchestration; services own transport; components render and handle user interaction.

📦 Scripts
{
  "start": "ng serve",                 // dev SSR
  "serve:ssr": "ng serve --ssr",
  "build": "ng build",
  "build:ssr": "ng build && ng run blog-platform:server",
  "test": "vitest",
  "test:ci": "vitest run --coverage",
  "lint": "ng lint",
  "format": "prettier --write \"**/*.{ts,js,html,scss,md,json}\""
}

✅ What’s Implemented (Challenge Checklist)

 Posts list with pagination, responsive grid

 Post detail with Markdown rendering + cover

 Create/Edit/Delete posts (Reactive Forms + validation + server errors)

 Comments thread (read/add/delete when auth present)

 NgRx Signals Store for posts & comments

 Material 3 theming (light/dark) + runtime switcher (SSR-safe)

 SSR, lazy routes, OnPush, @for with track

 Unit tests (service + component)

 Husky pre-push safety, ESLint, Prettier

🤝 Contributing

PRs welcome—please run npm run lint and npm run test locally before pushing.
Keep layers clean (Service ↔ Store ↔ UI) and prefer Signals & standalone components for new features.

📄 License

MIT — Use freely, attribute appreciated.

If you’re reviewing this as a hiring manager: this codebase reflects how I structure real, maintainable Angular apps—clean architecture, strong developer experience, and a delightful UI that’s accessible and fast.