import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaArchangel015 } from "./015-archangel.ts";

function blocker(name: string) {
  return createMockUnit({ name, ap: 2, hp: 4, keywordEffects: [{ keyword: "Blocker" }] });
}

describe("Archangel (ST04-015)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("offers the revealed Shield's owner a choice and deploys the accepted physical card", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1, hp: 4 })] },
        { shieldArea: [betaArchangel015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Archangel's visible Burst choice");
      const baseId = burst.sourceCardId;
      expect(burst).toMatchObject({
        controllerId: PLAYER_TWO,
        prompt: "【Burst】Deploy this card.",
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(baseId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves one Shield to hand while Archangel enters the Base section", () => {
      const engine = GundamTestEngine.create({
        hand: [betaArchangel015],
        shieldArea: [
          createMockUnit({ name: "Shield One" }),
          createMockUnit({ name: "Shield Two" }),
        ],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
      expect(p1.getHand()).toHaveLength(handBefore);
    });
  });

  describe("【Activate･Main】【Once per Turn】②：Choose 1 friendly Unit with <Blocker>. Set it as active. It can't attack during this turn.", () => {
    it("sets only the chosen Blocker active and prevents its attack", () => {
      const engine = GundamTestEngine.create({
        baseSection: [betaArchangel015],
        play: [
          { card: blocker("Chosen"), exhausted: true },
          { card: blocker("Other"), exhausted: true },
        ],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [chosenId, otherId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateBaseAbility(betaArchangel015, { targets: [chosenId!] }));

      expect(p1.isExhausted(chosenId!)).toBe(false);
      expect(p1.isExhausted(otherId!)).toBe(true);
      expectFailure(p1.enterBattle(chosenId!, "direct"), "CANNOT_ATTACK");
    });
  });
});
