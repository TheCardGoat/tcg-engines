import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1 } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
  welcomeToNightCityRetailCorpoSecurity, // cost 2
  welcomeToNightCityRetailFieldOperator, // cost 2
  welcomeToNightCityRetailMantisBlades, // cost 1
  welcomeToNightCityRetailRebootOptics, // cost 2
  welcomeToNightCityRetailSwordwiseHuscle, // cost 3
} from "@tcg/cyberpunk-cards";

const hanako = welcomeToNightCityRetailHanakoArasakaInAGildedCage; // unit, cost 4, power 1

describe("Hanako Arasaka — In a Gilded Cage", () => {
  describe("{PLAY} Search top 4, reveal cards with cost == a friendly Gig value, add to hand", () => {
    it("adds cards whose cost matches a friendly Gig value to hand; bottom-decks the rest", () => {
      // Friendly gig value 2. Top 4: CorpoSec(2), FieldOperator(2), MantisBlades(1),
      // RebootOptics(2). All three cost-2 cards match; Mantis Blades (cost 1) does not.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [hanako],
          eddies: hanako.cost,
          deck: [
            welcomeToNightCityRetailCorpoSecurity,
            welcomeToNightCityRetailFieldOperator,
            welcomeToNightCityRetailMantisBlades,
            welcomeToNightCityRetailRebootOptics,
          ],
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {},
        { preserveDeckOrder: true },
      );
      engine.playCard(hanako);
      // Hanako entered the field.
      expect(engine.getCardsInZone("field", P1).map((c) => c.definitionId)).toContain(hanako.id);
      // Friendly gig value 2. CorpoSec(2) and RebootOptics(2) match -> hand.
      // FieldOperator(3) and MantisBlades(1) do NOT match -> bottom-decked.
      const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(hand).toContain(welcomeToNightCityRetailCorpoSecurity.id);
      expect(hand).toContain(welcomeToNightCityRetailRebootOptics.id);
      expect(hand).not.toContain(welcomeToNightCityRetailFieldOperator.id);
      expect(hand).not.toContain(welcomeToNightCityRetailMantisBlades.id);
    });

    it("a card whose cost does NOT match any friendly Gig value is bottom-decked, not handed", () => {
      // Friendly gig value 2. Top: SwordwiseHuscle (cost 3, no match), CorpoSec (cost 2, match).
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [hanako],
          eddies: hanako.cost,
          deck: [welcomeToNightCityRetailSwordwiseHuscle, welcomeToNightCityRetailCorpoSecurity],
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {},
        { preserveDeckOrder: true },
      );
      engine.playCard(hanako);
      const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(hand).toContain(welcomeToNightCityRetailCorpoSecurity.id); // cost 2 matches
      expect(hand).not.toContain(welcomeToNightCityRetailSwordwiseHuscle.id); // cost 3 no match
      // The non-matching card is bottom-decked (still in deck).
      expect(engine.getCardsInZone("deck", P1).map((c) => c.definitionId)).toContain(
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
    });

    it("matches multiple friendly Gig values (a card is eligible if its cost equals ANY)", () => {
      // Friendly gig values 2 and 3. Top: CorpoSec (cost 2), SwordwiseHuscle (cost 3).
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [hanako],
          eddies: hanako.cost,
          deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailSwordwiseHuscle],
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 3 },
          ],
        },
        {},
        { preserveDeckOrder: true },
      );
      engine.playCard(hanako);
      const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(hand).toContain(welcomeToNightCityRetailCorpoSecurity.id); // cost 2 == gig 2
      expect(hand).toContain(welcomeToNightCityRetailSwordwiseHuscle.id); // cost 3 == gig 3
    });

    it("hands nothing when no revealed card cost matches the friendly Gig value", () => {
      // Friendly gig value 2. Top: SwordwiseHuscle (cost 3), FieldOperator is cost 2...
      // use two cost-3 cards to ensure no match. SwordwiseHuscle + (another cost-3).
      // Only one cost-3 card is readily available; pair it with a cost-1 Mantis Blades.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [hanako],
          eddies: hanako.cost,
          deck: [welcomeToNightCityRetailSwordwiseHuscle, welcomeToNightCityRetailMantisBlades],
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {},
        { preserveDeckOrder: true },
      );
      engine.playCard(hanako);
      // Neither cost 3 nor cost 1 equals 2 -> nothing added to hand from the search.
      const hand = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(hand).not.toContain(welcomeToNightCityRetailSwordwiseHuscle.id);
      expect(hand).not.toContain(welcomeToNightCityRetailMantisBlades.id);
    });
  });
});
