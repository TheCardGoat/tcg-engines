import { describe, expect, it } from "vite-plus/test";
import {
  alphaFloorIt,
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaCorpoSecurity,
  alphaSwordwiseHuscle,
  alphaMantisBlades,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";

describe("Main Phase", () => {
  // ── Sell for Eddies ────────────────────────────────────────────────

  describe("Sell for Eddies", () => {
    describe("Successful Sell", () => {
      it("moves card from hand to eddieArea", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaFloorIt],
          eddies: 0,
        });

        engine.sellCard(alphaFloorIt);

        expect(engine.getCardsInZone("eddieArea", P1)).toHaveLength(1);
        expect(engine.getCardsInZone("eddieArea", P1)[0]!.definitionId).toBe(alphaFloorIt.id);
      });

      it("removes card from hand", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaFloorIt, alphaRuthlessLowlife],
          eddies: 0,
        });

        engine.sellCard(alphaFloorIt);

        const hand = engine.getCardsInZone("hand", P1);
        expect(hand).toHaveLength(1);
        expect(hand[0]!.definitionId).toBe(alphaRuthlessLowlife.id);
      });

      it("emits cardSold event", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaFloorIt],
          eddies: 0,
        });

        engine.sellCard(alphaFloorIt);

        const events = engine.getEvents("cardSold");
        expect(events).toHaveLength(1);
        expect(events[0]!.type).toBe("cardSold");
      });

      it("adds one available eddie", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaFloorIt],
          eddies: 0,
        });

        engine.sellCard(alphaFloorIt);

        expect(engine.getEddies(P1)).toBe(1);
      });

      it("sold card is only worth 1 eddie per turn", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaFloorIt, alphaRuthlessLowlife],
          eddies: 0,
        });

        // Sell the card → 1 eddie available.
        engine.sellCard(alphaFloorIt);
        expect(engine.getEddies(P1)).toBe(1);

        // Play a card costing 1 eddie, spending the sold-card eddie.
        engine.playCard(alphaRuthlessLowlife, { as: P1 });
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
          hand: [alphaFloorIt, alphaRebootOptics],
          eddies: 0,
        });

        engine.sellCard(alphaFloorIt);

        const failure = engine.expectFailure(() => engine.sellCard(alphaRebootOptics));
        expect(failure.errorCode).toBe("ALREADY_SOLD");
      });
    });

    describe("Restrictions", () => {
      it("cannot sell a card without sell tag", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaRuthlessLowlife],
          eddies: 0,
        });

        const failure = engine.expectFailure(() => engine.sellCard(alphaRuthlessLowlife));
        expect(failure.errorCode).toBe("NO_SELL_TAG");
      });

      it("cannot sell a card not in hand", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaRuthlessLowlife],
          field: [alphaFloorIt],
          eddies: 0,
        });

        const failure = engine.expectFailure(() =>
          engine.sellCard(engine.getCard(alphaFloorIt, "field", P1)),
        );
        expect(failure.errorCode).toBe("CARD_NOT_IN_HAND");
      });

      it("non-active player cannot sell", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { hand: [alphaRuthlessLowlife] },
          { hand: [alphaFloorIt], eddies: 0 },
        );

        const failure = engine.expectFailure(() => engine.sellCard(alphaFloorIt, { as: P2 }));
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
          hand: [alphaRuthlessLowlife],
          eddies: 10,
        });

        engine.playCard(alphaRuthlessLowlife);

        expect(engine.getCardsInZone("field", P1)).toHaveLength(1);
        expect(engine.getCardsInZone("field", P1)[0]!.definitionId).toBe(alphaRuthlessLowlife.id);
      });

      it("deducts eddies equal to card cost", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaRuthlessLowlife],
          eddies: 10,
        });

        engine.playCard(alphaRuthlessLowlife);

        // alphaRuthlessLowlife costs 2
        expect(engine.getEddies(P1)).toBe(8);
      });

      it("marks unit as playedThisTurn", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaRuthlessLowlife],
          eddies: 10,
        });

        engine.playCard(alphaRuthlessLowlife);

        const card = engine.getCard(alphaRuthlessLowlife, "field", P1);
        expect(card.meta.playedThisTurn).toBe(true);
      });

      it("emits cardPlayed event with cost", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaRuthlessLowlife],
          eddies: 10,
        });

        engine.playCard(alphaRuthlessLowlife);

        const events = engine.getEvents("cardPlayed");
        expect(events).toHaveLength(1);
        expect((events[0] as any).cost).toBe(2);
      });
    });

    describe("Playing a Program", () => {
      it("moves program from hand to trash", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaFloorIt],
          eddies: 10,
        });

        engine.playCard(alphaFloorIt);

        expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
        expect(
          engine.getCardsInZone("trash", P1).some((c) => c.definitionId === alphaFloorIt.id),
        ).toBe(true);
      });

      it("deducts eddies equal to card cost", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaFloorIt],
          eddies: 10,
        });

        engine.playCard(alphaFloorIt);

        // alphaFloorIt costs 3
        expect(engine.getEddies(P1)).toBe(7);
      });

      it("emits cardPlayed event", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaFloorIt],
          eddies: 10,
        });

        engine.playCard(alphaFloorIt);

        expect(engine.getEvents("cardPlayed")).toHaveLength(1);
      });
    });

    describe("Playing a Gear", () => {
      it("moves gear from hand to field attached to a unit", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaMantisBlades],
          field: [alphaRuthlessLowlife],
          eddies: 10,
        });

        const hostId = engine.getCard(alphaRuthlessLowlife, "field", P1).instanceId;
        const gearId = engine.findCardId(alphaMantisBlades, "hand", P1);
        const result = engine.executeMove("playCard", {
          args: { cardId: gearId as string, attachToId: hostId as string },
        });
        expect(result.success).toBe(true);

        expect(engine.getCardsInZone("field", P1)).toHaveLength(2);
        const gear = engine.getCard(alphaMantisBlades, "field", P1);
        expect(gear.meta.attachedToId).toBe(hostId);
      });

      it("deducts eddies equal to card cost", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaMantisBlades],
          field: [alphaRuthlessLowlife],
          eddies: 10,
        });

        const hostId = engine.getCard(alphaRuthlessLowlife, "field", P1).instanceId;
        const gearId = engine.findCardId(alphaMantisBlades, "hand", P1);
        engine.executeMove("playCard", {
          args: { cardId: gearId as string, attachToId: hostId as string },
        });

        // alphaMantisBlades costs 1
        expect(engine.getEddies(P1)).toBe(9);
      });

      it("emits cardPlayed event", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaMantisBlades],
          field: [alphaRuthlessLowlife],
          eddies: 10,
        });

        const hostId = engine.getCard(alphaRuthlessLowlife, "field", P1).instanceId;
        const gearId = engine.findCardId(alphaMantisBlades, "hand", P1);
        engine.executeMove("playCard", {
          args: { cardId: gearId as string, attachToId: hostId as string },
        });

        expect(engine.getEvents("cardPlayed")).toHaveLength(1);
      });
    });

    describe("Restrictions", () => {
      it("cannot play without enough eddies", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaSwordwiseHuscle],
          eddies: 1,
        });
        engine.spendAllLegends();

        const failure = engine.expectFailure(() => engine.playCard(alphaSwordwiseHuscle));
        expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
      });

      it("cannot play a card not in hand", () => {
        const engine = CyberpunkTestEngine.createWithFixture({
          hand: [alphaRuthlessLowlife],
          field: [alphaCorpoSecurity],
          eddies: 10,
        });

        const failure = engine.expectFailure(() =>
          engine.playCard(engine.getCard(alphaCorpoSecurity, "field", P1)),
        );
        expect(failure.errorCode).toBe("CARD_NOT_IN_HAND");
      });

      it("non-active player cannot play", () => {
        const engine = CyberpunkTestEngine.createWithFixture(
          { hand: [alphaRuthlessLowlife] },
          { hand: [alphaCorpoSecurity], eddies: 10 },
        );

        const failure = engine.expectFailure(() => engine.playCard(alphaCorpoSecurity, { as: P2 }));
        expect(failure.errorCode).toBe("NOT_YOUR_TURN");
      });
    });
  });

  // ── Action Ordering ────────────────────────────────────────────────

  describe("Action Ordering", () => {
    it("can sell, call legend, and play cards in any order", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaFloorIt, alphaRuthlessLowlife],
        eddies: 10,
      });

      // Play a unit first
      engine.playCard(alphaRuthlessLowlife);

      // Then sell
      engine.sellCard(alphaFloorIt);

      // Then call legend
      const legend = engine.getFaceDownLegends(P1)[0]!;
      engine.callLegend(legend);

      expect(engine.getCardsInZone("field", P1)).toHaveLength(1);
      expect(engine.getCardsInZone("eddieArea", P1)).toHaveLength(1);
      expect(engine.getFaceDownLegends(P1)).toHaveLength(2);
    });

    it("can play multiple cards in a single turn", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaRuthlessLowlife, alphaCorpoSecurity],
        eddies: 10,
      });

      engine.playCard(alphaRuthlessLowlife);
      engine.playCard(alphaCorpoSecurity);

      expect(engine.getCardsInZone("field", P1)).toHaveLength(2);
      // 10 - 2 - 2 = 6
      expect(engine.getEddies(P1)).toBe(6);
    });

    it("sell and call-legend are independent once-per-turn limits", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [alphaFloorIt],
        eddies: 10,
      });

      engine.sellCard(alphaFloorIt);
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
