import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ShrikeTeamSBulwark104 } from "./104-shrike-team-s-bulwark.ts";

describe("Shrike Team's Bulwark (GD04-104)", () => {
  it("【Main】/【Action】rests 1 to 2 enemy Units that are Lv.2 or lower", () => {
    const enemyA = createMockUnit({ level: 2 });
    const enemyB = createMockUnit({ level: 1 });
    const engine = GundamTestEngine.create(
      { hand: [gd04ShrikeTeamSBulwark104], resourceArea: activeResources(3) },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [enemyAId, enemyBId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd04ShrikeTeamSBulwark104, { targets: [enemyAId!, enemyBId!] }));

    expect(engine.getG().exhausted[enemyAId!]).toBe(true);
    expect(engine.getG().exhausted[enemyBId!]).toBe(true);
  });
});
