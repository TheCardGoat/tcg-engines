// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MagicBroomAerialCleaner,
//   MagicBroomBrigadeCommander,
//   MagicBroomIlluminaryKeeper,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Magic Broom - Brigade Commander", () => {
//   It("**Resist** +1 _(Damage dealt to this character is reduced by 1.)_", () => {
//     Const testEngine = new TestEngine({
//       Play: [magicBroomBrigadeCommander],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(magicBroomBrigadeCommander);
//
//     Expect(cardUnderTest.hasAbility("resist")).toBe(true);
//   });
//   It("**ARMY OF BROOMS** This character gets +2 {S} for each other Broom character you have in play.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         MagicBroomBrigadeCommander,
//         MagicBroomIlluminaryKeeper,
//         MagicBroomAerialCleaner,
//       ],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(magicBroomBrigadeCommander);
//     Const target = testEngine.getCardModel(magicBroomAerialCleaner);
//
//     Expect(cardUnderTest.strength).toBe(6);
//
//     Await target.banish();
//
//     Expect(cardUnderTest.strength).toBe(4);
//   });
// });
//
