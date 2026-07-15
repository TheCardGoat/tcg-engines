// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BeastForbiddingRecluse,
//   RabbitReluctantHost,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Beast- Forbidding Recluse", () => {
//   It("**YOU'RE NOT WELCOME HERE** When you play this character, you may deal 1 damage to chosen character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: beastForbiddingRecluse.cost,
//         Hand: [beastForbiddingRecluse],
//       },
//       {
//         Play: [rabbitReluctantHost],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       BeastForbiddingRecluse.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       RabbitReluctantHost.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(1);
//   });
// });
//
