// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BelleBookworm,
//   BelleHiddenArcher,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { avalanche } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { theLibraryAGiftForBelle } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Avalanche", () => {
//   It("Deal 1 damage to each opposing character. You may banish chosen location.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: avalanche.cost,
//         Hand: [avalanche],
//       },
//       {
//         Play: [theLibraryAGiftForBelle, belleBookworm, belleHiddenArcher],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", avalanche.id);
//
//     Const target = testStore.getCard(theLibraryAGiftForBelle);
//     Const charOne = testStore.getCard(belleBookworm);
//     Const charTwo = testStore.getCard(belleHiddenArcher);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//     Expect(charOne.damage).toEqual(1);
//     Expect(charTwo.damage).toEqual(1);
//   });
// });
//
