// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Moana - Of Motunui", () => {
//   it.skip("**WE CAN FIX IT** Whenever this character quests, you may ready your other Princess characters. They can't quest for the rest of this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: moanaOfMotunui.cost,
//       play: [moanaOfMotunui],
//       hand: [moanaOfMotunui],
//     });
//
//     await testEngine.playCard(moanaOfMotunui);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
