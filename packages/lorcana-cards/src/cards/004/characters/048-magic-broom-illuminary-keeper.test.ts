// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { madamMimSnake } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import {
//   aladdinBraveRescuer,
//   aladdinResoluteSwordsman,
//   magicBroomIlluminaryKeeper,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Magic Broom - Illuminary Keeper", () => {
//   describe("**NICE AND TIDY** Whenever you play another character, you man banish this character to draw a card.", () => {
//     it("should banish Magic Broom - Illuminary Keeper and draw a card when playing Aladdin - Resolute Swordsman", () => {
//       const testStore = new TestStore({
//         inkwell: aladdinResoluteSwordsman.cost,
//         play: [magicBroomIlluminaryKeeper],
//         hand: [aladdinResoluteSwordsman],
//         deck: [aladdinBraveRescuer],
//       });
//
//       const trigger = testStore.getCard(aladdinResoluteSwordsman);
//       trigger.playFromHand();
//
//       testStore.resolveOptionalAbility();
//
//       expect(testStore.getZonesCardCount().deck).toEqual(0);
//       expect(testStore.getZonesCardCount().hand).toEqual(1);
//     });
//
//     it("should not banish Magic Broom - Illuminary Keeper and draw a card when playing Aladdin - Brave Rescuer", () => {
//       const testStore = new TestStore({
//         inkwell: aladdinResoluteSwordsman.cost,
//         play: [magicBroomIlluminaryKeeper],
//         hand: [aladdinResoluteSwordsman],
//         deck: [aladdinBraveRescuer],
//       });
//
//       const trigger = testStore.getByZoneAndId(
//         "hand",
//         aladdinResoluteSwordsman.id,
//       );
//       trigger.playFromHand();
//
//       testStore.skipOptionalAbility();
//
//       expect(testStore.getZonesCardCount().deck).toEqual(1);
//       expect(testStore.getZonesCardCount().hand).toEqual(0);
//     });
//   });
// });
//
// describe("Regressiom", () => {
//   it("Should not bounce AND draw at the same time", async () => {
//     const testEngine = new TestEngine({
//       deck: 1,
//       inkwell: madamMimSnake.cost,
//       hand: [madamMimSnake],
//       play: [magicBroomIlluminaryKeeper],
//     });
//
//     await testEngine.playCard(madamMimSnake);
//
//     // Accept Madam Mim's ability
//     await testEngine.acceptOptionalLayer();
//
//     // Bouncing Magic Broom
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [magicBroomIlluminaryKeeper],
//       },
//       true,
//     );
//
//     // Broom trigger is in the bag
//     expect(testEngine.stackLayers).toHaveLength(1);
//
//     // Accept Broom's ability
//     await testEngine.acceptOptionalLayer();
//
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: 1, // Broom is in hand
//         deck: 1,
//       }),
//     );
//   });
// });
//
