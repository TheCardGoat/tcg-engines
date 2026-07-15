// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { peterPanFearless } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { peteBadGuy } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { peteWrestlingChamp } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pete - Wrestling Champ", () => {
//   Describe("**RE-PETE** {E} - Reveal the top card of your deck. If it’s a character card named Pete, you may play it for free.", () => {
//     It("Pete on top", () => {
//       Const testStore = new TestStore({
//         Play: [peteWrestlingChamp],
//         Deck: [peteBadGuy],
//       });
//
//       Const cardUnderTest = testStore.getCard(peteWrestlingChamp);
//
//       Const target = testStore.getCard(peteBadGuy);
//
//       CardUnderTest.activate();
//       TestStore.resolveOptionalAbility();
//
//       Expect(target.zone).toEqual("play");
//     });
//
//     It("Peter Pan on top", () => {
//       Const testStore = new TestStore({
//         Play: [peteWrestlingChamp],
//         Deck: [peterPanFearless],
//       });
//
//       Const cardUnderTest = testStore.getCard(peteWrestlingChamp);
//
//       Const target = testStore.getCard(peterPanFearless);
//
//       CardUnderTest.activate();
//
//       Expect(target.zone).toEqual("deck");
//       Expect(target.meta.revealed).toEqual(true);
//     });
//   });
// });
//
