// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { agustinMadrigalClumsyDad } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { greatStoneDragon } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Great Stone Dragon", () => {
//   Describe("**ASLEEP** This item enters play exerted.", () => {
//     It("should enter play exerted", () => {
//       Const testStore = new TestStore({
//         Inkwell: greatStoneDragon.cost,
//         Hand: [greatStoneDragon],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         GreatStoneDragon.id,
//       );
//
//       CardUnderTest.playFromHand();
//
//       Expect(cardUnderTest.meta.exerted).toEqual(true);
//     });
//   });
//   Describe("**AWAKEN** {E}- Put a character card from your discard into your inkwell facedown and exerted.", () => {
//     It("Put a character card from your discard into your inkwell facedown and exerted.", () => {
//       Const testStore = new TestStore({
//         Inkwell: [],
//         Play: [greatStoneDragon],
//         Discard: [agustinMadrigalClumsyDad],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         GreatStoneDragon.id,
//       );
//       Const targetCard = testStore.getByZoneAndId(
//         "discard",
//         AgustinMadrigalClumsyDad.id,
//       );
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targets: [targetCard] });
//
//       Expect(cardUnderTest.meta.exerted).toEqual(true);
//       Expect(targetCard.zone).toEqual("inkwell");
//     });
//   });
// });
//
