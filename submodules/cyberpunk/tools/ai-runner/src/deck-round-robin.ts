/**
 * Seat-balanced round robin over a deck pool: every unordered deck pairing
 * plays `seedsPerSeat` games in each seat with the same strategy on both
 * sides. This ranks *decks* (not strategies), so both seats share one
 * strategy id. Seat blocks of a pairing reuse one seed string so both seat
 * orders see the same shuffled decks and only the first player flips.
 *
 * Results use the shared batch taxonomy: illegal steps, stuck, and
 * repeated-state terminations are hard failures recorded with their seeds;
 * maxSteps is recorded but only fails the run when the CLI asks for it.
 */
import { runAutoMatch, type AutoMatchResult, type DeckList } from "@tcg/cyberpunk-engine";
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";

import {
  createStructuredCatalog,
  deckListFromGenerated,
  type GeneratedDeck,
} from "./legal-decks.ts";
import { lookupStrategy, type SearchStrategyOptions } from "./runner.ts";
import { bindStrategyToDeck } from "./bind-deck-strategy.ts";
import { createTestPlayers } from "./test-catalog.ts";

export interface DeckRoundRobinOptions extends SearchStrategyOptions {
  /** Resolved deck pool; pairings cover every unordered pair exactly once. */
  decks: readonly GeneratedDeck[];
  /** Single strategy id used by both seats. */
  strategy: string;
  /** Games per pairing in each seat; every pairing plays exactly 2x this. */
  seedsPerSeat: number;
  seed: string;
  maxSteps?: number;
}

export interface DeckStanding {
  deckId: string;
  title: string;
  wins: number;
  losses: number;
  draws: number;
  games: number;
}

export interface DeckPairingCell {
  deckAId: string;
  deckBId: string;
  aWins: number;
  bWins: number;
  draws: number;
  games: number;
}

export interface DeckRoundRobinFailure {
  seed: string;
  deckAId: string;
  deckBId: string;
  /** Which seat the first listed deck occupied in the failing game. */
  seatOfDeckA: "p1" | "p2";
  reason: AutoMatchResult["reason"];
  hadIllegalStep: boolean;
}

export interface DeckRoundRobinSummary {
  options: {
    strategy: string;
    seedsPerSeat: number;
    seed: string;
    maxSteps?: number;
    deckIds: string[];
  };
  standings: DeckStanding[];
  cells: DeckPairingCell[];
  hardFailures: DeckRoundRobinFailure[];
  totalPairings: number;
  totalMatches: number;
  draws: number;
  illegalCount: number;
  reasonCounts: Record<AutoMatchResult["reason"], number>;
  averageTurnCount: number;
  averageStepCount: number;
  seatWins: { p1: number; p2: number };
}

interface Accumulator {
  wins: Map<string, number>;
  losses: Map<string, number>;
  drawsByDeck: Map<string, number>;
  cells: Map<string, DeckPairingCell>;
  hardFailures: DeckRoundRobinFailure[];
  reasonCounts: Record<AutoMatchResult["reason"], number>;
  illegalCount: number;
  totalTurns: number;
  totalSteps: number;
  totalMatches: number;
  seatWins: { p1: number; p2: number };
}

/** Upper-triangle pair indices for the deck pool: [[0,1],[0,2],…]. */
export function allPairIndices(deckCount: number): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let a = 0; a < deckCount; a++) {
    for (let b = a + 1; b < deckCount; b++) pairs.push([a, b]);
  }
  return pairs;
}

export function runDeckRoundRobin(options: DeckRoundRobinOptions): DeckRoundRobinSummary {
  return runDeckPairings(options, allPairIndices(options.decks.length));
}

/** Run a subset of pairings; the worker entry point uses this for chunks. */
export function runDeckPairings(
  options: DeckRoundRobinOptions,
  pairIndices: ReadonlyArray<[number, number]>,
): DeckRoundRobinSummary {
  const strategy = lookupStrategy(options.strategy, options);
  const catalog = createStructuredCatalog();
  const acc = emptyAccumulator();

  for (const [aIndex, bIndex] of pairIndices) {
    const deckA = options.decks[aIndex];
    const deckB = options.decks[bIndex];
    if (!deckA || !deckB) throw new Error(`Pairing index out of range: ${aIndex}, ${bIndex}`);
    const cell = cellFor(acc, deckA.id, deckB.id);
    // One seed string per (pairing, match); both seat blocks reuse it so the
    // deck shuffle is identical and only the first player flips.
    for (let match = 0; match < options.seedsPerSeat; match++) {
      const seed = `${options.seed}/${deckA.id}-vs-${deckB.id}/match-${match}`;
      for (const seatOfDeckA of ["p1", "p2"] as const) {
        const decks: [DeckList, DeckList] =
          seatOfDeckA === "p1"
            ? [deckListFromGenerated(deckA, "p1"), deckListFromGenerated(deckB, "p2")]
            : [deckListFromGenerated(deckB, "p1"), deckListFromGenerated(deckA, "p2")];
        const result = runAutoMatch({
          players: createTestPlayers(),
          decks,
          strategies:
            seatOfDeckA === "p1"
              ? [bindStrategyToDeck(strategy, deckA), bindStrategyToDeck(strategy, deckB)]
              : [bindStrategyToDeck(strategy, deckB), bindStrategyToDeck(strategy, deckA)],
          catalog,
          seed,
          maxSteps: options.maxSteps,
        });
        recordResult(acc, {
          cell,
          seed,
          deckA,
          deckB,
          seatOfDeckA,
          result,
        });
      }
    }
  }

  return summarize(options, acc);
}

