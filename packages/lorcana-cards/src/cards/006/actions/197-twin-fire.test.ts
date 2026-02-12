// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GadgetHackwrenchPerceptiveMouse,
//   NickWildeCleverFox,
//   SailTheAzuriteSea,
//   TwinFire,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Twin Fire", () => {
//   It("Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: twinFire.cost,
//         Hand: [twinFire, sailTheAzuriteSea],
//       },
//       {
//         Play: [gadgetHackwrenchPerceptiveMouse, nickWildeCleverFox],
//       },
//     );
//
//     Await testEngine.playCard(twinFire);
//
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [gadgetHackwrenchPerceptiveMouse],
//       },
//       True,
//     );
//
//     Expect(
//       TestEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).damage,
//     ).toBe(2);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [sailTheAzuriteSea],
//       },
//       True,
//     );
//     Expect(testEngine.getCardModel(sailTheAzuriteSea).zone).toBe("discard");
//
//     Await testEngine.resolveTopOfStack({
//       Targets: [nickWildeCleverFox],
//     });
//     Expect(testEngine.getCardModel(nickWildeCleverFox).damage).toBe(2);
//   });
//
//   It("Should allow targeting the same character twice (current behavior)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: twinFire.cost,
//         Hand: [twinFire, sailTheAzuriteSea],
//       },
//       {
//         Play: [gadgetHackwrenchPerceptiveMouse, nickWildeCleverFox],
//       },
//     );
//
//     Await testEngine.playCard(twinFire);
//
//     // First damage targets Gadget
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [gadgetHackwrenchPerceptiveMouse],
//       },
//       True,
//     );
//
//     Expect(
//       TestEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).damage,
//     ).toBe(2);
//
//     // Accept the optional second ability
//     Await testEngine.resolveOptionalAbility();
//
//     // Discard a card
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [sailTheAzuriteSea],
//       },
//       True,
//     );
//     Expect(testEngine.getCardModel(sailTheAzuriteSea).zone).toBe("discard");
//
//     // Target the same character again - this currently works
//     Await testEngine.resolveTopOfStack({
//       Targets: [gadgetHackwrenchPerceptiveMouse],
//     });
//
//     // Gadget should be banished due to lethal damage (4 total damage)
//     Expect(testEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).zone).toBe(
//       "discard",
//     );
//   });
//
//   It("Should work correctly when there's only one character in play", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: twinFire.cost,
//         Hand: [twinFire, sailTheAzuriteSea],
//       },
//       {
//         Play: [gadgetHackwrenchPerceptiveMouse], // Only one character
//       },
//     );
//
//     Await testEngine.playCard(twinFire);
//
//     // First damage targets the only character
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [gadgetHackwrenchPerceptiveMouse],
//       },
//       True,
//     );
//
//     Expect(
//       TestEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).damage,
//     ).toBe(2);
//
//     // Accept the optional second ability
//     Await testEngine.resolveOptionalAbility();
//
//     // Discard a card
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [sailTheAzuriteSea],
//       },
//       True,
//     );
//     Expect(testEngine.getCardModel(sailTheAzuriteSea).zone).toBe("discard");
//
//     // Target the same character again (current behavior allows this)
//     Await testEngine.resolveTopOfStack({
//       Targets: [gadgetHackwrenchPerceptiveMouse],
//     });
//
//     // The character should be banished due to lethal damage
//     Expect(testEngine.getCardModel(gadgetHackwrenchPerceptiveMouse).zone).toBe(
//       "discard",
//     );
//   });
// });
//
