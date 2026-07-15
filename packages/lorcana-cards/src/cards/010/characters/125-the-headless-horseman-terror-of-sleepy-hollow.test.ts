// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DaisyDuckGhostFinder,
//   DiabloWatchfulRaven,
//   MickeyMouseAmberChampion,
//   TheHeadlessHorsemanTerrorOfSleepyHollow,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Headless Horseman - Terror of Sleepy Hollow", () => {
//   Describe("LEAVES NO TRACE - When you play this character, banish chosen opposing character with 2 or less", () => {
//     It("should banish chosen opposing character with strength 2 or less when played", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanTerrorOfSleepyHollow.cost,
//           Hand: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           Play: [daisyDuckGhostFinder], // Strength 2
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const targetCard = testEngine.getByZoneAndId(
//         "play",
//         DaisyDuckGhostFinder.id,
//         "player_two",
//       );
//
//       Expect(targetCard.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//       Expect(targetCard.zone).toBe("discard");
//     });
//
//     It("should not target opposing character with strength 3", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanTerrorOfSleepyHollow.cost,
//           Hand: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           Play: [diabloWatchfulRaven], // Strength 3
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const targetCard = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       Expect(targetCard.zone).toBe("play");
//       Expect(targetCard.strength).toBe(3);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//
//       // Diablo has strength 3, so it CANNOT be targeted
//       // The ability should skip since there are no valid targets
//       Expect(targetCard.zone).toBe("play"); // Still in play
//     });
//
//     It("should not target opposing character with strength 3 or more", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanTerrorOfSleepyHollow.cost,
//           Hand: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           Play: [mickeyMouseAmberChampion], // Strength 2 (from card definition)
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const targetCard = testEngine.getByZoneAndId(
//         "play",
//         MickeyMouseAmberChampion.id,
//         "player_two",
//       );
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//
//       // Mickey has strength 2, so he CAN be targeted, but ability is optional
//       // If we don't provide targets, the ability should skip
//       Expect(targetCard.zone).toBe("play"); // Still in play
//     });
//   });
//
//   Describe("GATHERING STRENGTH - During your turn, whenever an opposing character is banished, each of your characters gets +1 this turn", () => {
//     It("should give all your characters +1 strength when an opposing character is banished during your turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [theHeadlessHorsemanTerrorOfSleepyHollow, daisyDuckGhostFinder],
//         },
//         {
//           Play: [diabloWatchfulRaven],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const allyCard = testEngine.getByZoneAndId(
//         "play",
//         DaisyDuckGhostFinder.id,
//         "player_one",
//       );
//       Const opponentCard = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Before banishment
//       Expect(cardUnderTest.strength).toBe(
//         TheHeadlessHorsemanTerrorOfSleepyHollow.strength,
//       ); // 4
//       Expect(allyCard.strength).toBe(daisyDuckGhostFinder.strength); // 2
//
//       // Banish opponent's character during our turn
//       OpponentCard.banish();
//
//       // After banishment - all characters should have +1 strength
//       Expect(cardUnderTest.strength).toBe(5); // 4 + 1
//       Expect(allyCard.strength).toBe(3); // 2 + 1
//     });
//
//     It("should not trigger during opponent's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [theHeadlessHorsemanTerrorOfSleepyHollow, daisyDuckGhostFinder],
//         },
//         {
//           Play: [diabloWatchfulRaven],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const allyCard = testEngine.getByZoneAndId(
//         "play",
//         DaisyDuckGhostFinder.id,
//         "player_one",
//       );
//       Const opponentCard = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // Banish opponent's character during opponent's turn
//       OpponentCard.banish();
//
//       // Should NOT trigger - no strength bonus
//       Expect(cardUnderTest.strength).toBe(
//         TheHeadlessHorsemanTerrorOfSleepyHollow.strength,
//       ); // 4
//       Expect(allyCard.strength).toBe(daisyDuckGhostFinder.strength); // 2
//     });
//
//     It("should give +1 strength multiple times if multiple opposing characters are banished in the same turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           Play: [diabloWatchfulRaven, daisyDuckGhostFinder],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const opponentCard1 = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//       Const opponentCard2 = testEngine.getByZoneAndId(
//         "play",
//         DaisyDuckGhostFinder.id,
//         "player_two",
//       );
//
//       // Before banishment
//       Expect(cardUnderTest.strength).toBe(4);
//
//       // Banish first opponent's character
//       OpponentCard1.banish();
//       Expect(cardUnderTest.strength).toBe(5); // 4 + 1
//
//       // Banish second opponent's character
//       OpponentCard2.banish();
//       Expect(cardUnderTest.strength).toBe(6); // 4 + 1 + 1
//     });
//
//     It("should reset strength bonus at the start of next turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [theHeadlessHorsemanTerrorOfSleepyHollow],
//         },
//         {
//           Play: [diabloWatchfulRaven],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const opponentCard = testEngine.getByZoneAndId(
//         "play",
//         DiabloWatchfulRaven.id,
//         "player_two",
//       );
//
//       // Banish opponent's character
//       OpponentCard.banish();
//       Expect(cardUnderTest.strength).toBe(5); // 4 + 1
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // Pass back to player one (start of next turn)
//       TestEngine.passTurn();
//
//       // Bonus should be gone - back to base strength
//       Expect(cardUnderTest.strength).toBe(4);
//     });
//
//     It("should not trigger when own characters are banished", async () => {
//       Const testEngine = new TestEngine({
//         Play: [theHeadlessHorsemanTerrorOfSleepyHollow, daisyDuckGhostFinder],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const allyCard = testEngine.getByZoneAndId(
//         "play",
//         DaisyDuckGhostFinder.id,
//         "player_one",
//       );
//
//       // Before banishment
//       Expect(cardUnderTest.strength).toBe(4);
//
//       // Banish own character
//       AllyCard.banish();
//
//       // Should NOT trigger - no strength bonus
//       Expect(cardUnderTest.strength).toBe(4);
//     });
//   });
//
//   Describe("Combined abilities", () => {
//     It("should trigger GATHERING STRENGTH when LEAVES NO TRACE banishes an opposing character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanTerrorOfSleepyHollow.cost,
//           Hand: [theHeadlessHorsemanTerrorOfSleepyHollow],
//           Play: [daisyDuckGhostFinder],
//         },
//         {
//           Play: [daisyDuckGhostFinder], // Use same character but for opponent
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanTerrorOfSleepyHollow,
//       );
//       Const allyCard = testEngine.getByZoneAndId(
//         "play",
//         DaisyDuckGhostFinder.id,
//         "player_one",
//       );
//       Const opponentCard = testEngine.getByZoneAndId(
//         "play",
//         DaisyDuckGhostFinder.id,
//         "player_two",
//       );
//
//       Expect(allyCard.strength).toBe(daisyDuckGhostFinder.strength); // 2
//
//       // Play the Headless Horseman and banish opponent's character
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [opponentCard] });
//
//       // Opponent's character should be banished
//       Expect(opponentCard.zone).toBe("discard");
//
//       // GATHERING STRENGTH should trigger - all characters get +1 strength
//       // Note: The Headless Horseman itself should also get the bonus
//       Expect(cardUnderTest.strength).toBe(5); // 4 + 1
//       Expect(allyCard.strength).toBe(3); // 2 + 1
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Multiple headless horsemen should merge continuous effects", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [
//           TheHeadlessHorsemanTerrorOfSleepyHollow,
//           TheHeadlessHorsemanTerrorOfSleepyHollow,
//           TheHeadlessHorsemanTerrorOfSleepyHollow,
//           DaisyDuckGhostFinder,
//         ],
//       },
//       {
//         Play: [diabloWatchfulRaven],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(
//       TheHeadlessHorsemanTerrorOfSleepyHollow,
//       0,
//     );
//     Const allyCard = testEngine.getByZoneAndId(
//       "play",
//       DaisyDuckGhostFinder.id,
//       "player_one",
//     );
//     Const opponentCard = testEngine.getByZoneAndId(
//       "play",
//       DiabloWatchfulRaven.id,
//       "player_two",
//     );
//
//     // Before banishment
//     Expect(cardUnderTest.strength).toBe(
//       TheHeadlessHorsemanTerrorOfSleepyHollow.strength,
//     ); // 4
//     Expect(allyCard.strength).toBe(daisyDuckGhostFinder.strength); // 2
//
//     // Banish opponent's character during our turn
//     OpponentCard.banish();
//
//     Expect(testEngine.stackLayers).toHaveLength(3);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.acceptOptionalLayer();
//     // The last effect is resolved automatically, and this is expected
//
//     // Verify strength bonuses are still correct
//     Expect(cardUnderTest.strength).toBe(7); // 4 + 3
//     Expect(allyCard.strength).toBe(5); // 2 + 3
//
//     // Verify continuous effects are merged: should be 4 (one per target) instead of 12
//     Const continuousEffects = testEngine.store.toJSON().continuousEffects;
//     Expect(continuousEffects).toHaveLength(4);
//
//     // Each merged effect should have amount 3 (from 3 Horsemen)
//     For (const effect of continuousEffects || []) {
//       Expect(effect.effect.type).toBe("attribute");
//       If (effect.effect.type === "attribute") {
//         Expect(effect.effect.amount).toBe(3);
//       }
//       // Verify mergedSources tracking
//       Expect(effect.mergedSources).toHaveLength(3);
//     }
//   });
// });
//
