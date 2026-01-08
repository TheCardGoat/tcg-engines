// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   stealFromRich,
//   tangle,
// } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { lefouBumbler } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { thievery } from "@lorcanito/lorcana-engine/cards/006";
// import { liloCausingAnUproar } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lilo - Causing an Uproar", () => {
//   it("STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 16,
//       play: [],
//       hand: [bePrepared, tangle, thievery, stealFromRich, liloCausingAnUproar],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(liloCausingAnUproar);
//
//     expect(cardUnderTest.cost).toEqual(liloCausingAnUproar.cost);
//
//     await testEngine.playCard(bePrepared);
//     await testEngine.playCard(tangle);
//     await testEngine.playCard(thievery);
//
//     expect(cardUnderTest.cost).toEqual(0);
//
//     await testEngine.playCard(stealFromRich);
//
//     expect(cardUnderTest.cost).toEqual(0);
//   });
//
//   it("RAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: liloCausingAnUproar.cost,
//       hand: [liloCausingAnUproar],
//       play: [lefouBumbler],
//     });
//
//     const readyTarget = testEngine.getCardModel(lefouBumbler);
//
//     await testEngine.questCard(lefouBumbler);
//
//     await testEngine.playCard(liloCausingAnUproar);
//     await testEngine.resolveTopOfStack({ targets: [lefouBumbler] });
//
//     expect(readyTarget.meta.exerted).toEqual(false);
//   });
// });
//
