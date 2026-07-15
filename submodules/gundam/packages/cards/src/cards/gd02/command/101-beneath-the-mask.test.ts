import { describe, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd02BeneathTheMask101 } from "./101-beneath-the-mask.ts";

describe("Beneath the Mask (GD02-101)", () => {
  describe("【Main】/【Action】Choose 1 to 2 enemy Units that are Lv.2 or lower. Rest them.", () => {
    it("rests two Lv ≤ 2 enemy units at once", () => {
      const e1 = createMockUnit({ ap: 1, hp: 2, level: 1 });
      const e2 = createMockUnit({ ap: 2, hp: 2, level: 2 });
      const engine = GundamTestEngine.create(
        { hand: [gd02BeneathTheMask101], resourceArea: activeResources(1) },
        { play: [e1, e2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [e1Id, e2Id] = p2.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02BeneathTheMask101, { targets: [e1Id!, e2Id!] }));

      const exhausted = engine.getG().exhausted;
      if (!exhausted[e1Id!] || !exhausted[e2Id!]) {
        throw new Error("Expected both enemy units to be rested");
      }
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("also works when only 1 target is chosen (min count = 1)", () => {
      const e1 = createMockUnit({ ap: 1, hp: 2, level: 1 });
      const engine = GundamTestEngine.create(
        { hand: [gd02BeneathTheMask101], resourceArea: activeResources(1) },
        { play: [e1] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [e1Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd02BeneathTheMask101, { targets: [e1Id!] }));
      if (!engine.getG().exhausted[e1Id!]) {
        throw new Error("Expected enemy unit to be rested");
      }
    });

    it("cannot target an enemy unit above Lv.2", () => {
      const bigEnemy = createMockUnit({ ap: 4, hp: 5, level: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd02BeneathTheMask101], resourceArea: activeResources(1) },
        { play: [bigEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [id] = p2.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(gd02BeneathTheMask101, { targets: [id!] }), "INVALID_TARGET");
    });
  });
});
