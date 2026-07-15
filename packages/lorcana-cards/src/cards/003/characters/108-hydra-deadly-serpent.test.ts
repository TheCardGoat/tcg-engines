// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   HydraDeadlySerpent,
//   KingLouieBandleader,
//   KitCloudkickerNavigator,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hydra - Deadly Serpent", () => {
//   Describe("**WATCH THE TEETH** When this character is damaged, deal the same amount of damage to a chosen opposing character.", () => {
//     It("receives damage from action card", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: smash.cost,
//           Hand: [smash],
//           Play: [hydraDeadlySerpent],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(hydraDeadlySerpent);
//       Const targetCard = testStore.getCard(goofyKnightForADay);
//       Const removalCard = testStore.getCard(smash);
//
//       RemovalCard.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [cardUnderTest] }, true);
//
//       // Hydra adds a layer to the stack
//       TestStore.resolveTopOfStack({ targets: [targetCard] });
//
//       Expect(cardUnderTest.damage).toBe(3);
//       Expect(targetCard.damage).toBe(3);
//     });
//
//     It("receives damage from challenge and dies", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [hydraDeadlySerpent],
//         },
//         {
//           Play: [goofyKnightForADay, kingLouieBandleader],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(hydraDeadlySerpent);
//       Const targetCard = testStore.getCard(goofyKnightForADay);
//       Const challenged = testStore.getCard(kingLouieBandleader);
//
//       Challenged.updateCardMeta({ exerted: true });
//       CardUnderTest.challenge(challenged);
//
//       TestStore.resolveTopOfStack({ targets: [targetCard] });
//
//       Expect(cardUnderTest.zone).toEqual("discard");
//       Expect(targetCard.damage).toBe(challenged.strength);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Cancels effect when it doesn't find a valid target", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [hydraDeadlySerpent],
//       },
//       {
//         Play: [goofyKnightForADay, kitCloudkickerNavigator],
//       },
//     );
//
//     Await testEngine.setCardDamage(
//       GoofyKnightForADay,
//       GoofyKnightForADay.willpower - 1,
//     );
//     Await testEngine.tapCard(goofyKnightForADay);
//
//     Const { attacker, defender } = await testEngine.challenge({
//       Attacker: hydraDeadlySerpent,
//       Defender: goofyKnightForADay,
//     });
//
//     Expect(attacker.isDead).toBe(true);
//     Expect(defender.isDead).toBe(true);
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
