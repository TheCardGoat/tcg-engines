// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { elsaTheFifthSpirit } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   DeweyLovableShowoff,
//   DonKarnageAirPirateLeader,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Don Karnage - Air Pirate Leader", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [donKarnageAirPirateLeader],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(donKarnageAirPirateLeader);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("SCORNFUL TAUNT Whenever you play an action that isn’t a song, chosen opposing character gains Reckless during their next turn. (They can’t quest and must challenge if able.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: brawl.cost,
//         Play: [donKarnageAirPirateLeader, deweyLovableShowoff],
//         Hand: [brawl],
//       },
//       {
//         Play: [elsaTheFifthSpirit],
//       },
//     );
//
//     Const cardActionItem = testEngine.getCardModel(elsaTheFifthSpirit);
//     Const action = testEngine.getCardModel(brawl);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(target.hasReckless).toEqual(false);
//
//     Await testEngine.playCard(action);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [cardActionItem] }, true);
//     Await testEngine.resolveTopOfStack({ targets: [target] }, true);
//
//     Await testEngine.passTurn();
//     TestEngine.changeActivePlayer();
//     Expect(target.hasReckless).toEqual(true);
//   });
// });
//
