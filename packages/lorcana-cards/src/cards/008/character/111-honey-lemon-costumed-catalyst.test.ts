// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   sisuEmboldenedWarrior,
//   sisuEmpoweredSibling,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import {
//   deweyLovableShowoff,
//   honeyLemonCostumedCatalyst,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Honey Lemon - Costumed Catalyst", () => {
//   it("LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: sisuEmpoweredSibling.cost,
//       play: [
//         honeyLemonCostumedCatalyst,
//         sisuEmboldenedWarrior,
//         deweyLovableShowoff,
//       ],
//       hand: [sisuEmpoweredSibling],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(honeyLemonCostumedCatalyst);
//     const target = testEngine.getCardModel(deweyLovableShowoff);
//     const cardToPlay = testEngine.getCardModel(sisuEmpoweredSibling);
//     const cardToShift = testEngine.getCardModel(sisuEmboldenedWarrior);
//
//     await testEngine.shiftCard({
//       shifted: sisuEmboldenedWarrior,
//       shifter: sisuEmpoweredSibling,
//     });
//     //     testEngine.stackLayers.map(x => console.log("------ STACK: " + x.name + " - " + x.description + " - Optional: " + x.isOptional() + " -------------------"))
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toEqual("hand");
//   });
// });
//
