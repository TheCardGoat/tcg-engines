#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../../.." && pwd)"
image_name="${BOT_BENCH_UI_IMAGE:-gundam-simulator:bot-bench-ui}"
host_port="${BOT_BENCH_UI_PORT:-3000}"
base_url="${BOT_BENCH_BASE_URL:-http://127.0.0.1:${host_port}/gundam/simulator}"

docker build \
  --build-arg VITE_BOT_BENCH_UI_ENABLED=1 \
  -f "$repo_root/Dockerfile" \
  -t "$image_name" \
  "$repo_root"

container_id="$(
  docker run \
    --rm \
    -d \
    -e BOT_BENCH_UI_ENABLED=1 \
    -e PORT=3000 \
    -p "127.0.0.1:${host_port}:3000" \
    "$image_name"
)"

cleanup() {
  docker stop "$container_id" >/dev/null 2>&1 || true
}
trap cleanup EXIT

ready=0
attempt=1
while [ "$attempt" -le 60 ]; do
  if node -e "fetch(process.argv[1]).then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))" "$base_url/bot-bench-ui"; then
    ready=1
    break
  fi
  sleep 1
  attempt=$((attempt + 1))
done

if [ "$ready" != "1" ]; then
  echo "Simulator did not become ready at $base_url" >&2
  docker logs "$container_id" >&2 || true
  exit 1
fi

vp run ui-bench -- --base-url "$base_url" "$@"
