// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { sisuWiseFriend } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   SisuInHerElement,
//   SisuUnitingDragon,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sisu - Uniting Dragon", () => {
//   Describe("TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.", () => {
//     It("Two dragons on top", async () => {
//       Const testEngine = new TestEngine({
//         Play: [sisuUnitingDragon],
//         Deck: [sisuInHerElement, sisuWiseFriend],
//       });
//
//       Await testEngine.questCard(sisuUnitingDragon);
//
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: { hand: [sisuWiseFriend] },
//         },
//         True,
//       );
//
//       Expect(testEngine.getCardModel(sisuWiseFriend).zone).toBe("hand");
//
//       Await testEngine.resolveTopOfStack({
//         Scry: { hand: [sisuInHerElement] },
//       });
//
//       Expect(testEngine.getCardModel(sisuInHerElement).zone).toBe("hand");
//     });
//   });
// });
//
