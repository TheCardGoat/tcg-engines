// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   daisyDuckGhostFinder,
//   diabloWatchfulRaven,
//   mickeyMouseAmberChampion,
//   theHeadlessHorsemanTerrorOfSleepyHollow,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Headless Horseman - Terror of Sleepy Hollow", () => {
//   describe("LEAVES NO TRACE - When you play this character, banish chosen opposing character with 2 or less", () => {
//     it("should banish chosen opposing character with strength 2 or less when played", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanTerrorOfSleepyHollow.cost,
//           hand: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           play: [daisyDuckGhostFinder], // Strength 2
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const targetCard = testEngine.getByZoneAndId(
//         "play",
//         daisyDuckGhostFinder.id,
//         "player_two",
//       );
//
//       expect(targetCard.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//       expect(targetCard.zone).toBe("discard");
//     });
//
//     it("should not target opposing character with strength 3", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanTerrorOfSleepyHollow.cost,
//           hand: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           play: [diabloWatchfulRaven], // Strength 3
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const targetCard = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       expect(targetCard.zone).toBe("play");
//       expect(targetCard.strength).toBe(3);
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//
//       // Diablo has strength 3, so it CANNOT be targeted
//       // The ability should skip since there are no valid targets
//       expect(targetCard.zone).toBe("play"); // Still in play
//     });
//
//     it("should not target opposing character with strength 3 or more", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanTerrorOfSleepyHollow.cost,
//           hand: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           play: [mickeyMouseAmberChampion], // Strength 2 (from card definition)
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const targetCard = testEngine.getByZoneAndId(
//         "play",
//         mickeyMouseAmberChampion.id,
//         "player_two",
//       );
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//
//       // Mickey has strength 2, so he CAN be targeted, but ability is optional
//       // If we don't provide targets, the ability should skip
//       expect(targetCard.zone).toBe("play"); // Still in play
//     });
//   });
//
//   describe("GATHERING STRENGTH - During your turn, whenever an opposing character is banished, each of your characters gets +1 this turn", () => {
//     it("should give all your characters +1 strength when an opposing character is banished during your turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [theHeadlessHorsemanTerrorOfSleepyHollow, daisyDuckGhostFinder],
//         },
//         {
//           play: [diabloWatchfulRaven],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const allyCard = testEngine.getByZoneAndId(
//         "play",
//         daisyDuckGhostFinder.id,
//         "player_one",
//       );
//       const opponentCard = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Before banishment
//       expect(cardUnderTest.strength).toBe(
//         theHeadlessHorsemanTerrorOfSleepyHollow.strength,
//       ); // 4
//       expect(allyCard.strength).toBe(daisyDuckGhostFinder.strength); // 2
//
//       // Banish opponent's character during our turn
//       opponentCard.banish();
//
//       // After banishment - all characters should have +1 strength
//       expect(cardUnderTest.strength).toBe(5); // 4 + 1
//       expect(allyCard.strength).toBe(3); // 2 + 1
//     });
//
//     it("should not trigger during opponent's turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [theHeadlessHorsemanTerrorOfSleepyHollow, daisyDuckGhostFinder],
//         },
//         {
//           play: [diabloWatchfulRaven],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const allyCard = testEngine.getByZoneAndId(
//         "play",
//         daisyDuckGhostFinder.id,
//         "player_one",
//       );
//       const opponentCard = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // Banish opponent's character during opponent's turn
//       opponentCard.banish();
//
//       // Should NOT trigger - no strength bonus
//       expect(cardUnderTest.strength).toBe(
//         theHeadlessHorsemanTerrorOfSleepyHollow.strength,
//       ); // 4
//       expect(allyCard.strength).toBe(daisyDuckGhostFinder.strength); // 2
//     });
//
//     it("should give +1 strength multiple times if multiple opposing characters are banished in the same turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           play: [diabloWatchfulRaven, daisyDuckGhostFinder],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const opponentCard1 = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//       const opponentCard2 = testEngine.getByZoneAndId(
//         "play",
//         daisyDuckGhostFinder.id,
//         "player_two",
//       );
//
//       // Before banishment
//       expect(cardUnderTest.strength).toBe(4);
//
//       // Banish first opponent's character
//       opponentCard1.banish();
//       expect(cardUnderTest.strength).toBe(5); // 4 + 1
//
//       // Banish second opponent's character
//       opponentCard2.banish();
//       expect(cardUnderTest.strength).toBe(6); // 4 + 1 + 1
//     });
//
//     it("should reset strength bonus at the start of next turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           play: [diabloWatchfulRaven],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const opponentCard = testEngine.getByZoneAndId(
//         "play",
//         diabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Banish opponent's character
//       opponentCard.banish();
//       expect(cardUnderTest.strength).toBe(5); // 4 + 1
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // Pass back to player one (start of next turn)
//       testEngine.passTurn();
//
//       // Bonus should be gone - back to base strength
//       expect(cardUnderTest.strength).toBe(4);
//     });
//
//     it("should not trigger when own characters are banished", async () => {
//       const testEngine = new TestEngine({
//         play: [theHeadlessHorsemanTerrorOfSleepyHollow, daisyDuckGhostFinder],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const allyCard = testEngine.getByZoneAndId(
//         "play",
//         daisyDuckGhostFinder.id,
//         "player_one",
//       );
//
//       // Before banishment
//       expect(cardUnderTest.strength).toBe(4);
//
//       // Banish own character
//       allyCard.banish();
//
//       // Should NOT trigger - no strength bonus
//       expect(cardUnderTest.strength).toBe(4);
//     });
//   });
//
//   describe("Combined abilities", () => {
//     it("should trigger GATHERING STRENGTH when LEAVES NO TRACE banishes an opposing character", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanTerrorOfSleepyHollow.cost,
//           hand: [theHeadlessHorsemanTerrorOfSleepyHollow],
//           play: [daisyDuckGhostFinder],
//         },
//         {
//           play: [daisyDuckGhostFinder], // Use same character but for opponent
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       const allyCard = testEngine.getByZoneAndId(
//         "play",
//         daisyDuckGhostFinder.id,
//         "player_one",
//       );
//       const opponentCard = testEngine.getByZoneAndId(
//         "play",
//         daisyDuckGhostFinder.id,
//         "player_two",
//       );
//
//       expect(allyCard.strength).toBe(daisyDuckGhostFinder.strength); // 2
//
//       // Play the Headless Horseman and banish opponent's character
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [opponentCard] });
//
//       // Opponent's character should be banished
//       expect(opponentCard.zone).toBe("discard");
//
//       // GATHERING STRENGTH should trigger - all characters get +1 strength
//       // Note: The Headless Horseman itself should also get the bonus
//       expect(cardUnderTest.strength).toBe(5); // 4 + 1
//       expect(allyCard.strength).toBe(3); // 2 + 1
//     });
//   });
// });
//
// describe("Regression", () => {
//   it("Multiple headless horsemen should merge continuous effects", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [
//           theHeadlessHorsemanTerrorOfSleepyHollow,
//           theHeadlessHorsemanTerrorOfSleepyHollow,
//           theHeadlessHorsemanTerrorOfSleepyHollow,
//           daisyDuckGhostFinder,
//         ],
//       },
//       {
//         play: [diabloWatchfulRaven],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(
//       theHeadlessHorsemanTerrorOfSleepyHollow,
//       0,
//     );
//     const allyCard = testEngine.getByZoneAndId(
//       "play",
//       daisyDuckGhostFinder.id,
//       "player_one",
//     );
//     const opponentCard = testEngine.getByZoneAndId(
//       "play",
//       diabloWatchfulRaven.id,
//       "player_two",
//     );
//
//     // Before banishment
//     expect(cardUnderTest.strength).toBe(
//       theHeadlessHorsemanTerrorOfSleepyHollow.strength,
//     ); // 4
//     expect(allyCard.strength).toBe(daisyDuckGhostFinder.strength); // 2
//
//     // Banish opponent's character during our turn
//     opponentCard.banish();
//
//     expect(testEngine.stackLayers).toHaveLength(3);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.acceptOptionalLayer();
//     // The last effect is resolved automatically, and this is expected
//
//     // Verify strength bonuses are still correct
//     expect(cardUnderTest.strength).toBe(7); // 4 + 3
//     expect(allyCard.strength).toBe(5); // 2 + 3
//
//     // Verify continuous effects are merged: should be 4 (one per target) instead of 12
//     const continuousEffects = testEngine.store.toJSON().continuousEffects;
//     expect(continuousEffects).toHaveLength(4);
//
//     // Each merged effect should have amount 3 (from 3 Horsemen)
//     for (const effect of continuousEffects || []) {
//       expect(effect.effect.type).toBe("attribute");
//       if (effect.effect.type === "attribute") {
//         expect(effect.effect.amount).toBe(3);
//       }
//       // Verify mergedSources tracking
//       expect(effect.mergedSources).toHaveLength(3);
//     }
//   });
// });
//
