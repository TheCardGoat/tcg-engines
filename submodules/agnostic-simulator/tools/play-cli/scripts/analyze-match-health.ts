/**
 * Deep health analysis of One Piece play-cli matches.
 *
 * Usage:
 *   bun scripts/analyze-match-health.ts [--out path] [--strategy first-legal|greedy|heuristic]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  createSt01MirrorPracticeConfig,
  getSafeOnePieceAutomatedActionStrategyOption,
  runBotMatch,
  type EngineCommand,
  type MatchState,
  type PromptState,
} from "../../../../one-piece/packages/engine/src/index.ts";

import { onePiecePlayAdapter } from "../src/adapters/one-piece.ts";
import type { PlaySession } from "../src/types.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

interface Matchup {
  id: string;
  p1Deck: string;
  p2Deck: string;
  seedBase: string;
  series: number;
}

/** Same matchups as the five Bo3 agents. */
const MATCHUPS: Matchup[] = [
  {
    id: "agent1-nami-enel",
    p1Deck: "blue-control",
    p2Deck: "purple-ramp",
    seedBase: "agent1-nami-enel",
    series: 10,
  },
  {
    id: "agent2-luffy-nami",
    p1Deck: "green-midrange",
    p2Deck: "blue-control",
    seedBase: "agent2-luffy-nami",
    series: 10,
  },
  {
    id: "agent3-bb-enel",
    p1Deck: "black-removal",
    p2Deck: "purple-ramp",
    seedBase: "agent3-bb-enel",
    series: 10,
  },
  {
    id: "agent4-rosi-luffy",
    p1Deck: "yellow-trigger",
    p2Deck: "green-midrange",
    seedBase: "agent4-rosi-luffy",
    series: 10,
  },
  {
    id: "agent5-zoro-bb",
    p1Deck: "red-aggro",
    p2Deck: "black-removal",
    seedBase: "agent5-zoro-bb",
    series: 10,
  },
];

interface GameDiag {
  matchup: string;
  seriesId: string;
  gameIndex: number;
  seed: string;
  strategy: string;
  termination: string;
  winner: string | null;
  finishReason: string | null;
  status: string;
  turnNumber: number;
  phase: string;
  actionCount: number;
  step: number;
  southLife: number;
  northLife: number;
  southHand: number;
  northHand: number;
  southDeck: number;
  northDeck: number;
  southChars: number;
  northChars: number;
  pendingPrompts: number;
  commandTypeHistogram: Record<string, number>;
  lastCommands: string[];
  logTail: string[];
  hardIssue: string | null;
}

function parseArgs(argv: string[]) {
  let out = join(
    process.env.PLAY_CLI_ANALYSIS_OUT ?? join(ROOT, "match-health"),
    "match-health-report.json",
  );
  let strategy = "first-legal";
  let maxSeries = 10;
  let maxGamesPerSeries = 3;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") out = argv[++i]!;
    if (argv[i] === "--strategy") strategy = argv[++i]!;
    if (argv[i] === "--max-series") maxSeries = Number(argv[++i]);
    if (argv[i] === "--max-games") maxGamesPerSeries = Number(argv[++i]);
  }
  return { out, strategy, maxSeries, maxGamesPerSeries };
}

function commandType(cmd: EngineCommand): string {
  return cmd.type;
}

async function resolveSession(value: PlaySession | Promise<PlaySession>): Promise<PlaySession> {
  return await value;
}

function loadDeck(id: string) {
  const playableDir = join(ROOT, "decks/playable");
  const path = join(playableDir, `${id}.json`);
  if (!existsSync(path)) throw new Error(`missing ${path}`);
  return JSON.parse(readFileSync(path, "utf8")) as {
    leaderId: string;
    mainDeck: string[];
    name?: string;
    id?: string;
  };
}

