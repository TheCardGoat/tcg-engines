// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   caterpillarCalmAndCollected,
//   hiramFlavershamToymaker,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// import { scarVengefulLion } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Scar - Vengeful Lion", () => {
//   describe("**LIFE'S NOT FAIR, IS IT?** Whenever one of your characters challenges a damaged character, you may draw a card.", () => {
//     it("DOES trigger when challenging a damaged character", async () => {
//       const testEngine = new TestEngine(
//         {
//           deck: 5,
//           play: [scarVengefulLion, caterpillarCalmAndCollected],
//         },
//         {
//           play: [hiramFlavershamToymaker],
//         },
//       );
//
//       const defender = testEngine.getCardModel(hiramFlavershamToymaker);
//       await testEngine.tapCard(defender);
//       // Damage the defender
//       await testEngine.setCardDamage(hiramFlavershamToymaker, 1);
//
//       const attacker = testEngine.getCardModel(caterpillarCalmAndCollected);
//       const initialHandCount = testEngine.getZonesCardCount().hand;
//
//       await testEngine.challenge({ attacker, defender });
//       await testEngine.resolveOptionalAbility();
//
//       expect(testEngine.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           hand: initialHandCount + 1,
//           deck: 4,
//         }),
//       );
//     });
//
//     it("DOES NOT trigger when challenging an undamaged character", async () => {
//       const testEngine = new TestEngine(
//         {
//           deck: 5,
//           play: [scarVengefulLion, caterpillarCalmAndCollected],
//         },
//         {
//           play: [hiramFlavershamToymaker],
//         },
//       );
//
//       const defender = testEngine.getCardModel(hiramFlavershamToymaker);
//       await testEngine.tapCard(defender);
//       // Defender has no damage
//
//       const attacker = testEngine.getCardModel(caterpillarCalmAndCollected);
//       const initialHandCount = testEngine.getZonesCardCount().hand;
//
//       await testEngine.challenge({ attacker, defender });
//
//       expect(testEngine.stackLayers).toHaveLength(0);
//       expect(testEngine.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           hand: initialHandCount,
//           deck: 5,
//         }),
//       );
//     });
//
//     it("DOES NOT trigger when challenging a location (even if damaged)", async () => {
//       const testEngine = new TestEngine(
//         {
//           deck: 5,
//           play: [scarVengefulLion, caterpillarCalmAndCollected],
//         },
//         {
//           play: [hiddenCoveTranquilHaven],
//         },
//       );
//
//       const defender = testEngine.getCardModel(hiddenCoveTranquilHaven);
//       // Damage the location
//       await testEngine.setCardDamage(hiddenCoveTranquilHaven, 1);
//
//       const attacker = testEngine.getCardModel(caterpillarCalmAndCollected);
//       const initialHandCount = testEngine.getZonesCardCount().hand;
//
//       await testEngine.challenge({ attacker, defender });
//
//       // Verify no ability was added to the stack
//       expect(testEngine.stackLayers).toHaveLength(0);
//
//       // Verify the ability name is NOT in the stack layers
//       const hasScarAbility = testEngine.stackLayers.some(
//         (layer) => layer.ability?.name === "**LIFE'S NOT FAIR, IS IT?**",
//       );
//       expect(hasScarAbility).toBe(false);
//
//       // Verify no card was drawn
//       expect(testEngine.getZonesCardCount()).toEqual(
//         expect.objectContaining({
//           hand: initialHandCount,
//           deck: 5,
//         }),
//       );
//     });
//   });
// });
//
