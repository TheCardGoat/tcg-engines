import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { donaldDuckPieSlinger } from "./107-donald-duck-pie-slinger";
import { donaldDuckBoisterousFowl } from "../../001/characters/108-donald-duck-boisterous-fowl";

describe("Donald Duck - Pie Slinger", () => {
  it("should have Shift 4 keyword ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckPieSlinger],
    });

    expect(testEngine.hasKeyword(donaldDuckPieSlinger, "Shift")).toBe(true);
  });

  describe("HUMBLE PIE - When you play this character, if you used Shift to play him, each opponent loses 2 lore.", () => {
    it("reduces each opponent lore by 2 when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: donaldDuckPieSlinger.cost,
          hand: [donaldDuckPieSlinger],
          play: [donaldDuckBoisterousFowl],
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);

      const shiftTarget = testEngine.findCardInstanceId(
        donaldDuckBoisterousFowl,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(donaldDuckPieSlinger, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // Resolve triggered ability (HUMBLE PIE)
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(donaldDuckPieSlinger),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });

    it("does not trigger when played normally (without Shift)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: donaldDuckPieSlinger.cost,
          hand: [donaldDuckPieSlinger],
        },
        {
          lore: 5,
        },
      );

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);

      expect(testEngine.asPlayerOne().playCard(donaldDuckPieSlinger)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);
    });
  });

  describe("RAGING DUCK - While an opponent has 10 or more lore, this character gets +6 {S}.", () => {
    it("gets +6 strength while an opponent has 10 or more lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckPieSlinger],
        },
        {
          lore: 10,
        },
      );

      expect(testEngine.getLore(PLAYER_TWO)).toBe(10);
      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckPieSlinger)).toBe(
        donaldDuckPieSlinger.strength + 6,
      );
    });

    it("does not get +6 strength when opponent has less than 10 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckPieSlinger],
        },
        {
          lore: 9,
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(donaldDuckPieSlinger)).toBe(
        donaldDuckPieSlinger.strength,
      );
    });
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuck } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { donaldDuckPieSlinger } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Pie Slinger", () => {
//   It("**HUMBLE PIE** When you play this character, if you used **Shift** to play him, each opponent loses 2 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: donaldDuckPieSlinger.cost,
//       Hand: [donaldDuckPieSlinger],
//       Play: [donaldDuck],
//     });
//
//     TestStore.store.tableStore.getTable("player_two").updateLore(5);
//
//     Const cardUnderTest = testStore.getCard(donaldDuckPieSlinger);
//     Const target = testStore.getCard(donaldDuck);
//
//     CardUnderTest.shift(target);
//
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(3);
//   });
//
//   It("**RAGING DUCK** While an opponent has 10 or more lore, this character gets +6 {S}.", () => {
//     Const testStore = new TestStore({
//       Play: [donaldDuckPieSlinger],
//     });
//
//     Const cardUnderTest = testStore.getCard(donaldDuckPieSlinger);
//
//     Expect(cardUnderTest.strength).toBe(donaldDuckPieSlinger.strength);
//
//     TestStore.store.tableStore.getTable("player_two").updateLore(10);
//
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(10);
//     Expect(cardUnderTest.strength).toBe(donaldDuckPieSlinger.strength + 6);
//   });
// });
//
