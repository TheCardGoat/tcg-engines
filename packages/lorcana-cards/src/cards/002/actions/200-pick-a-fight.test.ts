// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mauiDemiGod } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pickAFight } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pick a Fight", () => {
//   It("Chosen character can challenge ready characters this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: pickAFight.cost,
//         Hand: [pickAFight],
//         Play: [goofyKnightForADay],
//       },
//       { play: [mauiDemiGod], deck: 1 },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", pickAFight.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       MauiDemiGod.id,
//       "player_two",
//     );
//
//     Expect(target.canChallenge(defender)).toEqual(false);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.canChallenge(defender)).toEqual(true);
//
//     TestStore.passTurn();
//
//     Expect(target.canChallenge(defender)).toEqual(false);
//   });
// });
//
