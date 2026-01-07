## Echo Lab - Phased Implementation Plan

---

## Phase 0: Monorepo Scaffolding

### Requirements
- Initialize pnpm workspace with `pnpm-workspace.yaml`
- Create folder structure: `apps/api`, `apps/web`, `packages/shared`
- Root `package.json` with workspace scripts
- TypeScript config with project references
- Shared `tsconfig.base.json` for consistent settings
- Configure Biome for linting and formatting
- Add root `biome.json` configuration
- Add workspace scripts for `lint`, `format`, `format:check`
- Install Vitest as dev dependency at root
- Configure Vitest in `vitest.config.ts`
- Add test scripts to root package.json
- Install Playwright for e2e browser testing
- Configure Playwright in `playwright.config.ts`
- Add e2e test script (`test:e2e`) to root package.json

### Files to Create
```
echo-lab/
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── biome.json
├── vitest.config.ts
├── playwright.config.ts
├── apps/
│   ├── api/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/
│       ├── package.json
│       └── tsconfig.json
└── packages/
    └── shared/
        ├── package.json
        └── tsconfig.json
```

### Pass Criteria
```bash
# From root directory:
pnpm install                    # ✓ Installs without errors
pnpm -r exec pwd               # ✓ Shows all 3 packages found
pnpm lint                       # ✓ No linting errors
pnpm format:check               # ✓ All files formatted correctly
pnpm test                       # ✓ Test runner works (no tests yet is OK)
pnpm test:e2e                   # ✓ Playwright runner works (no tests yet is OK)
```

---

## Phase 1: Shared Package - Schemas & Types

### Requirements
- Install `effect` and `@effect/schema` in shared package
- Define `TransformationType` as a literal union schema
- Define `TransformRequest` schema (text + transformation)
- Define `TransformResult` schema (original, result, transformation, id, timestamp)
- Define typed error schemas: `InvalidInput`, `TransformationFailed`
- Export everything from `packages/shared/src/index.ts`

### Files to Create
```
packages/shared/src/
├── index.ts
├── schemas.ts        # Effect Schema definitions
└── errors.ts         # Typed error definitions
```

### Pass Criteria
```bash
cd packages/shared
pnpm build                      # ✓ Compiles without errors
pnpm typecheck                  # ✓ No type errors

# In a test file or REPL:
import { TransformRequest } from "@echo-lab/shared"
Schema.decodeSync(TransformRequest)({ text: "hello", transformation: "uppercase" })  # ✓ Returns valid object
Schema.decodeSync(TransformRequest)({ text: "", transformation: "invalid" })          # ✓ Throws ParseError

# From root directory:
pnpm lint                       # ✓ No linting errors
pnpm format:check               # ✓ All files formatted correctly
pnpm test                       # ✓ All tests pass
```

---

## Phase 2: Backend Services (Pure Logic)

### Requirements
- Create `TransformationService` as Effect Service
- Implement all 6 transformations as pure functions
- Create `HistoryService` using `Effect.Ref<Array<TransformResult>>`
- Services should be testable without HTTP layer
- Use Effect's dependency injection pattern (`Context.Tag`)

### Files to Create
```
apps/api/src/
├── services/
│   ├── TransformationService.ts
│   └── HistoryService.ts
└── index.ts          # Re-exports services
```

### Pass Criteria
```typescript
// Create a test file or run in REPL:
import { TransformationService, HistoryService } from "./services"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const transformer = yield* TransformationService
  const history = yield* HistoryService

  // Test transformation
  const result = yield* transformer.transform("hello", "uppercase")
  console.log(result) // ✓ "HELLO"

  // Test history
  yield* history.add({ original: "hello", result: "HELLO", ... })
  const items = yield* history.getAll()
  console.log(items.length) // ✓ 1
})

// ✓ Program runs with provided services (live implementations)
```
```bash
# From root directory:
pnpm lint                       # ✓ No linting errors
pnpm format:check               # ✓ All files formatted correctly
pnpm test                       # ✓ All tests pass
```

---

## Phase 3: Backend HTTP API + OpenAPI

### Requirements
- Install `@effect/platform`, `@effect/platform-node`
- Define HTTP API using `HttpApi.make()` with groups
- Create `TransformApi` group with POST `/transform`, GET `/history`, DELETE `/history`
- Implement handlers that use services from Phase 2
- Add OpenAPI spec generation
- Serve Scalar docs at `/docs`
- CORS enabled for localhost:5173

