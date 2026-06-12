import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  expectCallableLegend,
  expectPendingChoice,
  expectSearchDeckChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaViktorVektorSitDownAndRelax,
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaSandevistan,
  alphaDyingNightVSPistol,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";
import { getDefinitionFor } from "@cyberpunk-engine/state/lookups.ts";

const viktor = alphaViktorVektorSitDownAndRelax;

// Gear costing ≤ 2: Kiroshi Optics (1), Mantis Blades (1), Mandibular Upgrade (1),
//                    Dying Night (2), Satori (2)
// Gear costing > 2: Sandevistan (3)

describe("Viktor Vektor - Sit Down and Relax", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: viktor, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, viktor);
    });

    it("presents a searchDeck choice with revealed gear after calling", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });
      engine.judgeMoveCardToTopOfDeck(alphaKiroshiOptics);
      engine.judgeMoveCardToTopOfDeck(alphaMantisBlades);

      engine.callLegend(viktor);

      const choice = expectPendingChoice(engine, "searchDeck");
      expectSearchDeckChoice(engine, {
        lookCount: 5,
        reveal: true,
        select: { kind: "upTo", max: 2 },
      });
      expect(choice.payload.target).toMatchObject({ cardTypes: ["gear"], maxCost: 2 });
      expect(choice.payload.revealedCardIds.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe(`CALL Search the top 5 cards of your deck for up to 2 gear that costs 2 or less each. Reveal them and add them to your hand. (Place the other cards on the bottom of your deck in a random order.)`, () => {
    it("finds gear in the top 5 and adds it to hand when called", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.judgeMoveCardToTopOfDeck(alphaKiroshiOptics);

      const handBefore = engine.getHandCount(P1);

      engine.callLegend(viktor);
      engine.resolveSearchDeck([alphaKiroshiOptics]);

      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("can select up to 2 gear cards", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.judgeMoveCardToTopOfDeck(alphaKiroshiOptics);
      engine.judgeMoveCardToTopOfDeck(alphaMantisBlades);

      const handBefore = engine.getHandCount(P1);

      engine.callLegend(viktor);
      engine.resolveSearchDeck([alphaKiroshiOptics, alphaMantisBlades]);

      expect(engine.getHandCount(P1)).toBe(handBefore + 2);
    });

    it("allows selecting 0 cards (up to 2 is optional)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.callLegend(viktor);
      engine.resolveSearchDeck([]);

      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("cannot select more than 2 cards", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(viktor);

      // Get 3 revealed card IDs from the pending choice
      const state = engine.getState();
      const choice = state.G.turnMetadata.pendingChoice as any;
      const revealedIds = choice.payload.revealedCardIds as string[];

      const result = engine.executeMove(
        "resolveSearchDeck",
        { args: { selectedCardIds: revealedIds.slice(0, 3) } },
        P1,
      );
      expect(result.success).toBe(false);
      expect((result as any).errorCode).toBe("TOO_MANY_SELECTED");
    });

    it("cannot select gear that costs more than 2", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: [alphaSandevistan],
      });

      engine.judgeMoveCardToTopOfDeck(alphaSandevistan);

      engine.callLegend(viktor);

      const failure = engine.expectFailure(() => engine.resolveSearchDeck([alphaSandevistan]));
      expect(failure.errorCode).toBe("INVALID_COST");
    });

    it("cannot select non-gear cards from the search window", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      // Place a known non-gear card at the top of the deck
      engine.judgeMoveCardToTopOfDeck(alphaSwordwiseHuscle);

      engine.callLegend(viktor);

      // Find the Swordwise Huscle instance in the revealed cards
      const state = engine.getState();
      const choice = state.G.turnMetadata.pendingChoice as any;
      const revealedIds = choice.payload.revealedCardIds as string[];
      const huscleId = revealedIds.find((id: string) =>
        state.G.cardIndex[id]
          ? getDefinitionFor(state.G, id).id === alphaSwordwiseHuscle.id
          : false,
      );

      expect(huscleId).toBeDefined();

      const result = engine.executeMove(
        "resolveSearchDeck",
        { args: { selectedCardIds: [huscleId] } },
        P1,
      );
      expect(result.success).toBe(false);
      expect((result as any).errorCode).toBe("INVALID_CARD_TYPE");
    });

    it("bottom-decks the remaining cards after search", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(viktor);

      const state = engine.getState();
      const deckSizeBefore = state.G.players["p1"]!.zones.deck.length;

      engine.resolveSearchDeck([]);

      const deckSizeAfter = engine.getState().G.players["p1"]!.zones.deck.length;
      // All 5 looked-at cards should be back in the deck (at the bottom)
      expect(deckSizeAfter).toBe(deckSizeBefore);
    });

    it("flips Viktor face-up when called", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(viktor);

      expect(engine.getCard(viktor).meta.faceDown).toBe(false);
    });

    it("costs 1 eddie to call", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(viktor);

      const state = engine.getState();
      expect(state.G.players["p1"]!.eddies).toBe(1);
    });

    it("fails to call with insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 0,
        deck: 20,
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.callLegend(viktor));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("emits a searchPerformed event", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(viktor);
      engine.resolveSearchDeck([]);

      const searchEvents = engine.getEvents("searchPerformed");
      expect(searchEvents.length).toBeGreaterThan(0);
    });

    it("emits a reveal log with card IDs for the top 5", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(viktor);

      const logs = engine.getEvents("actionLog");
      const revealLog = logs.find((e: any) => e.messageKey === "move.searchDeck.reveal") as any;
      expect(revealLog).toBeDefined();
      expect(revealLog.category).toBe("search");
      expect(revealLog.cardIds).toBeDefined();
      expect(revealLog.cardIds.length).toBe(5);

      const text = formatActionLog(revealLog, enMessages);
      expect(text).toContain("top 5");
    });

    it("emits an action log for the call", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(viktor);

      const logs = engine.getEvents("actionLog");
      const callLog = logs.find((e: any) => e.messageKey === "move.callLegend") as any;
      expect(callLog).toBeDefined();
      expect(callLog.params.legendName).toBe(viktor.displayName);

      const text = formatActionLog(callLog, enMessages);
      expect(text).toContain(viktor.displayName);
    });

    it("emits an action log for the search resolution", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.judgeMoveCardToTopOfDeck(alphaKiroshiOptics);

      engine.callLegend(viktor);
      engine.resolveSearchDeck([alphaKiroshiOptics]);

      const logs = engine.getEvents("actionLog");
      const searchLog = logs.find((e: any) => e.messageKey === "move.resolveSearchDeck") as any;
      expect(searchLog).toBeDefined();
      expect(searchLog.category).toBe("search");
      expect(searchLog.cardIds).toBeDefined();
      expect(searchLog.cardIds.length).toBe(1);

      const text = formatActionLog(searchLog, enMessages);
      expect(text).toContain("top");
    });

    it("can select gear costing exactly 2", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [viktor],
        eddies: 2,
        deck: 20,
      });

      engine.judgeMoveCardToTopOfDeck(alphaDyingNightVSPistol);

      const handBefore = engine.getHandCount(P1);

      engine.callLegend(viktor);
      engine.resolveSearchDeck([alphaDyingNightVSPistol]);

      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });
  });
});
