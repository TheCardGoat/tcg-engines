// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { grandCouncilwomanFederationLeader } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Grand Councilwoman - Federation Leader", () => {
//   It.skip("FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: grandCouncilwomanFederationLeader.cost,
//       Play: [grandCouncilwomanFederationLeader],
//       Hand: [grandCouncilwomanFederationLeader],
//     });
//
//     Await testEngine.playCard(grandCouncilwomanFederationLeader);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
