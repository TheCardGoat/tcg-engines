// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { rufusOrphanageCat } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Rufus - Orphanage Cat", () => {
//   it.skip("**A LITTLE TOO OLD TO HUNT MICE** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
//     const testStore = new TestStore({
//       inkwell: rufusOrphanageCat.cost,
//       play: [rufusOrphanageCat],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       rufusOrphanageCat.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
