// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FairyGodmotherHereToHelp,
//   KuzcoWantedLlama,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kuzco - Wanted Llama", () => {
//   It("**OK, WHERE AM I?** When this character is banished, you may draw a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Deck: 1,
//         Play: [kuzcoWantedLlama],
//       },
//       { play: [fairyGodmotherHereToHelp] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", kuzcoWantedLlama.id);
//
//     CardUnderTest.updateCardMeta({ exerted: true });
//     Const attacker = testStore.getByZoneAndId(
//       "play",
//       FairyGodmotherHereToHelp.id,
//       "player_two",
//     );
//
//     Attacker.challenge(cardUnderTest);
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Discard: 1,
//         Deck: 0,
//       }),
//     );
//   });
// });
//
