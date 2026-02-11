// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rufusOrphanageCat } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rufus - Orphanage Cat", () => {
//   It.skip("**A LITTLE TOO OLD TO HUNT MICE** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rufusOrphanageCat.cost,
//       Play: [rufusOrphanageCat],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       RufusOrphanageCat.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
