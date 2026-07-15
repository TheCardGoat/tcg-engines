// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ryderFleetfootedInfiltrator } from "@lorcanito/lorcana-engine/cards/008";
// Import { timothyQMouseFlightInstructor } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Timothy Q. Mouse - Flight Instructor", () => {
//   It("LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: timothyQMouseFlightInstructor.cost,
//       Play: [timothyQMouseFlightInstructor, ryderFleetfootedInfiltrator],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       TimothyQMouseFlightInstructor,
//     );
//
//     Expect(cardUnderTest.lore).toBe(timothyQMouseFlightInstructor.lore + 1);
//   });
// });
//
