// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import { gwythaintSavageHunter } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gwythaint - Savage Hunter", () => {
//   it("should have Evasive keyword", () => {
//     const testEngine = new TestEngine({
//       play: [gwythaintSavageHunter],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(gwythaintSavageHunter);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it("should have SWOOPING STRIKE ability", () => {
//     const ability = gwythaintSavageHunter.abilities?.find(
//       (a) => a.name === "SWOOPING STRIKE",
//     );
//     expect(ability).toBeDefined();
//   });
//
//   it("SWOOPING STRIKE - Whenever this character quests, each opponent chooses and exerts one of their ready characters", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [gwythaintSavageHunter],
//       },
//       {
//         play: [deweyLovableShowoff],
//       },
//     );
//
//     const opponentCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     expect(opponentCard.ready).toBe(true);
//
//     await testEngine.questCard(gwythaintSavageHunter);
//
//     expect(testEngine.store.stackLayerStore.layers).toHaveLength(1);
//     expect(testEngine.store.priorityPlayer).toEqual("player_two");
//
//     testEngine.changeActivePlayer("player_two");
//     await testEngine.resolveTopOfStack({ targets: [opponentCard] });
//
//     expect(opponentCard.ready).toBe(false);
//   });
//
//   it("SWOOPING STRIKE - Should not require a target when opponent has no ready characters", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [gwythaintSavageHunter],
//       },
//       {
//         play: [deweyLovableShowoff],
//       },
//     );
//
//     const opponentCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     // Exert the opponent's character so it's not ready
//     opponentCard.updateCardMeta({ exerted: true });
//     expect(opponentCard.ready).toBe(false);
//
//     await testEngine.questCard(gwythaintSavageHunter);
//
//     // The ability should still trigger but auto-resolve since there are no valid targets
//     expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//     expect(opponentCard.ready).toBe(false);
//   });
// });
//
