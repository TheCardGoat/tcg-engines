// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { drCalicoGreeneyedMan } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dr. Calico - Green-Eyed Man", () => {
//   it.skip("YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: drCalicoGreeneyedMan.cost,
//       play: [drCalicoGreeneyedMan],
//       hand: [drCalicoGreeneyedMan],
//     });
//
//     await testEngine.playCard(drCalicoGreeneyedMan);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
