// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   luisaMadrigalEntertainingMuscle,
//   vanellopeVonSchweetzCandyMechanic,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Vanellope Von Schweetz - Candy Mechanic", () => {
//   it("**YOU’VE GOT TO PAY TO PLAY** Whenever this character quests, chosen opposing character gets -1 {S} until the start of your next turn.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: vanellopeVonSchweetzCandyMechanic.cost,
//         play: [vanellopeVonSchweetzCandyMechanic],
//       },
//       {
//         play: [luisaMadrigalEntertainingMuscle],
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(vanellopeVonSchweetzCandyMechanic);
//     const target = testStore.getCard(luisaMadrigalEntertainingMuscle);
//
//     cardUnderTest.quest();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.strength).toBe(luisaMadrigalEntertainingMuscle.strength - 1);
//
//     testStore.passTurn();
//
//     expect(target.strength).toBe(luisaMadrigalEntertainingMuscle.strength - 1);
//
//     testStore.passTurn();
//
//     expect(target.strength).toBe(luisaMadrigalEntertainingMuscle.strength);
//   });
// });
//
