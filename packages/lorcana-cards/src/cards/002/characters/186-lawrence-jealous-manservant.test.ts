// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { lawrenceJealousManservant } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lawrence- Jealous Manservant", () => {
//   Describe("**PAYBACK** While this character has no damage, he gets +4 {S}.", () => {
//     It("has no damage", () => {
//       Const testStore = new TestStore({
//         Inkwell: lawrenceJealousManservant.cost,
//         Play: [lawrenceJealousManservant],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         LawrenceJealousManservant.id,
//       );
//
//       Expect(cardUnderTest.strength).toEqual(
//         LawrenceJealousManservant.strength + 4,
//       );
//     });
//
//     It("damaged", () => {
//       Const testStore = new TestStore({
//         Inkwell: lawrenceJealousManservant.cost,
//         Play: [lawrenceJealousManservant],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         LawrenceJealousManservant.id,
//       );
//
//       CardUnderTest.updateCardMeta({ damage: 1 });
//
//       Expect(cardUnderTest.strength).toEqual(0);
//     });
//   });
// });
//
// [
//   {
//     Source: "s2",
//     Effects: {
//       Type: "attribute",
//       Attribute: "strength",
//       Amount: 4,
//       Modifier: "add",
//       Duration: "static",
//       Target: {
//         Type: "card",
//         Value: "all",
//         Filters: [{ filter: "instanceId", value: "s2" }],
//       },
//     },
//     Responder: "player_one",
//   },
// ];
//
