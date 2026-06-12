#!/usr/bin/env bash

set -uo pipefail

if [ "$#" -lt 1 ]; then
  echo "usage: $0 <bun-script> [args...]" >&2
  exit 2
fi

script_name="$1"
shift

if [ "${DISABLE_AGENT_FULL_CI:-0}" = "1" ]; then
  echo "ci check blocked: $script_name,Agents must not run full CI during the current sessions.  Run only the individual test or type check for the module you changed." >&2
  echo "If you think this behaviouor is incorrect ask clarification if not running as sub agent or autonousmly" >&2
  exit 1
fi

timestamp="$(date +"%Y%m%d-%H%M%S")"
log_dir="logs/ci-check"
log_name="${script_name//:/-}-${timestamp}.log"

mkdir -p "$log_dir"

full_log_dir="$(cd "$log_dir" && pwd -P)"
log_path="${full_log_dir}/${log_name}"

log_files=()
shopt -s nullglob
existing_logs=("$full_log_dir"/*.log)
shopt -u nullglob

read_lines_into_array() {
  local target_array_name="$1"
  shift
  local line

  eval "$target_array_name=()"
  while IFS= read -r line; do
    eval "$target_array_name+=(\"\$line\")"
  done < <("$@" || true)
}

if [ "${#existing_logs[@]}" -gt 0 ]; then
  read_lines_into_array log_files ls -1t "${existing_logs[@]}"
fi

if [ "${#log_files[@]}" -ge 20 ]; then
  for old_log in "${log_files[@]:19}"; do
    rm -f "$old_log"
  done
fi

export AGENT=1
export LOG_LEVEL=error

kill_process_tree() {
  local signal="$1"
  local pid="$2"
  local child_pids=()
  read_lines_into_array child_pids pgrep -P "$pid"

  for child_pid in "${child_pids[@]}"; do
    [ -n "$child_pid" ] || continue
    kill_process_tree "$signal" "$child_pid"
  done

  kill "-$signal" "$pid" 2>/dev/null || true
}

timeout_seconds="${CI_CHECK_TIMEOUT_SECONDS:-180}"
heartbeat_interval=30
poll_interval=5
elapsed=0
timed_out=0

echo "ci check running: $script_name ($log_path)"

bun run "$script_name" "$@" >"$log_path" 2>&1 &
command_pid=$!

max_polls=$(( (timeout_seconds + poll_interval - 1) / poll_interval + 1 ))
for ((poll = 0; poll < max_polls; poll += 1)); do
  if ! kill -0 "$command_pid" 2>/dev/null; then
    break
  fi

  sleep "$poll_interval"
  elapsed=$((elapsed + poll_interval))

  if ! kill -0 "$command_pid" 2>/dev/null; then
    break
  fi

  if [ $((elapsed % heartbeat_interval)) -eq 0 ]; then
    echo "ci check still running (${elapsed}s): $script_name ($log_path)"
  fi

  if [ "$elapsed" -ge "$timeout_seconds" ]; then
    timed_out=1
    echo "ci check timed out after ${timeout_seconds}s: $script_name ($log_path)" >&2
    kill_process_tree TERM "$command_pid"
    sleep 5
    kill_process_tree KILL "$command_pid"
    break
  fi
done

if wait "$command_pid" 2>/dev/null; then
  status=0
else
  status=$?
fi

if [ "$timed_out" -eq 1 ]; then
  status=124
fi

if [ "$status" -eq 0 ]; then
  echo "ci check passed: $script_name ($log_path)"
  exit 0
fi

if [ "$timed_out" -eq 1 ]; then
  echo "ci check failed: $script_name"
  echo "reason: timed out after ${timeout_seconds}s"
else
  echo "ci check failed: $script_name"
fi
echo "full log: $log_path"
echo "last 200 lines:"
tail -n 200 "$log_path"

exit "$status"
