import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1 } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailMoxInciters,
} from "@tcg/cyberpunk-cards";

const ripper = welcomeToNightCityRetailSketchyRipper; // unit, cost 2, power 0
const gear = welcomeToNightCityRetailKiroshiOptics; // a Gear
const unit = welcomeToNightCityRetailSwordwiseHuscle; // a Unit

describe("Sketchy Ripper", () => {
  describe("{ATTACK} Search top 3, reveal a Gear to hand, bottom-deck the rest", () => {
    it("steals 0 Gigs on a direct attack (power 0 rule) — only opens the search", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: ripper, spent: false, hasLag: false }],
          deck: [unit, gear, welcomeToNightCityRetailMoxInciters],
        },
        { gigArea: [{ dieType: "d4", faceValue: 1 }] },
        { preserveDeckOrder: true },
      );
      const p2GigsBefore = engine.getGigCount("p2");
      engine.attackRival(ripper, { as: P1 });
      // Power 0 -> no Gigs stolen. A scry (search) prompt opens instead.
      expect(engine.getPrompt(P1).choice?.type).toBe("scry");
      const p2GigsAfter = engine.getGigCount("p2");
      expect(p2GigsAfter).toBe(p2GigsBefore);
    });

    it("the search reveals 3 and the hand destination takes at most 1 (the Gear)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: ripper, spent: false, hasLag: false }],
          deck: [unit, gear, welcomeToNightCityRetailMoxInciters],
        },
        { gigArea: [{ dieType: "d4", faceValue: 1 }] },
        { preserveDeckOrder: true },
      );
      engine.attackRival(ripper, { as: P1 });
      const choice = engine.getPrompt(P1).choice;
      if (!choice || choice.type !== "scry") throw new Error("Expected scry prompt");
      // The hand destination takes at most 1 card (the Gear), and at least 0.
      expect(choice.payload.destinations[0]?.max).toBe(1);
      expect(choice.payload.destinations[0]?.min).toBe(0);
      // Revealed exactly 3.
      expect(choice.payload.revealedCardIds).toHaveLength(3);

      // Taking the Gear to hand leaves the Unit and Program bottom-decked
      // (still in the deck) — the search does not hand non-Gear cards.
      const gearId = engine.getCard(gear, "deck", P1).instanceId;
      engine.executeMove(
        "resolveScry",
        { args: { destinations: [{ zone: "hand", cardIds: [gearId] }] } },
        P1,
      );
      const deckDefs = engine.getCardsInZone("deck", P1).map((c) => c.definitionId);
      expect(deckDefs).toContain(unit.id);
      expect(deckDefs).toContain(welcomeToNightCityRetailMoxInciters.id);
    });

    it("adds the chosen Gear to hand and bottom-decks the rest", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: ripper, spent: false, hasLag: false }],
          deck: [unit, gear, welcomeToNightCityRetailMoxInciters],
        },
        { gigArea: [{ dieType: "d4", faceValue: 1 }] },
        { preserveDeckOrder: true },
      );
      engine.attackRival(ripper, { as: P1 });
      const gearId = engine.getCard(gear, "deck", P1).instanceId;
      engine.executeMove(
        "resolveScry",
        { args: { destinations: [{ zone: "hand", cardIds: [gearId] }] } },
        P1,
      );
      expect(engine.getCardsInZone("hand", P1).map((c) => c.definitionId)).toContain(gear.id);
      // The other revealed cards are bottom-decked (still in the deck).
      const deck = engine.getCardsInZone("deck", P1).map((c) => c.definitionId);
      expect(deck).toContain(unit.id);
    });

    it("allows taking NONE (min 0) when no Gear is in the top 3", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: ripper, spent: false, hasLag: false }],
          deck: [
            unit,
            welcomeToNightCityRetailMoxInciters,
            welcomeToNightCityRetailSwordwiseHuscle,
          ],
        },
        { gigArea: [{ dieType: "d4", faceValue: 1 }] },
        { preserveDeckOrder: true },
      );
      engine.attackRival(ripper, { as: P1 });
      const choice = engine.getPrompt(P1).choice;
      if (!choice || choice.type !== "scry") throw new Error("Expected scry prompt");
      // No Gear -> min 0 lets the player take none.
      expect(choice.payload.destinations[0]?.min).toBe(0);
      // Resolve taking nothing.
      expect(
        engine.executeMove(
          "resolveScry",
          { args: { destinations: [{ zone: "hand", cardIds: [] }] } },
          P1,
        ),
      ).toMatchObject({ success: true });
      // No card added to hand from the search.
      const handDefs = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(handDefs).not.toContain(welcomeToNightCityRetailMoxInciters.id);
    });
  });
});
