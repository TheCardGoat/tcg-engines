// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mauisFishHook } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { fredMajorScienceEnthusiast } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Fred - Major Science Enthusiast", () => {
//   it("SPITTING FIRE! When you play this character, you may banish chosen item.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: fredMajorScienceEnthusiast.cost,
//         hand: [fredMajorScienceEnthusiast],
//       },
//       {
//         play: [mauisFishHook],
//       },
//     );
//
//     const target = testEngine.getCardModel(mauisFishHook);
//
//     await testEngine.playCard(fredMajorScienceEnthusiast);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toEqual("discard");
//   });
// });
//
