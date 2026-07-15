import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { belleStrangeButSpecial } from "./142-belle-strange-but-special";

describe("Belle - Strange but Special", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [belleStrangeButSpecial] });
  //   Expect(testEngine.getCardModel(belleStrangeButSpecial).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BelleStrangeButBeautiful,
//   DukeOfWeselton,
//   GastonArrogantHunter,
//   GoonsMaleficent,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Belle - Strange but Special", () => {
//   Describe("DISARMING BEAUTY effect - Chosen characters gets -2 {S} this turn.", () => {
//     It("One Belle in play", () => {
//       Const testStore = new TestStore({
//         Hand: [goonsMaleficent, dukeOfWeselton, mickeyMouseTrueFriend],
//         Play: [belleStrangeButBeautiful],
//       });
//
//       Const target = testStore.getByZoneAndId("hand", goonsMaleficent.id);
//       Const anotherTarget = testStore.getByZoneAndId("hand", dukeOfWeselton.id);
//       Const thirdTarget = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseTrueFriend.id,
//       );
//
//       Target.addToInkwell();
//       AnotherTarget.addToInkwell();
//       ThirdTarget.addToInkwell();
//
//       Expect(target.zone).toEqual("inkwell");
//       Expect(anotherTarget.zone).toEqual("inkwell");
//       Expect(thirdTarget.zone).toEqual("hand");
//     });
//
//     It("Two Belles in play", () => {
//       Const testStore = new TestStore({
//         Hand: [goonsMaleficent, dukeOfWeselton, mickeyMouseTrueFriend],
//         Play: [belleStrangeButBeautiful, belleStrangeButBeautiful],
//       });
//
//       Const target = testStore.getByZoneAndId("hand", goonsMaleficent.id);
//       Const anotherTarget = testStore.getByZoneAndId("hand", dukeOfWeselton.id);
//       Const thirdTarget = testStore.getByZoneAndId(
//         "hand",
//         MickeyMouseTrueFriend.id,
//       );
//
//       Target.addToInkwell();
//       AnotherTarget.addToInkwell();
//       ThirdTarget.addToInkwell();
//
//       Expect(target.zone).toEqual("inkwell");
//       Expect(anotherTarget.zone).toEqual("inkwell");
//       Expect(thirdTarget.zone).toEqual("inkwell");
//     });
//   });
//
//   It("While you have 10 or more cards in your inkwell, this character gets +4 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 9,
//       Hand: [goonsMaleficent],
//       Play: [belleStrangeButBeautiful],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       BelleStrangeButBeautiful.id,
//     );
//     Const target = testStore.getByZoneAndId("hand", goonsMaleficent.id);
//
//     Expect(cardUnderTest.lore).toEqual(1);
//
//     Target.addToInkwell();
//     Expect(cardUnderTest.lore).toEqual(5);
//     CardUnderTest.quest();
//     Expect(testStore.getPlayerLore()).toEqual(5);
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Only Bell receives the bonus", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: 10,
//         Play: [belleStrangeButBeautiful, goonsMaleficent],
//       },
//       {
//         Play: [gastonArrogantHunter],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(belleStrangeButBeautiful);
//     Const target = testStore.getCard(goonsMaleficent);
//     Const anotherTarget = testStore.getCard(gastonArrogantHunter);
//
//     Expect(cardUnderTest.lore).toEqual(belleStrangeButBeautiful.lore + 4);
//     Expect(anotherTarget.lore).toEqual(gastonArrogantHunter.lore);
//     Expect(target.lore).toEqual(goonsMaleficent.lore);
//   });
// });
//
