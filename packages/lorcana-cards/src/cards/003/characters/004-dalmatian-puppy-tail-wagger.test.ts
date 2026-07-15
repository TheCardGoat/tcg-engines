// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { dalmatianPuppyTailWagger } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dalmatian Puppy - Tail Wagger", () => {
//   It.skip("**WHERE DID THEY ALL COME FROM?** You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: dalmatianPuppyTailWagger.cost,
//       Play: [dalmatianPuppyTailWagger],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DalmatianPuppyTailWagger.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
