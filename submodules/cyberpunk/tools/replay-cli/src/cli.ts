#!/usr/bin/env bun
import { resolveDefIds } from "./card-resolver.ts";
import { fetchReplay, ReplayNotFoundError } from "./fetch.ts";
import { renderReplaySummary, renderTurn } from "./render.ts";
import { extractTurn } from "./turn-extractor.ts";

const DEFAULT_API_ORIGIN = "https://cyberpunk-api.tcg.online";

interface CliOptions {
  replayId: string | null;
  turn: number | null;
  apiOrigin: string;
  showHelp: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  let replayId: string | null = null;
  let turn: number | null = null;
  let apiOrigin = process.env.TCG_API_ORIGIN ?? DEFAULT_API_ORIGIN;
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
    }
  }

  return { replayId, turn, apiOrigin, showHelp };
}

function printHelp(): void {
  console.log(
    `Download a Cyberpunk replay and print a per-turn trace.

Required:
  --replay-id <id>    Replay (game) id to download

Trace mode:
  --turn <n>          1-based turn number to inspect. If omitted, prints a
                      replay summary with available turns.

Options:
  --api-origin <url>  API origin to download the replay from
                      (default: $TCG_API_ORIGIN or ${DEFAULT_API_ORIGIN})
  -h, --help          Show this help

Output sections:
  --- CARDS INVOLVED ---       instanceId -> card slug/id -> on-disk file path
  --- INITIAL STATE ---        reconstructed Cyberpunk MatchState before turn
  --- PENDING CHOICE ---       turnMetadata.pendingChoice before/after steps
  --- STEPS ---                per-step move, logs, JSON patches

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
  if (opts.turn !== null && opts.turn < 1) {
    process.stderr.write("Invalid --turn (expected 1-based positive integer)\n\n");
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

  if (opts.turn === null) {
    process.stdout.write(renderReplaySummary(replay) + "\n");
    return;
  }

  let extracted;
  try {
    extracted = extractTurn(replay, opts.turn);
  } catch (err) {
    process.stderr.write(`${(err as Error).message}\n`);
    process.exit(1);
  }

  const defIds = new Set<string>();
  for (const instId of extracted.involvedInstanceIds) {
    const defId = extracted.cardInstances[instId];
    if (defId) defIds.add(defId);
  }

  const resolvedCards = await resolveDefIds(defIds);
  process.stdout.write(renderTurn({ replay, turn: opts.turn, extracted, resolvedCards }) + "\n");
}

if (import.meta.main) {
  main().catch((err) => {
    process.stderr.write(
      `cyberpunk-replay failed: ${(err as Error).stack ?? (err as Error).message}\n`,
    );
    process.exit(1);
  });
}
