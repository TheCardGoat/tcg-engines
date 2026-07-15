// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnnaMysticalMajesty,
//   MonstroWhaleOfAWhale,
//   VanellopeVonSchweetzCandyMechanic,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Anna - Mystical Majesty", () => {
//   It("**EXCEPTIONAL POWER** When you play this character, exert all opposing characters.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: annaMysticalMajesty.cost,
//         Hand: [annaMysticalMajesty],
//       },
//       {
//         Play: [vanellopeVonSchweetzCandyMechanic, monstroWhaleOfAWhale],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(annaMysticalMajesty);
//     Const targets = [
//       TestStore.getCard(vanellopeVonSchweetzCandyMechanic),
//       TestStore.getCard(monstroWhaleOfAWhale),
//     ];
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({});
//     Targets.forEach((target) => {
//       Expect(target.meta.exerted).toEqual(true);
//     });
//   });
// });
//
