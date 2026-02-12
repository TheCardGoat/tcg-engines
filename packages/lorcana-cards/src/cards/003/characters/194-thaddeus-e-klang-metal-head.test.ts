// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { thaddeusEKlangMetalHead } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Thaddeus E. Klang - Metal Head", () => {
//   It.skip("**SHARP JAW** Whenever this character quests while at a location, you may deal 1 damage to chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: thaddeusEKlangMetalHead.cost,
//       Play: [thaddeusEKlangMetalHead],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ThaddeusEKlangMetalHead.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
