import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  createMockUnit,
  createMockProgram,
  expectEligibleTargets,
  expectNoPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailAllIsLost,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailCorporateSurveillance,
} from "@tcg/cyberpunk-cards";

const allIsLost = welcomeToNightCityRetailAllIsLost; // program, cost 1, sell tag
const deckUnit = welcomeToNightCityRetailSwordwiseHuscle; // a Unit
const deckProgram = welcomeToNightCityRetailRebootOptics; // a Program
const deckUnit2 = createMockUnit({ id: "ail-deck-unit-2", name: "Deck Unit 2", power: 4 });

describe("All is Lost", () => {
  describe("[PLAY] Trash 3. Add a Unit from among them to your hand.", () => {
    it("trashes exactly 3 cards from the top of the deck", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [allIsLost],
          eddies: allIsLost.cost,
          deck: [deckUnit, deckProgram, deckUnit2],
        },
        {},
        { preserveDeckOrder: true },
      );
      const deckBefore = engine.getCardsInZone("deck", P1).length;
      engine.playCard(allIsLost);
      // 3 cards moved from deck to trash.
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 3);
      expect(engine.getCardsInZone("trash", P1).length).toBeGreaterThanOrEqual(3);
    });

    it("offers only the Units among the 3 trashed cards as the recovery choice", () => {
      // Stack the top 3: Unit, Program, Unit. Only the two Units are eligible.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [allIsLost],
          eddies: allIsLost.cost,
          deck: [deckUnit, deckProgram, deckUnit2],
        },
        {},
        { preserveDeckOrder: true },
      );
      engine.playCard(allIsLost);
      // The recovery choice draws from the trashed cards (trash zone).
      expectEligibleTargets(engine, [deckUnit, deckUnit2], { zone: "trash" });
    });

    it("moves the chosen Unit back to hand (recovered from the trash)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [allIsLost],
          eddies: allIsLost.cost,
          deck: [deckUnit, deckProgram, deckUnit2],
        },
        {},
        { preserveDeckOrder: true },
      );
      const handBefore = engine.getCardsInZone("hand", P1).length;
      engine.playCard(allIsLost);
      engine.resolveEffectTarget(deckUnit);
      // Played All Is Lost (-1 hand), recovered the Unit (+1) -> net 0.
      expect(engine.getCardsInZone("hand", P1).length).toBe(handBefore);
      const handDefs = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(handDefs).toContain(deckUnit.id);
    });

    it("creates no recovery choice when none of the 3 trashed cards is a Unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [allIsLost],
          eddies: allIsLost.cost,
          deck: [
            deckProgram,
            welcomeToNightCityRetailFloorIt,
            welcomeToNightCityRetailCorporateSurveillance,
          ],
        },
        {},
        { preserveDeckOrder: true },
      );
      engine.playCard(allIsLost);
      expectNoPendingChoice(engine);
    });
  });
});
