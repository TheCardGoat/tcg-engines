// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { hansNobleScoundrel } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hans - Noble Scoundrel", () => {
//   It.skip("**ROYAL SCHEMES** When you play this characer, if a Princess or Queen character is in play, gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hansNobleScoundrel.cost,
//       Play: [hansNobleScoundrel],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HansNobleScoundrel.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
