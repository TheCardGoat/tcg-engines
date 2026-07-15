// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { gwythaintSavageHunter } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gwythaint - Savage Hunter", () => {
//   It("should have Evasive keyword", () => {
//     Const testEngine = new TestEngine({
//       Play: [gwythaintSavageHunter],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(gwythaintSavageHunter);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("should have SWOOPING STRIKE ability", () => {
//     Const ability = gwythaintSavageHunter.abilities?.find(
//       (a) => a.name === "SWOOPING STRIKE",
//     );
//     Expect(ability).toBeDefined();
//   });
//
//   It("SWOOPING STRIKE - Whenever this character quests, each opponent chooses and exerts one of their ready characters", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [gwythaintSavageHunter],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const opponentCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(opponentCard.ready).toBe(true);
//
//     Await testEngine.questCard(gwythaintSavageHunter);
//
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(1);
//     Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({ targets: [opponentCard] });
//
//     Expect(opponentCard.ready).toBe(false);
//   });
//
//   It("SWOOPING STRIKE - Should not require a target when opponent has no ready characters", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [gwythaintSavageHunter],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const opponentCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     // Exert the opponent's character so it's not ready
//     OpponentCard.updateCardMeta({ exerted: true });
//     Expect(opponentCard.ready).toBe(false);
//
//     Await testEngine.questCard(gwythaintSavageHunter);
//
//     // The ability should still trigger but auto-resolve since there are no valid targets
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//     Expect(opponentCard.ready).toBe(false);
//   });
// });
//
