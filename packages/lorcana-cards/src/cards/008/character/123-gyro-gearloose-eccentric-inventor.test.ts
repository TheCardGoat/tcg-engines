// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GyroGearlooseEccentricInventor,
//   MontereyJackDefiantProtector,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gyro Gearloose - Eccentric Inventor", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [gyroGearlooseEccentricInventor],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       GyroGearlooseEccentricInventor,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("I'LL SHOW YOU! When you play this character, chosen opposing character gets -3 {S} this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: gyroGearlooseEccentricInventor.cost,
//         Hand: [gyroGearlooseEccentricInventor],
//       },
//       {
//         Play: [montereyJackDefiantProtector],
//       },
//     );
//     Expect(testEngine.getCardModel(montereyJackDefiantProtector).strength).toBe(
//       4,
//     );
//     Await testEngine.playCard(gyroGearlooseEccentricInventor);
//     Await testEngine.resolveTopOfStack({
//       Targets: [montereyJackDefiantProtector],
//     });
//     Expect(testEngine.getCardModel(montereyJackDefiantProtector).strength).toBe(
//       1,
//     );
//     TestEngine.passTurn();
//     Expect(testEngine.getCardModel(montereyJackDefiantProtector).strength).toBe(
//       4,
//     );
//   });
// });
//
