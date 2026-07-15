// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pinocchioTalkativePuppet } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pinocchio - Talkative Puppet", () => {
//   It("**TELLING LIES** When you play this character, you may exert chosen opposing character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: pinocchioTalkativePuppet.cost,
//         Hand: [pinocchioTalkativePuppet],
//       },
//       {
//         Play: [pinocchioTalkativePuppet],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       PinocchioTalkativePuppet.id,
//     );
//
//     Const target = testStore.getByZoneAndId(
//       "play",
//       PinocchioTalkativePuppet.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.ready).toBeFalsy();
//   });
// });
//
