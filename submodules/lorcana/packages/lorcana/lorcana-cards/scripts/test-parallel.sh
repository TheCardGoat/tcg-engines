#!/usr/bin/env bash
# Runs bun test for each card set in parallel to exploit multiple CPU cores.
# Each shard writes its own junit XML file (bun-001.xml, bun-002.xml, ...).
#
# Coalescing: if another agent is already running this script, we wait for it
# and exit with its result instead of spawning duplicate work.
set -uo pipefail

LOCK_DIR="${TMPDIR:-/tmp}/lorcana-test-locks"
# Key includes the repo root so parallel runs from different checkouts don't share locks.
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
LOCK_KEY="lorcana-cards-test-parallel-$(echo "$REPO_ROOT" | tr '/' '_')"
LOCK_FILE="$LOCK_DIR/$LOCK_KEY.lock"
RESULT_FILE="$LOCK_DIR/$LOCK_KEY.result"

mkdir -p "$LOCK_DIR"

wait_for_owner() {
  local owner_pid="$1"
  echo "tests already running (pid: $owner_pid) — waiting for result..."
  for ((elapsed = 3; elapsed <= 300; elapsed += 3)); do
    if ! kill -0 "$owner_pid" 2>/dev/null; then
      break
    fi
    sleep 3
    [ $((elapsed % 15)) -eq 0 ] && echo "still waiting (${elapsed}s)..."
  done
  if kill -0 "$owner_pid" 2>/dev/null; then
    echo "timed out waiting after 300s" >&2
    exit 1
  fi
  if [ -f "$RESULT_FILE" ]; then
    result=$(cat "$RESULT_FILE")
    echo "reusing completed test result: exit $result"
    exit "$result"
  fi
  echo "owner exited but no result file found — running tests ourselves"
}

# --- Coalescing: wait if another agent already holds the lock ---
if [ -f "$LOCK_FILE" ]; then
  owner_pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
  if [ -n "$owner_pid" ] && kill -0 "$owner_pid" 2>/dev/null; then
    wait_for_owner "$owner_pid"
  else
    rm -f "$LOCK_FILE" "$RESULT_FILE"
  fi
fi

# --- Acquire lock atomically (noclobber prevents two processes racing) ---
if ! ( set -C; echo $$ > "$LOCK_FILE" ) 2>/dev/null; then
  # Lost the race — another process just created the lock
  owner_pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
  if [ -n "$owner_pid" ] && kill -0 "$owner_pid" 2>/dev/null; then
    wait_for_owner "$owner_pid"
  fi
  rm -f "$LOCK_FILE" "$RESULT_FILE"
fi

cleanup() {
  rm -f "$LOCK_FILE"
}
trap cleanup EXIT

# --- Run shards in parallel ---
SETS=(001 002 003 004 005 006 007 008 009 010 011)
pids=()

timestamp="$(date +"%Y%m%d-%H%M%S")"
log_dir="logs/test-parallel"
mkdir -p "$log_dir"

echo "tests running (pid: $$, logs: $log_dir/shard-*.log)"

for s in "${SETS[@]}"; do
  AGENT=1 bun test "src/cards/$s" \
    --reporter=junit \
    --reporter-outfile="./bun-$s.xml" \
    --bail=10 \
    --only-failures \
    "$@" > "$log_dir/shard-$s.log" 2>&1 &
  pids+=($!)
done

exit_code=0

# Heartbeat: print progress every 15s while any shard is still running
(
  for ((elapsed = 15; ; elapsed += 15)); do
    sleep 15
    running=0
    for pid in "${pids[@]}"; do
      kill -0 "$pid" 2>/dev/null && running=$((running + 1))
    done
    [ "$running" -eq 0 ] && break
    echo "tests still running (${elapsed}s, ${running} shards active)..."
  done
) &
heartbeat_pid=$!

for pid in "${pids[@]}"; do
  wait "$pid" || exit_code=1
done

kill "$heartbeat_pid" 2>/dev/null || true
wait "$heartbeat_pid" 2>/dev/null || true

echo "$exit_code" > "$RESULT_FILE"

if [ "$exit_code" -eq 0 ]; then
  echo "tests passed"
else
  echo "tests failed — showing failing shards:"
  for s in "${SETS[@]}"; do
    shard_log="$log_dir/shard-$s.log"
    if grep -q " fail" "$shard_log" 2>/dev/null; then
      echo "=== set $s ==="
      cat "$shard_log"
    fi
  done
fi

exit "$exit_code"
