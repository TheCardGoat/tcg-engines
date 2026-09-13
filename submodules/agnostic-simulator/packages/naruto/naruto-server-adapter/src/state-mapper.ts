/**
 * Maps between the platform's opaque actor ids and the Naruto engine's
 * `"p1" | "p2"` seat ids, and defines the serializable snapshot payload the
 * adapter persists through {@link import("@tcg/shared/game-engine").EngineSnapshot}.
 *
 * The Naruto engine's `GameState` is already a plain serializable object
 * tree (the reducer shallow-copies on every accepted action), but it carries
 * no state version. The platform's live protocol is compare-and-swap on
 * `stateVersion`, so the adapter owns a monotonically increasing version
 * counter and stores it alongside the engine state and the seat map.
 */

import {
  NARUTO_PREVIEW_RULES_PROFILE,
  type EffectKind,
  type GameState,
  type PlayerId,
} from "@tcg-engines/naruto-engine";

/** Platform actor id seated at each engine player slot. */
export interface NarutoSeatMap {
  readonly p1: string;
  readonly p2: string;
}

/**
 * Serializable payload stored in `EngineSnapshot.state` for naruto games.
 * Wraps the engine `GameState` with the adapter-owned CAS version counter
 * and the seat map needed to route actor ids on restore.
 */
export interface NarutoSnapshotState {
  readonly gameSlug: "naruto";
  readonly stateVersion: number;
  readonly seats: NarutoSeatMap;
  readonly state: GameState;
}

export function actorIdForPlayer(seats: NarutoSeatMap, player: PlayerId): string {
  return seats[player];
}

export function playerIdForActor(seats: NarutoSeatMap, actorId: string): PlayerId | null {
  if (actorId === seats.p1) return "p1";
  if (actorId === seats.p2) return "p2";
  return null;
}

export function toSnapshotState(input: {
  state: GameState;
  stateVersion: number;
  seats: NarutoSeatMap;
}): NarutoSnapshotState {
  return {
    gameSlug: "naruto",
    stateVersion: input.stateVersion,
    seats: { ...input.seats },
    state: input.state,
  };
}

/**
 * Narrow an opaque persisted payload back into a {@link NarutoSnapshotState}.
 * Throws on any structural mismatch so a corrupted snapshot fails loudly at
 * restore time instead of poisoning a live engine.
 */
