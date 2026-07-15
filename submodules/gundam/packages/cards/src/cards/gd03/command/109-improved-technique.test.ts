import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03ImprovedTechnique109 } from "./109-improved-technique.ts";

function improvedTechniqueCopy() {
  return createMockCommand({ name: "Improved Technique (Alternate Art)" });
}

describe("Improved Technique (GD03-109)", () => {
  describe("【Burst】Activate this card's 【Main】.", () => {
    it("activates the Main effect from shield burst", () => {
      const attacker = createMockUnit({ name: "Enemy Attacker", level: 4, ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd03ImprovedTechnique109] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        directiveIndex: -1,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [attackerId],
      });
      expectSuccess(p2.resolveEffect({ targets: [attackerId] }));

      expect(p1.getDamage(attackerId)).toBe(3);
      expect(p2.getCardZone(gd03ImprovedTechnique109)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe('【Main】/【Action】Choose 1 enemy Unit that is Lv.4 or lower. Deal 3 damage to it. If there are 2 or more cards with "Improved Technique" in their card name in your trash, choose 1 enemy Unit instead.', () => {
    it("deals 3 damage to an enemy Unit that is Lv.4 or lower during Main", () => {
      const enemy = createMockUnit({ level: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd03ImprovedTechnique109], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd03ImprovedTechnique109, { targets: [enemyId] }));

      expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(3);
    });

    it("deals 3 damage during Action", () => {
      const enemy = createMockUnit({ level: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd03ImprovedTechnique109], resourceArea: activeResources(3) },
        { play: [enemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(enemyId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(gd03ImprovedTechnique109, { targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(3);
    });

    it("rejects an enemy Unit above Lv.4 without two Improved Technique cards in trash", () => {
      const enemy = createMockUnit({ level: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd03ImprovedTechnique109], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd03ImprovedTechnique109, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
    });

    it("can target any enemy Unit when two Improved Technique cards are in trash", () => {
      const enemy = createMockUnit({ level: 6, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ImprovedTechnique109],
          trash: [improvedTechniqueCopy(), improvedTechniqueCopy()],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd03ImprovedTechnique109, { targets: [enemyId] }));

      expect(engine.asPlayer(PLAYER_TWO).getDamage(enemyId)).toBe(3);
    });
  });
});
