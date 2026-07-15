// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mauisFishHook } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { fredMajorScienceEnthusiast } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fred - Major Science Enthusiast", () => {
//   It("SPITTING FIRE! When you play this character, you may banish chosen item.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: fredMajorScienceEnthusiast.cost,
//         Hand: [fredMajorScienceEnthusiast],
//       },
//       {
//         Play: [mauisFishHook],
//       },
//     );
//
//     Const target = testEngine.getCardModel(mauisFishHook);
//
//     Await testEngine.playCard(fredMajorScienceEnthusiast);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
