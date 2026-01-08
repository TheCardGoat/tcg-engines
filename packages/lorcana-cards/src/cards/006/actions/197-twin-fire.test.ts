// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   gadgetHackwrenchPerceptiveMouse,
//   nickWildeCleverFox,
//   sailTheAzuriteSea,
//   twinFire,
// } from "@lorcanito/lorcana-engine/cards/006";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Twin Fire", () => {
//   it("Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: twinFire.cost,
//         hand: [twinFire, sailTheAzuriteSea],
//       },
//       {
//         play: [gadgetHackwrenchPerceptiveMouse, nickWildeCleverFox],
//       },
//     );
//
//     await testEngine.playCard(twinFire);
//
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [gadgetHackwrenchPerceptiveMouse],
//       },
//       true,
//     );
//
//     expect(
//       testEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).damage,
//     ).toBe(2);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [sailTheAzuriteSea],
//       },
//       true,
//     );
//     expect(testEngine.getCardModel(sailTheAzuriteSea).zone).toBe("discard");
//
//     await testEngine.resolveTopOfStack({
//       targets: [nickWildeCleverFox],
//     });
//     expect(testEngine.getCardModel(nickWildeCleverFox).damage).toBe(2);
//   });
//
//   it("Should allow targeting the same character twice (current behavior)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: twinFire.cost,
//         hand: [twinFire, sailTheAzuriteSea],
//       },
//       {
//         play: [gadgetHackwrenchPerceptiveMouse, nickWildeCleverFox],
//       },
//     );
//
//     await testEngine.playCard(twinFire);
//
//     // First damage targets Gadget
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [gadgetHackwrenchPerceptiveMouse],
//       },
//       true,
//     );
//
//     expect(
//       testEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).damage,
//     ).toBe(2);
//
//     // Accept the optional second ability
//     await testEngine.resolveOptionalAbility();
//
//     // Discard a card
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [sailTheAzuriteSea],
//       },
//       true,
//     );
//     expect(testEngine.getCardModel(sailTheAzuriteSea).zone).toBe("discard");
//
//     // Target the same character again - this currently works
//     await testEngine.resolveTopOfStack({
//       targets: [gadgetHackwrenchPerceptiveMouse],
//     });
//
//     // Gadget should be banished due to lethal damage (4 total damage)
//     expect(testEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).zone).toBe(
//       "discard",
//     );
//   });
//
//   it("Should work correctly when there's only one character in play", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: twinFire.cost,
//         hand: [twinFire, sailTheAzuriteSea],
//       },
//       {
//         play: [gadgetHackwrenchPerceptiveMouse], // Only one character
//       },
//     );
//
//     await testEngine.playCard(twinFire);
//
//     // First damage targets the only character
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [gadgetHackwrenchPerceptiveMouse],
//       },
//       true,
//     );
//
//     expect(
//       testEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).damage,
//     ).toBe(2);
//
//     // Accept the optional second ability
//     await testEngine.resolveOptionalAbility();
//
//     // Discard a card
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [sailTheAzuriteSea],
//       },
//       true,
//     );
//     expect(testEngine.getCardModel(sailTheAzuriteSea).zone).toBe("discard");
//
//     // Target the same character again (current behavior allows this)
//     await testEngine.resolveTopOfStack({
//       targets: [gadgetHackwrenchPerceptiveMouse],
//     });
//
//     // The character should be banished due to lethal damage
//     expect(testEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).zone).toBe(
//       "discard",
//     );
//   });
// });
//
