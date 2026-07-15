// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CaterpillarCalmAndCollected,
//   HiramFlavershamToymaker,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { scarVengefulLion } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scar - Vengeful Lion", () => {
//   Describe("**LIFE'S NOT FAIR, IS IT?** Whenever one of your characters challenges a damaged character, you may draw a card.", () => {
//     It("DOES trigger when challenging a damaged character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 5,
//           Play: [scarVengefulLion, caterpillarCalmAndCollected],
//         },
//         {
//           Play: [hiramFlavershamToymaker],
//         },
//       );
//
//       Const defender = testEngine.getCardModel(hiramFlavershamToymaker);
//       Await testEngine.tapCard(defender);
//       // Damage the defender
//       Await testEngine.setCardDamage(hiramFlavershamToymaker, 1);
//
//       Const attacker = testEngine.getCardModel(caterpillarCalmAndCollected);
//       Const initialHandCount = testEngine.getZonesCardCount().hand;
//
//       Await testEngine.challenge({ attacker, defender });
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: initialHandCount + 1,
//           Deck: 4,
//         }),
//       );
//     });
//
//     It("DOES NOT trigger when challenging an undamaged character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 5,
//           Play: [scarVengefulLion, caterpillarCalmAndCollected],
//         },
//         {
//           Play: [hiramFlavershamToymaker],
//         },
//       );
//
//       Const defender = testEngine.getCardModel(hiramFlavershamToymaker);
//       Await testEngine.tapCard(defender);
//       // Defender has no damage
//
//       Const attacker = testEngine.getCardModel(caterpillarCalmAndCollected);
//       Const initialHandCount = testEngine.getZonesCardCount().hand;
//
//       Await testEngine.challenge({ attacker, defender });
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: initialHandCount,
//           Deck: 5,
//         }),
//       );
//     });
//
//     It("DOES NOT trigger when challenging a location (even if damaged)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 5,
//           Play: [scarVengefulLion, caterpillarCalmAndCollected],
//         },
//         {
//           Play: [hiddenCoveTranquilHaven],
//         },
//       );
//
//       Const defender = testEngine.getCardModel(hiddenCoveTranquilHaven);
//       // Damage the location
//       Await testEngine.setCardDamage(hiddenCoveTranquilHaven, 1);
//
//       Const attacker = testEngine.getCardModel(caterpillarCalmAndCollected);
//       Const initialHandCount = testEngine.getZonesCardCount().hand;
//
//       Await testEngine.challenge({ attacker, defender });
//
//       // Verify no ability was added to the stack
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       // Verify the ability name is NOT in the stack layers
//       Const hasScarAbility = testEngine.stackLayers.some(
//         (layer) => layer.ability?.name === "**LIFE'S NOT FAIR, IS IT?**",
//       );
//       Expect(hasScarAbility).toBe(false);
//
//       // Verify no card was drawn
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: initialHandCount,
//           Deck: 5,
//         }),
//       );
//     });
//   });
// });
//
