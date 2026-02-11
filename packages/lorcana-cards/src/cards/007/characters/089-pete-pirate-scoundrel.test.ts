// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { hiddenInkcaster } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { gatheringKnowledgeAndWisdom } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { petePirateScoundrel } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("PILFER AND PLUNDER Whenever you play an action that isn’t a song, you may banish chosen item.", () => {
//   It("should banish chosen item when playing an action not a song", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [petePirateScoundrel, hiddenInkcaster],
//       Hand: [gatheringKnowledgeAndWisdom],
//     });
//
//     Await testEngine.playCard(gatheringKnowledgeAndWisdom);
//
//     Const cardTarget = testEngine.getCardModel(hiddenInkcaster);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     Expect(cardTarget.zone).toEqual("discard");
//   });
//   It("should not banish chosen item when playing a song", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [petePirateScoundrel, hiddenInkcaster],
//       Hand: [aPiratesLife],
//     });
//
//     Await testEngine.playCard(aPiratesLife);
//
//     Const cardTarget = testEngine.getCardModel(hiddenInkcaster);
//
//     Expect(cardTarget.zone).toEqual("play");
//   });
// });
//
