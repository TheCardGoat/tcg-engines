// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import { hesGotASword } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("He's Got a Sword!", () => {
//   It("Chosen character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hesGotASword.cost,
//       Hand: [hesGotASword],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", hesGotASword.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
//   });
// });
//
