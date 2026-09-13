#!/usr/bin/env bun
/**
 * play-cli — game-agnostic terminal match loop for agent validation / smoke play.
 *
 * Usage:
 *   pnpm play-cli help
 *   pnpm play-cli doctor --game one-piece
 *   pnpm play-cli auto --game one-piece --matches 3 --seed-base smoke
 *   pnpm play-cli series --game one-piece --series 10 --best-of 3 \
 *     --p1-deck red-aggro --p2-deck blue-control
 */
import { getPlayAdapter, listPlayGames } from "./registry.ts";
import type {
  PlayEndResult,
  PlayTerminationReason,
  SeriesGameResult,
  SeriesResult,
} from "./types.ts";

type Flags = Record<string, string | boolean>;

/** Terminations that mean the automation failed to reach a rules outcome. */
const AUTOMATION_FAILURE_TERMINATIONS = new Set<PlayTerminationReason>([
  "automation-concession",
  "repeated-state",
  "unsupported-prompt",
  "illegal-command",
  "max-actions",
  "infrastructure-error",
]);

function isAutomationFailure(termination: PlayTerminationReason): boolean {
  return AUTOMATION_FAILURE_TERMINATIONS.has(termination);
}

function parseFlags(args: readonly string[]): Flags {
  const flags: Flags = {};
  for (let index = 0; index < args.length; index++) {
    const token = args[index];
    if (!token?.startsWith("--")) continue;
    const key = token.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      flags[key] = true;
    } else {
      flags[key] = value;
      index++;
    }
  }
  return flags;
}

function required(flags: Flags, name: string): string {
  const value = flags[name];
  if (typeof value !== "string") throw new Error(`--${name} is required`);
  return value;
}

function optionalString(flags: Flags, name: string): string | undefined {
  const value = flags[name];
  return typeof value === "string" ? value : undefined;
}

function optionalPositiveInt(flags: Flags, name: string, fallback: number): number {
  const raw = flags[name];
  if (raw === undefined) return fallback;
  if (typeof raw !== "string") throw new Error(`--${name} requires a positive integer`);
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`--${name} must be a positive integer`);
  return n;
}

function printHelp(): void {
  console.log(`play-cli — headless multi-game match CLI

Commands:
  help
  doctor --game <id>
  auto   --game <id> [options]
  series --game <id> [options]

auto options:
  --matches <n>       Number of matches to run (default 1)
  --seed-base <s>     Seed prefix; match i uses "<s>-<i>" (default play-cli)
  --seed <s>          Single-match seed (overrides seed-base when matches=1)
  --p1 <strategy>     P1 bot strategy id (game-defined default if omitted)
  --p2 <strategy>     P2 bot strategy id (game-defined default if omitted)
  --p1-deck <id|path> Deck for P1 (playable id or JSON path)
  --p2-deck <id|path> Deck for P2
  --max-steps <n>     Safety cap on auto steps (default 1000)
  --json              Emit one JSON object per match on stdout

series options (best-of-N batches):
  --series <n>        Number of series to run (default 1)
  --best-of <n>       Odd length series; first to majority wins (default 3)
  --seed-base <s>     Seed prefix for series/games indices
  --p1 / --p2 / --p1-deck / --p2-deck / --max-steps / --json  (same as auto)

Registered games: ${listPlayGames().join(", ") || "none"}

Exit codes:
  0  success
  1  runtime / match failure
  2  bad input (missing flags, unknown game)
`);
}

