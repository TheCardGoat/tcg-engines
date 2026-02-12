// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { expect, it } from "@jest/globals";
// Import {
//   MauiDemiGod,
//   PrincePhillipDragonSlayer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Export const princePhillipTestCase = async () => {
//   Const testStore = new TestEngine(
//     {
//       Play: [princePhillipDragonSlayer],
//     },
//     {
//       Play: [mauiDemiGod],
//     },
//   );
//
//   Await testStore.challenge({
//     Attacker: princePhillipDragonSlayer,
//     Defender: mauiDemiGod,
//     ExertDefender: true,
//   });
//
//   Expect(testStore.getCardModel(princePhillipDragonSlayer).zone).toEqual(
//     "discard",
//   );
//   Expect(testStore.getCardModel(mauiDemiGod).zone).toEqual("discard");
// };
//
// It("Prince Phillip Dragon Slayer", async () => {
//   Await princePhillipTestCase();
// });
//
