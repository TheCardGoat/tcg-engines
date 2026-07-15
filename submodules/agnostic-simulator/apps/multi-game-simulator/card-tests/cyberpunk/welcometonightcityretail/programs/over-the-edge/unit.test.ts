import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  expectEligibleTargets,
  expectNoPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import { welcomeToNightCityRetailOverTheEdge } from "@tcg/cyberpunk-cards";

const overTheEdge = welcomeToNightCityRetailOverTheEdge; // program, cost 3, sell tag

// Mock units at exact power boundaries against a friendly d20 value of 6.
const friendly5 = createMockUnit({ id: "ote-friendly-5", name: "Friendly 5", power: 5 });
const friendly6 = createMockUnit({ id: "ote-friendly-6", name: "Friendly 6", power: 6 });
const friendly7 = createMockUnit({ id: "ote-friendly-7", name: "Friendly 7", power: 7 });
const rival5 = createMockUnit({ id: "ote-rival-5", name: "Rival 5", power: 5 });
const rival7 = createMockUnit({ id: "ote-rival-7", name: "Rival 7", power: 7 });

describe("Over the Edge", () => {
  describe("[PLAY] Defeat a Unit with power equal to or less than the value of a friendly d20", () => {
    it("makes Units with power <= the friendly d20 value eligible (boundary inclusive at ==)", () => {
      // Friendly d20 = 6. Eligible: power <= 6 (friendly5, friendly6, rival5).
      // Excluded: power 7 (friendly7, rival7).
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [overTheEdge],
          eddies: overTheEdge.cost,
          field: [{ card: friendly5 }, { card: friendly6 }, { card: friendly7 }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
            { dieType: "d10", faceValue: 4 },
            { dieType: "d12", faceValue: 5 },
            { dieType: "d20", faceValue: 6 },
          ],
        },
        { field: [{ card: rival5 }, { card: rival7 }] },
        { autoGainGig: false },
      );
      engine.playCard(overTheEdge);
      // Target has no `controller` -> BOTH sides' units are eligible.
      expectEligibleTargets(engine, [friendly5, friendly6, rival5]);
    });

    it("targets BOTH friendly and rival Units (no controller restriction)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [overTheEdge],
          eddies: overTheEdge.cost,
          field: [{ card: friendly5 }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
            { dieType: "d10", faceValue: 4 },
            { dieType: "d12", faceValue: 5 },
            { dieType: "d20", faceValue: 6 },
          ],
        },
        { field: [{ card: rival5 }] },
        { autoGainGig: false },
      );
      engine.playCard(overTheEdge);
      // Both a friendly and a rival unit are eligible.
      expectEligibleTargets(engine, [friendly5, rival5]);
    });

    it("defeats the chosen Unit (it moves to its owner's trash)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [overTheEdge],
          eddies: overTheEdge.cost,
          field: [{ card: friendly6 }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
            { dieType: "d10", faceValue: 4 },
            { dieType: "d12", faceValue: 5 },
            { dieType: "d20", faceValue: 6 },
          ],
        },
        { field: [{ card: rival7 }] }, // power 7 > 6, not eligible
        { autoGainGig: false },
      );
      engine.playCard(overTheEdge);
      engine.resolveEffectTarget(friendly6);
      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === friendly6.id)).toBe(true);
    });

    it("creates no target choice when no Unit is within the d20 power threshold", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [overTheEdge],
          eddies: overTheEdge.cost,
          field: [{ card: friendly7 }], // power 7 > d20 value 6
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
            { dieType: "d10", faceValue: 4 },
            { dieType: "d12", faceValue: 5 },
            { dieType: "d20", faceValue: 6 },
          ],
        },
        { field: [{ card: rival7 }] },
        { autoGainGig: false },
      );
      engine.playCard(overTheEdge);
      expectNoPendingChoice(engine);
    });

    it("creates no target choice when the player controls no d20", () => {
      // No d20 in the gig area -> there is no "friendly d20 value" to compare
      // against, so no Unit can ever satisfy power <= <d20 value>. The program
      // still resolves (it is playable by cost/phase rules) but defeats nothing.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [overTheEdge],
          eddies: overTheEdge.cost,
          field: [{ card: friendly5 }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
            { dieType: "d10", faceValue: 4 },
            { dieType: "d12", faceValue: 5 },
            // deliberately NO d20
          ],
        },
        { field: [{ card: rival5 }] },
        { autoGainGig: false },
      );
      engine.playCard(overTheEdge);
      expectNoPendingChoice(engine);
      // No unit was defeated: both remain on the field.
      expect(engine.getCardsInZone("field", P1).map((c) => c.definitionId)).toContain(friendly5.id);
      expect(engine.getCardsInZone("field", P2).map((c) => c.definitionId)).toContain(rival5.id);
    });
  });
});
