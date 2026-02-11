// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { genieOfTheLamp } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Genie - Of the Lamp", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [genieOfTheLamp],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(genieOfTheLamp);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("LET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: genieOfTheLamp.cost,
//       Play: [genieOfTheLamp, deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(genieOfTheLamp);
//     Const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(targetCard.strength).toBe(deweyLovableShowoff.strength);
//
//     Await testEngine.exertCard(cardUnderTest);
//
//     Expect(targetCard.strength).toBe(deweyLovableShowoff.strength + 2);
//     Expect(cardUnderTest.strength).toBe(genieOfTheLamp.strength);
//
//     Await testEngine.passTurn();
//
//     Expect(cardUnderTest.ready).toBe(false);
//     Expect(targetCard.strength).toBe(deweyLovableShowoff.strength + 2);
//
//     // Turn ends, Genie is ready again
//     Await testEngine.passTurn();
//
//     Expect(cardUnderTest.ready).toBe(true);
//     Expect(targetCard.strength).toBe(deweyLovableShowoff.strength);
//
//     Await testEngine.exertCard(cardUnderTest);
//     Expect(targetCard.strength).toBe(deweyLovableShowoff.strength + 2);
//
//     Await testEngine.passTurn();
//
//     Expect(targetCard.strength).toBe(deweyLovableShowoff.strength + 2);
//
//     CardUnderTest.banish();
//     Expect(cardUnderTest.zone).toBe("discard");
//     Expect(targetCard.strength).toBe(deweyLovableShowoff.strength);
//   });
// });
//
