/**
 * CLI for the One Piece playtest loop (engine-connected).
 *
 * Plays best-of-three matches across the TEST_DECKS pool, writes per-game
 * JSON evidence and a batch-summary.md into reports/engine-playtest/<label>/,
 * and prints a concise supervisor summary. Deterministic per --seed.
 *
 * From packages/engine:
 *   bun run src/automation/playtest/cli.ts --matches=15 --label=pre-fix-baseline
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  deckPairs,
  runMatch,
  type GameRecord,
  type MatchRecord,
  type PlaytestStyleId,
} from "./runner.ts";
import { TEST_DECKS, type TestDeckId } from "../test-decks.ts";

const ALL_DECK_IDS = Object.keys(TEST_DECKS) as TestDeckId[];

function readArg(name: string): string | null {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function readNumberArg(name: string, fallback: number): number {
  const raw = readArg(name);
  if (raw === null) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseDecks(raw: string | null): TestDeckId[] {
  if (raw === null) return ALL_DECK_IDS;
  const ids = raw
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is TestDeckId => value.length > 0);
  for (const id of ids) {
    if (!(id in TEST_DECKS)) {
      throw new Error(`Unknown deck: ${id}. Known: ${ALL_DECK_IDS.join(", ")}`);
    }
  }
  return ids;
}

function parseStyles(raw: string | null): PlaytestStyleId[] {
  const known: PlaytestStyleId[] = ["heuristic", "aggressive", "greedy", "valueRanked"];
  if (raw === null) return ["heuristic", "aggressive"];
  const ids = raw
    .split(",")
    .map((value) => value.trim())
    .filter((value): value is PlaytestStyleId => value.length > 0);
  if (ids.length < 2) {
    throw new Error(`--styles needs at least two strategies, got: ${raw}`);
  }
  for (const id of ids) {
    if (!known.includes(id)) {
      throw new Error(`Unknown strategy: ${id}. Known: ${known.join(", ")}`);
    }
  }
  return ids;
}

function summarizeGames(games: readonly GameRecord[]): {
  total: number;
  natural: number;
  illegal: number;
  avgCommands: number;
  avgTurns: number;
} {
  const total = games.length;
  const natural = games.filter((g) => g.naturalCompletion).length;
  const illegal = games.reduce((sum, g) => sum + g.illegalCommands, 0);
  const avgCommands = total > 0 ? games.reduce((sum, g) => sum + g.totalCommands, 0) / total : 0;
  const avgTurns = total > 0 ? games.reduce((sum, g) => sum + g.turns, 0) / total : 0;
  return { total, natural, illegal, avgCommands, avgTurns };
}

function writeBatchSummary(options: {
  path: string;
  label: string;
  seed: number;
  matches: readonly MatchRecord[];
  startedAt: string;
  durationMs: number;
}): void {
  const games = options.matches.flatMap((m) => m.games);
  const totals = summarizeGames(games);
  const lines: string[] = [];
  lines.push(`# Playtest batch: ${options.label}`);
  lines.push("");
  lines.push(
    `- Started: ${options.startedAt}, seed ${options.seed}, duration ${(options.durationMs / 1000).toFixed(1)}s`,
  );
  lines.push(
    `- Matches: ${options.matches.length}, games: ${totals.total}, natural completions: ${totals.natural}/${totals.total} (${Math.round((totals.natural / Math.max(totals.total, 1)) * 100)}%)`,
  );
  lines.push(
    `- Avg commands/game: ${Math.round(totals.avgCommands * 10) / 10}, avg turns: ${Math.round(totals.avgTurns * 10) / 10}, illegal commands: ${totals.illegal}`,
  );
  lines.push("");
  lines.push("## Matches (best of three)");
  lines.push("");
  lines.push("| match | south | north | score | games natural | terminations |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const match of options.matches) {
    lines.push(
      `| ${match.matchId} | ${match.southStyle} ${match.southDeck} | ${match.northStyle} ${match.northDeck} | ` +
        `${match.score.south}-${match.score.north} (${match.winner}) | ${match.naturalGames}/${match.games.length} | ` +
        `${match.games.map((g) => g.termination).join(", ")} |`,
    );
  }
  lines.push("");
  lines.push("## Log audit (aggregated by category)");
  lines.push("");
  const byCategory = new Map<
    string,
    { severity: string; count: number; example: string | null; game: string }
  >();
  for (const game of games) {
    for (const finding of game.logAudit.findings) {
      const entry = byCategory.get(finding.category);
      if (entry) {
        entry.count += finding.count;
      } else {
        byCategory.set(finding.category, {
          severity: finding.severity,
          count: finding.count,
          example: finding.example,
          game: game.gameId,
        });
      }
    }
  }
  if (byCategory.size === 0) {
    lines.push("No log findings. Either the logs are clean or the audit needs new rules.");
  } else {
    lines.push("| category | severity | total | first seen in | example |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const [category, entry] of [...byCategory.entries()].sort(
      (a, b) => b[1].count - a[1].count,
    )) {
      lines.push(
        `| ${category} | ${entry.severity} | ${entry.count} | ${entry.game} | ${JSON.stringify(entry.example)} |`,
      );
    }
  }
  lines.push("");
  lines.push("## Rules-invariant violations");
  lines.push("");
  const violating = games.filter((g) => !g.invariantAudit.ok);
  if (violating.length === 0) {
    lines.push(`None (${games.length} games audited).`);
  } else {
    for (const game of violating) {
      lines.push(`- ${game.gameId}:`);
      for (const violation of game.invariantAudit.violations) {
        lines.push(`  - ${violation.id}: ${violation.detail}`);
      }
    }
  }
  lines.push("");
  lines.push("## Non-natural terminations");
  lines.push("");
  const unnatural = games.filter((g) => !g.naturalCompletion);
  if (unnatural.length === 0) {
    lines.push("None — every game ended by the rules.");
  } else {
    for (const game of unnatural) {
      lines.push(
        `- ${game.gameId}: ${game.termination} (turn ${game.turns}, commands ${game.totalCommands})`,
      );
    }
  }
  lines.push("");
  lines.push("## Hidden-information leakage (per-seat projections)");
  lines.push("");
  const leaky = games.filter((g) => !g.projectionAudit.ok);
  if (leaky.length === 0) {
    lines.push(
      `None (${games.length} games, ${games.reduce((s, g) => s + g.projectionAudit.checkedNames, 0)} hidden names checked against both seat projections).`,
    );
  } else {
    for (const game of leaky) {
      lines.push(`- ${game.gameId}:`);
      for (const leak of game.projectionAudit.leaks) {
        lines.push(
          `  - ${leak.viewer} saw ${leak.owner}'s ${leak.where} card "${leak.name}" in: ${JSON.stringify(leak.line)}`,
        );
      }
    }
  }
  lines.push("");
  lines.push("## Prompt coverage (point-and-click surface exercised)");
  lines.push("");
  const choiceKinds = new Map<string, number>();
  const promptKinds = new Map<string, number>();
  for (const game of games) {
    for (const seat of ["south", "north"] as const) {
      for (const [kind, count] of Object.entries(game.coverage[seat].promptKinds)) {
        promptKinds.set(kind, (promptKinds.get(kind) ?? 0) + count);
      }
      for (const [kind, count] of Object.entries(game.coverage[seat].promptChoiceKinds)) {
        choiceKinds.set(kind, (choiceKinds.get(kind) ?? 0) + count);
      }
    }
  }
  const fmt = (m: Map<string, number>) =>
    [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}=${v}`)
      .join(", ") || "(none)";
  lines.push(`- prompt kinds: ${fmt(promptKinds)}`);
  lines.push(`- choice kinds: ${fmt(choiceKinds)}`);
  lines.push("");
  writeFileSync(options.path, `${lines.join("\n")}\n`);
}

function writeGameRecord(dir: string, game: GameRecord): void {
  writeFileSync(join(dir, `${game.gameId}.json`), `${JSON.stringify(game, null, 2)}\n`);
}

function main(): void {
  const label = readArg("label") ?? `batch-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const seed = readNumberArg("seed", 41000);
  const matchesWanted = readNumberArg("matches", 15);
  const maxCommands = readNumberArg("max-commands", 1500);
  const deckIds = parseDecks(readArg("decks"));
  const outDir = resolve(
    fileURLToPath(new URL("../../../../../reports/engine-playtest/", import.meta.url)),
    label,
  );
  mkdirSync(outDir, { recursive: true });

  const pairs = deckPairs(deckIds);
  const styles = parseStyles(readArg("styles"));
  const startedAt = new Date().toISOString();
  const started = Date.now();
  const matches: MatchRecord[] = [];
  for (let index = 0; index < matchesWanted; index++) {
    const [southDeck, northDeck] = pairs[index % pairs.length]!;
    const match = runMatch({
      matchId: `op-fitl-${label}-m${String(index + 1).padStart(2, "0")}`,
      southDeck,
      northDeck,
      southStyle: styles[index % styles.length]!,
      northStyle: styles[(index + 1) % styles.length]!,
      seedBase: `${seed}-m${index + 1}`,
      maxCommands,
    });
    matches.push(match);
    for (const game of match.games) {
      writeGameRecord(outDir, game);
    }
  }
  const durationMs = Date.now() - started;
  writeBatchSummary({
    path: join(outDir, "batch-summary.md"),
    label,
    seed,
    matches,
    startedAt,
    durationMs,
  });

  const games = matches.flatMap((m) => m.games);
  const totals = summarizeGames(games);
  const logDefects = games.reduce(
    (sum, g) =>
      sum +
      g.logAudit.findings.filter((f) => f.severity === "defect").reduce((s, f) => s + f.count, 0),
    0,
  );
  const invariantFails = games.filter((g) => !g.invariantAudit.ok).length;
  console.log(
    `Batch ${label}: ${matches.length} matches, ${totals.total} games, ` +
      `natural ${totals.natural}/${totals.total}, illegal=${totals.illegal}, ` +
      `log defects=${logDefects}, invariant-fail-games=${invariantFails}, ` +
      `${(durationMs / 1000).toFixed(1)}s`,
  );
  console.log(`Reports: ${outDir}`);
}

main();
