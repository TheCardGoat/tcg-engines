import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2 } from "@cyberpunk-engine/testing/index.ts";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFoolOnTheHill,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailSketchyRipper,
} from "@tcg/cyberpunk-cards";

const fool = welcomeToNightCityRetailFoolOnTheHill; // program, cost 2, sell tag
const topA = welcomeToNightCityRetailCorpoSecurity;
const topB = welcomeToNightCityRetailFieldOperator;
const next = welcomeToNightCityRetailRidingNomad;

describe("Fool on the Hill", () => {
  describe("[PLAY] Reveal top 2; Rival chooses hand or trash; if trash, draw 2", () => {
    it("reveals the top 2 and asks the Rival (not the caster) to pick the destination", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [fool], eddies: fool.cost, deck: [topA, topB, next] },
        {},
        { preserveDeckOrder: true },
      );
      engine.playCard(fool, { as: P1 });

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("revealDestination");
      // The Rival (P2) is the chooser, never the caster.
      expect(choice?.chooserId).toBe(P2);
      // The two revealed cards are exactly the top 2 of the deck.
      expect(
        choice!.payload.revealedCardIds.map(
          (id) => engine.getState().G.cardIndex[id]!.definitionId,
        ),
      ).toEqual([topA.id, topB.id]);
    });

    it("HAND: the Rival adds both revealed cards to the caster's hand with NO bonus draw", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [fool], eddies: fool.cost, deck: [topA, topB, next] },
        {},
        { preserveDeckOrder: true },
      );

      const handBefore = engine.getCardsInZone("hand", P1).length;
      const deckBefore = engine.getCardsInZone("deck", P1).length;

      engine.playCard(fool, { as: P1 });
      engine.resolveRevealDestination("hand", { as: P2 });

      // Both revealed cards moved deck → hand; the 3rd card is now on top.
      const handDefs = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(handDefs).toContain(topA.id);
      expect(handDefs).toContain(topB.id);
      // Played the program (-1) then gained 2 revealed cards (+2): net +1.
      expect(engine.getCardsInZone("hand", P1).length).toBe(handBefore + 1);
      // Two cards left the top of the deck.
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 2);
      expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(next.id);
      // The program itself went to trash; the revealed cards did NOT.
      const trashDefs = engine.getCardsInZone("trash", P1).map((c) => c.definitionId);
      expect(trashDefs).toContain(fool.id);
      expect(trashDefs).not.toContain(topA.id);
      expect(trashDefs).not.toContain(topB.id);
      // No bonus draw — the choice is fully resolved.
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });

    it("TRASH: the Rival trashes both revealed cards and the caster draws 2", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [fool],
          eddies: fool.cost,
          deck: [topA, topB, next, welcomeToNightCityRetailSketchyRipper],
        },
        {},
        { preserveDeckOrder: true },
      );

      const handBefore = engine.getCardsInZone("hand", P1).length;
      const deckBefore = engine.getCardsInZone("deck", P1).length;

      engine.playCard(fool, { as: P1 });
      engine.resolveRevealDestination("trash", { as: P2 });

      // Both revealed cards went to trash (along with the resolved program).
      const trashDefs = engine.getCardsInZone("trash", P1).map((c) => c.definitionId);
      expect(trashDefs).toContain(fool.id);
      expect(trashDefs).toContain(topA.id);
      expect(trashDefs).toContain(topB.id);
      // Bonus draw: the next two deck cards (Riding Nomad, Sketchy Ripper) are now in hand.
      const handDefs = engine.getCardsInZone("hand", P1).map((c) => c.definitionId);
      expect(handDefs).toContain(next.id);
      expect(handDefs).toContain(welcomeToNightCityRetailSketchyRipper.id);
      // Played program (-1), revealed cards trashed (not added), drew 2 (+2): net +1.
      expect(engine.getCardsInZone("hand", P1).length).toBe(handBefore + 1);
      // All four deck cards were consumed (2 trashed + 2 drawn).
      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 4);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });
  });
});
