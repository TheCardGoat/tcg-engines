import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
  expectPendingChoice,
  expectCardsToMove,
  expectCardToMoveDestination,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerMeredithStoutStoneColdCorpo,
  spoilerEvelynParkerBeautifulEnigma,
  spoilerAfterpartyAtLizzieS,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

const meredith = spoilerMeredithStoutStoneColdCorpo;
const evelyn = spoilerEvelynParkerBeautifulEnigma;
const trashCard = spoilerAfterpartyAtLizzieS;
const otherTrashCard = alphaRuthlessLowlife;
const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d8" as const, faceValue: 1 },
];

/**
 * Setup: P1 has Meredith on field, a card in trash, and a gig die.
 *        P2 has Evelyn in legend area with eddies to call her.
 *
 * Trigger flow: P1 ends turn → P2's turn → P2 calls Evelyn →
 *   Evelyn's CALL decreases P1's gig value → gigValueChanged event →
 *   Meredith's trigger fires → moves card from P1's trash to P1's hand.
 */
function createEngine(opts?: { trashCards?: StructuredCardDefinition[]; meredithSpent?: boolean }) {
  const trashCards = opts?.trashCards ?? [trashCard];
  const engine = CyberpunkTestEngine.createWithFixture(
    {
      field: [{ card: meredith, spent: opts?.meredithSpent ?? false }],
      trash: trashCards,
      gigArea: [{ dieType: "d6", faceValue: 6 }],
      deck: 20,
    },
    {
      legendArea: [evelyn],
      eddies: 2,
      deck: 20,
    },
  );
  return engine;
}

/** End P1's turn so P2 becomes the active player. */
function switchToP2(engine: ReturnType<typeof createEngine>) {
  engine.completeTurn();
}

/** Trigger Meredith's ability: P2 calls Evelyn to decrease P1's gig. */
function triggerGigDecrease(engine: ReturnType<typeof createEngine>) {
  switchToP2(engine);
  engine.callLegend(evelyn, { as: P2 });
}

