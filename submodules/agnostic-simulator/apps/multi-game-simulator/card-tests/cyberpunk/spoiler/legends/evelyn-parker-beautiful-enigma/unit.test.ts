import { describe, it, expect } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCallableLegend,
} from "@cyberpunk-engine/testing/index.ts";
import {
  spoilerEvelynParkerBeautifulEnigma,
  spoilerAfterpartyAtLizzieS,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const evelyn = spoilerEvelynParkerBeautifulEnigma;
const braindanceProgram = spoilerAfterpartyAtLizzieS; // Braindance classification
const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d8" as const, faceValue: 1 },
  { dieType: "d10" as const, faceValue: 1 },
];

describe("Evelyn Parker - Beautiful Enigma", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, evelyn);
    });

    it("has no pending choice after calling (effect auto-applies)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          legendArea: [evelyn],
          eddies: 2,
          gigArea: p1LeadGigs,
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 3 }],
        },
      );
      engine.callLegend(evelyn);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });
  });

  // ── CALL: Decrease a rival Gig's value by 3 ─────────────────────────

  describe(`CALL Decrease a rival Gig's value by 3.`, () => {
    it("decreases a rival gig's value by 3 when called", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 2, gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d6", faceValue: 5 }] },
      );

      engine.callLegend(evelyn);

      expect(engine.getGigValue(P2)).toBe(2); // 5 - 3 = 2
    });

    it("clamps the gig value to a minimum of 1", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 2, gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d6", faceValue: 2 }] },
      );

      engine.callLegend(evelyn);

      expect(engine.getGigValue(P2)).toBe(1); // 2 - 3 = -1, clamped to 1
    });

    it("decreases a d4 gig correctly", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 2, gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d4", faceValue: 4 }] },
      );

      engine.callLegend(evelyn);

      expect(engine.getGigValue(P2)).toBe(1); // 4 - 3 = 1
    });

    it("emits a gigValueChanged event", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 2, gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d6", faceValue: 6 }] },
      );

      engine.callLegend(evelyn);

      const gigEvents = engine.getEvents("gigValueChanged");
      expect(gigEvents.length).toBeGreaterThan(0);
      const last = gigEvents[gigEvents.length - 1] as {
        type: "gigValueChanged";
        newValue: number;
      };
      expect(last.newValue).toBe(3); // 6 - 3 = 3
    });

    it("costs 1 eddie to call", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 2, gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d6", faceValue: 5 }] },
      );

      engine.callLegend(evelyn);

      const state = engine.getState();
      expect(state.G.players["p1"]!.eddies).toBe(1);
    });

    it("fails to call with insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 0, gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d6", faceValue: 5 }] },
      );
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.callLegend(evelyn));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("flips Evelyn face-up when called", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 2, gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d6", faceValue: 5 }] },
      );

      engine.callLegend(evelyn);

      expect(engine.getCard(evelyn).meta.faceDown).toBe(false);
    });

    it("emits action log for the call", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 2, gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d6", faceValue: 5 }] },
      );

      engine.callLegend(evelyn);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.callLegend");
      expect(log!.params.legendName).toBe(evelyn.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(evelyn.displayName);
    });

    it("decreases only one rival gig when multiple are present", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { legendArea: [evelyn], eddies: 2, gigArea: p1LeadGigs },
        {
          gigArea: [
            { dieType: "d6", faceValue: 6 },
            { dieType: "d8", faceValue: 4 },
          ],
        },
      );

      engine.callLegend(evelyn);

      const dice = engine.getGigDice(P2);
      expect(dice[0]!.faceValue).toBe(3); // 6 - 3 = 3
      expect(dice[1]!.faceValue).toBe(4); // unchanged
    });
  });

  // ── [Spend Icon]: Search top 3 for Braindance Program ───────────────

  describe(`[Spend Icon]: Search the top 3 cards of your deck for up to 1 Braindance Program. Add it to your hand. Bottom-deck the rest.`, () => {
    it("finds a Braindance program in the top 3 and adds it to hand", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: [braindanceProgram],
      });

      engine.judgeMoveCardToTopOfDeck(braindanceProgram);

      const handBefore = engine.getHandCount(P1);

      engine.activateAbility(evelyn, 1);
      engine.resolveSearchDeck([braindanceProgram]);

      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("spends Evelyn when the ability is activated", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: 20,
      });

      engine.activateAbility(evelyn, 1);

      expect(engine.getCard(evelyn).meta.spent).toBe(true);
    });

    it("cannot activate when Evelyn is already spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: 20,
      });

      engine.judgeSpendCard(evelyn);

      const failure = engine.expectFailure(() => engine.activateAbility(evelyn, 1));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("cannot activate when Evelyn is face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [evelyn], // face-down by default
        deck: 20,
      });

      const failure = engine.expectFailure(() => engine.activateAbility(evelyn, 1));
      expect(failure.errorCode).toBe("LEGEND_FACE_DOWN");
    });

    it("allows selecting 0 cards (up to 1 is optional)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.activateAbility(evelyn, 1);
      engine.resolveSearchDeck([]);

      // No cards added to hand
      expect(engine.getHandCount(P1)).toBe(handBefore);
    });

    it("bottom-decks the remaining cards after search", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: 20,
      });

      engine.activateAbility(evelyn, 1);

      const state = engine.getState();
      const deckSizeBefore = state.G.players["p1"]!.zones.deck.length;

      // Select 0 cards — all 3 go to bottom
      engine.resolveSearchDeck([]);

      const deckSizeAfter = engine.getState().G.players["p1"]!.zones.deck.length;
      // All 3 looked-at cards should be back in the deck (at the bottom)
      expect(deckSizeAfter).toBe(deckSizeBefore);
    });

    it("emits a searchPerformed event", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: 20,
      });

      engine.activateAbility(evelyn, 1);
      engine.resolveSearchDeck([]);

      const searchEvents = engine.getEvents("searchPerformed");
      expect(searchEvents.length).toBeGreaterThan(0);
    });

    it("emits an action log for the activated ability", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: 20,
      });

      engine.activateAbility(evelyn, 1);

      // The activateAbility action log should have been emitted
      const logs = engine.getEvents("actionLog");
      const activateLog = logs.find((e: any) => e.messageKey === "move.activateAbility") as any;
      expect(activateLog).toBeDefined();
      expect(activateLog.params.cardName).toBe(evelyn.displayName);

      const text = formatActionLog(activateLog, enMessages);
      expect(text).toContain(evelyn.displayName);
    });

    it("emits an action log for the search resolution", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: 20,
      });

      engine.activateAbility(evelyn, 1);
      engine.resolveSearchDeck([]);

      const logs = engine.getEvents("actionLog");
      const searchLog = logs.find((e: any) => e.messageKey === "move.resolveSearchDeck") as any;
      expect(searchLog).toBeDefined();
      expect(searchLog.category).toBe("search");

      const text = formatActionLog(searchLog, enMessages);
      expect(text).toContain("top");
    });

    it("emits a reveal log with category and cardIds", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: 20,
      });

      engine.activateAbility(evelyn, 1);

      const logs = engine.getEvents("actionLog");
      const revealLog = logs.find((e: any) => e.messageKey === "move.searchDeck.reveal") as any;
      expect(revealLog).toBeDefined();
      expect(revealLog.category).toBe("search");
      expect(revealLog.cardIds).toBeDefined();
      expect(revealLog.cardIds.length).toBe(3);

      const text = formatActionLog(revealLog, enMessages);
      expect(text).toContain("top 3");
    });

    it("includes selected cardIds in the resolution log", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: evelyn, faceDown: false }],
        deck: [braindanceProgram],
      });

      engine.judgeMoveCardToTopOfDeck(braindanceProgram);
      engine.activateAbility(evelyn, 1);
      engine.resolveSearchDeck([braindanceProgram]);

      const logs = engine.getEvents("actionLog");
      const searchLog = logs.find((e: any) => e.messageKey === "move.resolveSearchDeck") as any;
      expect(searchLog).toBeDefined();
      expect(searchLog.category).toBe("search");
      expect(searchLog.cardIds).toBeDefined();
      expect(searchLog.cardIds.length).toBe(1);
    });
  });
});
