// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { letItGo } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { galeWindSpirit } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gale - Wind Spirit", () => {
//   Describe("**RECURRING GUST** When this character is banished, return this card to your hand.", () => {
//     It("Does not trigger on spell removal", () => {
//       Const testStore = new TestStore({
//         Inkwell: dragonFire.cost,
//         Hand: [dragonFire],
//         Play: [galeWindSpirit],
//       });
//
//       Const cardUnderTest = testStore.getCard(galeWindSpirit);
//       Const banisher = testStore.getCard(dragonFire);
//
//       Banisher.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [cardUnderTest] });
//
//       Expect(cardUnderTest.zone).toEqual("hand");
//     });
//
//     It("Does not trigger on inkwell removal", () => {
//       Const testStore = new TestStore({
//         Inkwell: dragonFire.cost,
//         Hand: [letItGo],
//         Play: [galeWindSpirit],
//       });
//
//       Const cardUnderTest = testStore.getCard(galeWindSpirit);
//       Const banisher = testStore.getCard(letItGo);
//
//       Banisher.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [cardUnderTest] });
//
//       Expect(cardUnderTest.zone).toEqual("inkwell");
//     });
//
//     It("Does triggers on removal", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [goofyKnightForADay],
//         },
//         {
//           Play: [galeWindSpirit],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(galeWindSpirit);
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Const banisher = testStore.getCard(goofyKnightForADay);
//
//       Banisher.challenge(cardUnderTest);
//
//       Expect(cardUnderTest.zone).toEqual("hand");
//     });
//   });
// });
//