export function parseSnapshotState(value: unknown): NarutoSnapshotState {
  if (!isRecord(value)) {
    throw new Error("Naruto snapshot state must be an object.");
  }
  if (value.gameSlug !== "naruto") {
    throw new Error(`Naruto snapshot state has wrong gameSlug: ${JSON.stringify(value.gameSlug)}.`);
  }
  if (typeof value.stateVersion !== "number" || !Number.isInteger(value.stateVersion)) {
    throw new Error("Naruto snapshot state is missing an integer stateVersion.");
  }
  if (!isRecord(value.seats)) {
    throw new Error("Naruto snapshot state is missing the seat map.");
  }
  const { p1, p2 } = value.seats;
  if (typeof p1 !== "string" || typeof p2 !== "string") {
    throw new Error("Naruto snapshot seat map must hold string actor ids.");
  }
  if (!isRecord(value.state)) {
    throw new Error("Naruto snapshot state is missing the engine state.");
  }
  assertGameStateShape(value.state);
  return {
    gameSlug: "naruto",
    stateVersion: value.stateVersion,
    seats: { p1, p2 },
    // Shape-checked above; the engine owns the full invariants.
    state: value.state as unknown as GameState,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPlayerId(value: unknown): value is PlayerId {
  return value === "p1" || value === "p2";
}

function isCardInstance(value: unknown): boolean {
  return isRecord(value) && typeof value.uid === "string" && typeof value.cardId === "string";
}

function isCardArray(value: unknown): boolean {
  return Array.isArray(value) && value.every(isCardInstance);
}

function isCharacterInstance(value: unknown): boolean {
  if (!isCardInstance(value) || !isRecord(value)) return false;
  return (
    [
      "damage",
      "summonedOnTurn",
      "powerBonus",
      "damageBonus",
      "attacksUsed",
      "cannotAttackUntilTurn",
      "rushUntilTurn",
      "powerDoubledUntilTurn",
      "supportImmuneUntilTurn",
    ].every((field) => typeof value[field] === "number") &&
    ["rested", "activatedThisTurn", "effectsNegated"].every(
      (field) => typeof value[field] === "boolean",
    )
  );
}

function isChainLink(value: unknown): boolean {
  return (
    isRecord(value) &&
    isPlayerId(value.player) &&
    typeof value.uid === "string" &&
    typeof value.cardId === "string"
  );
}

function isPendingAttack(value: unknown): boolean {
  return (
    value === null ||
    (isRecord(value) &&
      typeof value.attackerUid === "string" &&
      isPlayerId(value.attacker) &&
      (value.attackerKind === "leader" || value.attackerKind === "character") &&
      (value.targetKind === "leader" || value.targetKind === "character") &&
      typeof value.targetUid === "string")
  );
}

function isPendingChoice(value: unknown): boolean {
  if (value === null) return true;
  if (
    !isRecord(value) ||
    !isEffectKind(value.effect) ||
    (value.sourceKind !== "leader" &&
      value.sourceKind !== "character" &&
      value.sourceKind !== "support") ||
    typeof value.source !== "string" ||
    !isPlayerId(value.player) ||
    typeof value.promptKey !== "string" ||
    typeof value.cancellable !== "boolean" ||
    (value.alwaysAsk !== undefined && typeof value.alwaysAsk !== "boolean") ||
    !isRecord(value.data) ||
    !Object.values(value.data).every(
      (entry) => typeof entry === "string" || typeof entry === "number",
    ) ||
    !Array.isArray(value.options)
  ) {
    return false;
  }
  return value.options.every(
    (option) =>
      isRecord(option) &&
      ["character", "leader", "hand", "deck", "trash"].includes(String(option.zone)) &&
      typeof option.key === "string" &&
      isPlayerId(option.owner) &&
      typeof option.cardId === "string" &&
      (option.index === null || typeof option.index === "number"),
  );
}

function isEffectKind(value: unknown): value is EffectKind {
  return (
    value === "leaderBoost" ||
    value === "leaderPutBack" ||
    value === "exRequirement" ||
    value === "reviveFromTrash" ||
    value === "freezeTarget" ||
    value === "koTarget" ||
    value === "bounceTarget" ||
    value === "doublePower" ||
    value === "supportImmune" ||
    value === "searchSummon"
  );
}

function assertPlayerStateShape(value: unknown, player: PlayerId): void {
  if (!isRecord(value)) throw new Error(`Naruto snapshot is missing player ${player}.`);
  const stringFields = ["name", "leaderId"] as const;
  const numberFields = [
    "life",
    "leaderAttacksUsed",
    "leaderCannotAttackUntilTurn",
    "summonsUsedThisTurn",
    "chakraLockedUntilTurn",
  ] as const;
  const booleanFields = ["leaderRested", "leaderUsedThisTurn", "mulliganDone"] as const;
  if (value.id !== player || stringFields.some((field) => typeof value[field] !== "string")) {
    throw new Error(`Naruto snapshot player ${player} has invalid identity fields.`);
  }
  if (numberFields.some((field) => typeof value[field] !== "number")) {
    throw new Error(`Naruto snapshot player ${player} has invalid numeric fields.`);
  }
  if (booleanFields.some((field) => typeof value[field] !== "boolean")) {
    throw new Error(`Naruto snapshot player ${player} has invalid boolean fields.`);
  }
  for (const field of ["deck", "hand", "trash", "exPile"] as const) {
    if (!isCardArray(value[field])) {
      throw new Error(`Naruto snapshot player ${player} has an invalid ${field} zone.`);
    }
  }
  if (
    !Array.isArray(value.characters) ||
    !value.characters.every((card) => card === null || isCharacterInstance(card)) ||
    !Array.isArray(value.supports) ||
    !value.supports.every(
      (card) =>
        card === null ||
        (isCardInstance(card) &&
          isRecord(card) &&
          (card.revealed === undefined || typeof card.revealed === "boolean")),
    ) ||
    !Array.isArray(value.chakra) ||
    !value.chakra.every(
      (card) => isCardInstance(card) && isRecord(card) && typeof card.faceUp === "boolean",
    ) ||
    !isCardInstance(value.summon) ||
    !isRecord(value.summon) ||
    typeof value.summon.rested !== "boolean"
  ) {
    throw new Error(`Naruto snapshot player ${player} has invalid board zones.`);
  }
}

function assertGameStateShape(state: Record<string, unknown>): void {
  if (typeof state.turn !== "number" || !Number.isInteger(state.turn)) {
    throw new Error("Naruto snapshot engine state is missing `turn`.");
  }
  if (!isPlayerId(state.activePlayer)) {
    throw new Error("Naruto snapshot engine state has an invalid `activePlayer`.");
  }
  if (!isRecord(state.players) || !isRecord(state.players.p1) || !isRecord(state.players.p2)) {
    throw new Error("Naruto snapshot engine state is missing both player states.");
  }
  assertPlayerStateShape(state.players.p1, "p1");
  assertPlayerStateShape(state.players.p2, "p2");
  if (
    state.phase !== "refresh" &&
    state.phase !== "draw" &&
    state.phase !== "main" &&
    state.phase !== "end"
  ) {
    throw new Error("Naruto snapshot engine state has an invalid phase.");
  }
  if (state.step !== "normal" && state.step !== "counter") {
    throw new Error("Naruto snapshot engine state has an invalid step.");
  }
  for (const field of ["priority", "awaitingMulligan", "winner"] as const) {
    if (state[field] !== null && !isPlayerId(state[field])) {
      throw new Error(`Naruto snapshot engine state has an invalid ${field}.`);
    }
  }
  if (
    !Array.isArray(state.chain) ||
    !state.chain.every(isChainLink) ||
    !Array.isArray(state.log) ||
    !state.log.every(
      (entry) =>
        isRecord(entry) &&
        typeof entry.turn === "number" &&
        (isPlayerId(entry.actor) || entry.actor === "system") &&
        typeof entry.key === "string" &&
        (entry.values === undefined ||
          (isRecord(entry.values) &&
            Object.values(entry.values).every(
              (item) => typeof item === "string" || typeof item === "number",
            ))),
    ) ||
    typeof state.consecutivePasses !== "number" ||
    !isPendingAttack(state.pendingAttack) ||
    !isPendingChoice(state.pendingChoice) ||
    (state.resolvingSupport !== null &&
      (!isChainLink(state.resolvingSupport) ||
        !isRecord(state.resolvingSupport) ||
        typeof state.resolvingSupport.keepsCard !== "boolean"))
  ) {
    throw new Error("Naruto snapshot engine state has invalid action state.");
  }
  if (typeof state.seed !== "number") {
    throw new Error("Naruto snapshot engine state is missing the rng seed.");
  }
  if (!isRecord(state.rulesProfile)) {
    throw new Error("Naruto snapshot engine state is missing the preview rules profile.");
  }
  const { id, version, status } = state.rulesProfile;
  if (
    id !== NARUTO_PREVIEW_RULES_PROFILE.id ||
    version !== NARUTO_PREVIEW_RULES_PROFILE.version ||
    status !== NARUTO_PREVIEW_RULES_PROFILE.status
  ) {
    throw new Error("Naruto snapshot engine state has an unsupported preview rules profile.");
  }
}
