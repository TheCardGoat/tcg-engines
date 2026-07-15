// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { teethAndAmbitions } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   DonaldDuckNotAgain,
//   GoofyKnightForADay,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Teeth and Ambitions", () => {
//   It("Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: teethAndAmbitions.cost,
//         Hand: [teethAndAmbitions],
//         Play: [goofyKnightForADay],
//       },
//       { play: [donaldDuckNotAgain] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       TeethAndAmbitions.id,
//     );
//     Const targetOfYour = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//     );
//     Const targetOfOpponent = testStore.getByZoneAndId(
//       "play",
//       DonaldDuckNotAgain.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({ targets: [targetOfYour] }, true);
//     Expect(targetOfYour.meta.damage).toBe(2);
//
//     TestStore.resolveTopOfStack({ targets: [targetOfOpponent] });
//     Expect(targetOfOpponent.meta.damage).toBe(2);
//   });
// });
//
