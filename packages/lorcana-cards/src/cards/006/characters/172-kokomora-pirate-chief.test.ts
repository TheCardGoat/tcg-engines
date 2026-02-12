// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GadgetHackwrenchBrilliantBosun,
//   GalacticCouncilChamber,
//   KakamoraBoardingParty,
//   KokomoraPirateChief,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kokomora - Pirate Chief", () => {
//   Describe("COCONUT LEADER Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.", () => {
//     It("Discard a non-pirate card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [kokomoraPirateChief, galacticCouncilChamber],
//           Hand: [gadgetHackwrenchBrilliantBosun],
//           Deck: 1,
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       Await testEngine.questCard(kokomoraPirateChief);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [gadgetHackwrenchBrilliantBosun],
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [galacticCouncilChamber],
//       });
//
//       Expect(testEngine.getCardModel(galacticCouncilChamber).damage).toBe(1);
//     });
//
//     It("Discard a pirate card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: kokomoraPirateChief.cost,
//           Play: [kokomoraPirateChief, galacticCouncilChamber],
//           Hand: [kakamoraBoardingParty],
//           Deck: 1,
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       Await testEngine.questCard(kokomoraPirateChief);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [kakamoraBoardingParty],
//         },
//         True,
//       );
//       Await testEngine.resolveTopOfStack({
//         Targets: [galacticCouncilChamber],
//       });
//
//       Expect(testEngine.getCardModel(galacticCouncilChamber).damage).toBe(3);
//     });
//   });
// });
//
