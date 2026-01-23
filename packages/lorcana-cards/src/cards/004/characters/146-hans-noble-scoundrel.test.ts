// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { hansNobleScoundrel } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hans - Noble Scoundrel", () => {
//   it.skip("**ROYAL SCHEMES** When you play this characer, if a Princess or Queen character is in play, gain 1 lore.", () => {
//     const testStore = new TestStore({
//       inkwell: hansNobleScoundrel.cost,
//       play: [hansNobleScoundrel],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       hansNobleScoundrel.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
