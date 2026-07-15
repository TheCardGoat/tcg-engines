// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { mauricesWorkshop } from "../../002/items/168-maurices-workshop";
// Import { monsieurDArqueDespicableProprietor } from "./157-monsieur-darque-despicable-proprietor";
//
// Describe("Monsieur D'arque - Contemptible Owner", () => {
//   It("I'M HERE TO COLLECT MY DUE Whenever this character is sent on an adventure, you can choose one of your items and banish it to draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: monsieurDArqueDespicableProprietor.cost,
//       Play: [monsieurDArqueDespicableProprietor, mauricesWorkshop],
//     });
//
//     // await testEngine.playCard(monsieurDArqueDespicableProprietor);
//     Const cardUnderTest = testEngine.getCardModel(
//       MonsieurDArqueDespicableProprietor,
//     );
//     Const itemToBanish = testEngine.getCardModel(mauricesWorkshop);
//
//     Await testEngine.questCard(cardUnderTest);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [itemToBanish] });
//
//     Expect(testEngine.getCardsByZone("hand").length).toBe(1);
//     Expect(itemToBanish.zone).toBe("discard");
//   });
// });
//
