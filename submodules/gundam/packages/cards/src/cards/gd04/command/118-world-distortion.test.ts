import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04WorldDistortion118 } from "./118-world-distortion.ts";

describe("World Distortion (GD04-118)", () => {
  it("【Main】/【Action】with 2+ friendly UN Units returns an enemy Unit with 5 or less HP to hand", () => {
    const unA = createMockUnit({ traits: ["un"] });
    const unB = createMockUnit({ traits: ["un"] });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04WorldDistortion118],
        play: [unA, unB],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd04WorldDistortion118, { targets: [enemyId] }));

    expect(p2.getHand()).toContain(enemyId);
  });
});
