import type { PlayerPrompt, PlayCardCandidate } from "../view/player-prompt.ts";
import type { CyberpunkTestEngine, CardRef } from "./test-engine.ts";
import type { PlayerId } from "../types/branded.ts";
import { P1 } from "./test-state.ts";

// ── Internal helpers ────────────────────────────────────────────────────

function getPlayCardCandidate(prompt: PlayerPrompt, cardId: string): PlayCardCandidate | undefined {
  const move = prompt.availableMoves.find((m) => m.moveId === "playCard");
  if (!move || move.inputSpec.type !== "playCard") return undefined;
  return move.inputSpec.candidates.find((c) => c.cardId === cardId);
}

function resolveCardId(
  engine: CyberpunkTestEngine,
  card: CardRef,
  zone?: "hand" | "field" | "legendArea" | "trash" | "deck",
  playerId?: PlayerId,
): string {
  if (typeof card === "string") return card;
  if ("instanceId" in card && "zone" in card) return (card as { instanceId: string }).instanceId;
  const inst = engine.getCard(card, zone, playerId);
  return inst.instanceId as string;
}

// ── Playable assertions ─────────────────────────────────────────────────

/**
 * Assert that a card appears in the `playCard` move candidates for the
 * given player (defaults to P1).
 */
export function expectCardPlayable(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId; zone?: "hand" | "field" | "legendArea" | "trash" | "deck" },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, opts?.zone ?? "hand", playerId);

  const candidate = getPlayCardCandidate(prompt, cardId);
  if (!candidate) {
    const move = prompt.availableMoves.find((m) => m.moveId === "playCard");
    const candidateIds =
      move?.inputSpec.type === "playCard" ? move.inputSpec.candidates.map((c) => c.cardId) : [];
    throw new Error(
      `Expected card "${cardId}" to be playable, but it was not among candidates: [${candidateIds.join(", ")}]`,
    );
  }
}

/**
 * Assert that a card is **not** in the `playCard` move candidates.
 */
export function expectCardNotPlayable(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId; zone?: "hand" | "field" | "legendArea" | "trash" | "deck" },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, opts?.zone ?? "hand", playerId);

  const candidate = getPlayCardCandidate(prompt, cardId);
  if (candidate) {
    throw new Error(
      `Expected card "${cardId}" to NOT be playable, but it was present in playCard candidates`,
    );
  }
}

/**
 * Assert that a gear card's `playCard` candidate lists a specific unit as a
 * valid attach target.
 */
export function expectAttachTarget(
  engine: CyberpunkTestEngine,
  gear: CardRef,
  unit: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const gearId = resolveCardId(engine, gear, "hand", playerId);
  const unitId = resolveCardId(engine, unit, "field", playerId);

  const candidate = getPlayCardCandidate(prompt, gearId);
  if (!candidate) {
    throw new Error(
      `Expected gear "${gearId}" to be playable, but it was not in playCard candidates`,
    );
  }
  if (!candidate.attachTargets?.includes(unitId)) {
    throw new Error(
      `Expected unit "${unitId}" to be a valid attach target for gear "${gearId}", ` +
        `but attachTargets were: [${candidate.attachTargets?.join(", ") ?? "none"}]`,
    );
  }
}

/**
 * Assert that a gear card's `playCard` candidate does **not** list a unit as
 * an attach target.
 */
export function expectNotAttachTarget(
  engine: CyberpunkTestEngine,
  gear: CardRef,
  unit: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const gearId = resolveCardId(engine, gear, "hand", playerId);
  const unitId = resolveCardId(engine, unit, "field", playerId);

  const candidate = getPlayCardCandidate(prompt, gearId);
  if (candidate?.attachTargets?.includes(unitId)) {
    throw new Error(
      `Expected unit "${unitId}" to NOT be a valid attach target for gear "${gearId}", ` +
        `but it was present in attachTargets`,
    );
  }
}

// ── Attack assertions ───────────────────────────────────────────────────

/**
 * Assert that a card appears in the `attackRival` move candidates.
 */
export function expectAttackCandidate(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, "field", playerId);

  const move = prompt.availableMoves.find((m) => m.moveId === "attackRival");
  if (!move || move.inputSpec.type !== "selectCard") {
    throw new Error(`attackRival move is not available for player "${playerId as string}"`);
  }
  if (!move.inputSpec.candidates.includes(cardId)) {
    throw new Error(
      `Expected card "${cardId}" to be an attackRival candidate, but candidates were: [${move.inputSpec.candidates.join(", ")}]`,
    );
  }
}

