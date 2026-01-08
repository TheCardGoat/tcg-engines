// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { webbyVanderquackJuniorProspector } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Webby Vanderquack - Junior Prospector", () => {
//   describe("Basic properties", () => {
//     it("has Shift 2 {I}", () => {
//       const testStore = new TestStore({
//         play: [webbyVanderquackJuniorProspector],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         webbyVanderquackJuniorProspector.id,
//       );
//       expect(cardUnderTest.hasShift).toBe(true);
//     });
//
//     it("has Ward", () => {
//       const testStore = new TestStore({
//         play: [webbyVanderquackJuniorProspector],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         webbyVanderquackJuniorProspector.id,
//       );
//       expect(cardUnderTest.hasWard).toBe(true);
//     });
//   });
//
//   describe("WORK SMARTER ability", () => {
//     it("triggers when this character quests and opponent has more inkwell cards", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: 3, // Player has 3 inkwell cards
//           play: [webbyVanderquackJuniorProspector],
//           deck: [webbyVanderquackJuniorProspector], // Card to move to inkwell
//         },
//         {
//           inkwell: 6, // Opponent has 6 inkwell cards (more than player)
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         webbyVanderquackJuniorProspector.id,
//       );
//       const targetCard = testStore.getByZoneAndId(
//         "deck",
//         webbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       cardUnderTest.quest();
//
//       // Accept the optional ability (should trigger)
//       testStore.resolveOptionalAbility();
//
//       // Should have moved card from deck to inkwell and exerted it
//       expect(targetCard.zone).toEqual("inkwell");
//       expect(targetCard.ready).toEqual(false);
//     });
//
//     it("does not trigger when player has equal inkwell cards to opponent", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: 3, // Player has 3 inkwell cards
//           play: [webbyVanderquackJuniorProspector],
//           deck: [webbyVanderquackJuniorProspector],
//         },
//         {
//           inkwell: 3, // Opponent has 3 inkwell cards (equal to player)
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         webbyVanderquackJuniorProspector.id,
//       );
//       const targetCard = testStore.getByZoneAndId(
//         "deck",
//         webbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       cardUnderTest.quest();
//
//       // Should not trigger optional ability (stack should be empty)
//       expect(testStore.stackLayers).toHaveLength(0);
//       expect(targetCard.zone).toEqual("deck");
//     });
//
//     it("does not trigger when player has more inkwell cards than opponent", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: 6, // Player has 6 inkwell cards
//           play: [webbyVanderquackJuniorProspector],
//           deck: [webbyVanderquackJuniorProspector],
//         },
//         {
//           inkwell: 3, // Opponent has 3 inkwell cards (less than player)
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         webbyVanderquackJuniorProspector.id,
//       );
//       const targetCard = testStore.getByZoneAndId(
//         "deck",
//         webbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       cardUnderTest.quest();
//
//       // Should not trigger optional ability (stack should be empty)
//       expect(testStore.stackLayers).toHaveLength(0);
//       expect(targetCard.zone).toEqual("deck");
//     });
//
//     it("puts top card of deck into inkwell facedown and exerted when ability is accepted", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: 3, // Player has 3 inkwell cards
//           play: [webbyVanderquackJuniorProspector],
//           deck: [webbyVanderquackJuniorProspector],
//         },
//         {
//           inkwell: 6, // Opponent has 6 inkwell cards (more than player)
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         webbyVanderquackJuniorProspector.id,
//       );
//       const targetCard = testStore.getByZoneAndId(
//         "deck",
//         webbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       cardUnderTest.quest();
//
//       // Accept the optional ability
//       testStore.resolveOptionalAbility();
//
//       // Should have moved card from deck to inkwell and exerted it
//       expect(targetCard.zone).toEqual("inkwell");
//       expect(targetCard.ready).toEqual(false);
//     });
//
//     it("triggers multiple times if character quests multiple times", () => {
//       const testStore = new TestStore(
//         {
//           inkwell: 3, // Player has 3 inkwell cards
//           play: [webbyVanderquackJuniorProspector],
//           deck: [webbyVanderquackJuniorProspector],
//         },
//         {
//           inkwell: 6, // Opponent has 6 inkwell cards (more than player)
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         webbyVanderquackJuniorProspector.id,
//       );
//       const targetCard = testStore.getByZoneAndId(
//         "deck",
//         webbyVanderquackJuniorProspector.id,
//       );
//
//       // Quest the character
//       cardUnderTest.quest();
//
//       // Accept the optional ability
//       testStore.resolveOptionalAbility();
//
//       // Should have moved card from deck to inkwell and exerted it
//       expect(targetCard.zone).toEqual("inkwell");
//       expect(targetCard.ready).toEqual(false);
//     });
//   });
// });
//