export interface DeckRoundRobinWorkerPayload {
  kind: "deck-round-robin";
  options: DeckRoundRobinOptions;
  pairIndices: Array<[number, number]>;
}

export async function runDeckRoundRobinParallel(
  options: DeckRoundRobinOptions,
  workerCount: number,
): Promise<DeckRoundRobinSummary> {
  const pairIndices = allPairIndices(options.decks.length);
  if (workerCount <= 1 || pairIndices.length < workerCount * 2) {
    return runDeckPairings(options, pairIndices);
  }
  const chunks = splitPairIndices(pairIndices, workerCount);
  const parts = await Promise.all(
    chunks.map(
      (chunk) =>
        new Promise<DeckRoundRobinSummary>((resolve, reject) => {
          const workerUrl = new URL("./worker.ts", import.meta.url);
          if (workerUrl.protocol !== "file:") {
            resolve(runDeckPairings(options, chunk));
            return;
          }
          const worker = new Worker(fileURLToPath(workerUrl), {
            workerData: {
              kind: "deck-round-robin",
              options,
              pairIndices: chunk,
            } satisfies DeckRoundRobinWorkerPayload,
            execArgv: ["--experimental-transform-types"],
          });
          worker.on("message", (summary: DeckRoundRobinSummary) => resolve(summary));
          worker.on("error", reject);
          worker.on("exit", (code) => {
            if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
          });
        }),
    ),
  );
  return mergeDeckRoundRobinSummaries(options, parts);
}

function splitPairIndices(
  pairIndices: Array<[number, number]>,
  parts: number,
): Array<Array<[number, number]>> {
  const base = Math.floor(pairIndices.length / parts);
  const remainder = pairIndices.length - base * parts;
  const chunks: Array<Array<[number, number]>> = [];
  let cursor = 0;
  for (let i = 0; i < parts; i++) {
    const size = base + (i < remainder ? 1 : 0);
    chunks.push(pairIndices.slice(cursor, cursor + size));
    cursor += size;
  }
  return chunks;
}

function emptyAccumulator(): Accumulator {
  return {
    wins: new Map(),
    losses: new Map(),
    drawsByDeck: new Map(),
    cells: new Map(),
    hardFailures: [],
    reasonCounts: {
      winCondition: 0,
      concede: 0,
      deckOut: 0,
      stuck: 0,
      illegal: 0,
      repeatedState: 0,
      maxSteps: 0,
    },
    illegalCount: 0,
    totalTurns: 0,
    totalSteps: 0,
    totalMatches: 0,
    seatWins: { p1: 0, p2: 0 },
  };
}

function cellFor(acc: Accumulator, deckAId: string, deckBId: string): DeckPairingCell {
  const key = `${deckAId}|${deckBId}`;
  const existing = acc.cells.get(key);
  if (existing) return existing;
  const cell: DeckPairingCell = {
    deckAId,
    deckBId,
    aWins: 0,
    bWins: 0,
    draws: 0,
    games: 0,
  };
  acc.cells.set(key, cell);
  return cell;
}

interface RecordedMatch {
  cell: DeckPairingCell;
  seed: string;
  deckA: GeneratedDeck;
  deckB: GeneratedDeck;
  seatOfDeckA: "p1" | "p2";
  result: AutoMatchResult;
}

