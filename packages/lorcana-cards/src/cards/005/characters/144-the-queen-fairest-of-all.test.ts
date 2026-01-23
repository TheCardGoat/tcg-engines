// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   theQueenCrownOfTheCouncil,
//   theQueenCruelestOfAll,
//   theQueenFairestOfAll,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("The Queen - Fairest of All", () => {
//   it("**REFLECTIONS OF VANITY** For each other character named The Queen you have in play, this character gets +1 {L}.", () => {
//     const testStore = new TestStore({
//       inkwell: theQueenFairestOfAll.cost,
//       play: [
//         theQueenFairestOfAll,
//         theQueenCrownOfTheCouncil,
//         theQueenCruelestOfAll,
//       ],
//     });
//
//     expect(testStore.getCard(theQueenFairestOfAll).lore).toEqual(
//       theQueenFairestOfAll.lore + 2,
//     );
//   });
// });
//
