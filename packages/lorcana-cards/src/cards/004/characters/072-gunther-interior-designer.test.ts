// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { guntherInteriorDesigner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gunther - Interior Designer", () => {
//   It.skip("**SAD-EYED PUPPY** When this character is challenged and banished, each opponent chooses one of their characters and returns that card to their hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: guntherInteriorDesigner.cost,
//       Play: [guntherInteriorDesigner],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       GuntherInteriorDesigner.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
