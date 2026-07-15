// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyExpertShipwright } from "@lorcanito/lorcana-engine/cards/006";
// Import { youCameBack } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("You Came Back", () => {
//   It("Ready chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: youCameBack.cost,
//       // Goofy has Ward
//       Play: [goofyExpertShipwright],
//       Hand: [youCameBack],
//     });
//
//     Const cardTarget = testEngine.getCardModel(goofyExpertShipwright);
//
//     Await testEngine.tapCard(goofyExpertShipwright);
//
//     Expect(cardTarget.exerted).toBe(true);
//
//     Await testEngine.playCard(youCameBack, {
//       Targets: [goofyExpertShipwright],
//     });
//
//     Expect(cardTarget.exerted).toBe(false);
//   });
// });
//
