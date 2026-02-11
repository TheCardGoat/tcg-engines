// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { princeEricExpertHelmsman } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince Eric - Expert Helmsman", () => {
//   It.skip("**SURPRISE MANEUVER** When this character is banished, you may banish chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: princeEricExpertHelmsman.cost,
//       Play: [princeEricExpertHelmsman],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PrinceEricExpertHelmsman.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
