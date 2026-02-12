// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurKingVictorious,
//   DocBoldKnight,
//   NalaMischievousCub,
//   PrinceNaveenUkulelePlayer,
//   TukeNorthernMoose,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Doc - Bold Knight", () => {
//   It("**DRASTIC MEASURES** When you play this character, you may discard your hand to draw 2 cards.", () => {
//     Const testStore = new TestStore({
//       Inkwell: docBoldKnight.cost,
//       Hand: [
//         DocBoldKnight,
//         ArthurKingVictorious,
//         NalaMischievousCub,
//         PrinceNaveenUkulelePlayer,
//         TukeNorthernMoose,
//       ],
//       Deck: 3,
//     });
//
//     Const cardUnderTest = testStore.getCard(docBoldKnight);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 2,
//         Deck: 1,
//         Discard: 4,
//       }),
//     );
//   });
// });
//
