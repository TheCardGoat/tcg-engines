// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { imStuck } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { cheshireCatAlwaysGrinning } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("I'm Stuck!", () => {
//   It("Chosen exerted character can't ready at the start of their next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: imStuck.cost,
//         Hand: [imStuck],
//       },
//       {
//         Play: [cheshireCatAlwaysGrinning],
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", imStuck.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       CheshireCatAlwaysGrinning.id,
//       "player_two",
//     );
//
//     Target.updateCardMeta({ exerted: true });
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     TestStore.passTurn();
//
//     Expect(target.ready).toBeFalsy();
//   });
// });
//
