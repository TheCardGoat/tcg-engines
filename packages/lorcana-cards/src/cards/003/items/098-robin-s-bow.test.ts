// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pigletVerySmallAnimal } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { robinHoodDaydreamer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { robinsBow } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Robin's Bow", () => {
//   It("**A BIT OF A LARK** Whenever a character of yours named Robin Hood quests, you may ready this item.", () => {
//     Const testStore = new TestStore({
//       Play: [robinsBow, robinHoodDaydreamer, pigletVerySmallAnimal],
//     });
//
//     Const cardUnderTest = testStore.getCard(robinsBow);
//     Const robinHood = testStore.getCard(robinHoodDaydreamer);
//     Const piglet = testStore.getCard(pigletVerySmallAnimal);
//
//     CardUnderTest.updateCardMeta({ exerted: true });
//
//     Piglet.quest();
//     Expect(testStore.stackLayers).toHaveLength(0);
//     Expect(cardUnderTest.ready).toBe(false);
//
//     RobinHood.quest();
//     Expect(testStore.stackLayers).toHaveLength(1);
//     TestStore.resolveOptionalAbility();
//     Expect(cardUnderTest.ready).toBe(true);
//   });
//
//   It.skip("**FOREST’S GIFT** {E} – Deal 1 damage to chosen damaged character or location.**A BIT OF A LARK** Whenever a character of yours named Robin Hood quests, you may ready this item.", () => {
//     Const testStore = new TestStore({
//       Inkwell: robinsBow.cost,
//       Play: [robinsBow],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", robinsBow.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
