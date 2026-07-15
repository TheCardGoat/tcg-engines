// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { intoTheUnknown } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Into The Unknown", () => {
//   It("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: intoTheUnknown.cost,
//       Play: [cinderellaBallroomSensation],
//       Hand: [intoTheUnknown],
//     });
//
//     Await testEngine.singSong({
//       Song: intoTheUnknown,
//       Singer: cinderellaBallroomSensation,
//     });
//     Await testEngine.resolveTopOfStack({
//       Targets: [cinderellaBallroomSensation],
//     });
//
//     Expect(testEngine.getCardModel(cinderellaBallroomSensation).zone).toBe(
//       "inkwell",
//     );
//   });
//
//   It("Put chosen exerted character into their player's inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: intoTheUnknown.cost,
//         Play: [],
//         Hand: [intoTheUnknown],
//       },
//       {
//         Play: [cinderellaBallroomSensation],
//         Inkwell: 1,
//       },
//     );
//
//     TestEngine
//       .getCardModel(cinderellaBallroomSensation)
//       .updateCardMeta({ exerted: true });
//
//     Await testEngine.playCard(intoTheUnknown);
//     Await testEngine.resolveTopOfStack({
//       Targets: [cinderellaBallroomSensation],
//     });
//
//     Expect(testEngine.getCardModel(cinderellaBallroomSensation).zone).toBe(
//       "inkwell",
//     );
//     Expect(testEngine.getCardModel(cinderellaBallroomSensation).exerted).toBe(
//       True,
//     );
//     Expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(1);
//     Expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(2);
//   });
//
//   It("No characters in play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: intoTheUnknown.cost,
//       Play: [],
//       Hand: [intoTheUnknown],
//     });
//
//     Await testEngine.playCard(intoTheUnknown);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
