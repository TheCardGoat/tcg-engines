// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BambiPrinceOfTheForest,
//   JeweledCollar,
//   JumbaJookibaCriticalScientist,
//   KhanWarHorse,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jeweled Collar", () => {
//   It("WELCOME EXTRAVAGANCE Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [bambiPrinceOfTheForest],
//       },
//       {
//         Play: [jeweledCollar, khanWarHorse],
//         Deck: [jumbaJookibaCriticalScientist],
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: bambiPrinceOfTheForest,
//       Defender: khanWarHorse,
//       ExertDefender: true,
//     });
//
//     Expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(0);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getZonesCardCount("player_two").inkwell).toBe(1);
//   });
// });
//
