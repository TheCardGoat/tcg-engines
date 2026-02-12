// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { triggerImpreciseShooter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Trigger - Imprecise Shooter", () => {
//   It.skip("**MY OL' BETSY** Your characters named Nutsy gain +1 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: triggerImpreciseShooter.cost,
//       Play: [triggerImpreciseShooter],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TriggerImpreciseShooter.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
