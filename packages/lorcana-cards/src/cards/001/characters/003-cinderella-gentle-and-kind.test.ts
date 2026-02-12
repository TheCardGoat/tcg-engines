// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArielOnHumanLegs,
//   CinderellaGentleAndKind,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cinderella - Gentle And Kind", () => {
//   Describe("{E}− Remove up to 3 damage from chosen Princess character.", () => {
//     It("Healing 3 damage from princess character", () => {
//       Const testStore = new TestStore({
//         Play: [cinderellaGentleAndKind, arielOnHumanLegs],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         CinderellaGentleAndKind.id,
//       );
//       Const target = testStore.getByZoneAndId("play", arielOnHumanLegs.id);
//
//       Target.updateCardMeta({ damage: 4 });
//
//       CardUnderTest.activate();
//
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       Expect(target.meta.damage).toEqual(1);
//     });
//   });
// });
//
