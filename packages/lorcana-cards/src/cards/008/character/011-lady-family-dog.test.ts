// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyDaredevil } from "@lorcanito/lorcana-engine/cards/001/characters/111-goofy-daredevil";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/184-lilo-galactic-hero";
// Import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/008-lilo-junior-cake-decorator";
// Import { trampStreetSmartDog } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   HueyReliableLeader,
//   LadyFamilyDog,
//   LiloCausingAnUproar,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { liloBestExplorerEver } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lady - Family Dog", () => {
//   It("SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: ladyFamilyDog.cost,
//       Hand: [hueyReliableLeader, ladyFamilyDog],
//     });
//
//     Await testEngine.playCard(ladyFamilyDog);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [hueyReliableLeader] });
//     Expect(testEngine.getCardModel(hueyReliableLeader).zone).toEqual("play");
//   });
//
//   Describe("Regression", () => {
//     It("Tramp interaction", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: ladyFamilyDog.cost,
//         Play: [
//           GoofyDaredevil,
//           LiloBestExplorerEver,
//           LiloCausingAnUproar,
//           LiloGalacticHero,
//           LiloJuniorCakeDecorator,
//         ],
//         Hand: [hueyReliableLeader, ladyFamilyDog, trampStreetSmartDog],
//       });
//
//       Await testEngine.playCard(ladyFamilyDog);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack(
//         { targets: [trampStreetSmartDog] },
//         True,
//       );
//       Expect(testEngine.getCardModel(hueyReliableLeader).zone).toEqual("hand");
//     });
//   });
// });
//
