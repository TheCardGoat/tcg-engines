// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   YelanaNorthuldraLeader,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yelana - Northuldra Leader", () => {
//   It("WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: yelanaNorthuldraLeader.cost,
//       Hand: [yelanaNorthuldraLeader],
//       Play: [deweyLovableShowoff],
//     });
//
//     Const cardGainsChalleng = testEngine.getCardModel(deweyLovableShowoff);
//     Expect(cardGainsChalleng.hasChallenger).toBe(false);
//     Await testEngine.playCard(yelanaNorthuldraLeader);
//     Await testEngine.resolveTopOfStack({ targets: [cardGainsChalleng] });
//     Expect(cardGainsChalleng.hasChallenger).toBe(true);
//     // await testEngine.acceptOptionalLayer();
//     //
//   });
// });
//
