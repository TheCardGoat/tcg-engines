import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01TiffaAdillFreeden090 } from "./090-tiffa-adill-freeden.ts";

describe("Tiffa Adill & Freeden (EB01-090)", () => {
  describe("【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, choose 1 Unit with 2 or less HP belonging to each enemy player. Return them to their owners' hands.", () => {
    it("adds a Shield, then returns only an enemy Unit with 2 or less HP on its controller's turn", () => {
      const shield = createMockUnit({ name: "Returned Shield" });
      const eligible = createMockUnit({ hp: 2 });
      const ineligible = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [eb01TiffaAdillFreeden090],
          shieldArea: [shield],
          resourceArea: activeResources(2),
        },
        { play: [eligible, ineligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployBase(eb01TiffaAdillFreeden090));
      expect(p1.getCardZone(shield)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [eligibleId],
      });
      expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

      expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getCardZone(ineligibleId!)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("does not offer the return choice when deployed by Burst on the opponent's turn", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const remainingShield = createMockUnit({ name: "Remaining Shield" });
      const enemy = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create(
        { shieldArea: [eb01TiffaAdillFreeden090, remainingShield] },
        { play: [attacker, enemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[1]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      const baseId = burst.sourceCardId;

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getCardZone(remainingShield)).toBe(`hand:${PLAYER_ONE}`);
      expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
