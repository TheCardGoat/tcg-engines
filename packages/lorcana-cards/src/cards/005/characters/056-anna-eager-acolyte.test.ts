// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnnaEagerAcolyte,
//   RafikiShamanDuelist,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Anna - Eager Acolyte", () => {
//   It("**GROWING POWERS** When you play this character, each opponent choses and exerts on of their ready characters.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: annaEagerAcolyte.cost,
//         Hand: [annaEagerAcolyte],
//       },
//       {
//         Play: [rafikiShamanDuelist],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(annaEagerAcolyte);
//     Const target = testStore.getCard(rafikiShamanDuelist);
//     CardUnderTest.playFromHand();
//     TestStore.changePlayer("player_two");
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.exerted).toBe(true);
//   });
// });
//
