// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { flotsamUrsulasBaby } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flotsam - Ursula's Baby", () => {
//   It.skip("**QUICK ESCAPE** When this character is banished in a challenge, return this card to your hand.**OMINOUS PAIR** Your characters named Jetsam gain 'When this character is banished in a challenge, return this card to your hand.'", () => {
//     Const testStore = new TestStore({
//       Inkwell: flotsamUrsulasBaby.cost,
//       Play: [flotsamUrsulasBaby],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       FlotsamUrsulasBaby.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