/**
 * Assert that a card does **not** appear in the `attackRival` move candidates.
 */
export function expectNotAttackCandidate(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, "field", playerId);

  const move = prompt.availableMoves.find((m) => m.moveId === "attackRival");
  if (move?.inputSpec.type === "selectCard" && move.inputSpec.candidates.includes(cardId)) {
    throw new Error(
      `Expected card "${cardId}" to NOT be an attackRival candidate, but it was present`,
    );
  }
}

/**
 * Assert that an attacker/defender pair appears in the `attackUnit` move
 * candidates.
 */
export function expectAttackPair(
  engine: CyberpunkTestEngine,
  attacker: CardRef,
  defender: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const opponentId = engine.getOpponentOf(playerId);
  const prompt = engine.getPrompt(playerId);
  const attackerId = resolveCardId(engine, attacker, "field", playerId);
  const defenderId = resolveCardId(engine, defender, "field", opponentId);

  const move = prompt.availableMoves.find((m) => m.moveId === "attackUnit");
  if (!move || move.inputSpec.type !== "selectPair") {
    throw new Error(`attackUnit move is not available for player "${playerId as string}"`);
  }
  if (!move.inputSpec.fromCandidates.includes(attackerId)) {
    throw new Error(
      `Expected attacker "${attackerId}" to be in attackUnit fromCandidates, but got: [${move.inputSpec.fromCandidates.join(", ")}]`,
    );
  }
  if (!move.inputSpec.toCandidates.includes(defenderId)) {
    throw new Error(
      `Expected defender "${defenderId}" to be in attackUnit toCandidates, but got: [${move.inputSpec.toCandidates.join(", ")}]`,
    );
  }
}

/**
 * Assert that an attacker/defender pair does **not** appear in the
 * `attackUnit` move candidates (either attacker not eligible or defender not
 * eligible).
 */
export function expectNotAttackPair(
  engine: CyberpunkTestEngine,
  attacker: CardRef,
  defender: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const opponentId = engine.getOpponentOf(playerId);
  const prompt = engine.getPrompt(playerId);
  const attackerId = resolveCardId(engine, attacker, "field", playerId);
  const defenderId = resolveCardId(engine, defender, "field", opponentId);

  const move = prompt.availableMoves.find((m) => m.moveId === "attackUnit");
  if (!move || move.inputSpec.type !== "selectPair") return;

  const fromOk = move.inputSpec.fromCandidates.includes(attackerId);
  const toOk = move.inputSpec.toCandidates.includes(defenderId);
  if (fromOk && toOk) {
    throw new Error(
      `Expected attack pair ("${attackerId}" → "${defenderId}") to NOT be eligible, but both were present in attackUnit candidates`,
    );
  }
}

// ── Blocker assertions ──────────────────────────────────────────────────

/**
 * Assert that a card appears in the `useBlocker` move candidates.
 */
export function expectBlockerCandidate(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, "field", playerId);

  const move = prompt.availableMoves.find((m) => m.moveId === "useBlocker");
  if (!move || move.inputSpec.type !== "selectCard") {
    throw new Error(`useBlocker move is not available for player "${playerId as string}"`);
  }
  if (!move.inputSpec.candidates.includes(cardId)) {
    throw new Error(
      `Expected card "${cardId}" to be a blocker candidate, but candidates were: [${move.inputSpec.candidates.join(", ")}]`,
    );
  }
}

/**
 * Assert that a card does **not** appear in the `useBlocker` move candidates.
 */
export function expectNotBlockerCandidate(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, "field", playerId);

  const move = prompt.availableMoves.find((m) => m.moveId === "useBlocker");
  if (move?.inputSpec.type === "selectCard" && move.inputSpec.candidates.includes(cardId)) {
    throw new Error(`Expected card "${cardId}" to NOT be a blocker candidate, but it was present`);
  }
}

// ── Sell assertions ─────────────────────────────────────────────────────

/**
 * Assert that a card appears in the `sellCard` move candidates.
 */
export function expectSellable(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, "hand", playerId);

  const move = prompt.availableMoves.find((m) => m.moveId === "sellCard");
  if (!move || move.inputSpec.type !== "selectCard") {
    throw new Error(`sellCard move is not available for player "${playerId as string}"`);
  }
  if (!move.inputSpec.candidates.includes(cardId)) {
    throw new Error(
      `Expected card "${cardId}" to be sellable, but candidates were: [${move.inputSpec.candidates.join(", ")}]`,
    );
  }
}

