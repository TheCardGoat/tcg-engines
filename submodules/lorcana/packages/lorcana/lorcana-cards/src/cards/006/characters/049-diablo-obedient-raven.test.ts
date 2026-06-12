// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { diabloDevotedHerald } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { diabloObedientRaven } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Diablo - Obedient Raven", () => {
//   Describe("FLY, MY PET! When this character is banished, you may draw a card.", () => {
//     It("should draw a card when banished", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: fireTheCannons.cost,
//         Play: [diabloObedientRaven],
//         Hand: [fireTheCannons],
//         Deck: 2,
//       });
//
//       Await testEngine.playCard(
//         FireTheCannons,
//         {
//           Targets: [diabloObedientRaven],
//         },
//         True,
//       );
//
//       Await testEngine.resolveOptionalAbility();
//
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 1,
//         }),
//       );
//     });
//
//     It("should not draw a card when banished after shifting", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: fireTheCannons.cost,
//         Play: [diabloObedientRaven],
//         Hand: [diabloDevotedHerald, brawl, fireTheCannons],
//         Deck: 2,
//       });
//
//       Await testEngine.shiftCard({
//         Shifted: diabloObedientRaven,
//         Shifter: diabloDevotedHerald,
//         Costs: [brawl],
//       });
//
//       Await testEngine.playCard(fireTheCannons, {
//         Targets: [diabloDevotedHerald],
//       });
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Deck: 2,
//         }),
//       );
//     });
//   });
// });
//
