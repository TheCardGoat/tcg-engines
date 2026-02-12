// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { eeyoreOverstuffedDonkey } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Eeyore - Overstuffed Donkey", () => {
//   It("**Resist** +1 _(Damage dealt to this character is reduced by 1.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: eeyoreOverstuffedDonkey.cost,
//       Play: [eeyoreOverstuffedDonkey],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       EeyoreOverstuffedDonkey.id,
//     );
//
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
