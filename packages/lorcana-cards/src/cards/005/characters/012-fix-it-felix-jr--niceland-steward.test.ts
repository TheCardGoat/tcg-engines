// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fixitFelixJrNicelandSteward } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { theLibraryAGiftForBelle } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fix‐It Felix, Jr. - Niceland Steward", () => {
//   It("**BUILDING TOGETHER** Your locations get +2 {W}️.", () => {
//     Const testStore = new TestStore({
//       Inkwell: fixitFelixJrNicelandSteward.cost,
//       Play: [theLibraryAGiftForBelle, fixitFelixJrNicelandSteward],
//     });
//
//     Expect(testStore.getCard(theLibraryAGiftForBelle).willpower).toBe(
//       TheLibraryAGiftForBelle.willpower + 2,
//     );
//   });
// });
//
