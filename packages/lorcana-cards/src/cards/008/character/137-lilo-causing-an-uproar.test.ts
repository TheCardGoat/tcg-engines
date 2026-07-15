// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   StealFromRich,
//   Tangle,
// } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { lefouBumbler } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { thievery } from "@lorcanito/lorcana-engine/cards/006";
// Import { liloCausingAnUproar } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lilo - Causing an Uproar", () => {
//   It("STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 16,
//       Play: [],
//       Hand: [bePrepared, tangle, thievery, stealFromRich, liloCausingAnUproar],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(liloCausingAnUproar);
//
//     Expect(cardUnderTest.cost).toEqual(liloCausingAnUproar.cost);
//
//     Await testEngine.playCard(bePrepared);
//     Await testEngine.playCard(tangle);
//     Await testEngine.playCard(thievery);
//
//     Expect(cardUnderTest.cost).toEqual(0);
//
//     Await testEngine.playCard(stealFromRich);
//
//     Expect(cardUnderTest.cost).toEqual(0);
//   });
//
//   It("RAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: liloCausingAnUproar.cost,
//       Hand: [liloCausingAnUproar],
//       Play: [lefouBumbler],
//     });
//
//     Const readyTarget = testEngine.getCardModel(lefouBumbler);
//
//     Await testEngine.questCard(lefouBumbler);
//
//     Await testEngine.playCard(liloCausingAnUproar);
//     Await testEngine.resolveTopOfStack({ targets: [lefouBumbler] });
//
//     Expect(readyTarget.meta.exerted).toEqual(false);
//   });
// });
//