async function diagnoseGame(input: {
  matchup: Matchup;
  seriesIndex: number;
  gameIndex: number;
  strategy: string;
}): Promise<GameDiag> {
  const seriesId = `${input.matchup.seedBase}-s${input.seriesIndex}`;
  const seed = `${seriesId}-g${input.gameIndex}`;
  const session = await resolveSession(
    onePiecePlayAdapter.createSession({
      seed,
      maxSteps: 1_000,
      p1Strategy: input.strategy,
      p2Strategy: input.strategy,
      p1Deck: input.matchup.p1Deck,
      p2Deck: input.matchup.p2Deck,
    }),
  );

  const result = session.runToEnd();

  const strategyOpt = getSafeOnePieceAutomatedActionStrategyOption(input.strategy);
  const botAgent = {
    id: strategyOpt.id,
    choose: strategyOpt.strategy,
    resolvePrompt: strategyOpt.resolvePrompt,
  };

  const p1 = loadDeck(input.matchup.p1Deck);
  const p2 = loadDeck(input.matchup.p2Deck);
  const practice = createSt01MirrorPracticeConfig({ firstPlayer: "south", seed });
  const config = {
    ...practice,
    seed,
    shuffleDecks: true as const,
    skipFirstTurnDraw: true as const,
    players: {
      south: {
        leaderCardId: p1.leaderId,
        mainDeck: [...p1.mainDeck],
        donDeckCount: 10,
        playerName: p1.name ?? p1.id ?? "P1",
      },
      north: {
        leaderCardId: p2.leaderId,
        mainDeck: [...p2.mainDeck],
        donDeckCount: 10,
        playerName: p2.name ?? p2.id ?? "P2",
      },
    },
  };

  const botResult = runBotMatch(
    config,
    { south: botAgent, north: botAgent },
    { maxCommands: 1_000, seed },
  );

  const histogram: Record<string, number> = {};
  const lastCommands: string[] = [];
  for (const cmd of botResult.commandHistory) {
    const t = commandType(cmd);
    histogram[t] = (histogram[t] ?? 0) + 1;
  }
  for (const cmd of botResult.commandHistory.slice(-8)) {
    lastCommands.push(cmd.type);
  }

  const final: MatchState = botResult.finalState;
  let hardIssue: string | null = null;
  if (botResult.illegalCommands > 0) hardIssue = `illegalCommands=${botResult.illegalCommands}`;
  if (botResult.stuck) hardIssue = (hardIssue ? `${hardIssue}; ` : "") + "stuck";
  if (botResult.termination !== "rules-win") {
    hardIssue = (hardIssue ? `${hardIssue}; ` : "") + `termination=${botResult.termination}`;
  }
  if (final.status === "finished" && !final.winner) {
    hardIssue = (hardIssue ? `${hardIssue}; ` : "") + "finished-without-winner";
  }
  if (final.status === "finished" && !final.finishReason) {
    hardIssue = (hardIssue ? `${hardIssue}; ` : "") + "finished-without-finishReason";
  }
  if (result.winner !== botResult.winner) {
    hardIssue =
      (hardIssue ? `${hardIssue}; ` : "") +
      `session/bot winner mismatch session=${result.winner} bot=${botResult.winner}`;
  }

  return {
    matchup: input.matchup.id,
    seriesId,
    gameIndex: input.gameIndex,
    seed,
    strategy: input.strategy,
    termination: botResult.termination,
    winner: botResult.winner,
    finishReason: final.finishReason,
    status: final.status,
    turnNumber: final.turnNumber,
    phase: final.phase,
    actionCount: botResult.totalCommands,
    step: result.step,
    southLife: final.players.south.life.length,
    northLife: final.players.north.life.length,
    southHand: final.players.south.hand.length,
    northHand: final.players.north.hand.length,
    southDeck: final.players.south.deck.length,
    northDeck: final.players.north.deck.length,
    southChars: final.players.south.characterArea.filter(Boolean).length,
    northChars: final.players.north.characterArea.filter(Boolean).length,
    pendingPrompts: final.promptQueue.filter((p: PromptState) => p.status === "pending").length,
    commandTypeHistogram: histogram,
    lastCommands,
    logTail: botResult.logHistory.slice(-12),
    hardIssue,
  };
}

