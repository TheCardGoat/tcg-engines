// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { webbyVanderquackJuniorProspector } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Webby Vanderquack - Junior Prospector", () => {
//   Describe("Basic properties", () => {
//     It("has Shift 2 {I}", () => {
//       Const testStore = new TestStore({
//         Play: [webbyVanderquackJuniorProspector],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         WebbyVanderquackJuniorProspector.id,
//       );
//       Expect(cardUnderTest.hasShift).toBe(true);
//     });
//
//     It("has Ward", () => {
//       Const testStore = new TestStore({
//         Play: [webbyVanderquackJuniorProspector],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         WebbyVanderquackJuniorProspector.id,
//       );
//       Expect(cardUnderTest.hasWard).toBe(true);
//     });
//   });
//
//   Describe("WORK SMARTER ability", () => {
//     It("triggers when this character quests and opponent has more inkwell cards", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: 3, // Player has 3 inkwell cards
//           Play: [webbyVanderquackJuniorProspector],
//           Deck: [webbyVanderquackJuniorProspector], // Card to move to inkwell
//         },
//         {
//           Inkwell: 6, // Opponent has 6 inkwell cards (more than player)
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         WebbyVanderquackJuniorProspector.id,
//       );
//       Const targetCard = testStore.getByZoneAndId(
//         "deck",
//         WebbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       CardUnderTest.quest();
//
//       // Accept the optional ability (should trigger)
//       TestStore.resolveOptionalAbility();
//
//       // Should have moved card from deck to inkwell and exerted it
//       Expect(targetCard.zone).toEqual("inkwell");
//       Expect(targetCard.ready).toEqual(false);
//     });
//
//     It("does not trigger when player has equal inkwell cards to opponent", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: 3, // Player has 3 inkwell cards
//           Play: [webbyVanderquackJuniorProspector],
//           Deck: [webbyVanderquackJuniorProspector],
//         },
//         {
//           Inkwell: 3, // Opponent has 3 inkwell cards (equal to player)
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         WebbyVanderquackJuniorProspector.id,
//       );
//       Const targetCard = testStore.getByZoneAndId(
//         "deck",
//         WebbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       CardUnderTest.quest();
//
//       // Should not trigger optional ability (stack should be empty)
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(targetCard.zone).toEqual("deck");
//     });
//
//     It("does not trigger when player has more inkwell cards than opponent", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: 6, // Player has 6 inkwell cards
//           Play: [webbyVanderquackJuniorProspector],
//           Deck: [webbyVanderquackJuniorProspector],
//         },
//         {
//           Inkwell: 3, // Opponent has 3 inkwell cards (less than player)
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         WebbyVanderquackJuniorProspector.id,
//       );
//       Const targetCard = testStore.getByZoneAndId(
//         "deck",
//         WebbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       CardUnderTest.quest();
//
//       // Should not trigger optional ability (stack should be empty)
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(targetCard.zone).toEqual("deck");
//     });
//
//     It("puts top card of deck into inkwell facedown and exerted when ability is accepted", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: 3, // Player has 3 inkwell cards
//           Play: [webbyVanderquackJuniorProspector],
//           Deck: [webbyVanderquackJuniorProspector],
//         },
//         {
//           Inkwell: 6, // Opponent has 6 inkwell cards (more than player)
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         WebbyVanderquackJuniorProspector.id,
//       );
//       Const targetCard = testStore.getByZoneAndId(
//         "deck",
//         WebbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       CardUnderTest.quest();
//
//       // Accept the optional ability
//       TestStore.resolveOptionalAbility();
//
//       // Should have moved card from deck to inkwell and exerted it
//       Expect(targetCard.zone).toEqual("inkwell");
//       Expect(targetCard.ready).toEqual(false);
//     });
//
//     It("triggers multiple times if character quests multiple times", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: 3, // Player has 3 inkwell cards
//           Play: [webbyVanderquackJuniorProspector],
//           Deck: [webbyVanderquackJuniorProspector],
//         },
//         {
//           Inkwell: 6, // Opponent has 6 inkwell cards (more than player)
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         WebbyVanderquackJuniorProspector.id,
//       );
//       Const targetCard = testStore.getByZoneAndId(
//         "deck",
//         WebbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       CardUnderTest.quest();
//
//       // Accept the optional ability
//       TestStore.resolveOptionalAbility();
//
//       // Should have moved card from deck to inkwell and exerted it
//       Expect(targetCard.zone).toEqual("inkwell");
//       Expect(targetCard.ready).toEqual(false);
//     });
//   });
// });
//
