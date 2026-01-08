// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import {
//   nanaCanineCaregiver,
//   violetSabrewingSeniorJuniorWoodchuck,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Nana - Canine Caregiver", () => {
//   it("HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: nanaCanineCaregiver.cost,
//         hand: [nanaCanineCaregiver, goofyKnightForADay],
//       },
//       {
//         play: [violetSabrewingSeniorJuniorWoodchuck],
//       },
//     );
//
//     await testEngine.playCard(nanaCanineCaregiver);
//     await testEngine.acceptOptionalLayer();
//
//     await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] }, true);
//     expect(testEngine.getCardModel(goofyKnightForADay).zone).toBe("discard");
//
//     await testEngine.resolveTopOfStack({
//       targets: [violetSabrewingSeniorJuniorWoodchuck],
//     });
//     expect(
//       testEngine.getCardModel(violetSabrewingSeniorJuniorWoodchuck).zone,
//     ).toBe("hand");
//   });
// });
//
