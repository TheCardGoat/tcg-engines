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

import type { GameState, PlayerId } from "@tcg-engines/naruto-engine";

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

function assertGameStateShape(state: Record<string, unknown>): void {
  if (typeof state.turn !== "number") {
    throw new Error("Naruto snapshot engine state is missing `turn`.");
  }
  if (state.activePlayer !== "p1" && state.activePlayer !== "p2") {
    throw new Error("Naruto snapshot engine state has an invalid `activePlayer`.");
  }
  if (!isRecord(state.players) || !isRecord(state.players.p1) || !isRecord(state.players.p2)) {
    throw new Error("Naruto snapshot engine state is missing both player states.");
  }
  if (!Array.isArray(state.log)) {
    throw new Error("Naruto snapshot engine state is missing the log.");
  }
  if (typeof state.seed !== "number") {
    throw new Error("Naruto snapshot engine state is missing the rng seed.");
  }
}
