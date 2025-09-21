# Blog Platform · Angular 20 · Material 3 · SSR

![Angular](https://img.shields.io/badge/Angular-20-red)
![Material](https://img.shields.io/badge/UI-Material%20Design%203-blue)
![State](https://img.shields.io/badge/State-NgRx%20Signals-5C2D91)
![SSR](https://img.shields.io/badge/Rendering-SSR%20%2B%20Vite-8A2BE2)
![Tests](https://img.shields.io/badge/Tests-Vitest-brightgreen)
![Lint](https://img.shields.io/badge/Code%20Style-ESLint%20%2B%20Prettier-yellow)

> A production-grade RealWorld client built with modern Angular patterns: **Standalone Components**, **NgRx Signals Store**, **Material 3** theming (light/dark), **SSR**, clean separation of concerns, and polished UX.

API: `https://api.realworld.show/api`

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Why These Technologies?](#why-these-technologies)
- [State Management](#state-management)
- [Performance](#performance)
- [UX / UI](#ux--ui)
- [Testing](#testing)
- [Developer Experience](#developer-experience)
- [Design Decisions (ADRs)](#design-decisions-adrs)
- [Challenge Checklist](#challenge-checklist)
- [License](#license)

---

## Features

- **Angular 20** with **Standalone** components and **SSR**
- **Material 3 (MDC)** theme: light/dark + runtime switching
- **NgRx Signals Store** for deterministic, minimal-boilerplate state
- **Posts**: list with pagination, responsive grid
- **Post Detail**: Markdown rendering + cover placeholder
- **Post Editor**: Reactive Forms (create/edit), server-error mapping, validation
- **Comments Thread**: modular service + store + UI (read/add/delete when authenticated)
- **Clean architecture**: Service ↔ Store ↔ UI separation
- **Tooling**: Vitest, ESLint + Prettier, Husky pre-push

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- NPM or PNPM
- (Windows) Git Bash recommended for running Husky shell hooks

### Install

```bash
npm i
```

## Development (SSR)

```bash
npm start

http://localhost:4200
```

## Build

npm run build # client build (SSR output mode)
npm run build:ssr # client + server bundle

## Serve SSR (dev)

npm run serve:ssr

## Tests

```
npm test          # vitest watch
npm run test:ci   # CI mode with coverage
```

## Project Structure

```
src/
├─ app/
│  ├─ core/                      # singletons & cross-cutting
│  │  ├─ interceptors/
│  │  └─ services/
│  │     ├─ api.service.ts       # HTTP boundary to RealWorld
│  │     └─ theme.service.ts     # SSR-safe theme toggling
│  ├─ features/
│  │  ├─ posts/                  # list feature
│  │  │  ├─ components/
│  │  │  ├─ pages/
│  │  │  └─ store/               # Signals store (list/paging)
│  │  └─ post/                   # single post feature
│  │     ├─ components/comments-thread/
│  │     ├─ pages/post-details/
│  │     ├─ pages/editor/
│  │     └─ services/            # article/comments HTTP only
│  ├─ shared/
│  │  ├─ components/             # UI atoms (confirm-dialog, etc.)
│  │  ├─ models/                 # DTOs
│  │  ├─ pipes/                  # markdown
│  │  └─ utils/                  # form error mapper, cover util
│  └─ store/                     # (optional) app-level items
├─ styles.scss                   # tokens + global polish + theme use
└─ material-theme.scss           # Material 3 theme (light/dark)
```

## Architecture

### Separation of Concerns

- Service (HTTP): Pure transport, no UI/state (e.g., ArticleService, CommentsService).

- Store (Signals): Holds state & effects (loadPage, loadOne, createOne, updateOne, deleteOne). Explicit transitions and error handling.

- UI (Pages/Components): Declarative templates, Reactive Forms, no business logic.

- Module Boundaries

- Core: singletons (API client, theme), interceptors, platform concerns.

- Shared: reusable UI atoms, DTOs, pipes, utilities.

- Feature: self-contained vertical slices: pages/components/store/services.

- This layout scales: add a feature by cloning a proven pattern (service → store → UI).

### Why These Technologies?

- Angular 20 + Standalone: fewer NgModules, better tree-shaking, simpler mental model.

- SSR: faster first paint, SEO-friendly; guarded browser APIs (isPlatformBrowser) to prevent SSR crashes.

- Material 3 (MDC): accessible color system, consistent components, and tokens for density/shape/typography.

- NgRx Signals Store: deterministic state without classic NgRx boilerplate; perfect fit for medium-size apps.

- Reactive Forms: robust validation, server error mapping (422) into controls, great UX for forms.

- Markdown: marked + Angular sanitizer via [innerHTML] for safe, SSR-friendly content.

### State Management

- Signals Store (@ngrx/signals): withState for shape, withMethods for side-effects.

- Stores orchestrate API calls, handle loading/error flags, and update state slices.

- Components consume signals directly; no manual subscriptions or teardown.

### Performance

- Lazy-loaded routes with loadComponent.

- OnPush change detection across feature pages/components.

- Angular 20 control flow (@if, @for) with track keys (slug/id).

- SSR-safe theme/localStorage initialization (no top-level document access).

### UX / UI

- Material 3 theming (light/dark); runtime theme switcher via CSS class scopes.

- Global tokens: --app-surface, --app-border, --app-radius for cohesive visuals.

- Posts List: responsive grid + outlined paginator; hover elevation on cards.

- Post Detail: Markdown .prose typography, cover image derived from slug.

- Editor: Reactive Forms, inline validation, server-error mapping, progress bar while submitting, snackbar feedback.

- Comments Thread: clean list, add/delete (when authenticated), independent store.

### Testing

- Service tests with HttpClientTestingModule (e.g., paging, error cases).

- Component tests for validation (e.g., Editor).

Run:

```bash
npm test
npm run test:ci
```

## Developer Experience

- ESLint + Prettier for consistency.

- Husky pre-push runs tests in CI mode to keep main green.

- Tailwind compatibility fixes for MDC outlined inputs (prevent “double border”).

- Theming via material-theme.scss and @use (M3 API), referenced in styles.scss.

## Design Decisions (ADRs)

- Signals over Classic NgRx: App size does not justify actions/reducers boilerplate. Signals keep state explicit and ergonomic while staying scalable.

- SSR-first: For SEO/perceived performance; all browser-only APIs are guarded (theme initialization happens only in browser).

- Class-scoped color layers: Enables runtime brand/dark switching without rebuilding styles.

- Service ↔ Store ↔ UI: Single responsibility per layer; easier testing and maintenance.

- Reactive Forms + Server Mapping: Strong UX for forms and predictable error presentation.

### Challenge Checklist

- Angular (>=15) with modular, scalable architecture (Core/Shared/Feature)

- Clean Code & Separation of Concerns (Service/Store/UI)

- State Management with Signals / NgRx Signals

- Performance: Lazy Loading, OnPush, @for track keys

- UX/UI: Material 3, responsive design, dark/light themes

- Post Management: create/edit/delete with Reactive Forms + validation + server errors

- Comments thread display (+ add/delete when authenticated)

- Unit tests: at least one Service and one Component

- Documentation: this README explains architecture & tech choices

### License

MIT — use freely, attribution appreciated.
