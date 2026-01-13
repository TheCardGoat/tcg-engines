// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { scroogeMcduckOnTheRightTrack } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe.skip("Scrooge McDuck - On the Right Track", () => {
//   describe.skip("FABULOUS WEALTH", () => {
//     it("should have FABULOUS WEALTH ability defined", () => {
//       const ability = scroogeMcduckOnTheRightTrack.abilities?.find(
//         (ability) => "name" in ability && ability.name === "FABULOUS WEALTH",
//       );
//       expect(ability).toBeDefined();
//       if (ability && "type" in ability) {
//         expect(ability.type).toBe("resolution");
//       }
//     });
//
//     it("When you play this character, chosen character with a card under them gets +1 this turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: scroogeMcduckOnTheRightTrack.cost,
//         hand: [scroogeMcduckOnTheRightTrack],
//       });
//
//       await testEngine.playCard(scroogeMcduckOnTheRightTrack);
//
//       // Should trigger the optional ability
//       await testEngine.acceptOptionalLayer();
//       await testEngine.resolveTopOfStack({});
//     });
//   });
//
//   describe("Stats and basic properties", () => {
//     it("should have correct stats", () => {
//       const testEngine = new TestEngine({
//         play: [scroogeMcduckOnTheRightTrack],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         scroogeMcduckOnTheRightTrack,
//       );
//
//       expect(cardUnderTest.strength).toBe(4);
//       expect(cardUnderTest.willpower).toBe(3);
//       expect(cardUnderTest.lore).toBe(1);
//       expect(cardUnderTest.cost).toBe(3);
//     });
//
//     it("should be inkwell card", () => {
//       expect(scroogeMcduckOnTheRightTrack.inkwell).toBe(true);
//     });
//
//     it("should have correct characteristics", () => {
//       expect(scroogeMcduckOnTheRightTrack.characteristics).toEqual([
//         "storyborn",
//         "hero",
//       ]);
//     });
//
//     it("should be amber color", () => {
//       expect(scroogeMcduckOnTheRightTrack.colors).toEqual(["amber"]);
//     });
//
//     it("should be uncommon rarity", () => {
//       expect(scroogeMcduckOnTheRightTrack.rarity).toBe("uncommon");
//     });
//   });
// });
//
