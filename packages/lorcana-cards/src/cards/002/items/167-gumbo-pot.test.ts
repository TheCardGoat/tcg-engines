// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   OwlLogicalLecturer,
//   RabbitReluctantHost,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { gumboPot } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gumbo Pot", () => {
//   Describe("**THE BEST I'VE EVER TASTED** {E} − Remove 1 damage each from up to 2 chosen characters.", () => {
//     It("should remove 1 damage from 2 characters", () => {
//       Const testStore = new TestStore({
//         Play: [gumboPot, rabbitReluctantHost, owlLogicalLecturer],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", gumboPot.id);
//       Const damagedChar1 = testStore.getByZoneAndId(
//         "play",
//         RabbitReluctantHost.id,
//       );
//       Const damagedChar2 = testStore.getByZoneAndId(
//         "play",
//         OwlLogicalLecturer.id,
//       );
//
//       [damagedChar1, damagedChar2].forEach((char) => {
//         Char.updateCardMeta({ damage: 1 });
//         Expect(char.meta).toEqual(expect.objectContaining({ damage: 1 }));
//       });
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targets: [damagedChar1, damagedChar2] });
//
//       [damagedChar1, damagedChar2].forEach((char) => {
//         Expect(char.meta).toEqual(expect.objectContaining({ damage: 0 }));
//       });
//     });
//
//     It("should remove 1 damage from 1 characters", () => {
//       Const testStore = new TestStore({
//         Play: [gumboPot, rabbitReluctantHost, owlLogicalLecturer],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", gumboPot.id);
//       Const damagedChar1 = testStore.getByZoneAndId(
//         "play",
//         RabbitReluctantHost.id,
//       );
//       Const damagedChar2 = testStore.getByZoneAndId(
//         "play",
//         OwlLogicalLecturer.id,
//       );
//
//       [damagedChar1, damagedChar2].forEach((char) => {
//         Char.updateCardMeta({ damage: 1 });
//         Expect(char.meta).toEqual(expect.objectContaining({ damage: 1 }));
//       });
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targets: [damagedChar1] });
//
//       Expect(damagedChar1.meta).toEqual(expect.objectContaining({ damage: 0 }));
//       Expect(damagedChar2.meta).toEqual(expect.objectContaining({ damage: 1 }));
//     });
//   });
// });
//
