#!/bin/bash
set -e

MAX_ITERATIONS=${1:-50}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$PROJECT_ROOT"

echo "🚀 Starting Ralph - Echo Lab Builder"
echo "📁 Project: $PROJECT_ROOT"
echo "🔄 Max iterations: $MAX_ITERATIONS"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "═══════════════════════════════════════"
  echo "═══ Iteration $i of $MAX_ITERATIONS ═══"
  echo "═══════════════════════════════════════"

  # Show current progress
  CURRENT_PHASE=$(jq -r '.current_phase // 0' progress.json)
  CURRENT_TASK=$(jq -r '.current_task // "none"' progress.json)
  OVERALL=$(jq -r '.overall_status' progress.json)
  echo "📊 Phase: $CURRENT_PHASE | Task: $CURRENT_TASK | Status: $OVERALL"

  OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" \
    | claude --dangerously-skip-permissions 2>&1 \
    | tee /dev/stderr) || true

  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "✅ All phases complete! Echo Lab is ready."
    exit 0
  fi

  sleep 2
done

echo ""
echo "⚠️ Max iterations ($MAX_ITERATIONS) reached"
exit 1
