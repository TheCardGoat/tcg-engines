import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCardPlayable,
  expectPendingChoice,
  expectCardsToMove,
  expectCardToMoveDestination,
  expectTargetChoice,
  expectEligibleTargets,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerPlacideVoodooSentinel,
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";

const placide = spoilerPlacideVoodooSentinel;
const program = alphaRebootOptics; // A Program card for the discard option
const rivalUnit = alphaRuthlessLowlife; // A Unit for the rival's field
const otherRivalUnit = alphaSwordwiseHuscle; // Second valid Unit to prove the effect chooses one

function discardProgramAndBottomDeckRivalUnit(engine: CyberpunkTestEngine) {
  engine.resolveCardToMove(program);

  const targetChoice = engine.getState().G.turnMetadata.pendingChoice;
  expect(targetChoice).toBeDefined();
  expect(targetChoice!.type).toBe("chooseTarget");
  if (!targetChoice || targetChoice.type !== "chooseTarget") {
    throw new Error("Expected chooseTarget");
  }
  expect(targetChoice!.payload.type).toBe("effectTarget");

  engine.resolveEffectTarget(rivalUnit);
}

describe("Placide - Voodoo Sentinel", () => {
  describe("UI prompt", () => {
    it("shows the unit as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [placide],
        eddies: placide.cost,
      });
      expectCardPlayable(engine, placide);
    });

    it("presents program discard choices after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [placide, program],
          eddies: placide.cost,
          field: [{ card: rivalUnit, spent: false }],
        },
        {
          field: [{ card: otherRivalUnit, spent: false }],
        },
      );
      engine.playCard(placide);
      expectPendingChoice(engine, "chooseCardToMove");
      expectCardToMoveDestination(engine, "trash");
      expectCardsToMove(engine, [program], { zone: "hand" });
    });

    it("presents a rival unit target choice after discarding the program", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [placide, program],
          eddies: placide.cost,
        },
        {
          field: [{ card: otherRivalUnit, spent: false }],
        },
      );
      engine.playCard(placide);
      engine.resolveCardToMove(program);

      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargets(engine, [otherRivalUnit], { as: P2 });
    });
  });

  // ── PLAY TRIGGER ─────────────────────────────────────────────────────

  describe("[PLAY] ifYouDo: discard a Program → bottom-deck a rival unit", () => {
    it("discards a Program from hand and bottom-decks a rival unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [placide, program],
          eddies: placide.cost,
        },
        {
          field: [{ card: rivalUnit, spent: true }],
        },
      );

      engine.playCard(placide);

      // A pending choice should be created for the optional discard
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseCardToMove");

      // Choose to discard the program
      discardProgramAndBottomDeckRivalUnit(engine);

      // Program should be in trash (discarded)
      const programCard = engine.getCard(program, "trash", P1);
      expect(programCard.zone).toBe("trash");

      // Rival unit should now be at the bottom of P2's deck
      const p2Deck = engine.getCardsInZone("deck", P2);
      const rivalInDeck = p2Deck.find((c) => c.definitionId === rivalUnit.id);
      expect(rivalInDeck).toBeDefined();

      // Rival unit should no longer be on the field
      const p2Field = engine.getCardsInZone("field", P2);
      const rivalOnField = p2Field.find((c) => c.definitionId === rivalUnit.id);
      expect(rivalOnField).toBeUndefined();
    });

    it("can opt out of discarding (rival unit stays on field)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [placide, program],
          eddies: placide.cost,
        },
        {
          field: [{ card: rivalUnit, spent: true }],
        },
      );

      engine.playCard(placide);

      // Decline the optional discard
      engine.resolveCardToMove(undefined, { pass: true });

      // Program should still be in hand
      const programCard = engine.getCard(program, "hand", P1);
      expect(programCard.zone).toBe("hand");

      // Rival unit should still be on the field
      const p2Field = engine.getCardsInZone("field", P2);
      const rivalOnField = p2Field.find((c) => c.definitionId === rivalUnit.id);
      expect(rivalOnField).toBeDefined();
    });

    it("no Programs in hand: ability is skipped (no pending choice)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [placide],
          eddies: placide.cost,
          deck: 0,
        },
        {
          field: [{ card: rivalUnit, spent: true }],
        },
      );

      engine.playCard(placide);

      // No pending choice — the optional discard had no valid targets
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeUndefined();

      // Rival unit should remain on field since the ifYouDo did not fire
      const p2Field = engine.getCardsInZone("field", P2);
      const rivalOnField = p2Field.find((c) => c.definitionId === rivalUnit.id);
      expect(rivalOnField).toBeDefined();
    });

    it("rival unit goes to bottom of rival's deck (not top)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [placide, program],
          eddies: placide.cost,
        },
        {
          field: [{ card: rivalUnit, spent: true }],
          deck: 10,
        },
      );

      const p2DeckBefore = engine.getCardsInZone("deck", P2);
      const deckSizeBefore = p2DeckBefore.length;

      engine.playCard(placide);
      discardProgramAndBottomDeckRivalUnit(engine);

      const p2DeckAfter = engine.getCardsInZone("deck", P2);
      // Deck grew by 1 (the rival unit was added)
      expect(p2DeckAfter.length).toBe(deckSizeBefore + 1);

      // The last card in the deck should be the rival unit (bottom-decked)
      const lastCard = p2DeckAfter[p2DeckAfter.length - 1];
      expect(lastCard!.definitionId).toBe(rivalUnit.id);
    });

    it("chooses one rival unit to bottom-deck when multiple are eligible", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [placide, program],
          eddies: placide.cost,
        },
        {
          field: [
            { card: rivalUnit, spent: true },
            { card: otherRivalUnit, spent: false },
          ],
          deck: 10,
        },
      );

      engine.playCard(placide);
      engine.resolveCardToMove(program);

      const targetChoice = engine.getState().G.turnMetadata.pendingChoice;
      expect(targetChoice?.type).toBe("chooseTarget");
      if (!targetChoice || targetChoice.type !== "chooseTarget") {
        throw new Error("Expected chooseTarget");
      }
      expect(targetChoice?.payload.type).toBe("effectTarget");
      expect(targetChoice?.payload.eligibleIds).toHaveLength(2);

      engine.resolveEffectTarget(otherRivalUnit);

      expect(engine.getCard(otherRivalUnit, "deck", P2).zone).toBe("deck");
      expect(engine.getCard(rivalUnit, "field", P2).zone).toBe("field");
    });
  });

  // ── ATTACK TRIGGER ────────────────────────────────────────────────────

  describe("[ATTACK] ifYouDo: discard a Program → bottom-deck a rival unit", () => {
    it("discards a Program and bottom-decks a rival unit on attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          // Placide is pre-placed on field (not summoning sick)
          field: [{ card: placide, spent: false }],
          hand: [program],
        },
        {
          field: [{ card: rivalUnit, spent: true }],
        },
      );

      engine.attackRival(placide);

      // Pending choice for the optional discard
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseCardToMove");

      // Choose to discard the program
      discardProgramAndBottomDeckRivalUnit(engine);

      // Program should be in trash
      const programCard = engine.getCard(program, "trash", P1);
      expect(programCard.zone).toBe("trash");

      // Rival unit should be bottom-decked
      const p2Field = engine.getCardsInZone("field", P2);
      const rivalOnField = p2Field.find((c) => c.definitionId === rivalUnit.id);
      expect(rivalOnField).toBeUndefined();

      const p2Deck = engine.getCardsInZone("deck", P2);
      const rivalInDeck = p2Deck.find((c) => c.definitionId === rivalUnit.id);
      expect(rivalInDeck).toBeDefined();
    });

    it("can opt out during attack trigger", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: placide, spent: false }],
          hand: [program],
        },
        {
          field: [{ card: rivalUnit, spent: true }],
        },
      );

      engine.attackRival(placide);

      // Decline the optional discard
      engine.resolveCardToMove(undefined, { pass: true });

      // Program still in hand
      const programCard = engine.getCard(program, "hand", P1);
      expect(programCard.zone).toBe("hand");

      // Rival unit still on the field
      const p2Field = engine.getCardsInZone("field", P2);
      const rivalOnField = p2Field.find((c) => c.definitionId === rivalUnit.id);
      expect(rivalOnField).toBeDefined();
    });

    it("works with Placide attacking a spent rival unit (unit fight)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: placide, spent: false }],
          hand: [program],
        },
        {
          field: [{ card: rivalUnit, spent: true }],
        },
      );

      // Attack the rival unit directly (not go to rival)
      engine.attackUnit(placide, rivalUnit);

      // Pending choice should still appear for the attack trigger
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeDefined();
      expect(choice!.type).toBe("chooseCardToMove");

      // Choose to discard the program
      discardProgramAndBottomDeckRivalUnit(engine);

      // Program should be in trash
      const programCard = engine.getCard(program, "trash", P1);
      expect(programCard.zone).toBe("trash");

      // Rival unit should be bottom-decked (removed from field by the ability)
      const p2Field = engine.getCardsInZone("field", P2);
      const rivalOnField = p2Field.find((c) => c.definitionId === rivalUnit.id);
      expect(rivalOnField).toBeUndefined();
    });

    it("action log shows the card moved events", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: placide, spent: false }],
          hand: [program],
        },
        {
          field: [{ card: rivalUnit, spent: true }],
        },
      );

      engine.attackRival(placide);
      discardProgramAndBottomDeckRivalUnit(engine);

      // There should be cardMoved events for the discard and the bottom-deck
      const moveEvents = engine.getEvents("cardMoved");
      const discardEvent = moveEvents.find(
        (e: any) => e.toZone === "trash" && e.fromZone === "hand",
      );
      expect(discardEvent).toBeDefined();

      const bottomDeckEvent = moveEvents.find(
        (e: any) => e.toZone === "deck" && e.fromZone === "field",
      );
      expect(bottomDeckEvent).toBeDefined();
    });
  });
});
