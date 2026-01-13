// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyDaredevil } from "@lorcanito/lorcana-engine/cards/001/characters/111-goofy-daredevil";
// import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/184-lilo-galactic-hero";
// import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/008-lilo-junior-cake-decorator";
// import { trampStreetSmartDog } from "@lorcanito/lorcana-engine/cards/007";
// import {
//   hueyReliableLeader,
//   ladyFamilyDog,
//   liloCausingAnUproar,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { liloBestExplorerEver } from "@lorcanito/lorcana-engine/cards/009";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lady - Family Dog", () => {
//   it("SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: ladyFamilyDog.cost,
//       hand: [hueyReliableLeader, ladyFamilyDog],
//     });
//
//     await testEngine.playCard(ladyFamilyDog);
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [hueyReliableLeader] });
//     expect(testEngine.getCardModel(hueyReliableLeader).zone).toEqual("play");
//   });
//
//   describe("Regression", () => {
//     it("Tramp interaction", async () => {
//       const testEngine = new TestEngine({
//         inkwell: ladyFamilyDog.cost,
//         play: [
//           goofyDaredevil,
//           liloBestExplorerEver,
//           liloCausingAnUproar,
//           liloGalacticHero,
//           liloJuniorCakeDecorator,
//         ],
//         hand: [hueyReliableLeader, ladyFamilyDog, trampStreetSmartDog],
//       });
//
//       await testEngine.playCard(ladyFamilyDog);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack(
//         { targets: [trampStreetSmartDog] },
//         true,
//       );
//       expect(testEngine.getCardModel(hueyReliableLeader).zone).toEqual("hand");
//     });
//   });
// });
//
