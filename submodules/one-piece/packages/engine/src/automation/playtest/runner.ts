/**
 * Best-of-three match runner for the One Piece simulator-readiness loop.
 *
 * Plays full engine-connected matches between the TEST_DECKS pool with the
 * production bot strategies, captures per-game evidence (logs, log audit,
 * rules-invariant audit, prompt/command coverage), and returns structured
 * records for the batch reports. No masking logic lives here: games that do
 * not finish naturally are recorded as such, never forced past their bugs.
 */

import "@tcg/op-cards";
import type {
  MatchConfig,
  MatchPlayerConfig,
  MatchSeat,
  MatchState,
  PromptState,
} from "../../types.ts";
import { runBotMatch } from "../bot-harness.ts";
import {
  greedyStrategy,
  toBotAgent,
  valueRankedStrategy,
  type OnePieceBotAgent,
} from "../bot-strategies.ts";
import { aggressiveAgent, heuristicAgent } from "../heuristic-strategy.ts";
import { TEST_DECKS, type TestDeckId } from "../test-decks.ts";
import { auditGameLog, type LogAuditResult } from "./log-audit.ts";
import { auditFinalState, type InvariantAuditResult } from "./invariant-audit.ts";
import { auditSeatLeakage, type ProjectionAuditResult } from "./projection-audit.ts";

export type PlaytestStyleId = "heuristic" | "aggressive" | "greedy" | "valueRanked";

const STRATEGIES: Record<PlaytestStyleId, OnePieceBotAgent> = {
  heuristic: toBotAgent(heuristicAgent),
  aggressive: toBotAgent(aggressiveAgent),
  // Naive-resolver strategies: no resolvePrompt hook, so the harness's
  // generic prompt resolver answers every interaction — different prompt
  // paths than the heuristic agents exercise.
  greedy: toBotAgent(greedyStrategy),
  valueRanked: toBotAgent(valueRankedStrategy),
};

export interface SeatCoverage {
  /** Times each strategy resolved a prompt, by prompt kind. */
  promptKinds: Record<string, number>;
  /** Same, keyed by choiceKind (choice prompts only). */
  promptChoiceKinds: Record<string, number>;
  /** Main-phase commands this seat's strategy chose, by type. */
  commandTypes: Record<string, number>;
}

function emptyCoverage(): SeatCoverage {
  return { promptKinds: {}, promptChoiceKinds: {}, commandTypes: {} };
}

function instrumentAgent(agent: OnePieceBotAgent, coverage: SeatCoverage): OnePieceBotAgent {
  return {
    id: agent.id,
    choose: (state, seat, legalCommands, context) => {
      const command = agent.choose(state, seat, legalCommands, context);
      if (command) {
        coverage.commandTypes[command.type] = (coverage.commandTypes[command.type] ?? 0) + 1;
      }
      return command;
    },
    resolvePrompt:
      agent.resolvePrompt === undefined
        ? undefined
        : (state: MatchState, prompt: PromptState, context) => {
            coverage.promptKinds[prompt.kind] = (coverage.promptKinds[prompt.kind] ?? 0) + 1;
            if (prompt.choiceKind !== null) {
              coverage.promptChoiceKinds[prompt.choiceKind] =
                (coverage.promptChoiceKinds[prompt.choiceKind] ?? 0) + 1;
            }
            return agent.resolvePrompt?.(state, prompt, context) ?? null;
          },
  };
}

function playerConfig(deckId: TestDeckId, seat: MatchSeat): MatchPlayerConfig {
  const deck = TEST_DECKS[deckId];
  return {
    leaderCardId: deck.leaderId,
    mainDeck: [...deck.mainDeck],
    donDeckCount: 10,
    playerName: `${seat === "south" ? "South" : "North"} ${deckId}`,
  };
}

export interface GameRecord {
  gameId: string;
  matchId: string;
  gameInMatch: number;
  seed: string;
  firstPlayer: MatchSeat;
  southDeck: TestDeckId;
  northDeck: TestDeckId;
  southStyle: PlaytestStyleId;
  northStyle: PlaytestStyleId;
  /** "rules-win" means the game ended by the rules; anything else is a loop finding. */
  termination: string;
  winner: MatchSeat | null;
  finishReason: string | null;
  naturalCompletion: boolean;
  totalCommands: number;
  illegalCommands: number;
  turns: number;
  durationMs: number;
  finalCounts: Record<MatchSeat, SeatFinalCounts>;
  logAudit: LogAuditResult;
  invariantAudit: InvariantAuditResult;
  projectionAudit: ProjectionAuditResult;
  coverage: { south: SeatCoverage; north: SeatCoverage };
  logs: string[];
}

export interface SeatFinalCounts {
  life: number;
  deck: number;
  hand: number;
  trash: number;
  characters: number;
}

