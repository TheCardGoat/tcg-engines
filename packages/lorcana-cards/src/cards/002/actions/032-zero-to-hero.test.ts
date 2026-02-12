// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { zeroToHero } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   ArthurTrainedSwordsman,
//   CheshireCatAlwaysGrinning,
//   FeliciaAlwaysHungry,
//   FlynnRiderConfidentVagabond,
//   LittleJohnLoyalFriend,
//   RabbitReluctantHost,
//   RatiganCriminalMastermind,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   FangCrossbow,
//   Pawpsicle,
// } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Zero To Hero", () => {
//   Describe("Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.", () => {
//     It("One character in play", () => {
//       Const testStore = new TestStore({
//         Inkwell: zeroToHero.cost,
//         Hand: [zeroToHero, feliciaAlwaysHungry],
//         Play: [pawpsicle, arthurTrainedSwordsman],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", zeroToHero.id);
//       Const target = testStore.getByZoneAndId("hand", feliciaAlwaysHungry.id);
//
//       CardUnderTest.playFromHand();
//       Target.playFromHand();
//
//       Expect(target.zone).toEqual("play");
//     });
//
//     It("Five character in play", () => {
//       Const testStore = new TestStore({
//         Inkwell: zeroToHero.cost,
//         Hand: [zeroToHero, rabbitReluctantHost],
//         Play: [
//           Pawpsicle,
//           FangCrossbow,
//           ArthurTrainedSwordsman,
//           CheshireCatAlwaysGrinning,
//           FlynnRiderConfidentVagabond,
//           LittleJohnLoyalFriend,
//           RatiganCriminalMastermind,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", zeroToHero.id);
//       Const target = testStore.getByZoneAndId("hand", rabbitReluctantHost.id);
//
//       CardUnderTest.playFromHand();
//       Target.playFromHand();
//
//       Expect(target.zone).toEqual("play");
//     });
//   });
// });
//
