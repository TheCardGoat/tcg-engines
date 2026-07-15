// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { drCalicoGreeneyedMan } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dr. Calico - Green-Eyed Man", () => {
//   It.skip("YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: drCalicoGreeneyedMan.cost,
//       Play: [drCalicoGreeneyedMan],
//       Hand: [drCalicoGreeneyedMan],
//     });
//
//     Await testEngine.playCard(drCalicoGreeneyedMan);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
