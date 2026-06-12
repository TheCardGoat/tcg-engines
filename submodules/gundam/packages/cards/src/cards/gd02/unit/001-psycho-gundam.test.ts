import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02PsychoGundam001 } from "./001-psycho-gundam.ts";

describe("Psycho Gundam (GD02-001)", () => {
  it("data declares Breach 3", () => {
    expect(gd02PsychoGundam001.keywordEffects).toEqual([{ keyword: "Breach", value: 3 }]);
  });

  describe("【During Pair･(Cyber-Newtype) Pilot】When one of your (Titans) Units destroys an enemy shield area card with damage, this Unit recovers 2 HP.", () => {
    it("recovers 2 HP when Psycho Gundam destroys an enemy shield-area card with battle damage while paired with a Cyber-Newtype Pilot", () => {
      const four = createMockPilot({
        name: "Four Murasame",
        traits: ["cyber-newtype"],
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create(
        {
          hand: [four],
          play: [gd02PsychoGundam001],
          resourceArea: activeResources(6),
        },
        { deck: 2 },
      );
      seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[psychoId] = 3;

      expectSuccess(p1.assignPilot(four, psychoId));
      expectSuccess(engine.resolveCombat({ attackerId: psychoId, target: "direct" }));

      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p1.getDamage(psychoId)).toBe(1);
    });

    it("does not recover when the paired Pilot is not a Cyber-Newtype", () => {
      const ordinaryPilot = createMockPilot({ name: "Ordinary Pilot", traits: ["titans"] });
      const engine = GundamTestEngine.create(
        {
          hand: [ordinaryPilot],
          play: [gd02PsychoGundam001],
          resourceArea: activeResources(6),
        },
        { deck: 2 },
      );
      seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[psychoId] = 3;

      expectSuccess(p1.assignPilot(ordinaryPilot, psychoId));
      expectSuccess(engine.resolveCombat({ attackerId: psychoId, target: "direct" }));

      expect(p1.getDamage(psychoId)).toBe(3);
    });

    it("does not recover when a non-Titans Unit destroys the shield-area card", () => {
      const four = createMockPilot({
        name: "Four Murasame",
        traits: ["cyber-newtype"],
        level: 1,
        cost: 1,
      });
      const nonTitansAttacker = createMockUnit({ name: "Non-Titans Attacker", ap: 2, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [four],
          play: [gd02PsychoGundam001, nonTitansAttacker],
          resourceArea: activeResources(6),
        },
        { deck: 2 },
      );
      seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [psychoId, attackerId] = p1.getCardsInZone("battleArea");
      engine.getG().damage[psychoId!] = 3;

      expectSuccess(p1.assignPilot(four, psychoId!));
      expectSuccess(engine.resolveCombat({ attackerId: attackerId!, target: "direct" }));

      expect(p1.getDamage(psychoId!)).toBe(3);
    });

    it("does not recover when Psycho Gundam is unpaired", () => {
      const engine = GundamTestEngine.create({ play: [gd02PsychoGundam001] }, { deck: 2 });
      seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[psychoId] = 3;

      expectSuccess(engine.resolveCombat({ attackerId: psychoId, target: "direct" }));

      expect(p1.getDamage(psychoId)).toBe(3);
    });
  });
});