function recordResult(acc: Accumulator, match: RecordedMatch): void {
  const { cell, seed, deckA, deckB, seatOfDeckA, result } = match;
  acc.totalMatches += 1;
  acc.totalTurns += result.turnCount;
  acc.totalSteps += result.stepCount;
  acc.reasonCounts[result.reason] += 1;
  if (result.winnerId === "p1") acc.seatWins.p1 += 1;
  else if (result.winnerId === "p2") acc.seatWins.p2 += 1;

  const deckAWon = result.winnerId === (seatOfDeckA === "p1" ? "p1" : "p2");
  cell.games += 1;
  let hadIllegalStep = false;
  for (const entry of result.log) {
    if (entry.result.kind !== "illegal") continue;
    acc.illegalCount += 1;
    hadIllegalStep = true;
  }
  if (result.winnerId === null) {
    cell.draws += 1;
    acc.drawsByDeck.set(deckA.id, (acc.drawsByDeck.get(deckA.id) ?? 0) + 1);
    acc.drawsByDeck.set(deckB.id, (acc.drawsByDeck.get(deckB.id) ?? 0) + 1);
  } else {
    const winnerId = deckAWon ? deckA.id : deckB.id;
    const loserId = deckAWon ? deckB.id : deckA.id;
    cell.aWins += deckAWon ? 1 : 0;
    cell.bWins += deckAWon ? 0 : 1;
    acc.wins.set(winnerId, (acc.wins.get(winnerId) ?? 0) + 1);
    acc.losses.set(loserId, (acc.losses.get(loserId) ?? 0) + 1);
  }

  const isHardFailure =
    hadIllegalStep ||
    result.reason === "stuck" ||
    result.reason === "illegal" ||
    result.reason === "repeatedState" ||
    result.reason === "maxSteps";
  if (isHardFailure) {
    acc.hardFailures.push({
      seed,
      deckAId: deckA.id,
      deckBId: deckB.id,
      seatOfDeckA,
      reason: result.reason,
      hadIllegalStep,
    });
  }
}

function summarize(options: DeckRoundRobinOptions, acc: Accumulator): DeckRoundRobinSummary {
  const standings: DeckStanding[] = options.decks.map((deck) => {
    const wins = acc.wins.get(deck.id) ?? 0;
    const losses = acc.losses.get(deck.id) ?? 0;
    const draws = acc.drawsByDeck.get(deck.id) ?? 0;
    return {
      deckId: deck.id,
      title: deck.title ?? deck.archetype,
      wins,
      losses,
      draws,
      games: wins + losses + draws,
    };
  });
  standings.sort(
    (a, b) => winRate(b) - winRate(a) || b.wins - a.wins || a.deckId.localeCompare(b.deckId),
  );
  return {
    options: {
      strategy: options.strategy,
      seedsPerSeat: options.seedsPerSeat,
      seed: options.seed,
      maxSteps: options.maxSteps,
      deckIds: options.decks.map((deck) => deck.id),
    },
    standings,
    cells: [...acc.cells.values()],
    hardFailures: acc.hardFailures,
    totalPairings: acc.cells.size,
    totalMatches: acc.totalMatches,
    draws: [...acc.cells.values()].reduce((sum, cell) => sum + cell.draws, 0),
    illegalCount: acc.illegalCount,
    reasonCounts: acc.reasonCounts,
    averageTurnCount: acc.totalMatches === 0 ? 0 : acc.totalTurns / acc.totalMatches,
    averageStepCount: acc.totalMatches === 0 ? 0 : acc.totalSteps / acc.totalMatches,
    seatWins: acc.seatWins,
  };
}

function winRate(standing: DeckStanding): number {
  return standing.games === 0 ? 0 : standing.wins / standing.games;
}

function mergeDeckRoundRobinSummaries(
  options: DeckRoundRobinOptions,
  parts: ReadonlyArray<DeckRoundRobinSummary>,
): DeckRoundRobinSummary {
  const acc = emptyAccumulator();
  for (const part of parts) {
    for (const standing of part.standings) {
      acc.wins.set(standing.deckId, (acc.wins.get(standing.deckId) ?? 0) + standing.wins);
      acc.losses.set(standing.deckId, (acc.losses.get(standing.deckId) ?? 0) + standing.losses);
      acc.drawsByDeck.set(
        standing.deckId,
        (acc.drawsByDeck.get(standing.deckId) ?? 0) + standing.draws,
      );
    }
    for (const cell of part.cells) {
      const merged = cellFor(acc, cell.deckAId, cell.deckBId);
      merged.aWins += cell.aWins;
      merged.bWins += cell.bWins;
      merged.draws += cell.draws;
      merged.games += cell.games;
    }
    acc.hardFailures.push(...part.hardFailures);
    for (const reason of Object.keys(acc.reasonCounts) as Array<keyof typeof acc.reasonCounts>) {
      acc.reasonCounts[reason] += part.reasonCounts[reason] ?? 0;
    }
    acc.illegalCount += part.illegalCount;
    acc.totalTurns += part.averageTurnCount * part.totalMatches;
    acc.totalSteps += part.averageStepCount * part.totalMatches;
    acc.totalMatches += part.totalMatches;
    acc.seatWins.p1 += part.seatWins.p1;
    acc.seatWins.p2 += part.seatWins.p2;
  }
  return summarize(options, acc);
}
