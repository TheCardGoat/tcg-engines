#!/usr/bin/env bun
/**
 * support-probe CLI
 *
 * Probe whether the Lorcana engine currently supports a proposed ability
 * shape, effect, condition, target, or trigger.
 *
 * Usage:
 *   bun packages/lorcana/lorcana-engine/src/support-probe/cli.ts \
 *     --ability '{"type":"triggered","trigger":{"event":"play","on":"SELF"},"effect":{"type":"deal-damage","amount":2,"target":"CHOSEN_CHARACTER"}}'
 *
 *   bun packages/lorcana/lorcana-engine/src/support-probe/cli.ts --effect deal-damage
 *   bun packages/lorcana/lorcana-engine/src/support-probe/cli.ts --condition has-named-character
 *   bun packages/lorcana/lorcana-engine/src/support-probe/cli.ts --target CHOSEN_CHARACTER
 *   bun packages/lorcana/lorcana-engine/src/support-probe/cli.ts --trigger play --on SELF
 *
 *   echo '{"ability":{...}}' | bun .../cli.ts --stdin
 *
 * Output is JSON. Exit code:
 *   0   ok=true
 *   1   ok=false (missing or unknown checks)
 *   2   bad input
 */
import { probeSupport } from "./probe";
import type { ProbeInput } from "./types";

type CliOptions = {
  input: ProbeInput;
  showHelp: boolean;
  pretty: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const input: ProbeInput = {};
  let showHelp = false;
  let pretty = true;
  let useStdin = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      showHelp = true;
      continue;
    }
    if (arg === "--stdin") {
      useStdin = true;
      continue;
    }
    if (arg === "--compact") {
      pretty = false;
      continue;
    }
    if (arg === "--ability") {
      input.ability = parseJson(argv[++i], "--ability") as Record<string, unknown>;
      continue;
    }
    if (arg === "--effect") {
      input.effect = argv[++i];
      continue;
    }
    if (arg === "--condition") {
      input.condition = argv[++i];
      continue;
    }
    if (arg === "--target") {
      const next = argv[++i];
      input.target = next.startsWith("{") ? parseJson(next, "--target") : next;
      continue;
    }
    if (arg === "--trigger") {
      input.trigger = { ...input.trigger, event: argv[++i] };
      continue;
    }
    if (arg === "--on") {
      input.trigger = { ...input.trigger, on: argv[++i] };
      continue;
    }
  }

  if (useStdin) {
    const raw = readAllStdin();
    if (raw) {
      const parsed = parseJson(raw, "stdin");
      if (parsed && typeof parsed === "object") {
        Object.assign(input, parsed as ProbeInput);
      }
    }
  }

  return { input, showHelp, pretty };
}

function parseJson(value: string | undefined, label: string): unknown {
  if (value === undefined) {
    process.stderr.write(`Missing value for ${label}\n`);
    process.exit(2);
  }
  try {
    return JSON.parse(value);
  } catch (err) {
    process.stderr.write(`Invalid JSON for ${label}: ${(err as Error).message}\n`);
    process.exit(2);
  }
}

function readAllStdin(): string | null {
  try {
    // Bun supports synchronous stdin via Bun.stdin in newer versions; fall back
    // to process.stdin.read which is synchronous when stdin is a piped buffer.
    const chunks: Buffer[] = [];
    let chunk: Buffer | null;
    while ((chunk = process.stdin.read() as Buffer | null)) {
      chunks.push(chunk);
    }
    if (chunks.length === 0) return null;
    return Buffer.concat(chunks).toString("utf8");
  } catch {
    return null;
  }
}

function printHelp(): void {
  console.log(
    `Probe whether the Lorcana engine supports a proposed ability shape.

Options:
  --ability <json>     Probe a full ability JSON shape
  --effect <type>      Probe a single effect discriminator
  --condition <type>   Probe a single condition discriminator
  --target <value>     Probe a target string or JSON object
  --trigger <event>    Probe a trigger event name
  --on <subject>       Probe a trigger subject (use with --trigger)
  --stdin              Read JSON-shaped ProbeInput from stdin
  --compact            Emit single-line JSON
  -h, --help           Show this help

Exit codes:
  0   all referenced variants supported
  1   one or more variants missing or unknown
  2   bad input
`,
  );
}

async function main(): Promise<void> {
  const { input, showHelp, pretty } = parseArgs(process.argv.slice(2));
  if (showHelp) {
    printHelp();
    return;
  }
  const result = probeSupport(input);
  process.stdout.write(JSON.stringify(result, null, pretty ? 2 : 0) + "\n");
  process.exit(result.ok ? 0 : 1);
}

if (import.meta.main) {
  main().catch((err) => {
    process.stderr.write(`support-probe failed: ${(err as Error).message}\n`);
    process.exit(2);
  });
}
