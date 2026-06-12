import { describe, it, expect } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCallableLegend,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaJackieWellesPourOneOutForMe } from "@tcg/cyberpunk-cards";
import { alphaEvelynParkerSchemingSiren } from "@tcg/cyberpunk-cards";
import { alphaCorpoSecurity } from "@tcg/cyberpunk-cards";
import { alphaDyingNightVSPistol, alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

const jackie = alphaJackieWellesPourOneOutForMe;
const blueUnit = alphaEvelynParkerSchemingSiren; // blue unit, cost 2
const greenUnit = alphaCorpoSecurity; // green unit, cost 2
const blueGear = alphaDyingNightVSPistol; // blue gear, cost 2
const gearHost = alphaSwordwiseHuscle;

describe("Jackie Welles - Pour One Out For Me", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, jackie);
    });
  });

  describe(`The first time you play a blue unit or blue gear each turn, you may increase a friendly gig by 2. Then, if it's at max value, draw a card.`, () => {
    it("increases a friendly gig by 2 when a blue unit is played", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit],
        eddies: blueUnit.cost,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      const gigBefore = engine.getGigValue(P1);
      engine.playCard(blueUnit);
      const gigAfter = engine.getGigValue(P1);

      expect(gigAfter).toBe(gigBefore + 2);
    });

    it("increases a friendly gig by 2 when a blue gear is played", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        field: [{ card: gearHost }],
        hand: [blueGear],
        eddies: blueGear.cost,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      });

      engine.attachGear(blueGear, gearHost);

      expect(engine.getGigValue(P1)).toBe(4);
      expect(engine.getCard(blueGear, "field", P1).meta.attachedToId).toBe(
        engine.getCard(gearHost, "field", P1).instanceId,
      );
    });

    it("draws a card if the gig reaches its max face value after the increase", () => {
      // d6 at 4 → increases to 6 (max for d6) → draw fires
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit],
        eddies: blueUnit.cost,
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      });

      const handBefore = engine.getHandCount(P1);
      engine.playCard(blueUnit);

      expect(engine.getGigValue(P1)).toBe(6);
      expect(engine.getHandCount(P1)).toBe(handBefore - 1 + 1); // spent blueUnit, drew 1
    });

    it("does not draw a card if the gig is below max value after the increase", () => {
      // d6 at 2 → increases to 4 (below max of 6) → no draw
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit],
        eddies: blueUnit.cost,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      });

      const handBefore = engine.getHandCount(P1);
      engine.playCard(blueUnit);

      expect(engine.getGigValue(P1)).toBe(4);
      expect(engine.getHandCount(P1)).toBe(handBefore - 1); // spent blueUnit, no draw
    });

    it("clamps the gig at its die type maximum", () => {
      // d4 at 4 (already max) → +2 clamped to 4 (no change in value)
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit],
        eddies: blueUnit.cost,
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      });

      engine.playCard(blueUnit);

      expect(engine.getGigValue(P1)).toBe(4);
    });

    it("does not trigger when a non-blue card is played", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [greenUnit],
        eddies: greenUnit.cost,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      const gigBefore = engine.getGigValue(P1);
      engine.playCard(greenUnit);
      const gigAfter = engine.getGigValue(P1);

      expect(gigAfter).toBe(gigBefore);
    });

    it("only triggers once per turn — second blue card does not fire the ability again", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit, blueUnit],
        eddies: blueUnit.cost * 2,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      // First blue card: gig goes 1→3
      engine.playCard(blueUnit);
      expect(engine.getGigValue(P1)).toBe(3);

      // Second blue card: no trigger (firstTimeEachTurn limit)
      engine.playCard(blueUnit);
      expect(engine.getGigValue(P1)).toBe(3);
    });

    it("fires again on the next turn after the limit resets", () => {
      // Two blue units in hand, enough eddies for both plays
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit, blueUnit],
        eddies: blueUnit.cost * 4, // enough for both turns
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      });

      // P1's turn: play first blue unit → gig 1→3
      engine.playCard(blueUnit);
      expect(engine.getGigValue(P1)).toBe(3);

      // End P1's turn, start P2's turn, then P1's next turn
      engine.completeTurn(); // P1 ends → P2's turn
      engine.completeTurn({ as: P2 }); // P2 ends → P1's turn again

      // P1 still has the second blueUnit in hand and enough eddies
      // Jackie fires again → gig 3→5
      engine.playCard(blueUnit);
      expect(engine.getGigValue(P1)).toBe(5);
    });

    it("does not increase the gig if no friendly gig is available (optional effect skipped)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit],
        eddies: blueUnit.cost,
        gigArea: [],
        // Explicit empty gigArea — P1 has no gigs.
      });

      // Should not throw; ability fires but optional modifyGig is skipped
      expect(() => engine.playCard(blueUnit)).not.toThrow();
      expect(engine.getGigCount(P1)).toBe(0);
    });

    it("emits a gigValueChanged event when the gig is increased", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit],
        eddies: blueUnit.cost,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      });

      engine.playCard(blueUnit);

      const gigEvents = engine.getEvents("gigValueChanged");
      expect(gigEvents.length).toBeGreaterThan(0);
      const last = gigEvents[gigEvents.length - 1] as { type: "gigValueChanged"; newValue: number };
      expect(last.newValue).toBe(5);
    });

    it("increases only the first gig when multiple friendly gigs are present", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit],
        eddies: blueUnit.cost,
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 1 },
        ],
      });

      engine.playCard(blueUnit);

      // First gig (d6) should increase by 2; second gig (d8) stays the same
      const dice = engine.getGigDice(P1);
      expect(dice[0]!.faceValue).toBe(4); // d6: 2 → 4
      expect(dice[1]!.faceValue).toBe(1); // d8: unchanged
    });

    it("draw fires on a d4 gig bumped to its max face of 4", () => {
      // d4 at 2 → +2 = 4 = max for d4 → draw fires
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: jackie, faceDown: false }],
        hand: [blueUnit],
        eddies: blueUnit.cost,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      });

      const handBefore = engine.getHandCount(P1);
      engine.playCard(blueUnit);

      expect(engine.getGigValue(P1)).toBe(4);
      expect(engine.getHandCount(P1)).toBe(handBefore - 1 + 1);
    });
  });
});
