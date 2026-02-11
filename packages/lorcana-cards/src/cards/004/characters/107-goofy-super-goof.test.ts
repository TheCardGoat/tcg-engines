// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { goofySuperGoof } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Goofy - Super Goof", () => {
//   It("**Rush** _(This character can challenge the turn they're played)_", () => {
//     Const testStore = new TestStore({
//       Play: [goofySuperGoof],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", goofySuperGoof.id);
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   Describe("**SUPER PEANUT POWERS** Whenever this character challenges another, gain 2 lore", () => {
//     It("should gain lore when challenging another character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [goofySuperGoof],
//         },
//         {
//           Play: [hiramFlavershamToymaker],
//         },
//       );
//
//       Await testEngine.tapCard(hiramFlavershamToymaker);
//       Await testEngine.challenge({
//         Attacker: goofySuperGoof,
//         Defender: hiramFlavershamToymaker,
//       });
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//     });
//
//     It("should NOT gain lore when challenging a location", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [goofySuperGoof],
//         },
//         {
//           Play: [hiddenCoveTranquilHaven],
//         },
//       );
//
//       Await testEngine.challenge({
//         Attacker: goofySuperGoof,
//         Defender: hiddenCoveTranquilHaven,
//       });
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(0);
//     });
//   });
// });
//
