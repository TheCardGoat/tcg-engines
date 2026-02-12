// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LuisaMadrigalEntertainingMuscle,
//   VanellopeVonSchweetzCandyMechanic,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Vanellope Von Schweetz - Candy Mechanic", () => {
//   It("**YOU’VE GOT TO PAY TO PLAY** Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: vanellopeVonSchweetzCandyMechanic.cost,
//         Play: [vanellopeVonSchweetzCandyMechanic],
//       },
//       {
//         Play: [luisaMadrigalEntertainingMuscle],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(vanellopeVonSchweetzCandyMechanic);
//     Const target = testStore.getCard(luisaMadrigalEntertainingMuscle);
//
//     CardUnderTest.quest();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toBe(luisaMadrigalEntertainingMuscle.strength - 1);
//
//     TestStore.passTurn();
//
//     Expect(target.strength).toBe(luisaMadrigalEntertainingMuscle.strength - 1);
//
//     TestStore.passTurn();
//
//     Expect(target.strength).toBe(luisaMadrigalEntertainingMuscle.strength);
//   });
// });
//
