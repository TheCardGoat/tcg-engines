// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { gyroGearlooseGadgetGenius } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gyro Gearloose - Gadget Genius", () => {
//   It.skip("**FOLLOW THE TWISTS OF MY GENIUS BRAIN** {E} - Put an item card from your discard to the top of your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: gyroGearlooseGadgetGenius.cost,
//       Play: [gyroGearlooseGadgetGenius],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       GyroGearlooseGadgetGenius.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
