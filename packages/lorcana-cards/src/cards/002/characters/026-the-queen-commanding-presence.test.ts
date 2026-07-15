// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   TheQueenCommandingPresence,
//   TheQueenRegalMonarch,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Queen - Commanding Presence", () => {
//   It("has shift", () => {
//     Const testStore = new TestStore({
//       Inkwell: theQueenCommandingPresence.cost,
//       Play: [theQueenCommandingPresence],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheQueenCommandingPresence.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
//
//   It("**WHO IS THE FAIREST?** Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: theQueenCommandingPresence.cost,
//         Play: [theQueenCommandingPresence, theQueenRegalMonarch],
//       },
//       { play: [goofyKnightForADay] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheQueenCommandingPresence.id,
//     );
//     Const target = testStore.getByZoneAndId("play", theQueenRegalMonarch.id);
//     Const opponentTarget = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//       "player_two",
//     );
//     CardUnderTest.quest();
//
//     TestStore.resolveTopOfStack({ targets: [opponentTarget] }, true);
//     Expect(opponentTarget.strength).toEqual(goofyKnightForADay.strength - 4);
//
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.strength).toEqual(theQueenRegalMonarch.strength + 4);
//   });
// });
//
