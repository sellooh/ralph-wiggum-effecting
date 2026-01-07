Here's a comprehensive prompt designed to test AI coding agents:

---

## Prompt: Build an Echo Transformation Service

### Overview
Build a full-stack TypeScript monorepo application called **"Echo Lab"** - a beautiful, minimal web app where users can submit text and apply various transformations (uppercase, reverse, base64 encode, etc.). The app should demonstrate proper Effect-TS patterns throughout.

---

### Tech Stack

**Monorepo:**
- pnpm workspaces
- Shared packages for types/schemas

**Backend (`apps/api`):**
- Effect HTTP API (`@effect/platform`, `effect`)
- OpenAPI spec generation with Scalar UI at `/docs`
- Effect Services pattern for business logic
- In-memory storage using `Effect.Ref`
- Typed errors (e.g., `TransformationNotFound`, `InvalidInput`)

**Frontend (`apps/web`):**
- Vite + React 18
- shadcn/ui (New York style, neutral palette)
- TanStack Query for server state
- `effect-atom` for local reactive state
- `@effect/platform` browser HTTP client for API calls

**Shared (`packages/shared`):**
- Effect Schema definitions for API request/response
- Transformation type definitions

---

### Features

#### Transformations Available:
1. `uppercase` - Convert to uppercase
2. `lowercase` - Convert to lowercase  
3. `reverse` - Reverse the string
4. `base64-encode` - Encode to base64
5. `base64-decode` - Decode from base64
6. `count` - Return character/word count as JSON

#### API Endpoints:

```
POST /api/transform
  Body: { text: string, transformation: TransformationType }
  Response: { original: string, result: string, transformation: string, timestamp: string }

GET /api/transform/history
  Response: { items: TransformResult[], total: number }

DELETE /api/transform/history
  Response: { deleted: number }
```

#### UI Requirements:
1. **Main card** centered on screen with:
   - Textarea for input text
   - Dropdown/select for transformation type (use shadcn Select)
   - "Transform" button (use shadcn Button)
   - Result display area with copy button

2. **History panel** (collapsible sidebar or below main card):
   - List of recent transformations
   - Each item shows: truncated original → truncated result, transformation type, timestamp
   - "Clear history" button

3. **Visual polish:**
   - Subtle animations on transform (result fade-in)
   - Toast notifications for errors and copy success
   - Responsive layout
   - Dark mode support via shadcn theming

---

### Architecture Requirements

#### Backend Services Pattern:
```typescript
// Define as Effect Services
- TransformationService: handles all text transformations
- HistoryService: manages in-memory history (use Ref<Array<TransformResult>>)
```

#### Frontend State Management:
```typescript
// Use effect-atom for:
- Current input text
- Selected transformation
- UI state (sidebar open, loading states)

// Use TanStack Query for:
- History fetching
- Transform mutations with optimistic updates
```

#### Error Handling:
- Define typed errors in shared package using Effect Schema
- API should return proper error responses with `_tag` discriminator
- Frontend should pattern match on error types and show appropriate toasts

---

### File Structure:
```
echo-lab/
├── pnpm-workspace.yaml
├── package.json
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── api.ts (HTTP API definition)
│   │   │   ├── services/
│   │   │   │   ├── TransformationService.ts
│   │   │   │   └── HistoryService.ts
│   │   │   └── errors.ts
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── components/
│       │   ├── atoms/
│       │   ├── hooks/
│       │   └── lib/
│       │       └── api-client.ts
│       └── package.json
└── packages/
    └── shared/
        ├── src/
        │   ├── schemas.ts
        │   └── types.ts
        └── package.json
```

---

### Acceptance Criteria:
1. `pnpm install` works from root
2. `pnpm dev` starts both API (port 3001) and web (port 5173) with hot reload
3. OpenAPI docs accessible at `http://localhost:3001/docs`
4. All transformations work correctly
5. History persists during session (in-memory)
6. No TypeScript errors (`pnpm typecheck` passes)
7. UI is polished and responsive

---

### Bonus (if time permits):
- Add a "chain transformations" feature (apply multiple in sequence)
- Keyboard shortcut (Cmd/Ctrl + Enter) to transform
- Export history as JSON

---

Want me to refine any section or add more specific implementation hints for areas where AI agents typically struggle?