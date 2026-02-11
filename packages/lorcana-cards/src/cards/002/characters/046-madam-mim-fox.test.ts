// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it, test } from "@jest/globals";
// Import {
//   MadamMimFox,
//   PinocchioStarAttraction,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Madam Mim - Fox", () => {
//   Test("**Rush** _(This character can challenge the turn they’re played.)_", () => {
//     Const testStore = new TestStore({
//       Play: [madamMimFox],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", madamMimFox.id);
//
//     Expect(cardUnderTest.hasRush).toEqual(true);
//   });
//
//   Describe("**CHASING THE RABBIT** When you play this character, banish her or return another chosen character of yours to your hand.", () => {
//     It("skipping the effect banishes her", () => {
//       Const testStore = new TestStore({
//         Inkwell: madamMimFox.cost,
//         Hand: [madamMimFox],
//         Play: [pinocchioStarAttraction],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", madamMimFox.id);
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
//         Inkwell: madamMimFox.cost,
//         Hand: [madamMimFox],
//         Play: [pinocchioStarAttraction],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", madamMimFox.id);
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
