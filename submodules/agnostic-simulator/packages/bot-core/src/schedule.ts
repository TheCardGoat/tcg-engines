import { stableBotHash } from "./hash.js";

export interface BotDeckPair {
  readonly id: string;
  readonly deckA: string;
  readonly deckB: string;
}

export interface BotScheduledMatch {
  readonly blockId: string;
  readonly pairId: string;
  readonly legId: string;
  readonly seed: string;
  readonly p1Controller: "candidate" | "baseline";
  readonly p2Controller: "candidate" | "baseline";
  readonly p1DeckId: string;
  readonly p2DeckId: string;
}

export interface BotPairedSchedule {
  readonly suiteId: string;
  readonly seedBase: string;
  readonly blocksPerPair: number;
  readonly matches: readonly BotScheduledMatch[];
  readonly hash: string;
}

function addLeg(
  matches: BotScheduledMatch[],
  base: Omit<
    BotScheduledMatch,
    "legId" | "seed" | "p1Controller" | "p2Controller" | "p1DeckId" | "p2DeckId"
  >,
  legId: string,
  seedBase: string,
  p1Controller: "candidate" | "baseline",
  p1DeckId: string,
  p2DeckId: string,
): void {
  matches.push({
    ...base,
    legId,
    seed: `${seedBase}/${base.pairId}/${base.blockId}/${legId}`,
    p1Controller,
    p2Controller: p1Controller === "candidate" ? "baseline" : "candidate",
    p1DeckId,
    p2DeckId,
  });
}

export function buildPairedSchedule(input: {
  readonly suiteId: string;
  readonly seedBase: string;
  readonly deckPairs: readonly BotDeckPair[];
  readonly blocksPerPair: number;
}): BotPairedSchedule {
  if (input.blocksPerPair < 1 || !Number.isInteger(input.blocksPerPair)) {
    throw new Error("blocksPerPair must be a positive integer");
  }
  if (input.deckPairs.length === 0) throw new Error("At least one deck pair is required");

  const matches: BotScheduledMatch[] = [];
  for (const pair of input.deckPairs) {
    for (let index = 0; index < input.blocksPerPair; index++) {
      const blockId = `block-${index}`;
      const base = { blockId: `${pair.id}/${blockId}`, pairId: pair.id };
      addLeg(matches, base, "a-seat-1", input.seedBase, "candidate", pair.deckA, pair.deckB);
      addLeg(matches, base, "a-seat-2", input.seedBase, "baseline", pair.deckA, pair.deckB);
      if (pair.deckA !== pair.deckB) {
        addLeg(matches, base, "b-seat-1", input.seedBase, "candidate", pair.deckB, pair.deckA);
        addLeg(matches, base, "b-seat-2", input.seedBase, "baseline", pair.deckB, pair.deckA);
      }
    }
  }

  const hashInput = {
    suiteId: input.suiteId,
    seedBase: input.seedBase,
    blocksPerPair: input.blocksPerPair,
    matches,
  };
  return { ...hashInput, hash: stableBotHash(hashInput) };
}
