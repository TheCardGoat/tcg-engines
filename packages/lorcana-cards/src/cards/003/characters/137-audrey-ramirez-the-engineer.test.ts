// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { audreyRamirezTheEngineer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Audrey Ramirez - The Engineer", () => {
//   It("**SPARE PARTS** Whenever this character quests, ready one of your items.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [audreyRamirezTheEngineer, pawpsicle],
//     });
//
//     Const pawpsicleCard = testEngine.getCardModel(pawpsicle);
//     PawpsicleCard.updateCardMeta({ exerted: true });
//
//     Await testEngine.questCard(audreyRamirezTheEngineer);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [pawpsicle] });
//
//     Expect(pawpsicleCard.exerted).toBe(false);
//   });
// });
//