function formatResultLine(result: PlayEndResult, index: number, total: number): string {
  return [
    `match ${index + 1}/${total}`,
    `game=${result.game}`,
    `seed=${result.seed}`,
    `termination=${result.termination}`,
    `winner=${result.winner ?? "null"}`,
    `turns=${result.turnCount}`,
    `actions=${result.actionCount}`,
    `steps=${result.step}`,
    result.p1DeckId ? `p1Deck=${result.p1DeckId}` : "",
    result.p2DeckId ? `p2Deck=${result.p2DeckId}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function sessionOptionsFromFlags(flags: Flags, seed: string, maxSteps: number) {
  return {
    seed,
    maxSteps,
    p1Strategy: optionalString(flags, "p1"),
    p2Strategy: optionalString(flags, "p2"),
    p1Deck: optionalString(flags, "p1-deck"),
    p2Deck: optionalString(flags, "p2-deck"),
  };
}

async function runDoctor(flags: Flags): Promise<void> {
  const game = required(flags, "game");
  const adapter = await getPlayAdapter(game);
  const result = await adapter.doctor();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

async function runAuto(flags: Flags): Promise<void> {
  const game = required(flags, "game");
  const matches = optionalPositiveInt(flags, "matches", 1);
  const maxSteps = optionalPositiveInt(flags, "max-steps", 1_000);
  const seedBase = optionalString(flags, "seed-base") ?? "play-cli";
  const singleSeed = optionalString(flags, "seed");
  const asJson = flags.json === true;

  const adapter = await getPlayAdapter(game);
  const outcomes: PlayEndResult[] = [];

  for (let i = 0; i < matches; i++) {
    const seed = matches === 1 && singleSeed !== undefined ? singleSeed : `${seedBase}-${i + 1}`;
    const session = adapter.createSession(sessionOptionsFromFlags(flags, seed, maxSteps));
    const result = session.runToEnd();
    outcomes.push(result);
    if (asJson) {
      console.log(JSON.stringify(result));
    } else {
      console.log(formatResultLine(result, i, matches));
    }
  }

  if (!asJson) {
    console.log(
      `summary matches=${outcomes.length} terminations=${outcomes.map((o) => o.termination).join(",")}`,
    );
  }

  if (outcomes.length === 0 || outcomes.some((o) => isAutomationFailure(o.termination))) {
    process.exitCode = 1;
  }
}

async function runSeries(flags: Flags): Promise<void> {
  const game = required(flags, "game");
  const seriesCount = optionalPositiveInt(flags, "series", 1);
  const bestOf = optionalPositiveInt(flags, "best-of", 3);
  if (bestOf % 2 === 0) throw new Error("--best-of must be an odd positive integer");
  const winsNeeded = Math.floor(bestOf / 2) + 1;
  const maxSteps = optionalPositiveInt(flags, "max-steps", 1_000);
  const seedBase = optionalString(flags, "seed-base") ?? "series";
  const asJson = flags.json === true;
  const baseP1Strategy = optionalString(flags, "p1");
  const baseP2Strategy = optionalString(flags, "p2");
  const baseP1Deck = optionalString(flags, "p1-deck");
  const baseP2Deck = optionalString(flags, "p2-deck");

  const adapter = await getPlayAdapter(game);
  const seriesResults: SeriesResult[] = [];
  let sawAutomationFailure = false;

  for (let s = 0; s < seriesCount; s++) {
    const seriesId = `${seedBase}-s${s + 1}`;
    let p1Wins = 0;
    let p2Wins = 0;
    const games: SeriesGameResult[] = [];

    for (let g = 0; g < bestOf; g++) {
      if (p1Wins >= winsNeeded || p2Wins >= winsNeeded) break;
      const seed = `${seriesId}-g${g + 1}`;
      // Alternate physical seats so Jo Ken Po / first-player setup bias does not
      // permanently favor P2 (south chooses first; rock/paper is seat-deterministic).
      const swapSeats = g % 2 === 1;
      const session = adapter.createSession({
        seed,
        maxSteps,
        p1Strategy: swapSeats ? baseP2Strategy : baseP1Strategy,
        p2Strategy: swapSeats ? baseP1Strategy : baseP2Strategy,
        p1Deck: swapSeats ? baseP2Deck : baseP1Deck,
        p2Deck: swapSeats ? baseP1Deck : baseP2Deck,
      });
      const result = session.runToEnd();
      if (isAutomationFailure(result.termination)) sawAutomationFailure = true;

      // Translate physical seats back to logical P1/P2 (including deck attribution).
      let logicalWinner: string | null = result.winner;
      if (swapSeats && result.winner === "south") logicalWinner = "north";
      else if (swapSeats && result.winner === "north") logicalWinner = "south";

      const gameResult: SeriesGameResult = {
        ...result,
        winner: logicalWinner,
        // createSession received swapped decks on odd games; map deck ids back
        // so series JSON keeps logical p1DeckId/p2DeckId consistent with winner.
        p1DeckId: swapSeats ? result.p2DeckId : result.p1DeckId,
        p2DeckId: swapSeats ? result.p1DeckId : result.p2DeckId,
        gameIndex: g + 1,
      };
      games.push(gameResult);
      if (logicalWinner === "south") p1Wins += 1;
      else if (logicalWinner === "north") p2Wins += 1;
    }

    const winner: SeriesResult["winner"] = p1Wins > p2Wins ? "p1" : p2Wins > p1Wins ? "p2" : "draw";
    const series: SeriesResult = {
      seriesId,
      bestOf,
      p1Wins,
      p2Wins,
      winner,
      games,
    };
    seriesResults.push(series);

    if (asJson) {
      console.log(JSON.stringify(series));
    } else {
      console.log(
        [
          `series ${s + 1}/${seriesCount}`,
          `id=${seriesId}`,
          `score=p1:${p1Wins}-p2:${p2Wins}`,
          `winner=${winner}`,
          `games=${games.length}`,
          `terminations=${games.map((entry) => entry.termination).join(",")}`,
        ].join(" "),
      );
      for (const gameResult of games) {
        console.log(
          `  game ${gameResult.gameIndex}: winner=${gameResult.winner ?? "null"} termination=${gameResult.termination} actions=${gameResult.actionCount}`,
        );
      }
    }
  }

  if (!asJson) {
    const p1 = seriesResults.filter((r) => r.winner === "p1").length;
    const p2 = seriesResults.filter((r) => r.winner === "p2").length;
    const draws = seriesResults.filter((r) => r.winner === "draw").length;
    console.log(
      `summary series=${seriesResults.length} p1_series_wins=${p1} p2_series_wins=${p2} draws=${draws}`,
    );
  }

  if (seriesResults.length === 0 || sawAutomationFailure) process.exitCode = 1;
}

async function main(): Promise<void> {
  const [command = "help", ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);

  if (command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  try {
    if (command === "doctor") {
      await runDoctor(flags);
      return;
    }
    if (command === "auto") {
      await runAuto(flags);
      return;
    }
    if (command === "series") {
      await runSeries(flags);
      return;
    }
    throw new Error(`Unknown command: ${command}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    if (
      message.includes("No play-cli adapter registered") ||
      message.includes("is required") ||
      message.startsWith("Unknown command") ||
      message.includes("must be a positive integer") ||
      message.includes("requires a positive integer") ||
      message.includes("Unknown p1 deck") ||
      message.includes("Unknown p2 deck") ||
      message.includes("Unknown One Piece strategy") ||
      message.includes("--best-of must be")
    ) {
      process.exitCode = 2;
    } else {
      process.exitCode = 1;
    }
  }
}

void main();
