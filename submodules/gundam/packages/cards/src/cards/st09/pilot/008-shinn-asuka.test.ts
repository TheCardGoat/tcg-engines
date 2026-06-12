import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
  isCardExhausted,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st09ImpulseGundam001 } from "../unit/001-impulse-gundam.ts";
import { st09ShinnAsuka008 } from "./008-shinn-asuka.ts";

function exhaustedResourceCount(engine: GundamTestEngine): number {
  return engine
    .asPlayer(PLAYER_ONE)
    .getCardsInZone("resourceArea")
    .filter((id) => isCardExhausted(engine, id)).length;
}

describe("Shinn Asuka (ST09-008)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("moves Shinn from shieldArea to hand", () => {
      const engine = GundamTestEngine.create({}, { deck: [st09ShinnAsuka008] });
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      if (!shieldId) throw new Error("seed failed");

      engine.fireShieldBurst(shieldId);

      expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
        `hand:${PLAYER_TWO}`,
      );
    });
  });

  describe("【Attack】If this is a (Minerva Squad) Unit, choose 1 of your Resources. Set it as active.", () => {
    it("data gates the attack trigger to a Minerva Squad host and targets one rested friendly resource", () => {
      const effect = st09ShinnAsuka008.effects?.[1];
      const directive = effect?.directives[0];

      expect(effect?.type).toBe("triggered");
      expect(effect?.activation.timing).toEqual(["attack"]);
      expect(effect?.activation.conditions).toEqual([
        { type: "linkedUnitHasTrait", trait: "minerva squad" },
      ]);
      if (!directive || !("action" in directive) || directive.action.action !== "setActive") {
        throw new Error("Unexpected directive shape");
      }
      expect(directive.action.target).toEqual({
        owner: "friendly",
        cardType: "resource",
        zone: "resourceArea",
        state: "rested",
        count: 1,
      });
    });

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

      expectSuccess(p1.deployUnit(st09ImpulseGundam001));
      expectSuccess(p1.assignPilot(st09ShinnAsuka008, st09ImpulseGundam001));
      const exhaustedBefore = exhaustedResourceCount(engine);
      const [defenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(st09ImpulseGundam001, defenderId!));

      expect(exhaustedResourceCount(engine)).toBe(exhaustedBefore - 1);
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

      expectSuccess(p1.deployUnit(nonMinervaUnit));
      expectSuccess(p1.assignPilot(st09ShinnAsuka008, nonMinervaUnit));
      const exhaustedBefore = exhaustedResourceCount(engine);
      const [defenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(nonMinervaUnit, defenderId!));

      expect(exhaustedResourceCount(engine)).toBe(exhaustedBefore);
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
      const enemyResourceId = p2.getCardsInZone("resourceArea")[0]!;

      expectSuccess(p1.deployUnit(st09ImpulseGundam001));
      expectSuccess(p1.assignPilot(st09ShinnAsuka008, st09ImpulseGundam001));
      const [defenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(st09ImpulseGundam001, defenderId!));

      expect(isCardExhausted(engine, enemyResourceId)).toBe(true);
    });
  });
});
