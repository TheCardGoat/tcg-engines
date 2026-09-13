import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05DestroyGundam037 } from "./037-destroy-gundam.ts";

describe("Destroy Gundam (GD05-037)", () => {
  /** @behavioral-proof complete: hand reduction threshold and linked Breach behavior are public. */
  describe("While an enemy player has 7 or more cards in their trash, this card in your hand gets Lv. -3 and cost -3.", () => {
    it("deploys as Lv.6/cost 5 when the enemy has seven cards in trash", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd05DestroyGundam037],
          resourceArea: activeResources(6),
        },
        { trash: Array.from({ length: 7 }, () => createMockUnit()) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const resourceIds = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.deployUnit(gd05DestroyGundam037));

      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(resourceIds.filter((id) => p1.isExhausted(id))).toHaveLength(5);
    });

    it("does not reduce the printed Lv.9 with only six enemy trash cards", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd05DestroyGundam037],
          resourceArea: activeResources(8),
        },
        { trash: Array.from({ length: 6 }, () => createMockUnit()) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd05DestroyGundam037), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(gd05DestroyGundam037)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("does not count seven cards in its controller's own trash", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05DestroyGundam037],
        trash: Array.from({ length: 7 }, () => createMockUnit()),
        resourceArea: activeResources(8),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(gd05DestroyGundam037), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(gd05DestroyGundam037)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【During Link】This Unit gains <Breach 3>.", () => {
    it("deals exactly 3 Breach damage to the enemy Base while linked to a Biological CPU Pilot", () => {
      const pilot = createMockPilot({
        name: "Biological CPU",
        traits: ["biological cpu"],
        level: 1,
        cost: 1,
      });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 1 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd05DestroyGundam037],
          resourceArea: activeResources(9),
        },
        {
          play: [{ card: defender, exhausted: true }],
          baseSection: [base],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const destroyId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.assignPilot(pilot, destroyId));
      expectSuccess(p1.enterBattle(destroyId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(baseId)).toBe(3);
    });

    it("does not gain Breach without a paired Pilot", () => {
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 1 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [gd05DestroyGundam037] },
        {
          play: [{ card: defender, exhausted: true }],
          baseSection: [base],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const destroyId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.enterBattle(destroyId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(baseId)).toBe(0);
    });

    it("does not gain Breach from a paired Pilot without the Biological CPU trait", () => {
      const pilot = createMockPilot({
        name: "Ordinary Pilot",
        traits: ["phantom pain"],
        level: 1,
        cost: 1,
      });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 1 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd05DestroyGundam037],
          resourceArea: activeResources(9),
        },
        {
          play: [{ card: defender, exhausted: true }],
          baseSection: [base],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const destroyId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.assignPilot(pilot, destroyId));
      expectSuccess(p1.enterBattle(destroyId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getDamage(baseId)).toBe(0);
    });
  });
});
