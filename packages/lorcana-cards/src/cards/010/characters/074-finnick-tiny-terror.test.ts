// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MrSmeeBumblingMate,
//   PigletPoohPirateCaptain,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { finnickTinyTerror } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Finnick - Tiny Terror", () => {
//   Describe("YOU BETTER RUN - Basic Functionality", () => {
//     It("returns chosen opposing character with 2 strength or less to their player's hand when paying 2 ink", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 2,
//           Hand: [finnickTinyTerror],
//         },
//         {
//           Play: [tipoGrowingSon],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       Expect(target.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(target.zone).toBe("hand");
//     });
//
//     It("can return character with exactly 2 strength", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 2,
//           Hand: [finnickTinyTerror],
//         },
//         {
//           Play: [pigletPoohPirateCaptain], // 2 strength
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       Const target = testEngine.getCardModel(pigletPoohPirateCaptain);
//
//       Expect(target.strength).toBe(2);
//       Expect(target.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("hand");
//     });
//
//     It("can return character with 1 strength", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 2,
//           Hand: [finnickTinyTerror],
//         },
//         {
//           Play: [tipoGrowingSon], // 1 strength
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       Expect(target.strength).toBe(1);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("hand");
//     });
//   });
//
//   Describe("YOU BETTER RUN - Targeting Restrictions", () => {
//     It("cannot target characters with 3 strength or more", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 2,
//           Hand: [finnickTinyTerror],
//         },
//         {
//           Play: [mrSmeeBumblingMate], // 3 strength
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       Const target = testEngine.getCardModel(mrSmeeBumblingMate);
//
//       Expect(target.strength).toBe(3);
//       Expect(target.zone).toBe("play");
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//
//       // Should not have any targets available, ability resolves without effect
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(target.zone).toBe("play");
//     });
//   });
//
//   Describe("YOU BETTER RUN - Optional Ability", () => {
//     It("ability is optional - can decline to activate", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 2,
//           Hand: [finnickTinyTerror],
//         },
//         {
//           Play: [tipoGrowingSon],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Decline the optional ability
//       Await testEngine.skipTopOfStack();
//
//       // Target should remain in play
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(target.zone).toBe("play");
//     });
//   });
//
//   Describe("YOU BETTER RUN - Ink Cost Requirements", () => {
//     It("requires paying 2 ink to activate", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 2, // Enough ink to play and activate
//           Hand: [finnickTinyTerror],
//         },
//         {
//           Play: [tipoGrowingSon],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       Const inkBeforePlay =
//         TestEngine.getAvailableInkwellCardCount("player_one");
//
//       Await testEngine.playCard(cardUnderTest);
//
//       Const inkAfterPlay =
//         TestEngine.getAvailableInkwellCardCount("player_one");
//
//       // Should have spent 1 ink to play Finnick
//       Expect(inkAfterPlay).toBe(inkBeforePlay - finnickTinyTerror.cost);
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       Const inkAfterAbility =
//         TestEngine.getAvailableInkwellCardCount("player_one");
//
//       // Should have spent an additional 2 ink for the ability
//       Expect(inkAfterAbility).toBe(inkAfterPlay - 2);
//       Expect(target.zone).toBe("hand");
//     });
//
//     It("cannot activate if insufficient ink available", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 1, // Only 1 extra ink, need 2
//           Hand: [finnickTinyTerror],
//         },
//         {
//           Play: [tipoGrowingSon],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       Const target = testEngine.getCardModel(tipoGrowingSon);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // The ability is still offered (appears on stack), but when accepted it will fail due to insufficient ink
//       Await testEngine.acceptOptionalLayer();
//
//       // Target should remain in play because the ability couldn't be paid for
//       Expect(target.zone).toBe("play");
//     });
//   });
//
//   Describe("YOU BETTER RUN - Edge Cases", () => {
//     It("works when opponent has no valid targets", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 2,
//           Hand: [finnickTinyTerror],
//         },
//         {
//           Play: [], // No opposing characters
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//
//       // Should play successfully even with no valid targets
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("can only target opposing characters, not own characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: finnickTinyTerror.cost + 2,
//           Hand: [finnickTinyTerror],
//           Play: [tipoGrowingSon], // Own character
//         },
//         {},
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       Const ownCharacter = testEngine.getCardModel(tipoGrowingSon);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveOptionalAbility();
//
//       // Should not be able to target own characters
//       Expect(ownCharacter.zone).toBe("play");
//     });
//   });
// });
//
