// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { triggerImpreciseShooter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Trigger - Imprecise Shooter", () => {
//   it.skip("**MY OL' BETSY** Your characters named Nutsy gain +1 {L}.", () => {
//     const testStore = new TestStore({
//       inkwell: triggerImpreciseShooter.cost,
//       play: [triggerImpreciseShooter],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       triggerImpreciseShooter.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
