// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import {
//   DiabloSpitefulRaven,
//   MauricesMachine,
//   MauriceUnconventionalInventor,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Maurice - Unconventional Inventor", () => {
//   Describe("HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.", () => {
//     It("Choosing Maurice's Machine", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: mauriceUnconventionalInventor.cost,
//           Play: [mauricesMachine],
//           Hand: [mauriceUnconventionalInventor],
//           Deck: 5,
//         },
//         { play: [diabloSpitefulRaven] },
//       );
//
//       Await testEngine.playCard(
//         MauriceUnconventionalInventor,
//         {
//           Targets: [mauricesMachine],
//           AcceptOptionalLayer: true,
//         },
//         True,
//       );
//
//       Expect(testEngine.getCardModel(mauricesMachine).zone).toEqual("discard");
//       Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//
//       Await testEngine.resolveTopOfStack({ targets: [diabloSpitefulRaven] });
//       Expect(testEngine.getCardModel(diabloSpitefulRaven).zone).toEqual(
//         "discard",
//       );
//     });
//
//     It("NOT choosing Maurice's Machine", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: mauriceUnconventionalInventor.cost,
//           Play: [pawpsicle],
//           Hand: [mauriceUnconventionalInventor],
//           Deck: 5,
//         },
//         { play: [diabloSpitefulRaven] },
//       );
//
//       Await testEngine.playCard(
//         MauriceUnconventionalInventor,
//         {
//           Targets: [pawpsicle],
//           AcceptOptionalLayer: true,
//         },
//         True,
//       );
//
//       Expect(testEngine.getCardModel(pawpsicle).zone).toEqual("discard");
//       Expect(testEngine.getZonesCardCount().hand).toEqual(1);
//
//       Console.log(JSON.stringify(testEngine.stackLayers));
//       Expect(testEngine.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
