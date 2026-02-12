// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   NanaCanineCaregiver,
//   VioletSabrewingSeniorJuniorWoodchuck,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nana - Canine Caregiver", () => {
//   It("HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nanaCanineCaregiver.cost,
//         Hand: [nanaCanineCaregiver, goofyKnightForADay],
//       },
//       {
//         Play: [violetSabrewingSeniorJuniorWoodchuck],
//       },
//     );
//
//     Await testEngine.playCard(nanaCanineCaregiver);
//     Await testEngine.acceptOptionalLayer();
//
//     Await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] }, true);
//     Expect(testEngine.getCardModel(goofyKnightForADay).zone).toBe("discard");
//
//     Await testEngine.resolveTopOfStack({
//       Targets: [violetSabrewingSeniorJuniorWoodchuck],
//     });
//     Expect(
//       TestEngine.getCardModel(violetSabrewingSeniorJuniorWoodchuck).zone,
//     ).toBe("hand");
//   });
// });
//
