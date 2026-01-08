// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import { hiddenInkcaster } from "@lorcanito/lorcana-engine/cards/004/items/items";
// import { gatheringKnowledgeAndWisdom } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { petePirateScoundrel } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("PILFER AND PLUNDER Whenever you play an action that isn’t a song, you may banish chosen item.", () => {
//   it("should banish chosen item when playing an action not a song", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [petePirateScoundrel, hiddenInkcaster],
//       hand: [gatheringKnowledgeAndWisdom],
//     });
//
//     await testEngine.playCard(gatheringKnowledgeAndWisdom);
//
//     const cardTarget = testEngine.getCardModel(hiddenInkcaster);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//     expect(cardTarget.zone).toEqual("discard");
//   });
//   it("should not banish chosen item when playing a song", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [petePirateScoundrel, hiddenInkcaster],
//       hand: [aPiratesLife],
//     });
//
//     await testEngine.playCard(aPiratesLife);
//
//     const cardTarget = testEngine.getCardModel(hiddenInkcaster);
//
//     expect(cardTarget.zone).toEqual("play");
//   });
// });
//
