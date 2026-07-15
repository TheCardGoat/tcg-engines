// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnnaTrustingSister,
//   ElsaFierceProtector,
//   RoquefortLockExpert,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Anna - Trusting Sister", () => {
//   It("WE CAN DO THIS TOGETHER When you play this character, if you have a character named Elsa in play, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: annaTrustingSister.cost + elsaFierceProtector.cost,
//       Hand: [annaTrustingSister],
//       Play: [elsaFierceProtector],
//       Deck: [roquefortLockExpert],
//     });
//
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//     Const initialInkwellCount =
//       AnnaTrustingSister.cost + elsaFierceProtector.cost;
//
//     Await testEngine.playCard(annaTrustingSister);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getZonesCardCount().inkwell).toBe(
//       InitialInkwellCount + 1,
//     );
//     Expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount - 1);
//
//     Const inkwellCards = testEngine.getCardsByZone("inkwell");
//     Const inkedCard = inkwellCards[inkwellCards.length - 1];
//     Expect(inkedCard).toBeDefined();
//     If (inkedCard) {
//       Expect(inkedCard.meta?.exerted).toBe(true);
//     }
//   });
//
//   It("should NOT put a card into inkwell if Elsa is NOT in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: annaTrustingSister.cost,
//       Hand: [annaTrustingSister],
//       Play: [], // No Elsa in play
//       Deck: [roquefortLockExpert],
//     });
//
//     Const initialInkwellCount = testEngine.getZonesCardCount().inkwell;
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     Await testEngine.playCard(annaTrustingSister);
//     Try {
//       Await testEngine.acceptOptionalLayer();
//     } catch (e) {
//       // Expected if no optional ability is on stack
//     }
//
//     Expect(testEngine.getZonesCardCount().inkwell).toBe(initialInkwellCount);
//     Expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount);
//   });
//   It("should NOT put a card into inkwell if Elsa is in play but player declines", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: annaTrustingSister.cost + elsaFierceProtector.cost,
//       Hand: [annaTrustingSister],
//       Play: [elsaFierceProtector], // Elsa is in play
//       Deck: [roquefortLockExpert],
//     });
//
//     Const initialInkwellCount = testEngine.getZonesCardCount().inkwell;
//     Const initialDeckCount = testEngine.getZonesCardCount().deck;
//
//     Await testEngine.playCard(annaTrustingSister);
//
//     Await testEngine.skipTopOfStack(); // Player chooses NOT to use the ability
//
//     Expect(testEngine.getZonesCardCount().inkwell).toBe(initialInkwellCount);
//     Expect(testEngine.getZonesCardCount().deck).toBe(initialDeckCount);
//   });
// });
//
