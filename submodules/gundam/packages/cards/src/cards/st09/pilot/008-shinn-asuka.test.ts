import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09ImpulseGundam001 } from "../unit/001-impulse-gundam.ts";
import { st09ShinnAsuka008 } from "./008-shinn-asuka.ts";

describe("Shinn Asuka (ST09-008)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("moves Shinn from shieldArea to hand", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st09ShinnAsuka008] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const shieldId = p2.getCardsInZone("shieldArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: shieldId,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p2.getHand()).toContain(shieldId);
    });
  });

  describe("【Attack】If this is a (Minerva Squad) Unit, choose 1 of your Resources. Set it as active.", () => {
    it("readies one rested resource when a paired Minerva Squad unit attacks", () => {
      const restedResource = createMockResource();
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st09ImpulseGundam001, st09ShinnAsuka008],
          resourceArea: [...activeResources(5), { card: restedResource, exhausted: true }],
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const restedResourceId = p1.getCardsInZone("resourceArea").at(-1)!;

      expectSuccess(p1.deployUnit(st09ImpulseGundam001));
      expectSuccess(p1.assignPilot(st09ShinnAsuka008, st09ImpulseGundam001));
      const [defenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(st09ImpulseGundam001, defenderId!));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "targetSelection" });
      if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
      expect(choice.legalTargetIds).toContain(restedResourceId);
      expectSuccess(p1.resolveEffect({ targets: [restedResourceId] }));

      expect(p1.isExhausted(restedResourceId)).toBe(false);
    });

    it("does not ready a resource when the paired unit is not Minerva Squad", () => {
      const nonMinervaUnit = createMockUnit({
        name: "Non-Minerva Host",
        traits: ["zaft"],
        ap: 3,
        hp: 4,
        level: 3,
        cost: 2,
        linkCondition: "[Shinn Asuka]",
      });
      const restedResource = createMockResource();
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [nonMinervaUnit, st09ShinnAsuka008],
          resourceArea: [...activeResources(5), { card: restedResource, exhausted: true }],
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const restedResourceId = p1.getCardsInZone("resourceArea").at(-1)!;

      expectSuccess(p1.deployUnit(nonMinervaUnit));
      expectSuccess(p1.assignPilot(st09ShinnAsuka008, nonMinervaUnit));
      const [defenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(nonMinervaUnit, defenderId!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.isExhausted(restedResourceId)).toBe(true);
    });

    it("does not ready an opponent's rested resource", () => {
      const restedFriendly = createMockResource();
      const restedEnemy = createMockResource();
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st09ImpulseGundam001, st09ShinnAsuka008],
          resourceArea: [...activeResources(5), { card: restedFriendly, exhausted: true }],
        },
        {
          play: [{ card: defender, exhausted: true }],
          resourceArea: [{ card: restedEnemy, exhausted: true }],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyResourceId = p1.getCardsInZone("resourceArea").at(-1)!;
      const enemyResourceId = p2.getCardsInZone("resourceArea")[0]!;

      expectSuccess(p1.deployUnit(st09ImpulseGundam001));
      expectSuccess(p1.assignPilot(st09ShinnAsuka008, st09ImpulseGundam001));
      const [defenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(st09ImpulseGundam001, defenderId!));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "targetSelection" });
      if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
      expect(choice.legalTargetIds).toContain(friendlyResourceId);
      expect(choice.legalTargetIds).not.toContain(enemyResourceId);
      expectSuccess(p1.resolveEffect({ targets: [friendlyResourceId] }));

      expect(p2.isExhausted(enemyResourceId)).toBe(true);
    });
  });
});
