import { describe, it, expect } from "vite-plus/test";
import "../gundam/testing/register-matchers.ts";
import type { PlayerId } from "../types/branded.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockResource,
} from "../index.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
}

describe("Per-player undo", () => {
  it("player who moved can undo their own move", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) }, {});
    engine.asPlayer(PLAYER_ONE).deployUnit(unit);

    const result = engine.undo(PLAYER_ONE as PlayerId);
    expect(result).not.toBeNull();
    expect(result!.success).toBe(true);
  });

  it("other player cannot undo the move", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) }, {});
    engine.asPlayer(PLAYER_ONE).deployUnit(unit);

    const result = engine.undo(PLAYER_TWO as PlayerId);
    expect(result).toBeNull();
  });

  it("canUndo returns true only for the acting player", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) }, {});
    engine.asPlayer(PLAYER_ONE).deployUnit(unit);
    const runtime = engine.getRuntime();

    expect(runtime.canUndo(PLAYER_ONE as PlayerId)).toBe(true);
    expect(runtime.canUndo(PLAYER_TWO as PlayerId)).toBe(false);
  });

  it("different player's move clears the undo stack", () => {
    const u1 = createMockUnit({ level: 1, cost: 1, name: "Unit-A" });
    const u2 = createMockUnit({ level: 1, cost: 1, name: "Unit-B" });
    const engine = GundamTestEngine.create(
      { hand: [u1], resourceArea: resources(2) },
      { hand: [u2], resourceArea: resources(2) },
      { initialActivePlayer: PLAYER_ONE },
    );
    engine.asPlayer(PLAYER_ONE).deployUnit(u1);

    engine.getRuntime().state.ctx.status.activePlayer = PLAYER_TWO as unknown as PlayerId;
    engine.asPlayer(PLAYER_TWO).deployUnit(u2);

    expect(engine.getRuntime().canUndo(PLAYER_ONE as PlayerId)).toBe(false);
    expect(engine.getRuntime().canUndo(PLAYER_TWO as PlayerId)).toBe(true);
  });
});
