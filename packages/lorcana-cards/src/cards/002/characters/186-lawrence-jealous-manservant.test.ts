// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { lawrenceJealousManservant } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Lawrence- Jealous Manservant", () => {
//   describe("**PAYBACK** While this character has no damage, he gets +4 {S}.", () => {
//     it("has no damage", () => {
//       const testStore = new TestStore({
//         inkwell: lawrenceJealousManservant.cost,
//         play: [lawrenceJealousManservant],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         lawrenceJealousManservant.id,
//       );
//
//       expect(cardUnderTest.strength).toEqual(
//         lawrenceJealousManservant.strength + 4,
//       );
//     });
//
//     it("damaged", () => {
//       const testStore = new TestStore({
//         inkwell: lawrenceJealousManservant.cost,
//         play: [lawrenceJealousManservant],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         lawrenceJealousManservant.id,
//       );
//
//       cardUnderTest.updateCardMeta({ damage: 1 });
//
//       expect(cardUnderTest.strength).toEqual(0);
//     });
//   });
// });
//
// [
//   {
//     source: "s2",
//     effects: {
//       type: "attribute",
//       attribute: "strength",
//       amount: 4,
//       modifier: "add",
//       duration: "static",
//       target: {
//         type: "card",
//         value: "all",
//         filters: [{ filter: "instanceId", value: "s2" }],
//       },
//     },
//     responder: "player_one",
//   },
// ];
//
