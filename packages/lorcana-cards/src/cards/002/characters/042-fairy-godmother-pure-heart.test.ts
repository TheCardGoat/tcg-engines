// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CinderellaBallroomSensation,
//   FairyGodmotherPureHeart,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fairy Godmother - Pure Heart", () => {
//   Describe("**JUST LEAVE IT TO ME** Whenever you play a character named Cinderella, you may exert chosen character.", () => {
//     It("Play a character named Cinderella", () => {
//       Const testStore = new TestStore({
//         Inkwell: cinderellaBallroomSensation.cost,
//         Hand: [cinderellaBallroomSensation],
//         Play: [fairyGodmotherPureHeart],
//       });
//
//       Const cardToTriggerEffect = testStore.getByZoneAndId(
//         "hand",
//         CinderellaBallroomSensation.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         FairyGodmotherPureHeart.id,
//       );
//
//       CardToTriggerEffect.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(target.ready).toBeFalsy();
//     });
//
//     It("Play a character not named Cinderella", () => {
//       Const testStore = new TestStore({
//         Inkwell: fairyGodmotherPureHeart.cost,
//         Hand: [fairyGodmotherPureHeart],
//         Play: [fairyGodmotherPureHeart],
//       });
//
//       Const cardToNotTriggerEffect = testStore.getByZoneAndId(
//         "hand",
//         FairyGodmotherPureHeart.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         FairyGodmotherPureHeart.id,
//       );
//
//       CardToNotTriggerEffect.playFromHand();
//       Expect(target.ready).toBeTruthy();
//     });
//   });
// });
//