/**
 * Assert that a card does **not** appear in the `sellCard` move candidates.
 */
export function expectNotSellable(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, "hand", playerId);

  const move = prompt.availableMoves.find((m) => m.moveId === "sellCard");
  if (move?.inputSpec.type === "selectCard" && move.inputSpec.candidates.includes(cardId)) {
    throw new Error(
      `Expected card "${cardId}" to NOT be sellable, but it was present in sellCard candidates`,
    );
  }
}

// ── Legend assertions ───────────────────────────────────────────────────

/**
 * Assert that a face-down legend appears in the `callLegend` move candidates.
 */
export function expectCallableLegend(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, "legendArea", playerId);

  const move = prompt.availableMoves.find((m) => m.moveId === "callLegend");
  if (!move || move.inputSpec.type !== "selectCard") {
    throw new Error(`callLegend move is not available for player "${playerId as string}"`);
  }
  if (!move.inputSpec.candidates.includes(cardId)) {
    throw new Error(
      `Expected legend "${cardId}" to be callable, but candidates were: [${move.inputSpec.candidates.join(", ")}]`,
    );
  }
}

/**
 * Assert that a card does **not** appear in the `callLegend` move candidates.
 */
export function expectNotCallableLegend(
  engine: CyberpunkTestEngine,
  card: CardRef,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const cardId = resolveCardId(engine, card, "legendArea", playerId);

  const move = prompt.availableMoves.find((m) => m.moveId === "callLegend");
  if (move?.inputSpec.type === "selectCard" && move.inputSpec.candidates.includes(cardId)) {
    throw new Error(
      `Expected legend "${cardId}" to NOT be callable, but it was present in callLegend candidates`,
    );
  }
}

// ── Post-action choice assertions ───────────────────────────────────────

import type { PendingChoice } from "../types/match-state.ts";

function getPendingChoice(engine: CyberpunkTestEngine): PendingChoice | undefined {
  return engine.getState().G.turnMetadata.pendingChoice;
}

/**
 * Assert that a pending choice of the expected type is open.
 */
export function expectPendingChoice<T extends PendingChoice["type"]>(
  engine: CyberpunkTestEngine,
  expectedType: T,
): Extract<PendingChoice, { type: T }> {
  const choice = getPendingChoice(engine);
  if (!choice) {
    throw new Error(`Expected a pending choice of type "${expectedType}", but no choice was open`);
  }
  if (choice.type !== expectedType) {
    throw new Error(`Expected pending choice type "${expectedType}", but got "${choice.type}"`);
  }
  return choice as Extract<PendingChoice, { type: T }>;
}

/**
 * Assert that no pending choice is open.
 */
export function expectNoPendingChoice(engine: CyberpunkTestEngine): void {
  const choice = getPendingChoice(engine);
  if (choice) {
    throw new Error(`Expected no pending choice, but found one of type "${choice.type}"`);
  }
}

/**
 * Assert that the current `chooseTarget` pending choice lists specific cards
 * as eligible targets.
 */
export function expectEligibleTargets(
  engine: CyberpunkTestEngine,
  expectedCards: CardRef[],
  opts?: { as?: PlayerId; zone?: "hand" | "field" | "legendArea" | "trash" | "deck" },
): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error(`Expected a chooseTarget pending choice, but got: ${choice?.type ?? "none"}`);
  }
  const eligibleIds = choice.payload.eligibleIds ?? [];
  const playerId = opts?.as ?? P1;
  const expectedIds = expectedCards.map((card) =>
    resolveCardId(engine, card, opts?.zone ?? "field", playerId),
  );

  const missing = expectedIds.filter((id) => !eligibleIds.includes(id));
  const unexpected = eligibleIds.filter((id) => !expectedIds.includes(id));

  if (missing.length > 0 || unexpected.length > 0) {
    throw new Error(
      `Eligible target mismatch.\n  Missing: [${missing.join(", ")}]\n  Unexpected: [${unexpected.join(", ")}]\n  Expected: [${expectedIds.join(", ")}]\n  Actual: [${eligibleIds.join(", ")}]`,
    );
  }
}

/**
 * Assert that the current `chooseTarget` pending choice has exactly `count`
 * eligible targets.
 */
