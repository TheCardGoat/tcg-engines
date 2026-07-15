#!/usr/bin/env bun
/**
 * tcg-replay CLI
 *
 * Download a Lorcana replay from production and print the per-turn trace
 * (cards involved → initial state → step-by-step move/logs/patches) so
 * an LLM agent can debug a specific turn from a player bug report.
 *
 * Alternatively, with `--open` or `--fork`, jump straight from the CLI to
 * the browser, landing on the requested turn in the simulator's replay
 * watcher (or fork view) so the rest of triage can happen in the UI.
 *
 * Usage:
 *   bun packages/tools/replay-cli/src/cli.ts --replay-id <gameId> --turn <n>
 *   tcg-replay --replay-id <gameId> --turn <n> [--api-origin <url>]
 *   tcg-replay --replay-id <gameId> --turn <n> --open [--base-url <url>]
 *   tcg-replay --replay-id <gameId> --turn <n> --fork --side playerOne
 */
import { fetchReplay, ReplayNotFoundError } from "./fetch";
import { extractTurn } from "./turn-extractor";
import { resolveDefIds } from "./card-resolver";
import { renderTurn } from "./render";
import { buildReplayUrl, openInBrowser, type ForkSide, type OpenMode } from "./open-replay";

const DEFAULT_API_ORIGIN = "https://api.tcg.online";
const DEFAULT_BASE_URL = "http://localhost:5173";

interface CliOptions {
  replayId: string | null;
  turn: number | null;
  apiOrigin: string;
  baseUrl: string;
  openMode: OpenMode | null;
  side: ForkSide | null;
  showHelp: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  let replayId: string | null = null;
  let turn: number | null = null;
  let apiOrigin = process.env.TCG_API_ORIGIN ?? DEFAULT_API_ORIGIN;
  let baseUrl = process.env.TCG_REPLAY_BASE_URL ?? DEFAULT_BASE_URL;
  let openMode: OpenMode | null = null;
  let side: ForkSide | null = null;
  let showHelp = false;

  const requireValue = (flag: string, value: string | undefined): string => {
    if (value === undefined || value.startsWith("--")) {
      process.stderr.write(`${flag} requires a value\n`);
      process.exit(2);
    }
    return value;
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      showHelp = true;
      continue;
    }
    if (arg === "--replay-id") {
      replayId = requireValue("--replay-id", argv[++i]);
      continue;
    }
    if (arg === "--turn") {
      const raw = requireValue("--turn", argv[++i]);
      const n = Number.parseInt(raw, 10);
      turn = Number.isFinite(n) ? n : null;
      continue;
    }
    if (arg === "--api-origin") {
      apiOrigin = requireValue("--api-origin", argv[++i]);
      continue;
    }
    if (arg === "--base-url") {
      baseUrl = requireValue("--base-url", argv[++i]);
      continue;
    }
    if (arg === "--open") {
      if (openMode === null) openMode = "watch";
      continue;
    }
    if (arg === "--fork") {
      openMode = "fork";
      continue;
    }
    if (arg === "--side") {
      const raw = requireValue("--side", argv[++i]);
      if (raw !== "playerOne" && raw !== "playerTwo") {
        process.stderr.write(`--side must be playerOne or playerTwo (got ${raw})\n`);
        process.exit(2);
      }
      side = raw;
      continue;
    }
  }

  return { replayId, turn, apiOrigin, baseUrl, openMode, side, showHelp };
}

function printHelp(): void {
  console.log(
    `Download a Lorcana replay and either print the per-turn trace or open it
in the simulator at the requested point.

Required:
  --replay-id <id>    Replay (game) id to download
  --turn <n>          1-based turn number to inspect

Trace mode (default):
  --api-origin <url>  API origin to download the replay from
                      (default: $TCG_API_ORIGIN or ${DEFAULT_API_ORIGIN})

Browser mode (move triage from CLI to UI):
  --open              Open the replay watcher in the default browser at the
                      first step of --turn, instead of printing the trace.
  --fork              Open the "play from here" fork view at the first step
                      of --turn. Requires --side. Implies --open.
  --side <p1|p2>      Required with --fork: which player you are forking as.
                      Accepts "playerOne" or "playerTwo".
  --base-url <url>    Simulator origin for --open/--fork
                      (default: $TCG_REPLAY_BASE_URL or ${DEFAULT_BASE_URL}).
                      Set to https://tcg.online for production replays.

  -h, --help          Show this help

Output sections in trace mode (in order):
  --- CARDS INVOLVED ---       instanceId → defId → on-disk file path
  --- INITIAL STATE ---        reconstructed MatchState before the turn
  --- PENDING SELECTIONS ---   raw selectionContext objects for any pending
                               player choice at the pre-turn state, then again
                               after each step in --- STEPS --- as a
                               pendingSelections: line.
  --- STEPS ---                per-step move, logs, JSON patches

Browser mode prints the URL and launches the default browser. The trace is
NOT printed in this mode — use a second invocation without --open if you
need both.

Exit codes:
  0   success
  1   runtime error (replay not found, turn out of range, fetch failure)
  2   bad input (missing/invalid args)
`,
  );
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.showHelp) {
    printHelp();
    return;
  }
  if (!opts.replayId) {
    process.stderr.write("Missing required --replay-id\n\n");
    printHelp();
    process.exit(2);
  }
  if (opts.turn === null || opts.turn < 1) {
    process.stderr.write("Missing or invalid --turn (expected 1-based positive integer)\n\n");
    printHelp();
    process.exit(2);
  }
  if (opts.openMode === "fork" && !opts.side) {
    process.stderr.write("--fork requires --side <playerOne|playerTwo>\n\n");
    printHelp();
    process.exit(2);
  }

  let replay;
  try {
    replay = await fetchReplay(opts.replayId, opts.apiOrigin);
  } catch (err) {
    if (err instanceof ReplayNotFoundError) {
      process.stderr.write(`replay not found: ${opts.replayId}\n`);
      process.exit(1);
    }
    process.stderr.write(`fetch failed: ${(err as Error).message}\n`);
    process.exit(1);
  }

  let extracted;
  try {
    extracted = extractTurn(replay, opts.turn);
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exit(1);
  }

  if (opts.openMode !== null) {
    // Browser mode: jump to the first step of the requested turn.
    const step = extracted.turnSteps[0]?.globalIndex ?? 0;
    const url = buildReplayUrl({
      baseUrl: opts.baseUrl,
      replayId: opts.replayId,
      step,
      mode: opts.openMode,
      side: opts.side ?? undefined,
    });
    process.stdout.write(`${url}\n`);
    openInBrowser(url);
    return;
  }

  const defIds = new Set<string>();
  for (const instId of extracted.involvedInstanceIds) {
    const defId = extracted.cardInstances[instId];
    if (defId) defIds.add(defId);
  }
  const resolvedCards = await resolveDefIds(defIds);

  const output = renderTurn({ replay, turn: opts.turn, extracted, resolvedCards });
  process.stdout.write(output + "\n");
}

if (import.meta.main) {
  main().catch((err) => {
    process.stderr.write(`tcg-replay failed: ${(err as Error).stack ?? (err as Error).message}\n`);
    process.exit(1);
  });
}
