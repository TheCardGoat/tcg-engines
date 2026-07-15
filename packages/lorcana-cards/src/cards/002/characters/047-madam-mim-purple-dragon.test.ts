// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it, test } from "@jest/globals";
// Import {
//   MadamMimPurpleDragon,
//   PinocchioStarAttraction,
//   WinnieThePoohHunnyWizard,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Madam Mim - Purple Dragon", () => {
//   Test("Evasive", () => {
//     Const testStore = new TestStore({
//       Play: [madamMimPurpleDragon],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MadamMimPurpleDragon.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//   });
//
//   Describe("**I WIN, I WIN!** When you play this character, banish her or return another 2 chosen characters of yours to your hand.", () => {
//     It("skipping the effect banishes her", () => {
//       Const testStore = new TestStore({
//         Inkwell: madamMimPurpleDragon.cost,
//         Hand: [madamMimPurpleDragon],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         MadamMimPurpleDragon.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//
//       Expect(cardUnderTest.zone).toEqual("discard");
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("return another chosen character of yours to your hand.", () => {
//       Const testStore = new TestStore({
//         Inkwell: madamMimPurpleDragon.cost,
//         Hand: [madamMimPurpleDragon],
//         Play: [pinocchioStarAttraction, winnieThePoohHunnyWizard],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         MadamMimPurpleDragon.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         PinocchioStarAttraction.id,
//       );
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         WinnieThePoohHunnyWizard.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target, anotherTarget] });
//
//       Expect(target.zone).toEqual("hand");
//       Expect(anotherTarget.zone).toEqual("hand");
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
