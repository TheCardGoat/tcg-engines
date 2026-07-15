// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   MadamMimFox,
//   MadamMimSnake,
//   MerlinShapeshifter,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin - Shapeshifter", () => {
//   Describe("**BATTLE OF WITS** Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.", () => {
//     It("Effect only active until end of turn", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: madamMimFox.cost,
//           Hand: [madamMimFox],
//           Play: [merlinShapeshifter, goofyKnightForADay],
//         },
//         { deck: 1 },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         MerlinShapeshifter.id,
//       );
//       Const otherCard = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//       Const bounce = testStore.getByZoneAndId("hand", madamMimFox.id);
//
//       Expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore);
//
//       Bounce.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [otherCard] });
//
//       Expect(otherCard.zone).toEqual("hand");
//       Expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore + 1);
//
//       TestStore.passTurn();
//
//       Expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore);
//     });
//
//     It("accumulates previous effects", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: madamMimFox.cost + madamMimSnake.cost + madamMimFox.cost,
//           Hand: [madamMimFox],
//           Play: [merlinShapeshifter, madamMimSnake],
//         },
//         { deck: 1 },
//       );
//
//       Await testEngine.playCard(madamMimFox);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [madamMimSnake] }, true);
//
//       Expect(testEngine.getCardModel(madamMimSnake).zone).toEqual("hand");
//
//       // expect(testEngine.getCardModel(merlinShapeshifter).lore).toEqual(
//       //   merlinShapeshifter.lore,
//       // );
//       // await testEngine.resolveOptionalAbility();
//       Expect(testEngine.getCardModel(merlinShapeshifter).lore).toEqual(
//         MerlinShapeshifter.lore + 1,
//       );
//
//       Await testEngine.playCard(madamMimSnake);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [madamMimFox] }, true);
//
//       Expect(testEngine.getCardModel(madamMimFox).zone).toEqual("hand");
//       // await testEngine.resolveOptionalAbility();
//       Expect(testEngine.getCardModel(merlinShapeshifter).lore).toEqual(
//         MerlinShapeshifter.lore + 2,
//       );
//
//       Await testEngine.playCard(madamMimFox);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [madamMimSnake] }, true);
//
//       Expect(testEngine.getCardModel(madamMimSnake).zone).toEqual("hand");
//       // await testEngine.resolveOptionalAbility();
//       Expect(testEngine.getCardModel(merlinShapeshifter).lore).toEqual(
//         MerlinShapeshifter.lore + 3,
//       );
//     });
//   });
// });
//