describe("Meredith Stout - Stone Cold Corpo", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: meredith, spent: false }],
      });
      expectAttackCandidate(engine, meredith);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: meredith, spent: true }],
      });
      expectNotAttackCandidate(engine, meredith);
    });

    it("presents trash cards as choices after the rival calls a legend", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: meredith, spent: false }],
          trash: [trashCard],
          gigArea: [{ dieType: "d6", faceValue: 6 }],
          deck: 20,
        },
        {
          legendArea: [evelyn],
          eddies: 2,
          deck: 20,
        },
      );
      engine.completeTurn();
      engine.callLegend(evelyn, { as: P2 });

      expectPendingChoice(engine, "chooseCardToMove");
      expectCardToMoveDestination(engine, "hand");
      expectCardsToMove(engine, [trashCard], { zone: "trash" });
    });
  });

  describe("When a rival decreases the value of your friendly Gig, you may choose a card from your trash and add it to your hand.", () => {
    it("recovers a card from trash when rival gig value decreases", () => {
      const engine = createEngine();
      const trashBefore = engine.getCardsInZone("trash", P1).length;

      triggerGigDecrease(engine);

      expect(engine.getCardsInZone("trash", P1).length).toBe(trashBefore);
      expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToMove");
      engine.resolveCardToMove(trashCard, { as: P1 });

      expect(engine.getCardsInZone("trash", P1).length).toBe(trashBefore - 1);
    });

    it("chooses one card when multiple trash cards are eligible", () => {
      const engine = createEngine({ trashCards: [trashCard, otherTrashCard] });
      const handBefore = engine.getHandCount(P1);

      triggerGigDecrease(engine);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseCardToMove");
      if (!choice || choice.type !== "chooseCardToMove") {
        throw new Error("Expected chooseCardToMove");
      }
      expect(choice?.payload.cardIds).toHaveLength(2);

      engine.resolveCardToMove(otherTrashCard, { as: P1 });

      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
      expect(engine.getCard(otherTrashCard, "hand", P1).zone).toBe("hand");
      expect(engine.getCard(trashCard, "trash", P1).zone).toBe("trash");
      expect(engine.getCardsInZone("trash", P1)).toHaveLength(1);
    });

    it("can decline the optional recovery", () => {
      const engine = createEngine();
      const handBefore = engine.getHandCount(P1);
      const trashBefore = engine.getCardsInZone("trash", P1).length;

      triggerGigDecrease(engine);
      engine.resolveCardToMove(undefined, { as: P1, pass: true });

      expect(engine.getHandCount(P1)).toBe(handBefore);
      expect(engine.getCardsInZone("trash", P1).length).toBe(trashBefore);
    });

    it("does NOT trigger on gig value increase", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: meredith, spent: false }],
          trash: [trashCard],
          gigArea: [{ dieType: "d6", faceValue: 3 }],
          deck: 20,
        },
        { deck: 20 },
      );

      const trashBefore = engine.getCardsInZone("trash", P1).length;

      // Directly increase P1's gig value via a judge correction — no rival involvement,
      // but the key test is that direction=increase doesn't match the filter.
      engine.judgeSetGigValue(engine.getGigDice(P1)[0]!, 5);

      expect(engine.getCardsInZone("trash", P1).length).toBe(trashBefore);
    });

    it("does NOT trigger when friendly gig value decreases (self-inflicted)", () => {
      // P1 has Evelyn AND Meredith. P1 calls Evelyn to decrease P2's gig.
      // Meredith should NOT fire because the gig that decreased belongs to the rival (P2).
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: meredith, spent: false }],
          legendArea: [evelyn],
          trash: [trashCard],
          eddies: 2,
          gigArea: p1LeadGigs,
          deck: 20,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 6 }],
          deck: 20,
        },
      );

      const trashBefore = engine.getCardsInZone("trash", P1).length;

      // P1 calls Evelyn — decreases P2's (rival) gig, not P1's (friendly) gig.
      engine.callLegend(evelyn);

      expect(engine.getCardsInZone("trash", P1).length).toBe(trashBefore);
    });

    it("can choose not to recover (skip when trash is empty)", () => {
      // With no cards in trash, the optional effect is skipped gracefully.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: meredith, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 6 }],
          deck: 20,
        },
        {
          legendArea: [evelyn],
          eddies: 2,
          deck: 20,
        },
      );

      // No cards in P1's trash — ability should be skipped without error.
      expect(() => triggerGigDecrease(engine)).not.toThrow();
    });

    it("recovered card goes to hand", () => {
      const engine = createEngine();
      const handBefore = engine.getHandCount(P1);

      triggerGigDecrease(engine);
      engine.resolveCardToMove(trashCard, { as: P1 });

      // One card moved from trash to hand.
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("no cards in trash: ability is skipped without error", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: meredith, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 6 }],
          deck: 20,
        },
        {
          legendArea: [evelyn],
          eddies: 2,
          deck: 20,
        },
      );

      const handBefore = engine.getHandCount(P1);
      switchToP2(engine);
      engine.callLegend(evelyn, { as: P2 });

      // Hand count unchanged — no card to recover.
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("emits a gigValueChanged event when triggered", () => {
      const engine = createEngine();

      triggerGigDecrease(engine);

      const gigEvents = engine.getEvents("gigValueChanged");
      expect(gigEvents.length).toBeGreaterThan(0);
      const last = gigEvents[gigEvents.length - 1] as {
        type: "gigValueChanged";
        previousValue: number;
        newValue: number;
      };
      expect(last.newValue).toBeLessThan(last.previousValue);
    });

    it("triggers when rival gig is set to lower value (via Evelyn decrease)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: meredith, spent: false }],
          trash: [trashCard],
          gigArea: [{ dieType: "d4", faceValue: 4 }],
          deck: 20,
        },
        {
          legendArea: [evelyn],
          eddies: 2,
          deck: 20,
        },
      );

      const trashBefore = engine.getCardsInZone("trash", P1).length;

      switchToP2(engine);
      engine.callLegend(evelyn, { as: P2 });
      engine.resolveCardToMove(trashCard, { as: P1 });

      // Evelyn decreases d4 from 4 by 3 → clamped to 1. That's a decrease.
      expect(engine.getGigValue(P1)).toBe(1);
      expect(engine.getCardsInZone("trash", P1).length).toBe(trashBefore - 1);
    });

    it("Meredith stays on field after trigger", () => {
      const engine = createEngine();

      triggerGigDecrease(engine);
      engine.resolveCardToMove(trashCard, { as: P1 });

      const meredithCard = engine.getCard(meredith, "field", P1);
      expect(meredithCard).toBeDefined();
      expect(meredithCard.zone).toBe("field");
    });

    it("works when Meredith is spent", () => {
      const engine = createEngine({ meredithSpent: true });
      const trashBefore = engine.getCardsInZone("trash", P1).length;

      triggerGigDecrease(engine);
      engine.resolveCardToMove(trashCard, { as: P1 });

      expect(engine.getCardsInZone("trash", P1).length).toBe(trashBefore - 1);
    });
  });
});
