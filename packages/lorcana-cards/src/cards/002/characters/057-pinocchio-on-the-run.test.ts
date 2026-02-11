// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurTrainedSwordsman,
//   PinocchioOnTheRun,
//   YzmaWithoutBeautySleep,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { theSorcerersSpellbook } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pinocchio - On the Run", () => {
//   Describe("**LISTEN TO YOUR CONSCIENCE** When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.", () => {
//     It("return target item to owners hand", () => {
//       Const testStore = new TestStore({
//         Inkwell: pinocchioOnTheRun.cost,
//         Hand: [pinocchioOnTheRun],
//         Play: [yzmaWithoutBeautySleep, theSorcerersSpellbook],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         PinocchioOnTheRun.id,
//       );
//
//       Const target = testStore.getByZoneAndId("play", theSorcerersSpellbook.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(
//         TestStore.getByZoneAndId("hand", theSorcerersSpellbook.id),
//       ).toBeTruthy();
//     });
//     It("return target character to owners hand", () => {
//       Const testStore = new TestStore({
//         Inkwell: pinocchioOnTheRun.cost,
//         Hand: [pinocchioOnTheRun],
//         Play: [yzmaWithoutBeautySleep, theSorcerersSpellbook],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         PinocchioOnTheRun.id,
//       );
//
//       Const target = testStore.getByZoneAndId(
//         "play",
//         YzmaWithoutBeautySleep.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(
//         TestStore.getByZoneAndId("hand", yzmaWithoutBeautySleep.id),
//       ).toBeTruthy();
//     });
//     It("skip for invalid targets", () => {
//       Const testStore = new TestStore({
//         Inkwell: pinocchioOnTheRun.cost,
//         Hand: [pinocchioOnTheRun],
//         Play: [arthurTrainedSwordsman],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         PinocchioOnTheRun.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({});
//       Expect(
//         TestStore.getByZoneAndId("play", arthurTrainedSwordsman.id),
//       ).toBeTruthy();
//     });
//   });
// });
//
