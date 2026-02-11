// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { madamMimSnake } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   AladdinBraveRescuer,
//   AladdinResoluteSwordsman,
//   MagicBroomIlluminaryKeeper,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Broom - Illuminary Keeper", () => {
//   Describe("**NICE AND TIDY** Whenever you play another character, you man banish this character to draw a card.", () => {
//     It("should banish Magic Broom - Illuminary Keeper and draw a card when playing Aladdin - Resolute Swordsman", () => {
//       Const testStore = new TestStore({
//         Inkwell: aladdinResoluteSwordsman.cost,
//         Play: [magicBroomIlluminaryKeeper],
//         Hand: [aladdinResoluteSwordsman],
//         Deck: [aladdinBraveRescuer],
//       });
//
//       Const trigger = testStore.getCard(aladdinResoluteSwordsman);
//       Trigger.playFromHand();
//
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getZonesCardCount().deck).toEqual(0);
//       Expect(testStore.getZonesCardCount().hand).toEqual(1);
//     });
//
//     It("should not banish Magic Broom - Illuminary Keeper and draw a card when playing Aladdin - Brave Rescuer", () => {
//       Const testStore = new TestStore({
//         Inkwell: aladdinResoluteSwordsman.cost,
//         Play: [magicBroomIlluminaryKeeper],
//         Hand: [aladdinResoluteSwordsman],
//         Deck: [aladdinBraveRescuer],
//       });
//
//       Const trigger = testStore.getByZoneAndId(
//         "hand",
//         AladdinResoluteSwordsman.id,
//       );
//       Trigger.playFromHand();
//
//       TestStore.skipOptionalAbility();
//
//       Expect(testStore.getZonesCardCount().deck).toEqual(1);
//       Expect(testStore.getZonesCardCount().hand).toEqual(0);
//     });
//   });
// });
//
// Describe("Regressiom", () => {
//   It("Should not bounce AND draw at the same time", async () => {
//     Const testEngine = new TestEngine({
//       Deck: 1,
//       Inkwell: madamMimSnake.cost,
//       Hand: [madamMimSnake],
//       Play: [magicBroomIlluminaryKeeper],
//     });
//
//     Await testEngine.playCard(madamMimSnake);
//
//     // Accept Madam Mim's ability
//     Await testEngine.acceptOptionalLayer();
//
//     // Bouncing Magic Broom
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [magicBroomIlluminaryKeeper],
//       },
//       True,
//     );
//
//     // Broom trigger is in the bag
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     // Accept Broom's ability
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1, // Broom is in hand
//         Deck: 1,
//       }),
//     );
//   });
// });
//
