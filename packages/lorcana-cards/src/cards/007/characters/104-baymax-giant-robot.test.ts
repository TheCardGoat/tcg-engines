// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { baymaxGiantRobot } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)", () => {
//   It("should shift in any character", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [princeJohnGreediestOfAll],
//       Hand: [baymaxGiantRobot],
//     });
//
//     Const shiftedCard = testEngine.getCardModel(princeJohnGreediestOfAll);
//     Const shiftCard = testEngine.getCardModel(baymaxGiantRobot);
//
//     Expect(shiftCard.canShiftInto(shiftedCard)).toBe(true);
//
//     ShiftCard.shift(shiftedCard);
//
//     Expect(shiftCard.zone).toBe("play");
//     Expect(shiftedCard.zone).toBe("play");
//     Expect(shiftedCard.meta?.shifter).toBe(shiftCard.instanceId);
//     Expect(shiftCard.meta?.shifted).toBe(shiftedCard.instanceId);
//   });
// });
// Describe("FUNCTIONALITY IMPROVED When you play this character, if you used Shift to play him, remove all damage from him.", () => {
//   It("", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [princeJohnGreediestOfAll],
//       Hand: [baymaxGiantRobot],
//     });
//
//     Const shiftedCard = testEngine.getCardModel(princeJohnGreediestOfAll);
//     ShiftedCard.damage = 1;
//     Expect(shiftedCard.damage).toEqual(1);
//     Const shiftCard = testEngine.getCardModel(baymaxGiantRobot);
//
//     ShiftCard.shift(shiftedCard);
//
//     Expect(shiftCard.damage).toEqual(0);
//   });
// });
//
