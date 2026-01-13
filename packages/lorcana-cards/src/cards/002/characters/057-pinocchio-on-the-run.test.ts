// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   arthurTrainedSwordsman,
//   pinocchioOnTheRun,
//   yzmaWithoutBeautySleep,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { theSorcerersSpellbook } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Pinocchio - On the Run", () => {
//   describe("**LISTEN TO YOUR CONSCIENCE** When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.", () => {
//     it("return target item to owners hand", () => {
//       const testStore = new TestStore({
//         inkwell: pinocchioOnTheRun.cost,
//         hand: [pinocchioOnTheRun],
//         play: [yzmaWithoutBeautySleep, theSorcerersSpellbook],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         pinocchioOnTheRun.id,
//       );
//
//       const target = testStore.getByZoneAndId("play", theSorcerersSpellbook.id);
//
//       cardUnderTest.playFromHand();
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({ targets: [target] });
//       expect(
//         testStore.getByZoneAndId("hand", theSorcerersSpellbook.id),
//       ).toBeTruthy();
//     });
//     it("return target character to owners hand", () => {
//       const testStore = new TestStore({
//         inkwell: pinocchioOnTheRun.cost,
//         hand: [pinocchioOnTheRun],
//         play: [yzmaWithoutBeautySleep, theSorcerersSpellbook],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         pinocchioOnTheRun.id,
//       );
//
//       const target = testStore.getByZoneAndId(
//         "play",
//         yzmaWithoutBeautySleep.id,
//       );
//
//       cardUnderTest.playFromHand();
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({ targets: [target] });
//       expect(
//         testStore.getByZoneAndId("hand", yzmaWithoutBeautySleep.id),
//       ).toBeTruthy();
//     });
//     it("skip for invalid targets", () => {
//       const testStore = new TestStore({
//         inkwell: pinocchioOnTheRun.cost,
//         hand: [pinocchioOnTheRun],
//         play: [arthurTrainedSwordsman],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         pinocchioOnTheRun.id,
//       );
//
//       cardUnderTest.playFromHand();
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({});
//       expect(
//         testStore.getByZoneAndId("play", arthurTrainedSwordsman.id),
//       ).toBeTruthy();
//     });
//   });
// });
//
