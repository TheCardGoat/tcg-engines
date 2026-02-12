// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   JamesRoleModel,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("James - Role Model", () => {
//   It("**NEVER, EVER LOSE SIGHT** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [jamesRoleModel],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", jamesRoleModel.id);
//
//     CardUnderTest.updateCardMeta({ exerted: true });
//     Const attacker = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//       "player_two",
//     );
//
//     Attacker.challenge(cardUnderTest);
//
//     TestStore.resolveOptionalAbility();
//
//     Expect(cardUnderTest.zone).toEqual("inkwell");
//     Expect(cardUnderTest.ready).toEqual(false);
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
