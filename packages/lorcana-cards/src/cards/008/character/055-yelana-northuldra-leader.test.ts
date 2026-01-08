// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   deweyLovableShowoff,
//   yelanaNorthuldraLeader,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Yelana - Northuldra Leader", () => {
//   it("WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: yelanaNorthuldraLeader.cost,
//       hand: [yelanaNorthuldraLeader],
//       play: [deweyLovableShowoff],
//     });
//
//     const cardGainsChalleng = testEngine.getCardModel(deweyLovableShowoff);
//     expect(cardGainsChalleng.hasChallenger).toBe(false);
//     await testEngine.playCard(yelanaNorthuldraLeader);
//     await testEngine.resolveTopOfStack({ targets: [cardGainsChalleng] });
//     expect(cardGainsChalleng.hasChallenger).toBe(true);
//     // await testEngine.acceptOptionalLayer();
//     //
//   });
// });
//
