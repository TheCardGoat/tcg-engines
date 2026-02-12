// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   TheQueenDisguisedPeddler,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Queen - Disguised Peddler", () => {
//   It("**A PERFECT DISGUISE** {E}, Choose and discard a character card − Gain lore equal to the discarded character's {L}.", () => {
//     Const testStore = new TestStore({
//       Play: [theQueenDisguisedPeddler],
//       Hand: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheQueenDisguisedPeddler.id,
//     );
//     Const target = testStore.getByZoneAndId("hand", goofyKnightForADay.id);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//     Expect(testStore.getPlayerLore()).toEqual(target.lore);
//   });
// });
//
