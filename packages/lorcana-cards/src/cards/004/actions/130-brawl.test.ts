// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { daisyDuckLovelyLady } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Brawl", () => {
//   It("Banish chosen character with 2 {S} or less.", () => {
//     Const testStore = new TestStore({
//       Inkwell: brawl.cost,
//       Hand: [brawl],
//       Play: [daisyDuckLovelyLady],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", brawl.id);
//     Const target = testStore.getByZoneAndId("play", daisyDuckLovelyLady.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//     Expect(cardUnderTest.zone).toEqual("discard");
//   });
// });
//
