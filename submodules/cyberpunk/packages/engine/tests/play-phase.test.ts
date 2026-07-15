import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";

describe("Main Phase", () => {
  // ── Sell for Eddies ────────────────────────────────────────────────

  describe("Sell for Eddies", () => {
    describe("Successful Sell", () => {
      it("moves card from hand to eddieArea", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailFloorIt],
          eddies: 0,
        });

        engine.sellCard(welcomeToNightCityRetailFloorIt);

        expect(engine.getCardsInZone("eddieArea", P1)).toHaveLength(1);
        expect(engine.getCardsInZone("eddieArea", P1)[0]!.definitionId).toBe(
          welcomeToNightCityRetailFloorIt.id,
        );
      });

      it("removes card from hand", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailSketchyRipper],
          eddies: 0,
        });

        engine.sellCard(welcomeToNightCityRetailFloorIt);

        const hand = engine.getCardsInZone("hand", P1);
        expect(hand).toHaveLength(1);
        expect(hand[0]!.definitionId).toBe(welcomeToNightCityRetailSketchyRipper.id);
      });

      it("emits cardSold event", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailFloorIt],
          eddies: 0,
        });

        engine.sellCard(welcomeToNightCityRetailFloorIt);

        const events = engine.getEvents("cardSold");
        expect(events).toHaveLength(1);
        expect(events[0]!.type).toBe("cardSold");
      });

      it("adds one available eddie", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailFloorIt],
          eddies: 0,
        });

        engine.sellCard(welcomeToNightCityRetailFloorIt);

        expect(engine.getEddies(P1)).toBe(1);
      });

      it("sold card is only worth 1 eddie per turn", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailSketchyRipper],
          eddies: 0,
        });

        // Sell the card → 1 eddie available.
        engine.sellCard(welcomeToNightCityRetailFloorIt);
        expect(engine.getEddies(P1)).toBe(1);

        // Play a card costing 1 eddie, spending the sold-card eddie.
        engine.playCard(welcomeToNightCityRetailSketchyRipper, { as: P1 });
        expect(engine.getEddies(P1)).toBe(0);

        // End the turn.
        engine.passPhase({ as: P1 });

        // After the opponent's turn, we're back to P1 with the eddie readied.
        engine.completeTurn({ as: P2 });

        // The sold card can be spent again (still worth 1 eddie).
        expect(engine.getEddies(P1)).toBe(1);
      });

      it("prevents a second sell in the same turn", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailRebootOptics],
          eddies: 0,
        });

        engine.sellCard(welcomeToNightCityRetailFloorIt);

        const failure = engine.expectFailure(() =>
          engine.sellCard(welcomeToNightCityRetailRebootOptics),
        );
        expect(failure.errorCode).toBe("ALREADY_SOLD");
      });
    });

    describe("Restrictions", () => {
      it("cannot sell a card without sell tag", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailSketchyRipper],
          eddies: 0,
        });

        const failure = engine.expectFailure(() =>
          engine.sellCard(welcomeToNightCityRetailSketchyRipper),
        );
        expect(failure.errorCode).toBe("NO_SELL_TAG");
      });

      it("cannot sell a card not in hand", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailSketchyRipper],
          field: [welcomeToNightCityRetailFloorIt],
          eddies: 0,
        });

        const failure = engine.expectFailure(() =>
          engine.sellCard(engine.getCard(welcomeToNightCityRetailFloorIt, "field", P1)),
        );
        expect(failure.errorCode).toBe("CARD_NOT_IN_HAND");
      });

      it("non-active player cannot sell", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { hand: [welcomeToNightCityRetailSketchyRipper] },
          { hand: [welcomeToNightCityRetailFloorIt], eddies: 0 },
        );

        const failure = engine.expectFailure(() =>
          engine.sellCard(welcomeToNightCityRetailFloorIt, { as: P2 }),
        );
        expect(failure.errorCode).toBe("NOT_YOUR_TURN");
      });
    });
  });

  // ── Call a Legend ───────────────────────────────────────────────────

  describe("Call a Legend", () => {
    describe("Successful Call", () => {
      it("flips a legend from face-down to face-up", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          eddies: 5,
        });

        const faceDownBefore = engine.getFaceDownLegends(P1);
        expect(faceDownBefore.length).toBeGreaterThan(0);
        const legend = faceDownBefore[0]!;

        engine.callLegend(legend);

        const card = engine.getCard(legend);
        expect(card.meta.faceDown).toBe(false);
      });

      it("deducts 1 eddie", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          eddies: 5,
        });

        const legend = engine.getFaceDownLegends(P1)[0]!;
        engine.callLegend(legend);

        expect(engine.getEddies(P1)).toBe(4);
      });

      it("emits legendFlipped and legendCalled events", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          eddies: 5,
        });

        const legend = engine.getFaceDownLegends(P1)[0]!;
        engine.callLegend(legend);

        expect(engine.getEvents("legendFlipped")).toHaveLength(1);
        expect(engine.getEvents("legendCalled")).toHaveLength(1);
      });

      it("legend stays in legendArea after flip", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          eddies: 5,
        });

        const legend = engine.getFaceDownLegends(P1)[0]!;
        engine.callLegend(legend);

        const legendsInArea = engine.getCardsInZone("legendArea", P1);
        expect(legendsInArea.some((c) => c.instanceId === legend.instanceId)).toBe(true);
      });
    });

    describe("Restrictions", () => {
      it("cannot call twice in the same turn", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          eddies: 10,
        });

        const legends = engine.getFaceDownLegends(P1);
        engine.callLegend(legends[0]!);

        const failure = engine.expectFailure(() => engine.callLegend(legends[1]!));
        expect(failure.errorCode).toBe("ALREADY_CALLED");
      });

      it("requires at least 1 eddie", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          eddies: 0,
        });
        engine.spendAllLegends();

        const legend = engine.getFaceDownLegends(P1)[0]!;
        const failure = engine.expectFailure(() => engine.callLegend(legend));
        expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
      });

      it("requires a face-down legend", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          legendArea: [
            { card: structuredLegend(0), faceDown: false },
            { card: structuredLegend(1), faceDown: false },
            { card: structuredLegend(2), faceDown: false },
          ],
          eddies: 10,
        });

        const legend = engine.getCardsInZone("legendArea", P1)[0]!;
        const failure = engine.expectFailure(() => engine.callLegend(legend));
        expect(failure.errorCode).toBe("NO_FACE_DOWN_LEGENDS");
      });

      it("requires the legend being revealed to be targeted", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          eddies: 5,
        });

        const result = engine.executeMove("callLegend", { args: {} }, P1);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.errorCode).toBe("MISSING_LEGEND_TARGET");
        }
      });
    });
  });

  // ── Play Cards ─────────────────────────────────────────────────────

  describe("Play Cards", () => {
    describe("Playing a Unit", () => {
      it("moves unit from hand to field", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailSketchyRipper],
          eddies: 10,
        });

        engine.playCard(welcomeToNightCityRetailSketchyRipper);

        expect(engine.getCardsInZone("field", P1)).toHaveLength(1);
        expect(engine.getCardsInZone("field", P1)[0]!.definitionId).toBe(
          welcomeToNightCityRetailSketchyRipper.id,
        );
      });

      it("deducts eddies equal to card cost", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailSketchyRipper],
          eddies: 10,
        });

        engine.playCard(welcomeToNightCityRetailSketchyRipper);

        // welcomeToNightCityRetailSketchyRipper costs 2
        expect(engine.getEddies(P1)).toBe(8);
      });

      it("marks unit as hasLag", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailSketchyRipper],
          eddies: 10,
        });

        engine.playCard(welcomeToNightCityRetailSketchyRipper);

        const card = engine.getCard(welcomeToNightCityRetailSketchyRipper, "field", P1);
        expect(card.meta.hasLag).toBe(true);
      });

      it("emits cardPlayed event with cost", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailSketchyRipper],
          eddies: 10,
        });

        engine.playCard(welcomeToNightCityRetailSketchyRipper);

        const events = engine.getEvents("cardPlayed");
        expect(events).toHaveLength(1);
        expect((events[0] as any).cost).toBe(2);
      });
    });

    describe("Playing a Program", () => {
      it("moves program from hand to trash", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailRebootOptics],
          eddies: 10,
        });

        engine.playCard(welcomeToNightCityRetailRebootOptics);

        expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
        expect(
          engine
            .getCardsInZone("trash", P1)
            .some((c) => c.definitionId === welcomeToNightCityRetailRebootOptics.id),
        ).toBe(true);
      });

      it("deducts eddies equal to card cost", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailRebootOptics],
          eddies: 10,
        });

        engine.playCard(welcomeToNightCityRetailRebootOptics);

        expect(engine.getEddies(P1)).toBe(10 - welcomeToNightCityRetailRebootOptics.cost);
      });

      it("emits cardPlayed event", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailFloorIt],
          eddies: 10,
        });

        engine.playCard(welcomeToNightCityRetailFloorIt);

        expect(engine.getEvents("cardPlayed")).toHaveLength(1);
      });
    });

    describe("Playing a Gear", () => {
      it("moves gear from hand to field attached to a unit", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailMantisBlades],
          field: [welcomeToNightCityRetailSketchyRipper],
          eddies: 10,
        });

        const hostId = engine.getCard(
          welcomeToNightCityRetailSketchyRipper,
          "field",
          P1,
        ).instanceId;
        const gearId = engine.findCardId(welcomeToNightCityRetailMantisBlades, "hand", P1);
        const result = engine.executeMove("playCard", {
          args: { cardId: gearId as string, attachToId: hostId as string },
        });
        expect(result.success).toBe(true);

        expect(engine.getCardsInZone("field", P1)).toHaveLength(2);
        const gear = engine.getCard(welcomeToNightCityRetailMantisBlades, "field", P1);
        expect(gear.meta.attachedToId).toBe(hostId);
      });

      it("deducts eddies equal to card cost", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailMantisBlades],
          field: [welcomeToNightCityRetailSketchyRipper],
          eddies: 10,
        });

        const hostId = engine.getCard(
          welcomeToNightCityRetailSketchyRipper,
          "field",
          P1,
        ).instanceId;
        const gearId = engine.findCardId(welcomeToNightCityRetailMantisBlades, "hand", P1);
        engine.executeMove("playCard", {
          args: { cardId: gearId as string, attachToId: hostId as string },
        });

        // welcomeToNightCityRetailMantisBlades costs 1
        expect(engine.getEddies(P1)).toBe(9);
      });

      it("emits cardPlayed event", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailMantisBlades],
          field: [welcomeToNightCityRetailSketchyRipper],
          eddies: 10,
        });

        const hostId = engine.getCard(
          welcomeToNightCityRetailSketchyRipper,
          "field",
          P1,
        ).instanceId;
        const gearId = engine.findCardId(welcomeToNightCityRetailMantisBlades, "hand", P1);
        engine.executeMove("playCard", {
          args: { cardId: gearId as string, attachToId: hostId as string },
        });

        expect(engine.getEvents("cardPlayed")).toHaveLength(1);
      });
    });

    describe("Restrictions", () => {
      it("cannot play without enough eddies", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailSwordwiseHuscle],
          eddies: 1,
        });
        engine.spendAllLegends();

        const failure = engine.expectFailure(() =>
          engine.playCard(welcomeToNightCityRetailSwordwiseHuscle),
        );
        expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
      });

      it("cannot play a card not in hand", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [welcomeToNightCityRetailSketchyRipper],
          field: [welcomeToNightCityRetailCorpoSecurity],
          eddies: 10,
        });

        const failure = engine.expectFailure(() =>
          engine.playCard(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1)),
        );
        expect(failure.errorCode).toBe("CARD_NOT_IN_HAND");
      });

      it("non-active player cannot play", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { hand: [welcomeToNightCityRetailSketchyRipper] },
          { hand: [welcomeToNightCityRetailCorpoSecurity], eddies: 10 },
        );

        const failure = engine.expectFailure(() =>
          engine.playCard(welcomeToNightCityRetailCorpoSecurity, { as: P2 }),
        );
        expect(failure.errorCode).toBe("NOT_YOUR_TURN");
      });
    });
  });

  // ── Action Ordering ────────────────────────────────────────────────

  describe("Action Ordering", () => {
    it("can sell, call legend, and play cards in any order", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailSketchyRipper],
        eddies: 10,
      });

      // Play a unit first
      engine.playCard(welcomeToNightCityRetailSketchyRipper);

      // Then sell
      engine.sellCard(welcomeToNightCityRetailFloorIt);

      // Then call legend
      const legend = engine.getFaceDownLegends(P1)[0]!;
      engine.callLegend(legend);

      expect(engine.getCardsInZone("field", P1)).toHaveLength(1);
      expect(engine.getCardsInZone("eddieArea", P1)).toHaveLength(1);
      expect(engine.getFaceDownLegends(P1)).toHaveLength(2);
    });

    it("can play multiple cards in a single turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [welcomeToNightCityRetailSketchyRipper, welcomeToNightCityRetailCorpoSecurity],
        eddies: 10,
      });

      engine.playCard(welcomeToNightCityRetailSketchyRipper);
      engine.playCard(welcomeToNightCityRetailCorpoSecurity);

      expect(engine.getCardsInZone("field", P1)).toHaveLength(2);
      // 10 - 2 - 2 = 6
      expect(engine.getEddies(P1)).toBe(6);
    });

    it("sell and call-legend are independent once-per-turn limits", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [welcomeToNightCityRetailFloorIt],
        eddies: 10,
      });

      engine.sellCard(welcomeToNightCityRetailFloorIt);
      const legend = engine.getFaceDownLegends(P1)[0]!;
      engine.callLegend(legend);

      // Both succeed — selling doesn't block calling and vice versa
      expect(engine.getCardsInZone("eddieArea", P1)).toHaveLength(1);
      expect(engine.getEvents("legendCalled")).toHaveLength(1);
    });
  });
});

// ── Helpers ────────────────────────────────────────────────────────

import { structuredCards } from "@tcg/cyberpunk-cards";

const legends = structuredCards.filter((c) => c.type === "legend");

/** Return the Nth legend definition from the catalog (for fixture use). */
function structuredLegend(index: number) {
  const l = legends[index];
  if (!l) throw new Error(`No legend at index ${index}`);
  return l;
}