### Files to Create
```
apps/api/src/
├── main.ts           # Entry point, runs server
├── api.ts            # HttpApi definition
├── handlers.ts       # Route handlers
└── live.ts           # Live layer composition
```

### Pass Criteria
```bash
cd apps/api && pnpm dev         # ✓ Server starts on port 3001

# Test endpoints:
curl -X POST http://localhost:3001/api/transform \
  -H "Content-Type: application/json" \
  -d '{"text":"hello","transformation":"uppercase"}'
# ✓ Returns: {"original":"hello","result":"HELLO","transformation":"uppercase","id":"...","timestamp":"..."}

curl http://localhost:3001/api/transform/history
# ✓ Returns: {"items":[...],"total":1}

curl http://localhost:3001/docs
# ✓ Returns Scalar UI HTML

curl http://localhost:3001/openapi.json
# ✓ Returns valid OpenAPI 3.x spec

# From root directory:
pnpm lint                       # ✓ No linting errors
pnpm format:check               # ✓ All files formatted correctly
pnpm test                       # ✓ All tests pass
```

---

## Phase 4: Frontend Shell (Vite + shadcn)

### Requirements
- Initialize Vite React-TS project in `apps/web`
- Install and configure shadcn (New York style, neutral colors)
- Install required shadcn components: Button, Input, Textarea, Select, Card, Toast, Separator
- Set up basic layout with centered Card
- Configure dark mode support via class strategy
- Proxy `/api` requests to backend in vite.config.ts

### Files to Create
```
apps/web/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css           # Tailwind + shadcn styles
│   ├── components/
│   │   └── ui/             # shadcn components
│   └── lib/
│       └── utils.ts        # cn() helper
├── components.json          # shadcn config
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

### Pass Criteria
```bash
cd apps/web && pnpm dev       # ✓ Starts on port 5173

# Visual checks:
# ✓ Page loads with centered Card component
# ✓ Card contains placeholder text "Echo Lab"
# ✓ Dark mode toggle works (or respects system preference)
# ✓ shadcn Button renders correctly inside card

# From root directory:
pnpm lint                       # ✓ No linting errors
pnpm format:check               # ✓ All files formatted correctly
pnpm test                       # ✓ All tests pass
```

---

## Phase 5: Frontend State Layer

### Requirements
- Install `effect-atom`, `@tanstack/react-query`, `effect`, `@effect/platform`
- Create atoms for: `inputText`, `selectedTransformation`, `isHistoryOpen`
- Set up TanStack Query client with provider
- Create typed API client using `@effect/platform` `HttpClient`
- Create query hooks: `useHistory`, `useTransformMutation`

### Files to Create
```
apps/web/src/
├── atoms/
│   └── index.ts             # effect-atom definitions
├── lib/
│   ├── api-client.ts        # Effect HttpClient setup
│   └── query-client.ts      # TanStack Query client
├── hooks/
│   ├── useHistory.ts
│   └── useTransform.ts
└── providers.tsx            # QueryClientProvider wrapper
```

### Pass Criteria
```typescript
// In React DevTools or console:
// ✓ Atoms are reactive - changing inputText re-renders subscribers
// ✓ useHistory returns { data, isLoading, error } shape
// ✓ useTransform returns mutation with mutateAsync function

// Network tab:
// ✓ API calls go through Effect HttpClient
// ✓ Request/response properly typed (no `any`)

// From root directory:
// pnpm lint                       # ✓ No linting errors
// pnpm format:check               # ✓ All files formatted correctly
// pnpm test                       # ✓ All tests pass
```

---

## Phase 6: Transform UI Component

### Requirements
- Build `TransformCard` component with:
  - Textarea bound to `inputText` atom
  - Select dropdown for transformation type
  - Transform button that triggers mutation
  - Result display area (appears after transform)
  - Copy button for result (uses clipboard API)
- Add toast notifications for success/error
- Loading state on button during transform

### Files to Create
```
apps/web/src/
├── components/
│   ├── TransformCard.tsx
│   ├── TransformResult.tsx
│   └── CopyButton.tsx
```

### Pass Criteria
```
# Visual/interaction checks:
# ✓ Can type text in textarea
# ✓ Can select transformation from dropdown
# ✓ Button shows loading spinner during API call
# ✓ Result appears below with fade-in animation
# ✓ Copy button copies result to clipboard
# ✓ Toast appears on copy success
# ✓ Toast appears on API error with error message

