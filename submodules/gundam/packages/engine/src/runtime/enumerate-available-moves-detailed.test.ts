/**
 * enumerateAvailableMovesDetailed — UI-facing move enumeration with
 * per-move card candidates. Proves that each wired move emits the expected
 * `selectableCardIds` for typical main-phase / battle-phase fixtures.
 */

import { describe, it, expect } from "vite-plus/test";
import "../gundam/testing/register-matchers.ts";
import type { PlayerId } from "../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockBase,
  createMockCommand,
  createMockPilot,
  createMockResource,
  enumerateAvailableMovesDetailed,
} from "../index.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
}

function getDetailed(engine: GundamTestEngine, playerId: string) {
  const runtime = engine.getRuntime() as unknown as {
    state: unknown;
    staticResources: unknown;
  };
  return enumerateAvailableMovesDetailed(
    runtime.state as Parameters<typeof enumerateAvailableMovesDetailed>[0],
    playerId as PlayerId,
    runtime.staticResources as Parameters<typeof enumerateAvailableMovesDetailed>[2],
  );
}

describe("enumerateAvailableMovesDetailed", () => {
  it("lists hand units under deployUnit.selectableCardIds in main-phase", () => {
    const unit1 = createMockUnit({ level: 1, cost: 1 });
    const unit2 = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit1, unit2],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    const deploy = moves.find((m) => m.moveName === "deployUnit");
    expect(deploy).toBeDefined();
    expect(deploy!.requiresCardSelection).toBe(true);
    expect(deploy!.selectableCardIds.length).toBe(2);
  });

  it("omits deployUnit when hand has no playable units", () => {
    const unit = createMockUnit({ level: 5, cost: 5 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(1),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    expect(moves.find((m) => m.moveName === "deployUnit")).toBeUndefined();
  });

  it("lists hand bases under deployBase when the base section is empty", () => {
    const base = createMockBase({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [base],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    const deploy = moves.find((m) => m.moveName === "deployBase");
    expect(deploy).toBeDefined();
    expect(deploy!.selectableCardIds.length).toBe(1);
  });

  it("lists hand pilots under assignPilot when a pairable unit exists", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [unit],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    const pair = moves.find((m) => m.moveName === "assignPilot");
    expect(pair).toBeDefined();
    expect(pair!.selectableCardIds.length).toBe(1);
  });

  it("omits assignPilot when no pairable unit is on the field", () => {
    const pilot = createMockPilot({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    expect(moves.find((m) => m.moveName === "assignPilot")).toBeUndefined();
  });

  it("includes playCommand candidates when a main-timing command is playable", () => {
    const cmd = createMockCommand({
      level: 1,
      cost: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "no-op",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [cmd],
      resourceArea: resources(2),
    });

    const moves = getDetailed(engine, PLAYER_ONE);
    const play = moves.find((m) => m.moveName === "playCommand");
    expect(play).toBeDefined();
    expect(play!.selectableCardIds).toContain(
      engine.asPlayer(PLAYER_ONE).getCardsInZone("hand")[0],
    );
  });

  it("returns [] when the game has ended", () => {
    const engine = GundamTestEngine.create({ hand: [createMockUnit()] });
    engine.getRuntime().state.ctx.status.gameEnded = true;
    const moves = getDetailed(engine, PLAYER_ONE);
    expect(moves).toEqual([]);
  });

  it("returns passTurn with no card selection in main-phase", () => {
    const engine = GundamTestEngine.create({ hand: [] });
    const moves = getDetailed(engine, PLAYER_ONE);
    const pass = moves.find((m) => m.moveName === "passTurn");
    expect(pass).toBeDefined();
    expect(pass!.requiresCardSelection).toBe(false);
    expect(pass!.selectableCardIds).toEqual([]);
  });

  it("excludes moves from the non-active player when move is active-player-only", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [unit],
      resourceArea: resources(2),
    });
    const moves = getDetailed(engine, PLAYER_TWO);
    expect(moves.find((m) => m.moveName === "deployUnit")).toBeUndefined();
  });
});
