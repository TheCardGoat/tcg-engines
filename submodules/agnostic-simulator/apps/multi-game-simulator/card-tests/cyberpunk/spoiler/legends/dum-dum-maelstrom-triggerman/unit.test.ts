import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  expectCallableLegend,
  expectPendingChoice,
  expectCardToMoveCount,
  expectCardToMoveDestination,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaTBugAmateurPhilosopher,
  spoilerDumDumMaelstromTriggerman,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const legend = spoilerDumDumMaelstromTriggerman; // legend, call trigger
const tBug = alphaTBugAmateurPhilosopher;
const kiroshi = alphaKiroshiOptics;
const mantis = alphaMantisBlades;

function setupWithFriendlyGear() {
  return CyberpunkTestEngine.createWithFixture({
    legendArea: [legend],
    field: [{ card: tBug, attachedGears: [kiroshi, mantis] }],
    hand: [],
    eddies: 2,
    deck: 20,
  });
}

describe("Dum Dum - Maelstrom Triggerman", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: legend, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, legend);
    });

    it("presents friendly gear as targets after calling", () => {
      const engine = setupWithFriendlyGear();
      engine.callLegend(legend);
      expectPendingChoice(engine, "chooseCardToMove");
      expectCardToMoveDestination(engine, "trash");
      expectCardToMoveCount(engine, 2);
    });
  });

  describe(`CALL You may defeat a friendly Gear. If you do, draw 4 cards. Otherwise, draw 1 card.`, () => {
    it("calling flips Dum Dum face-up", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [legend],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(legend);

      expect(engine.getCard(legend).meta.faceDown).toBe(false);
    });

    it("costs 1 eddie to call", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [legend],
        eddies: 4,
        deck: 20,
      });

      engine.callLegend(legend);

      expect(engine.getEddies(P1)).toBe(3); // 4 - 1
    });

    it("fails to call with insufficient eddies", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [legend],
        eddies: 0,
        deck: 20,
      });
      engine.spendAllLegends();

      const failure = engine.expectFailure(() => engine.callLegend(legend));
      expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    });

    it("draws 1 card when no friendly gear exists", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [legend],
        hand: [],
        eddies: 2,
        deck: 20,
      });

      const handBefore = engine.getHandCount(P1);

      engine.callLegend(legend);

      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("prompts to choose a friendly Gear when one can be defeated", () => {
      const engine = setupWithFriendlyGear();

      engine.callLegend(legend);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseCardToMove");
      if (!choice || choice.type !== "chooseCardToMove") {
        throw new Error("Expected chooseCardToMove pending choice");
      }
      const cardIndex = engine.getState().G.cardIndex;
      const eligibleNames = choice.payload.cardIds.map((id) => cardIndex[id]?.definitionId);
      expect(eligibleNames).toContain(kiroshi.id);
      expect(eligibleNames).toContain(mantis.id);
      expect(choice.payload.destination).toBe("trash");
    });

    it("defeating a friendly Gear draws 4 cards and detaches the Gear", () => {
      const engine = setupWithFriendlyGear();

      engine.callLegend(legend);
      engine.resolveCardToMove(kiroshi);

      expect(engine.getHandCount(P1)).toBe(4);
      expect(engine.getCard(kiroshi).zone).toBe("trash");
      expect(engine.getCard(kiroshi).meta.attachedToId).toBeNull();
      expect(engine.getCard(tBug).meta.attachedGearIds).not.toContain(
        engine.getCard(kiroshi).instanceId,
      );
    });

    it("declining to defeat a Gear draws 1 card and leaves Gear attached", () => {
      const engine = setupWithFriendlyGear();

      engine.callLegend(legend);
      engine.resolveCardToMove(undefined, { pass: true });

      expect(engine.getHandCount(P1)).toBe(1);
      expect(engine.getCard(kiroshi).zone).toBe("field");
      expect(engine.getCard(kiroshi).meta.attachedToId).toBe(engine.getCard(tBug).instanceId);
    });

    it("Dum Dum remains in legend area after being called", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [legend],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(legend);

      const legendArea = engine.getCardsInZone("legendArea", P1);
      expect(legendArea.some((c) => c.definitionId === legend.id)).toBe(true);
    });

    it("emits action log for the call", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [legend],
        eddies: 2,
        deck: 20,
      });

      engine.callLegend(legend);

      const logs = engine.getEvents("actionLog");
      const callLog = logs.find((e: any) => e.messageKey === "move.callLegend") as any;
      expect(callLog).toBeDefined();
      expect(callLog.params.legendName).toBe(legend.displayName);

      const text = formatActionLog(callLog, enMessages);
      expect(text).toContain(legend.displayName);
    });

    it("cannot call a face-up (already called) legend", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [legend],
        eddies: 4,
        deck: 20,
      });

      engine.callLegend(legend);

      // Try to call again — should fail since already face-up
      const failure = engine.expectFailure(() => engine.callLegend(legend));
      expect(failure.errorCode).toBe("ALREADY_CALLED");
    });
  });
});
