// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { gruesomeAndGrim } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { drFacilierSavvyOpportunist } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gruesome And Grim", () => {
//   It("Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: gruesomeAndGrim.cost,
//         Hand: [gruesomeAndGrim, drFacilierSavvyOpportunist],
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", gruesomeAndGrim.id);
//     Const target = testStore.getByZoneAndId(
//       "hand",
//       DrFacilierSavvyOpportunist.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//     Expect(target.zone).toEqual("play");
//     Expect(target.hasRush).toEqual(true);
//
//     TestStore.passTurn();
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
