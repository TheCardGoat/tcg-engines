// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { stichtNewDog } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { theUnderworldRiverStyx } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { stitchLittleTrickster } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Underworld - River Styx", () => {
//   It("**SAVE A SOUL** Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 3 + theUnderworldRiverStyx.moveCost,
//       Play: [theUnderworldRiverStyx, stitchLittleTrickster],
//       Discard: [stichtNewDog],
//     });
//
//     Await testEngine.moveToLocation({
//       Character: stitchLittleTrickster,
//       Location: theUnderworldRiverStyx,
//     });
//
//     Await testEngine.questCard(stitchLittleTrickster, {
//       Targets: [stichtNewDog],
//     });
//
//     Expect(testEngine.getCardModel(stichtNewDog).zone).toEqual("hand");
//     Expect(testEngine.getAvailableInkwellCardCount()).toBe(0);
//   });
// });
//
