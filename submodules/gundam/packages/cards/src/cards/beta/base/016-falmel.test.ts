import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaFalmel016 } from "./016-falmel.ts";

describe("Falmel (ST03-016)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the accepted revealed Base and resolves its visible deploy result", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1, hp: 5 })] },
        { shieldArea: [betaFalmel016, createMockUnit({ name: "Other Shield" })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Falmel's visible Burst choice");
      const baseId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(baseId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getHand()).toHaveLength(1);
      expect(p2.getCardsInZone("battleArea")).toHaveLength(0);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy a rested Char's Zaku Ⅱ token.", () => {
    it("adds one Shield and deploys one rested visible token during its controller's turn", () => {
      const engine = GundamTestEngine.create({
        hand: [betaFalmel016],
        shieldArea: [createMockUnit({ name: "Returned Shield" })],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(baseId));

      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(handBefore);
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 3,
        effectiveHp: 1,
        exhausted: true,
      });
    });
  });
});
