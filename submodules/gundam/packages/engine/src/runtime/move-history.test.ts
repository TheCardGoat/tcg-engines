import { describe, it, expect } from "vite-plus/test";
import "../gundam/testing/register-matchers.ts";
import type { PlayerId } from "../types/branded.ts";
import { GundamTestEngine, PLAYER_ONE, createMockUnit, createMockResource } from "../index.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
}

describe("Move history", () => {
  it("records entries for each executed command", () => {
    const u1 = createMockUnit({ level: 1, cost: 1, name: "Unit-1" });
    const u2 = createMockUnit({ level: 1, cost: 1, name: "Unit-2" });
    const engine = GundamTestEngine.create({ hand: [u1, u2], resourceArea: resources(4) });
    const p1 = engine.asPlayer(PLAYER_ONE);

    p1.deployUnit(u1);
    p1.deployUnit(u2);

    const history = engine.getRuntime().getMoveHistory();
    expect(history.length).toBe(2);
    expect(history[0]!.moveId).toBe("deployUnit");
    expect(history[1]!.moveId).toBe("deployUnit");
    expect(history[0]!.playerId).toBe(PLAYER_ONE);
  });

  it("captures stateID, phase, and turnNumber", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) });
    engine.asPlayer(PLAYER_ONE).deployUnit(unit);

    const entry = engine.getRuntime().getMoveHistory()[0]!;
    expect(entry.stateID).toBeGreaterThan(0);
    expect(entry.phase).toBe("main-phase");
    expect(typeof entry.turnNumber).toBe("number");
  });

  it("removes last entry on undo", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create({ hand: [unit], resourceArea: resources(2) });
    engine.asPlayer(PLAYER_ONE).deployUnit(unit);
    expect(engine.getRuntime().getMoveHistory().length).toBe(1);

    engine.undo(PLAYER_ONE as PlayerId);
    expect(engine.getRuntime().getMoveHistory().length).toBe(0);
  });

  it("is empty on a fresh engine", () => {
    const engine = GundamTestEngine.create({});
    expect(engine.getRuntime().getMoveHistory().length).toBe(0);
  });
});
