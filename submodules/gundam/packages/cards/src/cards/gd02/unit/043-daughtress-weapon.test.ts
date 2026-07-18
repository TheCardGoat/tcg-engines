import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02DaughtressWeapon043 } from "./043-daughtress-weapon.ts";

describe("Daughtress Weapon (GD02-043)", () => {
  describe("Playing the Unit", () => {
    it("stays in hand below its printed Lv.2 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02DaughtressWeapon043],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("stays in hand after another legal deployment rests the active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02DaughtressWeapon043],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("【Deploy】If you have another (New UNE) Unit in play, deploy 1 rested [Daughtress] Unit token.", () => {
    it("deploys a visible rested Daughtress token beside another friendly New UNE Unit", () => {
      const ally = createMockUnit({ traits: ["new une"] });
      const engine = GundamTestEngine.create({
        hand: [gd02DaughtressWeapon043],
        play: [ally],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const allyId = p1.getCardsInZone("battleArea")[0]!;
      const sourceId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(gd02DaughtressWeapon043));

      const deployed = p1.getCardsInZone("battleArea");
      const tokenId = deployed.find((id) => id !== allyId && id !== sourceId);
      expect(tokenId).toBeDefined();
      expect(p1.isExhausted(tokenId!)).toBe(true);
      expect(p1.getVisibleCard(tokenId!)).toMatchObject({ effectiveAp: 0, effectiveHp: 1 });
    });

    it("does not count an enemy New UNE Unit or a friendly Unit with another trait", () => {
      const enemyNewUne = createMockUnit({ traits: ["new une"] });
      const friendlyOutsider = createMockUnit({ traits: ["vulture"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02DaughtressWeapon043],
          play: [friendlyOutsider],
          resourceArea: activeResources(2),
        },
        { play: [enemyNewUne] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const outsiderId = p1.getCardsInZone("battleArea")[0]!;
      const sourceId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(gd02DaughtressWeapon043));

      expect(p1.getCardsInZone("battleArea")).toEqual(
        expect.arrayContaining([outsiderId, sourceId]),
      );
      expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
      expect(p1.getCardZone(gd02DaughtressWeapon043)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
