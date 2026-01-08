// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mrSmeeBumblingMate,
//   pigletPoohPirateCaptain,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { finnickTinyTerror } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Finnick - Tiny Terror", () => {
//   describe("YOU BETTER RUN - Basic Functionality", () => {
//     it("returns chosen opposing character with 2 strength or less to their player's hand when paying 2 ink", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 2,
//           hand: [finnickTinyTerror],
//         },
//         {
//           play: [tipoGrowingSon],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       expect(target.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       expect(cardUnderTest.zone).toBe("play");
//       expect(target.zone).toBe("hand");
//     });
//
//     it("can return character with exactly 2 strength", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 2,
//           hand: [finnickTinyTerror],
//         },
//         {
//           play: [pigletPoohPirateCaptain], // 2 strength
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       const target = testEngine.getCardModel(pigletPoohPirateCaptain);
//
//       expect(target.strength).toBe(2);
//       expect(target.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).toBe("hand");
//     });
//
//     it("can return character with 1 strength", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 2,
//           hand: [finnickTinyTerror],
//         },
//         {
//           play: [tipoGrowingSon], // 1 strength
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       expect(target.strength).toBe(1);
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       expect(target.zone).toBe("hand");
//     });
//   });
//
//   describe("YOU BETTER RUN - Targeting Restrictions", () => {
//     it("cannot target characters with 3 strength or more", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 2,
//           hand: [finnickTinyTerror],
//         },
//         {
//           play: [mrSmeeBumblingMate], // 3 strength
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       const target = testEngine.getCardModel(mrSmeeBumblingMate);
//
//       expect(target.strength).toBe(3);
//       expect(target.zone).toBe("play");
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//
//       // Should not have any targets available, ability resolves without effect
//       expect(cardUnderTest.zone).toBe("play");
//       expect(target.zone).toBe("play");
//     });
//   });
//
//   describe("YOU BETTER RUN - Optional Ability", () => {
//     it("ability is optional - can decline to activate", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 2,
//           hand: [finnickTinyTerror],
//         },
//         {
//           play: [tipoGrowingSon],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Decline the optional ability
//       await testEngine.skipTopOfStack();
//
//       // Target should remain in play
//       expect(cardUnderTest.zone).toBe("play");
//       expect(target.zone).toBe("play");
//     });
//   });
//
//   describe("YOU BETTER RUN - Ink Cost Requirements", () => {
//     it("requires paying 2 ink to activate", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 2, // Enough ink to play and activate
//           hand: [finnickTinyTerror],
//         },
//         {
//           play: [tipoGrowingSon],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       const inkBeforePlay =
//         testEngine.getAvailableInkwellCardCount("player_one");
//
//       await testEngine.playCard(cardUnderTest);
//
//       const inkAfterPlay =
//         testEngine.getAvailableInkwellCardCount("player_one");
//
//       // Should have spent 1 ink to play Finnick
//       expect(inkAfterPlay).toBe(inkBeforePlay - finnickTinyTerror.cost);
//
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ targets: [target] });
//
//       const inkAfterAbility =
//         testEngine.getAvailableInkwellCardCount("player_one");
//
//       // Should have spent an additional 2 ink for the ability
//       expect(inkAfterAbility).toBe(inkAfterPlay - 2);
//       expect(target.zone).toBe("hand");
//     });
//
//     it("cannot activate if insufficient ink available", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 1, // Only 1 extra ink, need 2
//           hand: [finnickTinyTerror],
//         },
//         {
//           play: [tipoGrowingSon],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       const target = testEngine.getCardModel(tipoGrowingSon);
//
//       await testEngine.playCard(cardUnderTest);
//
//       // The ability is still offered (appears on stack), but when accepted it will fail due to insufficient ink
//       await testEngine.acceptOptionalLayer();
//
//       // Target should remain in play because the ability couldn't be paid for
//       expect(target.zone).toBe("play");
//     });
//   });
//
//   describe("YOU BETTER RUN - Edge Cases", () => {
//     it("works when opponent has no valid targets", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 2,
//           hand: [finnickTinyTerror],
//         },
//         {
//           play: [], // No opposing characters
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//
//       // Should play successfully even with no valid targets
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("can only target opposing characters, not own characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: finnickTinyTerror.cost + 2,
//           hand: [finnickTinyTerror],
//           play: [tipoGrowingSon], // Own character
//         },
//         {},
//       );
//
//       const cardUnderTest = testEngine.getCardModel(finnickTinyTerror);
//       const ownCharacter = testEngine.getCardModel(tipoGrowingSon);
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveOptionalAbility();
//
//       // Should not be able to target own characters
//       expect(ownCharacter.zone).toBe("play");
//     });
//   });
// });
//
