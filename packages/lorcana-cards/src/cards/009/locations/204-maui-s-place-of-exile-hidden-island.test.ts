// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mauisPlaceOfExileHiddenIsland } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Maui's Place of Exile - Hidden Island", () => {
//   It.skip("**ISOLATED** Characters gain **Resist** +1 while here. _(Damage dealt to them is reduced by 1.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mauisPlaceOfExileHiddenIsland.cost,
//       Play: [mauisPlaceOfExileHiddenIsland],
//       Hand: [mauisPlaceOfExileHiddenIsland],
//     });
//
//     Await testEngine.playCard(mauisPlaceOfExileHiddenIsland);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