export function expectEligibleTargetCount(engine: CyberpunkTestEngine, count: number): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error(`Expected a chooseTarget pending choice, but got: ${choice?.type ?? "none"}`);
  }
  const actual = (choice.payload.eligibleIds ?? []).length;
  if (actual !== count) {
    throw new Error(`Expected ${count} eligible target(s), but found ${actual}`);
  }
}

/**
 * Assert that the current `chooseTarget` pending choice (with `targetKind: "gig"`)
 * lists specific gig dice as eligible targets.
 */
export function expectEligibleGigs(
  engine: CyberpunkTestEngine,
  expectedDice: { dieType: string; as?: PlayerId }[],
): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error(`Expected a chooseTarget pending choice, but got: ${choice?.type ?? "none"}`);
  }
  const eligibleIds = choice.payload.eligibleIds ?? [];
  const state = engine.getState();

  for (const expected of expectedDice) {
    const playerId = expected.as ?? P1;
    const foundId = eligibleIds.find((id) => {
      const die = state.G.gigDice[id as string];
      return die && die.dieType === expected.dieType && die.ownerId === playerId;
    });
    if (!foundId) {
      const actualTypes = eligibleIds
        .map((id) => state.G.gigDice[id as string]?.dieType)
        .filter(Boolean)
        .join(", ");
      throw new Error(
        `Expected gig die "${expected.dieType}" for ${playerId} in eligible targets, but only found: [${actualTypes}]`,
      );
    }
  }
}

/**
 * Assert that the current `chooseCardToMove` pending choice lists specific cards
 * as eligible choices.
 */
export function expectCardsToMove(
  engine: CyberpunkTestEngine,
  expectedCards: CardRef[],
  opts?: { as?: PlayerId; zone?: "hand" | "field" | "legendArea" | "trash" | "deck" },
): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "chooseCardToMove") {
    throw new Error(
      `Expected a chooseCardToMove pending choice, but got: ${choice?.type ?? "none"}`,
    );
  }
  const cardIds = choice.payload.cardIds;
  const playerId = opts?.as ?? P1;
  const expectedIds = expectedCards.map((card) =>
    resolveCardId(engine, card, opts?.zone ?? "field", playerId),
  );

  const cardIdSet = new Set(cardIds as string[]);
  const missing = expectedIds.filter((id) => !cardIdSet.has(id as string));
  if (missing.length > 0) {
    throw new Error(
      `Cards to move mismatch.\n  Missing: [${missing.join(", ")}]\n  Expected: [${expectedIds.join(", ")}]\n  Actual: [${cardIds.join(", ")}]`,
    );
  }
}

/**
 * Assert that the current `chooseCardToMove` pending choice has exactly `count`
 * eligible cards.
 */
export function expectCardToMoveCount(engine: CyberpunkTestEngine, count: number): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "chooseCardToMove") {
    throw new Error(
      `Expected a chooseCardToMove pending choice, but got: ${choice?.type ?? "none"}`,
    );
  }
  const actual = choice.payload.cardIds.length;
  if (actual !== count) {
    throw new Error(`Expected ${count} card(s) to move, but found ${actual}`);
  }
}

// ── Expressive choice-payload helpers ───────────────────────────────────

/**
 * Assert that the current `chooseTarget` pending choice has the expected
 * payload properties (type, targetKind, min, max).
 */
export function expectTargetChoice(
  engine: CyberpunkTestEngine,
  expected: {
    type?: string;
    targetKind?: "card" | "gig";
    min?: number;
    max?: number;
    amount?: number;
  },
): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error(`Expected a chooseTarget pending choice, but got: ${choice?.type ?? "none"}`);
  }
  const payload = choice.payload;
  if (expected.type !== undefined && payload.type !== expected.type) {
    throw new Error(`Expected target choice type "${expected.type}", but got "${payload.type}"`);
  }
  if (expected.targetKind !== undefined && payload.targetKind !== expected.targetKind) {
    throw new Error(
      `Expected targetKind "${expected.targetKind}", but got "${payload.targetKind ?? "undefined"}"`,
    );
  }
  if (expected.min !== undefined && payload.min !== expected.min) {
    throw new Error(`Expected min ${expected.min}, but got ${payload.min ?? "undefined"}`);
  }
  if (expected.max !== undefined && payload.max !== expected.max) {
    throw new Error(`Expected max ${expected.max}, but got ${payload.max ?? "undefined"}`);
  }
  if (expected.amount !== undefined && payload.amount !== expected.amount) {
    throw new Error(`Expected amount ${expected.amount}, but got ${payload.amount ?? "undefined"}`);
  }
}

