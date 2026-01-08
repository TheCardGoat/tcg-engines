// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mauisPlaceOfExileHiddenIsland } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Maui's Place of Exile - Hidden Island", () => {
//   it.skip("**ISOLATED** Characters gain **Resist** +1 while here. _(Damage dealt to them is reduced by 1.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mauisPlaceOfExileHiddenIsland.cost,
//       play: [mauisPlaceOfExileHiddenIsland],
//       hand: [mauisPlaceOfExileHiddenIsland],
//     });
//
//     await testEngine.playCard(mauisPlaceOfExileHiddenIsland);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
