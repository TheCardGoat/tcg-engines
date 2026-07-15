// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GrandDukeAdvisorToTheKing,
//   KuzcoWantedLlama,
//   PrinceCharmingHeirToTheThrone,
//   TheQueenRegalMonarch,
//   TianaDiligentWaitress,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Grand Duke - Advisor to the King", () => {
//   It("**YES, YOUR MAJESTY** Your Prince, Princess, King and Queen characters gain +1 {S}.", () => {
//     Const testStore = new TestStore({
//       Play: [
//         GrandDukeAdvisorToTheKing,
//         TheQueenRegalMonarch,
//         KuzcoWantedLlama,
//         PrinceCharmingHeirToTheThrone,
//         TianaDiligentWaitress,
//       ],
//     });
//
//     Const royals = [
//       TheQueenRegalMonarch,
//       KuzcoWantedLlama,
//       PrinceCharmingHeirToTheThrone,
//       TianaDiligentWaitress,
//     ].map((card) => testStore.getByZoneAndId("play", card.id));
//
//     Royals.forEach((royal) => {
//       Expect(royal.strength).toBe((royal.lorcanitoCard.strength || 0) + 1);
//     });
//   });
// });
//
