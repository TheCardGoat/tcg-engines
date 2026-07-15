// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DonaldDuck,
//   DonaldDuckMusketeer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { daisyDuckSecretAgent } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Daisy Duck - Secret Agent", () => {
//   It("**THWART** Whenever this character quests, each opponent chooses and discards a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [daisyDuckSecretAgent],
//       },
//       {
//         Hand: [donaldDuck, donaldDuckMusketeer],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DaisyDuckSecretAgent.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "hand",
//       DonaldDuck.id,
//       "player_two",
//     );
//
//     CardUnderTest.quest();
//     TestStore.changePlayer().resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
