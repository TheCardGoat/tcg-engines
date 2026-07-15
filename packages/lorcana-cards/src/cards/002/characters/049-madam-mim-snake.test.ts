// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it, test } from "@jest/globals";
// Import {
//   MadamMimSnake,
//   PinocchioStarAttraction,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { magicBroomIlluminaryKeeper } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Madam Mim - Snake", () => {
//   Describe("**JUST YOU WAIT** When you play this character, banish her or return another chosen character of yours to your hand.", () => {
//     It("skipping the effect banishes her", () => {
//       Const testStore = new TestStore({
//         Inkwell: madamMimSnake.cost,
//         Hand: [madamMimSnake],
//         Play: [pinocchioStarAttraction],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", madamMimSnake.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         PinocchioStarAttraction.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(target.zone).toEqual("play");
//       Expect(cardUnderTest.zone).toEqual("discard");
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("return another chosen character of yours to your hand.", () => {
//       Const testStore = new TestStore({
//         Inkwell: madamMimSnake.cost,
//         Hand: [madamMimSnake],
//         Play: [pinocchioStarAttraction],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", madamMimSnake.id);
//       Const target = testStore.getByZoneAndId(
//         "play",
//         PinocchioStarAttraction.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("hand");
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   Test("skipping the effect banishes her", async () => {
//     Const testEngine = new TestEngine({
//       Play: [magicBroomIlluminaryKeeper],
//       Inkwell: madamMimSnake.cost,
//       Hand: [madamMimSnake],
//     });
//
//     Await testEngine.playCard(madamMimSnake);
//
//     Await testEngine.skipTopOfStack();
//     Await testEngine.skipTopOfStack();
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getCardModel(madamMimSnake).zone).toEqual("discard");
//   });
// });
//
