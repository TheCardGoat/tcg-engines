// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { princeNaveenPennilessRoyal } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { croquetMallet } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Croquet Mallet", () => {
//   It("**HURTLING HEDGEHOG** Banish this item − Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: croquetMallet.cost,
//       Play: [croquetMallet, princeNaveenPennilessRoyal],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", croquetMallet.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       PrinceNaveenPennilessRoyal.id,
//     );
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasRush).toEqual(true);
//     Expect(cardUnderTest.zone).toEqual("discard");
//   });
// });
//
