// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { sisuEmpoweredSibling } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   KronkUnlicensedInvestigator,
//   MickeyMouseFoodFightDefender,
//   RoyalGuardBovineProtector,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { emeraldChromiconItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import {
//   MickeyMouseGiantMouse,
//   PullTheLever,
//   WrongLeverAction,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
// Import { mrSmeeBumblingMate } from "../../003/characters/characters";
//
// Describe("Emerald Chromicon", () => {
//   Describe("**EMERALD LIGHT** During opponents’ turns, whenever one of your characters is banished, you may return chosen character to their player’s hand.", () => {
//     It("Opponent attacking", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [goofyKnightForADay],
//         },
//         {
//           Play: [emeraldChromiconItem, royalGuardBovineProtector],
//         },
//       );
//
//       Const attacker = testStore.getCard(goofyKnightForADay);
//       Const defender = testStore.getCard(royalGuardBovineProtector);
//
//       Defender.updateCardMeta({ exerted: true });
//       Attacker.challenge(defender);
//
//       Expect(testStore.stackLayers).toHaveLength(1);
//     });
//
//     It("You Attacking", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [emeraldChromiconItem, goofyKnightForADay],
//         },
//         {
//           Play: [royalGuardBovineProtector],
//         },
//       );
//
//       Const attacker = testStore.getCard(goofyKnightForADay);
//       Const defender = testStore.getCard(royalGuardBovineProtector);
//
//       Defender.updateCardMeta({ exerted: true });
//       Attacker.challenge(defender);
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Should NOT trigger when returning to hand", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: wrongLeverAction.cost,
//         Hand: [wrongLeverAction],
//         Play: [goofyKnightForADay],
//       },
//       {
//         Play: [mickeyMouseGiantMouse, emeraldChromiconItem],
//       },
//     );
//
//     Await testEngine.playCard(wrongLeverAction, { mode: "1" }, true);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
//
//     Expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("hand");
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
//
//   It("Should NOT trigger when card is put at the bottom", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: wrongLeverAction.cost,
//         Discard: [pullTheLever],
//         Hand: [wrongLeverAction],
//         Play: [goofyKnightForADay],
//       },
//       {
//         Play: [mickeyMouseGiantMouse, emeraldChromiconItem],
//       },
//     );
//
//     Await testEngine.playCard(wrongLeverAction);
//
//     Await testEngine.resolveTopOfStack({ mode: "2" }, true);
//     Await testEngine.resolveTopOfStack({ targets: [pullTheLever] }, true);
//
//     Expect(testEngine.getCardModel(pullTheLever).zone).toBe("deck");
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
//     Expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("deck");
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
//
//   It("Mr Smee Interaction", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [mrSmeeBumblingMate, emeraldChromiconItem],
//       },
//       {
//         Play: [emeraldChromiconItem],
//       },
//     );
//
//     Const smee = testEngine.getCardModel(mrSmeeBumblingMate);
//     Await testEngine.setCardDamage(mrSmeeBumblingMate, 2);
//     Expect(smee.damage).toBe(2);
//
//     Await testEngine.tapCard(mrSmeeBumblingMate);
//     Expect(smee.exerted).toBe(true);
//
//     // Mr Smee damage himself at the end of the turn, which causes him to be banished
//     // This should NOT trigger the Emerald Chromicon ability, because it is not an opponent's turn
//     Await testEngine.passTurn();
//
//     Expect(smee.zone).toBe("discard");
//   });
//
//   It("Adds three layers onto the stack when removed by Sisu", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: sisuEmpoweredSibling.cost,
//         Hand: [sisuEmpoweredSibling],
//       },
//       {
//         Play: [
//           EmeraldChromiconItem,
//           RoyalGuardBovineProtector,
//           MickeyMouseFoodFightDefender,
//           KronkUnlicensedInvestigator,
//         ],
//       },
//     );
//
//     Const removal = testStore.getCard(sisuEmpoweredSibling);
//
//     Const firstTarget = testStore.getCard(royalGuardBovineProtector);
//     Const secondTarget = testStore.getCard(mickeyMouseFoodFightDefender);
//     Const thirdTarget = testStore.getCard(kronkUnlicensedInvestigator);
//
//     Removal.playFromHand();
//
//     For (const card of [firstTarget, secondTarget, thirdTarget]) {
//       Expect(card.zone).toEqual("discard");
//     }
//
//     Expect(testStore.stackLayers).toHaveLength(3);
//   });
// });
//
