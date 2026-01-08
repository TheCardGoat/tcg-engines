// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { ryderFleetfootedInfiltrator } from "@lorcanito/lorcana-engine/cards/008";
// import { timothyQMouseFlightInstructor } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Timothy Q. Mouse - Flight Instructor", () => {
//   it("LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: timothyQMouseFlightInstructor.cost,
//       play: [timothyQMouseFlightInstructor, ryderFleetfootedInfiltrator],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       timothyQMouseFlightInstructor,
//     );
//
//     expect(cardUnderTest.lore).toBe(timothyQMouseFlightInstructor.lore + 1);
//   });
// });
//
