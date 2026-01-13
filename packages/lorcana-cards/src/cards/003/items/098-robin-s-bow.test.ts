// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pigletVerySmallAnimal } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { robinHoodDaydreamer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { robinsBow } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Robin's Bow", () => {
//   it("**A BIT OF A LARK** Whenever a character of yours named Robin Hood quests, you may ready this item.", () => {
//     const testStore = new TestStore({
//       play: [robinsBow, robinHoodDaydreamer, pigletVerySmallAnimal],
//     });
//
//     const cardUnderTest = testStore.getCard(robinsBow);
//     const robinHood = testStore.getCard(robinHoodDaydreamer);
//     const piglet = testStore.getCard(pigletVerySmallAnimal);
//
//     cardUnderTest.updateCardMeta({ exerted: true });
//
//     piglet.quest();
//     expect(testStore.stackLayers).toHaveLength(0);
//     expect(cardUnderTest.ready).toBe(false);
//
//     robinHood.quest();
//     expect(testStore.stackLayers).toHaveLength(1);
//     testStore.resolveOptionalAbility();
//     expect(cardUnderTest.ready).toBe(true);
//   });
//
//   it.skip("**FOREST’S GIFT** {E} – Deal 1 damage to chosen damaged character or location.**A BIT OF A LARK** Whenever a character of yours named Robin Hood quests, you may ready this item.", () => {
//     const testStore = new TestStore({
//       inkwell: robinsBow.cost,
//       play: [robinsBow],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", robinsBow.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
