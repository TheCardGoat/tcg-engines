// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { motunuiIslandParadise } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Motunui - Island Paradise", () => {
//   It.skip("**REINCARNATION** Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: motunuiIslandParadise.cost,
//       Play: [motunuiIslandParadise],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MotunuiIslandParadise.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