function summarize(games: GameDiag[]) {
  const byTerm: Record<string, number> = {};
  const byFinish: Record<string, number> = {};
  const byWinner: Record<string, number> = {};
  const issues: GameDiag[] = [];
  const cmdTotals: Record<string, number> = {};
  const turns: number[] = [];
  const actions: number[] = [];

  for (const g of games) {
    byTerm[g.termination] = (byTerm[g.termination] ?? 0) + 1;
    byFinish[g.finishReason ?? "null"] = (byFinish[g.finishReason ?? "null"] ?? 0) + 1;
    byWinner[g.winner ?? "null"] = (byWinner[g.winner ?? "null"] ?? 0) + 1;
    turns.push(g.turnNumber);
    actions.push(g.actionCount);
    if (g.hardIssue) issues.push(g);
    for (const [k, v] of Object.entries(g.commandTypeHistogram)) {
      cmdTotals[k] = (cmdTotals[k] ?? 0) + v;
    }
  }

  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const sortedCmd = Object.entries(cmdTotals).sort((a, b) => b[1] - a[1]);

  return {
    totalGames: games.length,
    terminations: byTerm,
    finishReasons: byFinish,
    winners: byWinner,
    hardIssueCount: issues.length,
    hardIssues: issues.map((g) => ({
      seed: g.seed,
      matchup: g.matchup,
      hardIssue: g.hardIssue,
      termination: g.termination,
      finishReason: g.finishReason,
      winner: g.winner,
      actions: g.actionCount,
      turns: g.turnNumber,
    })),
    turns: {
      min: Math.min(...turns),
      max: Math.max(...turns),
      mean: Number(mean(turns).toFixed(2)),
    },
    actions: {
      min: Math.min(...actions),
      max: Math.max(...actions),
      mean: Number(mean(actions).toFixed(2)),
    },
    topCommandTypes: sortedCmd.slice(0, 20).map(([type, count]) => ({ type, count })),
    lifeAtEnd: {
      zeroLifeWins: games.filter(
        (g) =>
          g.finishReason === "leaderDamage" &&
          ((g.winner === "south" && g.northLife === 0) ||
            (g.winner === "north" && g.southLife === 0)),
      ).length,
      emptyDeckWins: games.filter((g) => g.finishReason === "emptyDeck").length,
      effectWins: games.filter((g) => g.finishReason === "effectWin").length,
      inconsistentLife:
        games.filter(
          (g) => g.finishReason === "leaderDamage" && g.winner === "south" && g.northLife !== 0,
        ).length +
        games.filter(
          (g) => g.finishReason === "leaderDamage" && g.winner === "north" && g.southLife !== 0,
        ).length,
    },
    pendingPromptsAtEnd: games.filter((g) => g.pendingPrompts > 0).length,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const games: GameDiag[] = [];

  console.log(
    `Analyzing match health strategy=${args.strategy} series<=${args.maxSeries} games<=${args.maxGamesPerSeries}`,
  );

  for (const matchup of MATCHUPS) {
    for (let s = 1; s <= Math.min(args.maxSeries, matchup.series); s++) {
      let p1 = 0;
      let p2 = 0;
      const winsNeeded = 2;
      for (let g = 1; g <= args.maxGamesPerSeries; g++) {
        if (p1 >= winsNeeded || p2 >= winsNeeded) break;
        const diag = await diagnoseGame({
          matchup,
          seriesIndex: s,
          gameIndex: g,
          strategy: args.strategy,
        });
        games.push(diag);
        if (diag.winner === "south") p1 += 1;
        else if (diag.winner === "north") p2 += 1;
        const flag = diag.hardIssue ? ` ISSUE=${diag.hardIssue}` : "";
        console.log(
          `${diag.seed} term=${diag.termination} finish=${diag.finishReason} winner=${diag.winner} turns=${diag.turnNumber} actions=${diag.actionCount} life=${diag.southLife}/${diag.northLife}${flag}`,
        );
      }
    }
  }

  const summary = summarize(games);
  const report = {
    generatedAt: new Date().toISOString(),
    strategy: args.strategy,
    summary,
    games,
  };

  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, `${JSON.stringify(report, null, 2)}\n`);
  console.log("\n=== SUMMARY ===");
  console.log(JSON.stringify(summary, null, 2));
  console.log(`\nWrote ${args.out}`);
  if (summary.hardIssueCount > 0) process.exitCode = 1;
}

void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
