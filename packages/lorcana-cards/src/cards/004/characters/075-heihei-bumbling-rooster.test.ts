// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { heiheiBumblingRooster } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Heihei - Bumbling Rooster", () => {
//   describe("**LET’S FATTEN YOU UP** When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
//     it("Opponent has more than you", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: heiheiBumblingRooster.cost,
//           hand: [heiheiBumblingRooster],
//           deck: [heiheiBoatSnack],
//         },
//         {
//           inkwell: heiheiBumblingRooster.cost + 1,
//         },
//       );
//
//       const cardUnderTest = testStore.getCard(heiheiBumblingRooster);
//       const target = testStore.getCard(heiheiBoatSnack);
//
//       cardUnderTest.playFromHand();
//       testStore.resolveOptionalAbility();
//
//       expect(target.zone).toEqual("inkwell");
//       expect(target.ready).toEqual(false);
//     });
//
//     it("Opponent has same as you", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: heiheiBumblingRooster.cost,
//           hand: [heiheiBumblingRooster],
//           deck: [heiheiBoatSnack],
//         },
//         {
//           inkwell: heiheiBumblingRooster.cost,
//         },
//       );
//
//       const cardUnderTest = testStore.getCard(heiheiBumblingRooster);
//       const target = testStore.getCard(heiheiBoatSnack);
//
//       cardUnderTest.playFromHand();
//       expect(testStore.stackLayers).toHaveLength(0);
//       expect(target.zone).toEqual("deck");
//     });
//   });
// });
//
