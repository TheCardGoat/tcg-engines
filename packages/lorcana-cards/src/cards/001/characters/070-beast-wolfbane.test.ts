// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeastWolfbane,
//   ElsaSnowQueen,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Beast - Wolfbane", () => {
//   It("**ROAR** When you play this character, exert all opposing damaged characters.", () => {
//     Const testStore = new TestStore(
//       {
//         Hand: [beastWolfbane],
//         Inkwell: beastWolfbane.cost,
//       },
//       {
//         Play: [moanaOfMotunui, elsaSnowQueen],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", beastWolfbane.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//     Target.updateCardMeta({ damage: 1 });
//     Const shouldNotBeTarget = testStore.getByZoneAndId(
//       "play",
//       ElsaSnowQueen.id,
//       "player_two",
//     );
//     ShouldNotBeTarget.updateCardMeta({ damage: 0 });
//
//     Expect(target.ready).toEqual(true);
//     Expect(shouldNotBeTarget.ready).toEqual(true);
//
//     CardUnderTest.playFromHand();
//
//     Expect(target.ready).toEqual(false);
//     Expect(shouldNotBeTarget.ready).toEqual(true);
//   });
// });
//
