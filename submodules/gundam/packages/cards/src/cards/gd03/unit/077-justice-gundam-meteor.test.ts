import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03JusticeGundamMeteor077 } from "./077-justice-gundam-meteor.ts";

describe("Justice Gundam (METEOR) (GD03-077)", () => {
  it("【When Linked】 returns 1 to 3 enemy Units with 3 or less HP to hand", () => {
    const athrun = createMockPilot({ name: "Athrun Zala" });
    const weakA = createMockUnit({ hp: 3 });
    const weakB = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [athrun],
        play: [gd03JusticeGundamMeteor077],
        resourceArea: activeResources(8),
      },
      { play: [weakA, weakB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [weakAId, weakBId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(athrun, unitId));

    expect(p2.getHand()).toEqual(expect.arrayContaining([weakAId, weakBId]));
  });
});
