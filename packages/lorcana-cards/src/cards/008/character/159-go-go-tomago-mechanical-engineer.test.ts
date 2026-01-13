// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   allCardsById,
//   type LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   goGoTomagoMechanicalEngineer,
//   littleSisterResponsibleRabbit,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// const testCard: LorcanitoCharacterCard = {
//   id: "j8q1276827136",
//   name: "Go Go Tomago",
//   title: "TEST CARD",
//   characteristics: ["floodborn", "hero", "inventor"],
//   type: "character",
//   abilities: [shiftAbility(4, "Go Go Tomago")],
//   inkwell: false,
//   colors: ["emerald", "sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Beno Mel",
//   number: 999,
//   set: "008",
//   rarity: "super_rare",
//   lore: 2,
// };
//
// allCardsById[testCard.id] = testCard;
//
// describe("Go Go Tomago - Mechanical Engineer", () => {
//   it("NEED THIS! When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: goGoTomagoMechanicalEngineer.cost + 4,
//       play: [goGoTomagoMechanicalEngineer],
//       hand: [testCard],
//       deck: [littleSisterResponsibleRabbit],
//     });
//     const initialInkwellCount = testEngine.getZonesCardCount().inkwell;
//     const initialDeckCount = testEngine.getZonesCardCount().deck;
//     await testEngine.shiftCard({
//       shifter: testCard,
//       shifted: goGoTomagoMechanicalEngineer,
//     });
//     await testEngine.resolveOptionalAbility();
//
//     expect(testEngine.getZonesCardCount().inkwell).toBe(
//       initialInkwellCount + 1,
//     );
//     expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount - 1);
//     const inkwellCards = testEngine.getCardsByZone("inkwell");
//     const topCardInInkwell = inkwellCards[inkwellCards.length - 1];
//     expect(topCardInInkwell).toBeDefined();
//     if (topCardInInkwell) {
//       expect(topCardInInkwell.name).toBe(littleSisterResponsibleRabbit.name);
//       expect(topCardInInkwell.meta?.exerted).toBe(true);
//     }
//   });
// });
//
