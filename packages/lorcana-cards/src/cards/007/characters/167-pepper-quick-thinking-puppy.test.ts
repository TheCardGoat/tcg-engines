// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   FrecklesGoodBoy,
//   GaetanMoliereTheMole,
//   PepperQuickthinkingPuppy,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pepper - Quick-Thinking Puppy", () => {
//   It("IN THE NICK OF TIME Whenever one of your Puppy characters is banished, you may put that card into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 3,
//         Hand: [liloGalacticHero],
//         Play: [gaetanMoliereTheMole],
//       },
//       {
//         Play: [pepperQuickthinkingPuppy, frecklesGoodBoy],
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: gaetanMoliereTheMole,
//       Defender: frecklesGoodBoy,
//       ExertDefender: true,
//     });
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardModel(frecklesGoodBoy).zone).toEqual("inkwell");
//     Expect(testEngine.getCardModel(pepperQuickthinkingPuppy).zone).toEqual(
//       "play",
//     );
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 3,
//         Hand: 1,
//         Play: 1,
//       }),
//     );
//   });
//   It("Pepper to the inkwell", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 3,
//         Hand: [liloGalacticHero],
//         Play: [gaetanMoliereTheMole],
//       },
//       {
//         Play: [pepperQuickthinkingPuppy, frecklesGoodBoy],
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: gaetanMoliereTheMole,
//       Defender: pepperQuickthinkingPuppy,
//       ExertDefender: true,
//     });
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardModel(pepperQuickthinkingPuppy).zone).toEqual(
//       "inkwell",
//     );
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 3,
//         Hand: 1,
//         Play: 1,
//       }),
//     );
//   });
// });
//
