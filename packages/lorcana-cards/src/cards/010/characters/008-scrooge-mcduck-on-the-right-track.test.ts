// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { scroogeMcduckOnTheRightTrack } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe.skip("Scrooge McDuck - On the Right Track", () => {
//   Describe.skip("FABULOUS WEALTH", () => {
//     It("should have FABULOUS WEALTH ability defined", () => {
//       Const ability = scroogeMcduckOnTheRightTrack.abilities?.find(
//         (ability) => "name" in ability && ability.name === "FABULOUS WEALTH",
//       );
//       Expect(ability).toBeDefined();
//       If (ability && "type" in ability) {
//         Expect(ability.type).toBe("resolution");
//       }
//     });
//
//     It("When you play this character, chosen character with a card under them gets +1 this turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: scroogeMcduckOnTheRightTrack.cost,
//         Hand: [scroogeMcduckOnTheRightTrack],
//       });
//
//       Await testEngine.playCard(scroogeMcduckOnTheRightTrack);
//
//       // Should trigger the optional ability
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({});
//     });
//   });
//
//   Describe("Stats and basic properties", () => {
//     It("should have correct stats", () => {
//       Const testEngine = new TestEngine({
//         Play: [scroogeMcduckOnTheRightTrack],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         ScroogeMcduckOnTheRightTrack,
//       );
//
//       Expect(cardUnderTest.strength).toBe(4);
//       Expect(cardUnderTest.willpower).toBe(3);
//       Expect(cardUnderTest.lore).toBe(1);
//       Expect(cardUnderTest.cost).toBe(3);
//     });
//
//     It("should be inkwell card", () => {
//       Expect(scroogeMcduckOnTheRightTrack.inkwell).toBe(true);
//     });
//
//     It("should have correct characteristics", () => {
//       Expect(scroogeMcduckOnTheRightTrack.characteristics).toEqual([
//         "storyborn",
//         "hero",
//       ]);
//     });
//
//     It("should be amber color", () => {
//       Expect(scroogeMcduckOnTheRightTrack.colors).toEqual(["amber"]);
//     });
//
//     It("should be uncommon rarity", () => {
//       Expect(scroogeMcduckOnTheRightTrack.rarity).toBe("uncommon");
//     });
//   });
// });
//