# From root directory:
pnpm lint                       # ✓ No linting errors
pnpm format:check               # ✓ All files formatted correctly
pnpm test                       # ✓ All tests pass
```

---

## Phase 7: Frontend-Backend Integration

### Requirements
- Ensure transform mutation calls real API
- Handle all error types from backend (pattern match on `_tag`)
- Optimistic update: show result immediately, rollback on error
- Invalidate history query after successful transform

### Code Changes
- Update `useTransform.ts` to integrate with real API
- Add error handling in `TransformCard.tsx`

### Pass Criteria
```bash
# Start both servers:
pnpm dev  # from root (should start both)

# Integration test:
# ✓ Type "hello world", select "uppercase", click Transform
# ✓ Result shows "HELLO WORLD"
# ✓ Network tab shows POST to /api/transform with correct payload
# ✓ Selecting "base64-decode" with invalid input shows typed error toast
# ✓ History endpoint reflects new transformation

# From root directory:
pnpm lint                       # ✓ No linting errors
pnpm format:check               # ✓ All files formatted correctly
pnpm test                       # ✓ All tests pass
```

---

## Phase 8: History Feature

### Requirements
- Build `HistoryPanel` component (sidebar or collapsible section)
- Display list of past transformations from `useHistory`
- Each item shows: truncated text (20 chars) → result, type badge, relative timestamp
- "Clear history" button with confirmation
- Empty state when no history

### Files to Create
```
apps/web/src/
├── components/
│   ├── HistoryPanel.tsx
│   ├── HistoryItem.tsx
│   └── EmptyHistory.tsx
```

### Pass Criteria
```
# Visual/interaction checks:
# ✓ History panel shows list of transformations
# ✓ Items show truncated preview with "..." if too long
# ✓ Timestamp shows "just now", "2 min ago", etc.
# ✓ Clear history button triggers DELETE request
# ✓ After clear, empty state shows "No transformations yet"
# ✓ New transforms appear in history without page refresh

# From root directory:
pnpm lint                       # ✓ No linting errors
pnpm format:check               # ✓ All files formatted correctly
pnpm test                       # ✓ All tests pass
```

---

## Phase 9: Polish & Final Touches

### Requirements
- Add subtle animations:
  - Result fade-in/slide-up on transform
  - History items animate in on load
  - Button micro-interactions
- Responsive layout (mobile-friendly)
- Keyboard shortcut: `Cmd/Ctrl + Enter` to transform
- Proper focus management (focus result after transform)
- Loading skeletons for history
- Final dark mode polish (check all components)

### Pass Criteria
```
# Visual/UX checks:
# ✓ Animations are smooth, not jarring
# ✓ Works on mobile viewport (390px width)
# ✓ Cmd+Enter triggers transform when textarea focused
# ✓ Tab order is logical
# ✓ Dark mode has no contrast issues
# ✓ No layout shift during loading states

# Final checks:
pnpm typecheck                 # ✓ Zero errors across all packages
pnpm build                     # ✓ Production build succeeds
pnpm preview                   # ✓ Production build runs correctly
pnpm lint                      # ✓ No linting errors
pnpm format:check              # ✓ All files formatted correctly
pnpm test                      # ✓ All tests pass
```

---

## Summary Table

| Phase | Focus | Key Deliverable | Est. Complexity |
|-------|-------|-----------------|-----------------|
| 0 | Setup | Working monorepo | Low |
| 1 | Shared | Effect Schemas | Low |
| 2 | Backend | Pure services | Medium |
| 3 | Backend | HTTP API + Docs | Medium |
| 4 | Frontend | Vite + shadcn shell | Low |
| 5 | Frontend | State management | Medium |
| 6 | Frontend | Transform UI | Medium |
| 7 | Integration | E2E working | Medium |
| 8 | Feature | History complete | Medium |
| 9 | Polish | Production ready | Low |

---

Want me to generate the actual prompt text for any specific phase, formatted for feeding directly to an AI agent?