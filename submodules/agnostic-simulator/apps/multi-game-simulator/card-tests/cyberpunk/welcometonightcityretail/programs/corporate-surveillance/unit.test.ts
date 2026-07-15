import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  expectEligibleTargets,
  expectNoPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import { welcomeToNightCityRetailCorporateSurveillance } from "@tcg/cyberpunk-cards";

const surveillance = welcomeToNightCityRetailCorporateSurveillance; // program, cost 2, sell tag

// Mock rival units at exact cost boundaries.
const rivalCost4 = createMockUnit({
  id: "cs-rival-cost-4",
  name: "Rival cost4",
  cost: 4,
  power: 3,
});
const rivalCost5 = createMockUnit({
  id: "cs-rival-cost-5",
  name: "Rival cost5",
  cost: 5,
  power: 4,
});
const rivalSpent = createMockUnit({ id: "cs-rival-spent", name: "Rival spent", cost: 2, power: 2 });

describe("Corporate Surveillance", () => {
  describe("[PLAY] Spend a rival Unit with cost 4 or less", () => {
    it("makes a cost-4 rival Unit eligible (boundary inclusive) and excludes cost-5", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [surveillance], eddies: surveillance.cost },
        { field: [{ card: rivalCost4 }, { card: rivalCost5 }] },
      );
      engine.playCard(surveillance);
      expectEligibleTargets(engine, [rivalCost4]);
    });

    it("SPENDS (not defeats) the targeted rival Unit — it stays on the field, spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [surveillance], eddies: surveillance.cost },
        { field: [{ card: rivalCost4 }] },
      );
      engine.playCard(surveillance);
      engine.resolveEffectTarget(rivalCost4);

      const target = engine.getCard(rivalCost4, "field", P2);
      expect(target.meta.spent).toBe(true);
      // Still on the field (spend, not defeat).
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === rivalCost4.id)).toBe(true);
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === rivalCost4.id)).toBe(false);
    });

    it("can target an already-spent rival Unit (the selector has no ready/spent gate)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [surveillance], eddies: surveillance.cost },
        { field: [{ card: rivalSpent, spent: true }] },
      );
      engine.playCard(surveillance);
      expectEligibleTargets(engine, [rivalSpent]);
    });

    it("creates no target choice when every rival Unit costs more than 4", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [surveillance], eddies: surveillance.cost },
        { field: [{ card: rivalCost5 }] },
      );
      engine.playCard(surveillance);
      expectNoPendingChoice(engine);
    });
  });
});
