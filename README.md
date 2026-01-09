# Ralph - Autonomous Agent Loop

Ralph is an experiment in autonomous code generation. It runs Claude Code CLI in a loop, building a complete project one task at a time from a structured task manifest.

## How It Works

Ralph uses three components:

1. **`ralph.sh`** - A bash script that loops, piping instructions to Claude
2. **`prompt.md`** - Instructions telling Claude to complete ONE task per session
3. **`progress.json`** - The project manifest with phases, tasks, and verification commands

Each iteration:
1. Claude reads `progress.json` to find the current state
2. Finds the first incomplete task
3. Implements it, runs verifications
4. Updates `progress.json` and commits
5. Stops (one task per session)

The loop continues until all tasks are complete or max iterations reached.

## Running From Scratch

To run the experiment from its starting state:

```bash
# Clone and checkout the starting commit
git checkout ad86ebc

# Run ralph (default 50 iterations max)
./scripts/ralph/ralph.sh

# Or specify max iterations
./scripts/ralph/ralph.sh 100
```

At commit `ad86ebc`, only the initial `.gitignore` task was complete. Ralph will build out the entire Echo Lab project across 10 phases:

- Phase 0: Monorepo scaffolding (pnpm workspace, TypeScript, Biome, Vitest, Playwright)
- Phase 1: Shared schemas with Effect
- Phase 2: Backend services (TransformationService, HistoryService)
- Phase 3: HTTP API with OpenAPI
- Phase 4: Frontend shell (Vite + shadcn)
- Phase 5: Frontend state layer
- Phase 6: Transform UI components
- Phase 7: Frontend-backend integration
- Phase 8: History feature
- Phase 9: Polish and animations
- Phase 10: E2E testing

## Requirements

- Claude Code CLI (`claude` command available)
- `jq` for JSON parsing in the bash script
- Node.js 20+ and pnpm

## Notes

- The `--dangerously-skip-permissions` flag allows Claude to run without interactive prompts
- Each task has verification commands that must pass before marking complete
- Progress is tracked in `progress.json` - the single source of truth
- Commits follow the pattern: `feat(phase-X): [Task ID] - [Task Name]`
