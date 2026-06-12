import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ramaVigilantFather } from "./109-rama-vigilant-father";
import { headlessManhorseManny } from "./004-headless-manhorse-manny";
import { theHornedKingWickedRuler } from "./036-the-horned-king-wicked-ruler";

const weakCharacter = createMockCharacter({
  id: "rama-test-weak-char",
  name: "Weak Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Rama - Vigilant Father", () => {
  describe("PROTECTION OF THE PACK - Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.", () => {
    it("triggers when you play another character with 5 or more strength, readies Rama and applies cant-quest", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ramaVigilantFather, exerted: true }],
          hand: [headlessManhorseManny],
          inkwell: headlessManhorseManny.cost,
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(true);

      expect(testEngine.asPlayerOne().playCard(headlessManhorseManny)).toBeSuccessfulCommand();

      // PROTECTION OF THE PACK should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability (ready Rama)
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ramaVigilantFather, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Rama should now be ready
      expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(false);

      // Rama should have cant-quest restriction
      expect(testEngine.asPlayerOne()).toHaveRestriction({
        card: ramaVigilantFather,
        restriction: "cant-quest",
      });
    });

    it("does not trigger when you play a character with less than 5 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ramaVigilantFather, exerted: true }],
          hand: [weakCharacter],
          inkwell: weakCharacter.cost,
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(weakCharacter)).toBeSuccessfulCommand();

      // PROTECTION OF THE PACK should NOT trigger for strength 3 character
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Rama should still be exerted
      expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(true);
    });

    it("does not trigger when Rama himself is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ramaVigilantFather],
          inkwell: ramaVigilantFather.cost,
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(ramaVigilantFather)).toBeSuccessfulCommand();

      // Should not trigger his own ability when he's played
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("can decline the optional - Rama stays exerted with no restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ramaVigilantFather, exerted: true }],
          hand: [headlessManhorseManny],
          inkwell: headlessManhorseManny.cost,
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(true);

      expect(testEngine.asPlayerOne().playCard(headlessManhorseManny)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ramaVigilantFather, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Rama should still be exerted
      expect(testEngine.asPlayerOne().isExerted(ramaVigilantFather)).toBe(true);

      // No cant-quest restriction applied
      expect(testEngine.hasRestriction(ramaVigilantFather, "cant-quest")).toBe(false);
    });

    it("does not trigger when playing a character with strength 3 (The Horned King)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ramaVigilantFather, exerted: true }],
          hand: [theHornedKingWickedRuler],
          inkwell: theHornedKingWickedRuler.cost,
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(theHornedKingWickedRuler)).toBeSuccessfulCommand();

      // PROTECTION OF THE PACK should NOT trigger for strength 3 character
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BalooFriendAndGuardian,
//   HeadlessManhorseManny, // cost 6 - should trigger
//   KaaHiddenSerpent,
//   RamaVigilantFather,
//   TheHornedKingWickedRuler, // cost 4 - should not trigger
// } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rama - Vigilant Father", () => {
//   Describe("PROTECTION OF THE PACK", () => {
//     It("1. should trigger when you play another character with strength 5 or more", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ramaVigilantFather],
//         Hand: [headlessManhorseManny],
//         Inkwell: headlessManhorseManny.cost,
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(ramaVigilantFather);
//       Const cardInHand = testEngine.getCardModel(headlessManhorseManny);
//
//       // Quest with Rama to exert him
//       Await testEngine.questCard(cardUnderTest);
//       Expect(cardUnderTest.ready).toBe(false);
//
//       Await testEngine.playCard(cardInHand, {}, true);
//
//       // Accept Bodyguard
//       Await testEngine.acceptOptionalAbility();
//
//       Expect(cardUnderTest.ready).toBe(true);
//       Expect(cardUnderTest.canQuest).toBe(false);
//     });
//
//     It("2. should not trigger when you play another character with cost less than 5", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ramaVigilantFather],
//         Hand: [theHornedKingWickedRuler], // Cost 4
//         Inkwell: theHornedKingWickedRuler.cost,
//       });
//
//       // Verify Rama's trigger should not fire for cost 4 character
//       Await testEngine.playCard(theHornedKingWickedRuler);
//
//       // PROTECTION OF THE PACK should NOT trigger for cost 4
//       Const protectionAbility = testEngine.store.stackLayerStore.layers.find(
//         (layer) => layer.ability.name === "PROTECTION OF THE PACK",
//       );
//       Expect(protectionAbility).toBeUndefined();
//     });
//
//     It("3. should not trigger when you play Rama himself", async () => {
//       Const testEngine = new TestEngine({
//         Hand: [ramaVigilantFather],
//         Inkwell: ramaVigilantFather.cost,
//       });
//
//       // Play Rama
//       Await testEngine.playCard(ramaVigilantFather);
//
//       // Should not trigger his own ability when he's played
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//
//     It("4. should ready Rama when you accept the optional ability", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ramaVigilantFather],
//         Hand: [headlessManhorseManny],
//         Inkwell: headlessManhorseManny.cost,
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(ramaVigilantFather);
//
//       // Exert Rama
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(cardUnderTest.ready).toBe(false);
//
//       Await testEngine.playCard(headlessManhorseManny, {}, true);
//
//       // Accept Bodyguard
//       Await testEngine.acceptOptionalAbility();
//
//       // Rama should be ready
//       Expect(cardUnderTest.ready).toBe(true);
//     });
//
//     It("5. should prevent Rama from questing for the rest of the turn when readied", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ramaVigilantFather],
//         Hand: [kaaHiddenSerpent],
//         Inkwell: kaaHiddenSerpent.cost,
//       });
//
//       // Play Rama first
//       Await testEngine.tapCard(ramaVigilantFather);
//
//       // Play another character with cost 6
//       Await testEngine.playCard(kaaHiddenSerpent);
//
//       // Accept optional ability
//       Await testEngine.resolveOptionalAbility();
//
//       // Rama should be ready but unable to quest
//       Expect(testEngine.getCardModel(ramaVigilantFather).meta.exerted).toBe(
//         False,
//       );
//       Expect(testEngine.getCardModel(ramaVigilantFather).canQuest).toBe(false);
//     });
//   });
// });
//
