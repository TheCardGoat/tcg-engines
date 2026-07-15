import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  expectEligibleTargets,
} from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailCaliberTotentanzSTopDog,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";

const caliber = welcomeToNightCityRetailCaliberTotentanzSTopDog; // unit, cost 5, power 4
const rivalCost2 = createMockUnit({
  id: "cal-rival-cost-2",
  name: "Rival cost2",
  cost: 2,
  power: 3,
});
const rivalCost3 = createMockUnit({
  id: "cal-rival-cost-3",
  name: "Rival cost3",
  cost: 3,
  power: 4,
});

describe("Caliber — Totentanz's Top Dog", () => {
  describe("[PLAY] Defeat a rival Unit with cost 2 or less", () => {
    it("makes rival Units with cost <= 2 eligible (excludes cost 3)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [caliber], eddies: caliber.cost },
        { field: [{ card: rivalCost2 }, { card: rivalCost3 }] },
      );
      engine.playCard(caliber);
      expectEligibleTargets(engine, [rivalCost2]);
    });

    it("defeats the chosen rival Unit (it moves to rival trash)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [caliber], eddies: caliber.cost },
        { field: [{ card: rivalCost2 }] },
      );
      engine.playCard(caliber);
      engine.resolveEffectTarget(rivalCost2);
      const p2Trash = engine.getCardsInZone("trash", P2).map((c) => c.definitionId);
      expect(p2Trash).toContain(rivalCost2.id);
    });
  });

  describe("[Defeated] A Rival discards 1; +1 more if the discarded card's cost equals a friendly Gig value", () => {
    it("forces a Rival to discard when Caliber is defeated", () => {
      // Caliber attacks a stronger spent defender and is defeated. The rival
      // (P2) must then discard 1 from hand.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: caliber, spent: false, hasLag: false }],
        },
        {
          hand: [
            welcomeToNightCityRetailCorpoSecurity,
            welcomeToNightCityRetailCorpoSecurity,
            welcomeToNightCityRetailCorpoSecurity,
          ],
          field: [
            {
              card: welcomeToNightCityRetailCorpoSecurity,
              spent: true,
              powerModifier: 3,
            },
          ],
        },
      );
      const rivalHandBefore = engine.getCardsInZone("hand", P2).length;

      engine.attackUnit(caliber, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
      engine.resolveFullFight({ as: P1 });

      // Caliber is defeated → its defeated trigger makes the rival discard 1.
      // Resolve the rival's discard choice.
      engine.resolveDiscardFromHand([welcomeToNightCityRetailCorpoSecurity], { as: P2 });

      expect(engine.getCardsInZone("hand", P2).length).toBe(rivalHandBefore - 1);
      // The discarded card reached the rival's trash.
      expect(engine.getCardsInZone("trash", P2).map((c) => c.definitionId)).toContain(
        welcomeToNightCityRetailCorpoSecurity.id,
      );
    });
  });
});
