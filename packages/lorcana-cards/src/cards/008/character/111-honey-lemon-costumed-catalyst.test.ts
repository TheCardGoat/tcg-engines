// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   SisuEmboldenedWarrior,
//   SisuEmpoweredSibling,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   DeweyLovableShowoff,
//   HoneyLemonCostumedCatalyst,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Honey Lemon - Costumed Catalyst", () => {
//   It("LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: sisuEmpoweredSibling.cost,
//       Play: [
//         HoneyLemonCostumedCatalyst,
//         SisuEmboldenedWarrior,
//         DeweyLovableShowoff,
//       ],
//       Hand: [sisuEmpoweredSibling],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(honeyLemonCostumedCatalyst);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//     Const cardToPlay = testEngine.getCardModel(sisuEmpoweredSibling);
//     Const cardToShift = testEngine.getCardModel(sisuEmboldenedWarrior);
//
//     Await testEngine.shiftCard({
//       Shifted: sisuEmboldenedWarrior,
//       Shifter: sisuEmpoweredSibling,
//     });
//     //     testEngine.stackLayers.map(x => console.log("------ STACK: " + x.name + " - " + x.description + " - Optional: " + x.isOptional() + " -------------------"))
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
