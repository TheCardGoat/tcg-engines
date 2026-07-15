// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AllCardsById,
//   Type LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   GoGoTomagoMechanicalEngineer,
//   LittleSisterResponsibleRabbit,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Const testCard: LorcanitoCharacterCard = {
//   Id: "j8q1276827136",
//   Name: "Go Go Tomago",
//   Title: "TEST CARD",
//   Characteristics: ["floodborn", "hero", "inventor"],
//   Type: "character",
//   Abilities: [shiftAbility(4, "Go Go Tomago")],
//   Inkwell: false,
//   Colors: ["emerald", "sapphire"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Illustrator: "Beno Mel",
//   Number: 999,
//   Set: "008",
//   Rarity: "super_rare",
//   Lore: 2,
// };
//
// AllCardsById[testCard.id] = testCard;
//
// Describe("Go Go Tomago - Mechanical Engineer", () => {
//   It("NEED THIS! When you play a Floodborn character on this card, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goGoTomagoMechanicalEngineer.cost + 4,
//       Play: [goGoTomagoMechanicalEngineer],
//       Hand: [testCard],
//       Deck: [littleSisterResponsibleRabbit],
//     });
//     Const initialInkwellCount = testEngine.getZonesCardCount().inkwell;
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//     Await testEngine.shiftCard({
//       Shifter: testCard,
//       Shifted: goGoTomagoMechanicalEngineer,
//     });
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getZonesCardCount().inkwell).toBe(
//       InitialInkwellCount + 1,
//     );
//     Expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount - 1);
//     Const inkwellCards = testEngine.getCardsByZone("inkwell");
//     Const topCardInInkwell = inkwellCards[inkwellCards.length - 1];
//     Expect(topCardInInkwell).toBeDefined();
//     If (topCardInInkwell) {
//       Expect(topCardInInkwell.name).toBe(littleSisterResponsibleRabbit.name);
//       Expect(topCardInInkwell.meta?.exerted).toBe(true);
//     }
//   });
// });
//
