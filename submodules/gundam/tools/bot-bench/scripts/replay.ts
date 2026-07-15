#!/usr/bin/env node
import { loadReplay, verifyReplay } from "../src/replay.ts";

interface CliArgs {
  path: string;
  help?: boolean;
}

function parseArgs(argv: readonly string[]): CliArgs {
  const out: Record<string, unknown> = { path: "" };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--help" || arg === "-h") {
      out.help = true;
      continue;
    }
    if (arg === "--") continue;
    if (arg === "--path") {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) throw new Error("--path requires a value");
      out.path = value;
      i++;
    }
  }
  return out as unknown as CliArgs;
}

function printHelp(): void {
  process.stdout.write("bot-bench replay --path <replay.json>\n");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (args.path === "") throw new Error("--path is required");

  const replay = loadReplay(args.path);
  const result = verifyReplay(replay);
  if (result.matched) {
    process.stdout.write(`Replay matched: ${args.path}\n`);
    return;
  }

  process.stderr.write(`Replay diverged: ${result.divergences.length} mismatch(es)\n`);
  for (const divergence of result.divergences.slice(0, 20)) {
    process.stderr.write(
      `  match ${divergence.matchId} action ${divergence.actionIndex} ${divergence.field}: expected=${JSON.stringify(
        divergence.expected,
      )} actual=${JSON.stringify(divergence.actual)}\n`,
    );
  }
  if (result.divergences.length > 20) {
    process.stderr.write(`  ... +${result.divergences.length - 20} more\n`);
  }
  process.exit(3);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  process.stderr.write(`replay failed: ${message}\n`);
  process.exit(1);
});
