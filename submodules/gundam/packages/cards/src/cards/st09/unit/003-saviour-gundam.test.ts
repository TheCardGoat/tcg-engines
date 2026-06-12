import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st09SaviourGundam003 } from "./003-saviour-gundam.ts";

const athrun = () => createMockPilot({ name: "Athrun Zala", level: 4, cost: 1 });
const purpleTrash = (count: number) =>
  Array.from({ length: count }, () => createMockUnit({ color: "purple" }));

describe("Saviour Gundam (ST09-003)", () => {
  describe("<Breach 3>", () => {
    it("declares Breach 3 in keyword data", () => {
      expect(st09SaviourGundam003.keywordEffects).toEqual([{ keyword: "Breach", value: 3 }]);
    });

    it("deals 3 damage to the defender's top shield after destroying an enemy Unit", () => {
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const shieldSeed = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st09SaviourGundam003] },
        { play: [defender], deck: [shieldSeed] },
      );
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(engine.getState().ctx.zones.private.cardIndex[defenderId]?.zoneKey).toBe(
        `trash:${PLAYER_TWO}`,
      );
      expect(getDamageCounter(engine, shieldId!)).toBe(3);
    });
  });

  describe("【When Linked】If there are 5 or more purple cards in your trash, deal 2 damage to all Units with 5 or less AP.", () => {
    it("data encodes the purple-trash condition and AP<=5 target filter", () => {
      const effect = st09SaviourGundam003.effects?.[0];
      const directive = effect?.directives[0];

      expect(effect?.type).toBe("triggered");
      expect(effect?.activation.timing).toEqual(["whenLinked"]);
      expect(effect?.activation.conditions).toEqual([
        {
          type: "cardInZone",
          owner: "friendly",
          zone: "trash",
          comparison: "gte",
          count: 5,
          hasColor: "purple",
        },
      ]);
      if (!directive || !("action" in directive) || directive.action.action !== "dealDamageAll") {
        throw new Error("Unexpected then directive shape");
      }
      expect(directive.action).toEqual({
        action: "dealDamageAll",
        amount: 2,
        target: {
          owner: "any",
          cardType: "unit",
          attributeFilters: [{ attribute: "ap", comparison: "lte", value: 5 }],
        },
      });
    });

    it("on link, deals 2 damage to every Unit with AP 5 or less when trash has 5 purple cards", () => {
      const pilot = athrun();
      const friendlyLow = createMockUnit({ ap: 4, hp: 5 });
      const enemyLow = createMockUnit({ ap: 5, hp: 5 });
      const enemyHigh = createMockUnit({ ap: 6, hp: 7 });
      const engine = GundamTestEngine.create(
        {
          play: [st09SaviourGundam003, friendlyLow],
          hand: [pilot],
          resourceArea: activeResources(4),
          trash: purpleTrash(5),
        },
        { play: [enemyLow, enemyHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [saviourId, friendlyLowId] = p1.getCardsInZone("battleArea");
      const [enemyLowId, enemyHighId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, saviourId!));

      // Shinn's pilot bonus pushes Saviour above the AP<=5 filter.
      expect(getDamageCounter(engine, saviourId!)).toBe(0);
      expect(getDamageCounter(engine, friendlyLowId!)).toBe(2);
      expect(getDamageCounter(engine, enemyLowId!)).toBe(2);
      expect(getDamageCounter(engine, enemyHighId!)).toBe(0);
    });

    it("does not fire with only four purple cards in trash", () => {
      const pilot = athrun();
      const enemyLow = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [st09SaviourGundam003],
          hand: [pilot],
          resourceArea: activeResources(4),
          trash: purpleTrash(4),
        },
        { play: [enemyLow] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [saviourId] = p1.getCardsInZone("battleArea");
      const [enemyLowId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, saviourId!));

      expect(getDamageCounter(engine, saviourId!)).toBe(0);
      expect(getDamageCounter(engine, enemyLowId!)).toBe(0);
    });
  });
});
