// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { heiheiBumblingRooster } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Heihei - Bumbling Rooster", () => {
//   Describe("**LET’S FATTEN YOU UP** When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
//     It("Opponent has more than you", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: heiheiBumblingRooster.cost,
//           Hand: [heiheiBumblingRooster],
//           Deck: [heiheiBoatSnack],
//         },
//         {
//           Inkwell: heiheiBumblingRooster.cost + 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(heiheiBumblingRooster);
//       Const target = testStore.getCard(heiheiBoatSnack);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//
//       Expect(target.zone).toEqual("inkwell");
//       Expect(target.ready).toEqual(false);
//     });
//
//     It("Opponent has same as you", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: heiheiBumblingRooster.cost,
//           Hand: [heiheiBumblingRooster],
//           Deck: [heiheiBoatSnack],
//         },
//         {
//           Inkwell: heiheiBumblingRooster.cost,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(heiheiBumblingRooster);
//       Const target = testStore.getCard(heiheiBoatSnack);
//
//       CardUnderTest.playFromHand();
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(target.zone).toEqual("deck");
//     });
//   });
// });
//
