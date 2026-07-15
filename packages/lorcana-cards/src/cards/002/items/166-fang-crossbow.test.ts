// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MadamMimPurpleDragon,
//   TheQueenRegalMonarch,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { fangCrossbow } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fang Crossbow", () => {
//   It("**CAREFUL AIM** {E}, 2 {I} – Chosen character gets -2 {S} this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: 2,
//         Play: [fangCrossbow, theQueenRegalMonarch],
//       },
//       { deck: 1 },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", fangCrossbow.id);
//     Const target = testStore.getByZoneAndId("play", theQueenRegalMonarch.id);
//
//     Expect(target.strength).toEqual(theQueenRegalMonarch.strength);
//
//     CardUnderTest.activate("Careful Aim");
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(cardUnderTest.ready).toEqual(false);
//     Expect(target.strength).toEqual(theQueenRegalMonarch.strength - 2);
//
//     TestStore.passTurn();
//
//     Expect(target.strength).toEqual(theQueenRegalMonarch.strength);
//   });
//
//   Describe("**STAY BACK!** {E}, Banish this item – Banish chosen Dragon character.", () => {
//     It("should banish a dragon", () => {
//       Const testStore = new TestStore({
//         Inkwell: fangCrossbow.cost,
//         Play: [fangCrossbow, madamMimPurpleDragon],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", fangCrossbow.id);
//       Const target = testStore.getByZoneAndId("play", madamMimPurpleDragon.id);
//
//       CardUnderTest.activate("Stay Back!");
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(cardUnderTest.zone).toEqual("discard");
//       Expect(target.zone).toEqual("discard");
//     });
//
//     It("should NOT banish a NON-dragon", () => {
//       Const testStore = new TestStore({
//         Inkwell: fangCrossbow.cost,
//         Play: [fangCrossbow, theQueenRegalMonarch],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", fangCrossbow.id);
//       Const target = testStore.getByZoneAndId("play", theQueenRegalMonarch.id);
//
//       CardUnderTest.activate("Stay Back!");
//       TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//       Expect(cardUnderTest.zone).toEqual("discard");
//       Expect(target.zone).toEqual("play");
//       Expect(testStore.stackLayers).toHaveLength(0);
//
//       TestStore.resolveTopOfStack({ skip: true });
//     });
//   });
// });
//