/**
 * Assert that the current `chooseTarget` pending choice is an `adjustGig`
 * choice with the expected properties.
 */
export function expectAdjustGigChoice(
  engine: CyberpunkTestEngine,
  expected: {
    maxAmount?: number;
    direction?: string;
  },
): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error(`Expected a chooseTarget pending choice, but got: ${choice?.type ?? "none"}`);
  }
  const payload = choice.payload;
  if (payload.type !== "adjustGig") {
    throw new Error(`Expected adjustGig choice, but got "${payload.type}"`);
  }
  if (expected.maxAmount !== undefined && payload.maxAmount !== expected.maxAmount) {
    throw new Error(
      `Expected adjustGig maxAmount ${expected.maxAmount}, but got ${payload.maxAmount ?? "undefined"}`,
    );
  }
  if (expected.direction !== undefined && payload.direction !== expected.direction) {
    throw new Error(
      `Expected adjustGig direction "${expected.direction}", but got "${payload.direction ?? "undefined"}"`,
    );
  }
}

/**
 * Assert that the current `searchDeck` pending choice has the expected
 * properties (lookCount, reveal, select spec, etc.).
 */
export function expectSearchDeckChoice(
  engine: CyberpunkTestEngine,
  expected: {
    lookCount?: number;
    reveal?: boolean;
    select?: { kind: "upTo"; max: number } | { kind: "exact"; amount: number } | { kind: "all" };
  },
): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "searchDeck") {
    throw new Error(`Expected a searchDeck pending choice, but got: ${choice?.type ?? "none"}`);
  }
  const payload = choice.payload;
  if (expected.lookCount !== undefined && payload.lookCount !== expected.lookCount) {
    throw new Error(
      `Expected searchDeck lookCount ${expected.lookCount}, but got ${payload.lookCount}`,
    );
  }
  if (expected.reveal !== undefined && payload.reveal !== expected.reveal) {
    throw new Error(`Expected searchDeck reveal ${expected.reveal}, but got ${payload.reveal}`);
  }
  if (expected.select !== undefined) {
    const actual = payload.select;
    if (actual.kind !== expected.select.kind) {
      throw new Error(
        `Expected searchDeck select kind "${expected.select.kind}", but got "${actual.kind}"`,
      );
    }
    if (
      expected.select.kind === "upTo" &&
      actual.kind === "upTo" &&
      actual.max !== expected.select.max
    ) {
      throw new Error(
        `Expected searchDeck select upTo max ${expected.select.max}, but got ${actual.max}`,
      );
    }
    if (
      expected.select.kind === "exact" &&
      actual.kind === "exact" &&
      actual.amount !== expected.select.amount
    ) {
      throw new Error(
        `Expected searchDeck select exact amount ${expected.select.amount}, but got ${actual.amount}`,
      );
    }
  }
}

/**
 * Assert that the current `chooseCardToMove` pending choice has the expected
 * destination zone.
 */
export function expectCardToMoveDestination(
  engine: CyberpunkTestEngine,
  expectedDestination: string,
): void {
  const choice = getPendingChoice(engine);
  if (!choice || choice.type !== "chooseCardToMove") {
    throw new Error(
      `Expected a chooseCardToMove pending choice, but got: ${choice?.type ?? "none"}`,
    );
  }
  const actual = choice.payload.destination;
  if (actual !== expectedDestination) {
    throw new Error(
      `Expected card-to-move destination "${expectedDestination}", but got "${actual ?? "undefined"}"`,
    );
  }
}

// ── General prompt helpers ──────────────────────────────────────────────

/**
 * Assert that the prompt contains a specific move.
 */
export function expectMoveAvailable(
  engine: CyberpunkTestEngine,
  moveId: string,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const move = prompt.availableMoves.find((m) => m.moveId === moveId);
  if (!move) {
    throw new Error(
      `Expected move "${moveId}" to be available, but only found: [${prompt.availableMoves.map((m) => m.moveId).join(", ")}]`,
    );
  }
}

/**
 * Assert that the prompt does **not** contain a specific move.
 */
export function expectMoveNotAvailable(
  engine: CyberpunkTestEngine,
  moveId: string,
  opts?: { as?: PlayerId },
): void {
  const playerId = opts?.as ?? P1;
  const prompt = engine.getPrompt(playerId);
  const move = prompt.availableMoves.find((m) => m.moveId === moveId);
  if (move) {
    throw new Error(`Expected move "${moveId}" to NOT be available, but it was present`);
  }
}
