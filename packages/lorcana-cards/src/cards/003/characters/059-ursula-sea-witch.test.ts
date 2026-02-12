// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { ursulaSeaWitch } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula - Sea Witch", () => {
//   It.skip("**YOU'RE TOO LATE** Whenever this character quests, chosen opposing character can't ready at the start of their next turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: ursulaSeaWitch.cost,
//       Play: [ursulaSeaWitch],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", ursulaSeaWitch.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
