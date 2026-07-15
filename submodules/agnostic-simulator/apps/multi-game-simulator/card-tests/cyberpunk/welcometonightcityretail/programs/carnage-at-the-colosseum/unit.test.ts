import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  expectEligibleTargets,
  expectNoPendingChoice,
  expectPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import { welcomeToNightCityRetailCarnageAtTheColosseum } from "@tcg/cyberpunk-cards";

const carnage = welcomeToNightCityRetailCarnageAtTheColosseum; // program, cost 6, sell tag

// Mock units with exact powers so we can pin the `powerLessThanAnyOf` boundary.
// powers: friendlyHigh=7, friendlyLow=5; rival6, rival7, rival5.
const friendlyHigh = createMockUnit({ id: "carnage-friendly-high", name: "Friendly 7", power: 7 });
const friendlyLow = createMockUnit({ id: "carnage-friendly-low", name: "Friendly 5", power: 5 });
const rival6 = createMockUnit({ id: "carnage-rival-6", name: "Rival 6", power: 6 });
const rival7 = createMockUnit({ id: "carnage-rival-7", name: "Rival 7", power: 7 });
const rival5 = createMockUnit({ id: "carnage-rival-5", name: "Rival 5", power: 5 });

describe("Carnage at the Colosseum", () => {
  describe("cost reduction (-1 €$ per friendly Gig with 8+ value, min 1)", () => {
    it("costs the base 6 €$ with no 8+ Gigs", () => {
      // gigArea accepts bare face values; the engine assigns the smallest die
      // type that can show each value (here 2 → d4).
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [carnage], eddies: 6, gigArea: [2] },
        { field: [{ card: rival5 }] },
      );
      // affordable at exactly 6
      expect(engine.getEddies(P1)).toBe(6);
      engine.playCard(carnage);
      expect(engine.getEddies(P1)).toBe(0);
    });

    it("costs 4 €$ with two 8+ Gigs", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [carnage], eddies: 4, gigArea: [8, 9] },
        { field: [{ card: rival5 }] },
      );
      engine.playCard(carnage);
      expect(engine.getEddies(P1)).toBe(0);
    });

    it("costs 2 €$ with four 8+ Gigs (one of each distinct die type)", () => {
      // Die types are distinct (d4..d20), so at most 4 can hold 8+ values:
      // d8=8, d10=9, d12=10, d20=11 -> 4 reductions -> cost 6 -> 2.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: 2,
          field: [{ card: friendlyHigh }],
          gigArea: [2, 3, 8, 9, 10, 11],
        },
        { field: [{ card: rival5 }] },
        { autoGainGig: false },
      );
      engine.playCard(carnage);
      expect(engine.getEddies(P1)).toBe(0);
    });

    it("is NOT playable when Gigs reduce it to the floor (1) but you have 0 €$", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [carnage], eddies: 0, gigArea: [8, 9] },
        { field: [{ card: rival5 }] },
      );
      expect(() => engine.playCard(carnage)).toThrow();
    });
  });

  describe("[PLAY] Defeat a rival Unit with less power than a friendly Unit", () => {
    it("makes a rival Unit eligible only when its power is STRICTLY less than SOME friendly Unit", () => {
      // friendly powers: 7 and 5. Rivals: 6 (<7), 7 (not <7, not <5), 5 (<7 but not <5).
      // Eligible = rival6 (6<7) and rival5 (5<7). rival7 excluded (7 not < 7 or 5).
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [carnage],
          eddies: carnage.cost,
          field: [{ card: friendlyHigh }, { card: friendlyLow }],
        },
        {
          field: [{ card: rival6 }, { card: rival7 }, { card: rival5 }],
        },
      );

      engine.playCard(carnage);

      // rival6 (6<7) and rival5 (5<7) are eligible; rival7 is excluded.
      expectEligibleTargets(engine, [rival6, rival5]);
    });

    it("the boundary is strict: a rival whose power EQUALS the max friendly power is excluded", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [carnage], eddies: carnage.cost, field: [{ card: friendlyHigh }] }, // friendly 7
        { field: [{ card: rival7 }] }, // rival 7 — equal, NOT less
      );

      engine.playCard(carnage);

      // Equal power is not "less than" -> no eligible target -> no pending choice.
      expectNoPendingChoice(engine);
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === rival7.id)).toBe(true);
    });

    it("defeats the chosen eligible rival Unit and moves the Program to trash", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [carnage], eddies: carnage.cost, field: [{ card: friendlyHigh }] },
        { field: [{ card: rival5 }, { card: rival7 }] }, // only rival5 (5<7) eligible
      );

      engine.playCard(carnage);
      engine.resolveEffectTarget(rival5);

      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === rival5.id)).toBe(true);
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === rival7.id)).toBe(true); // survivor
      // Program resolved and went to P1 trash.
      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === carnage.id)).toBe(true);
    });

    it("creates no target choice when the rival has no Units", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [carnage], eddies: carnage.cost, field: [{ card: friendlyHigh }] },
        { field: [] },
      );
      engine.playCard(carnage);
      expectNoPendingChoice(engine);
    });

    it("creates no target choice when the player has no friendly Units to compare against", () => {
      // No friendly unit -> no rival can be "less than a friendly Unit".
      const engine = CyberpunkTestEngine.createWithFixture(
        { hand: [carnage], eddies: carnage.cost, field: [] },
        { field: [{ card: rival5 }] },
      );
      engine.playCard(carnage);
      expectNoPendingChoice(engine);
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === rival5.id)).toBe(true);
    });
  });
});
