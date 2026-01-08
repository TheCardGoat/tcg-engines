// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   annaEagerAcolyte,
//   rafikiShamanDuelist,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Anna - Eager Acolyte", () => {
//   it("**GROWING POWERS** When you play this character, each opponent choses and exerts on of their ready characters.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: annaEagerAcolyte.cost,
//         hand: [annaEagerAcolyte],
//       },
//       {
//         play: [rafikiShamanDuelist],
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(annaEagerAcolyte);
//     const target = testStore.getCard(rafikiShamanDuelist);
//     cardUnderTest.playFromHand();
//     testStore.changePlayer("player_two");
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.meta.exerted).toBe(true);
//   });
// });
//
