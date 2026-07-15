// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cogsworthGrandfatherClock } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { morphSpaceGoo } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Morph - Space Goo", () => {
//   It("**MIMICRY** You may play any character with **Shift** on this character as if this character had any name.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 3,
//       Play: [morphSpaceGoo],
//       Hand: [cogsworthGrandfatherClock],
//     });
//
//     Const cardUnderTest = testStore.getCard(morphSpaceGoo);
//     Const shiftCard = testStore.getCard(cogsworthGrandfatherClock);
//
//     ShiftCard.shift(cardUnderTest);
//
//     Expect(shiftCard.zone).toBe("play");
//     Expect(cardUnderTest.zone).toBe("play");
//     Expect(cardUnderTest.meta?.shifter).toBe(shiftCard.instanceId);
//     Expect(shiftCard.meta?.shifted).toBe(cardUnderTest.instanceId);
//   });
// });
//
