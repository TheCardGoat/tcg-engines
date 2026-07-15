// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { sleepyNoddingOff } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sleepy - Nodding Off", () => {
//   It("**YAWN!** This character enters play exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: sleepyNoddingOff.cost,
//       Hand: [sleepyNoddingOff],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", sleepyNoddingOff.id);
//
//     CardUnderTest.playFromHand();
//     Expect(cardUnderTest.ready).toEqual(false);
//   });
// });
//
