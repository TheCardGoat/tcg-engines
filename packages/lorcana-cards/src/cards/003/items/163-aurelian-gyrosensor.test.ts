// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { aurelianGyrosensor } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Aurelian Gyrosensor", () => {
//   It.skip("**SEEKING KNOWLEDGE** Whenever one of your characters quests, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: aurelianGyrosensor.cost,
//       Play: [aurelianGyrosensor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       AurelianGyrosensor.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
