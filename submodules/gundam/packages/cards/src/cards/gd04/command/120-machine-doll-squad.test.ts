import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd04MachineDollSquad120 } from "./120-machine-doll-squad.ts";

describe("Machine Doll Squad (GD04-120)", () => {
  it("【Main】/【Action】gives a friendly Militia or Dianna Counter Unit AP+2 this turn", () => {
    const militia = createMockUnit({ traits: ["militia"] });
    const engine = GundamTestEngine.create({
      hand: [gd04MachineDollSquad120],
      play: [militia],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd04MachineDollSquad120, { targets: [unitId] }));

    expect(findStatModifier(engine, unitId, "ap")?.modifier).toBe(2);
  });
});