export interface MatchRecord {
  matchId: string;
  southDeck: TestDeckId;
  northDeck: TestDeckId;
  southStyle: PlaytestStyleId;
  northStyle: PlaytestStyleId;
  games: GameRecord[];
  /** Best-of-three outcome: first seat to 2 rules wins, else "draw". */
  winner: MatchSeat | "draw";
  score: Record<MatchSeat, number>;
  naturalGames: number;
}

export function playGame(options: {
  matchId: string;
  gameInMatch: number;
  gameId: string;
  southDeck: TestDeckId;
  northDeck: TestDeckId;
  southStyle: PlaytestStyleId;
  northStyle: PlaytestStyleId;
  firstPlayer: MatchSeat;
  seed: string;
  maxCommands?: number;
}): GameRecord {
  const started = Date.now();
  const southCoverage = emptyCoverage();
  const northCoverage = emptyCoverage();
  const config: MatchConfig = {
    firstPlayer: options.firstPlayer,
    seed: options.seed,
    shuffleDecks: true,
    skipFirstTurnDraw: true,
    players: {
      south: playerConfig(options.southDeck, "south"),
      north: playerConfig(options.northDeck, "north"),
    },
  };
  const result = runBotMatch(
    config,
    {
      south: instrumentAgent(STRATEGIES[options.southStyle], southCoverage),
      north: instrumentAgent(STRATEGIES[options.northStyle], northCoverage),
    },
    { maxCommands: options.maxCommands ?? 1500, seed: options.seed },
  );
  const state = result.finalState;
  const seatCounts = (seat: MatchSeat): SeatFinalCounts => {
    const player = state.players[seat];
    return {
      life: player.life.length,
      deck: player.deck.length,
      hand: player.hand.length,
      trash: player.trash.length,
      characters: player.characterArea.filter((id) => id !== null).length,
    };
  };
  const natural = result.termination === "rules-win" && state.winner !== null;
  return {
    gameId: options.gameId,
    matchId: options.matchId,
    gameInMatch: options.gameInMatch,
    seed: options.seed,
    firstPlayer: options.firstPlayer,
    southDeck: options.southDeck,
    northDeck: options.northDeck,
    southStyle: options.southStyle,
    northStyle: options.northStyle,
    termination: result.termination,
    winner: state.winner,
    finishReason: state.finishReason,
    naturalCompletion: natural,
    totalCommands: result.totalCommands,
    illegalCommands: result.illegalCommands,
    turns: state.turnNumber,
    durationMs: Date.now() - started,
    finalCounts: { south: seatCounts("south"), north: seatCounts("north") },
    logAudit: auditGameLog(result.logHistory),
    invariantAudit: auditFinalState(state),
    projectionAudit: auditSeatLeakage(state),
    coverage: { south: southCoverage, north: northCoverage },
    logs: result.logHistory,
  };
}

/** Ordered unique pairs over the deck pool, in pool order. */
export function deckPairs(deckIds: readonly TestDeckId[]): Array<[TestDeckId, TestDeckId]> {
  const pairs: Array<[TestDeckId, TestDeckId]> = [];
  for (let i = 0; i < deckIds.length; i++) {
    for (let j = i + 1; j < deckIds.length; j++) {
      pairs.push([deckIds[i]!, deckIds[j]!]);
    }
  }
  return pairs;
}

export function runMatch(options: {
  matchId: string;
  southDeck: TestDeckId;
  northDeck: TestDeckId;
  southStyle: PlaytestStyleId;
  northStyle: PlaytestStyleId;
  seedBase: string;
  maxCommands?: number;
}): MatchRecord {
  const games: GameRecord[] = [];
  const score: Record<MatchSeat, number> = { south: 0, north: 0 };
  for (let gameInMatch = 1; gameInMatch <= 3; gameInMatch++) {
    const record = playGame({
      matchId: options.matchId,
      gameInMatch,
      gameId: `${options.matchId}-g${gameInMatch}`,
      southDeck: options.southDeck,
      northDeck: options.northDeck,
      southStyle: options.southStyle,
      northStyle: options.northStyle,
      firstPlayer: gameInMatch % 2 === 1 ? "south" : "north",
      seed: `${options.seedBase}-g${gameInMatch}`,
      maxCommands: options.maxCommands,
    });
    games.push(record);
    if (record.naturalCompletion && record.winner !== null) {
      score[record.winner] += 1;
    }
    if (score.south === 2 || score.north === 2) break;
  }
  return {
    matchId: options.matchId,
    southDeck: options.southDeck,
    northDeck: options.northDeck,
    southStyle: options.southStyle,
    northStyle: options.northStyle,
    games,
    winner: score.south === 2 ? "south" : score.north === 2 ? "north" : "draw",
    score,
    naturalGames: games.filter((g) => g.naturalCompletion).length,
  };
}
