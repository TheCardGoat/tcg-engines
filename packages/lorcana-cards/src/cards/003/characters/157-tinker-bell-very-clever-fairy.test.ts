// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { benjaGuardianOfTheDragonGem } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { tinkerBellVeryCleverFairy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tinker Bell - Very Clever Fairy", () => {
//   It("**I CAN USE THAT** Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: benjaGuardianOfTheDragonGem.cost,
//       Play: [tinkerBellVeryCleverFairy, dingleHopper],
//       Hand: [benjaGuardianOfTheDragonGem],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       BenjaGuardianOfTheDragonGem.id,
//     );
//
//     Const target = testStore.getByZoneAndId("play", dingleHopper.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack(
//       {
//         Targets: [target],
//       },
//       True,
//     );
//
//     Expect(target.zone).toEqual("discard");
//
//     TestStore.resolveOptionalAbility();
//
//     Expect(target.zone).toEqual("inkwell");
//     Expect(testStore.getZonesCardCount().inkwell).toEqual(
//       BenjaGuardianOfTheDragonGem.cost + 1,
//     );
//   });
// });
//
