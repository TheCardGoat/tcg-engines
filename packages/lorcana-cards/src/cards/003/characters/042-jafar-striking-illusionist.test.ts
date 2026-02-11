// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { aWholeNewWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { jafarStrikingIllusionist } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jafar - Striking Illusionist", () => {
//   It("**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Jafar.)_**Evasive** _(Only characters with Evasive can challenge this character.)_**POWER BEYOND MEASURE** During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Play: [jafarStrikingIllusionist],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       JafarStrikingIllusionist.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("_**Evasive** _(Only characters with Evasive can challenge this character.)", () => {
//     Const testStore = new TestStore({
//       Play: [jafarStrikingIllusionist],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       JafarStrikingIllusionist.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   Describe("_**POWER BEYOND MEASURE** During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.", () => {
//     It("draw a card", () => {
//       Const testStore = new TestStore({
//         Inkwell: pawpsicle.cost,
//         Play: [jafarStrikingIllusionist],
//         Hand: [pawpsicle],
//         Deck: 7,
//       });
//
//       Const cardUnderTest = testStore.getCard(jafarStrikingIllusionist);
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Const pawpsicleCard = testStore.getCard(pawpsicle);
//       PawpsicleCard.playFromHand();
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getPlayerLore("player_one")).toBe(1);
//     });
//
//     It("draws many cards", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: aWholeNewWorld.cost,
//           Play: [jafarStrikingIllusionist],
//           Hand: [aWholeNewWorld],
//           Deck: 7,
//         },
//         {
//           Hand: [dingleHopper],
//           Deck: 7,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(jafarStrikingIllusionist);
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Const aWholeNewWorldCard = testStore.getCard(aWholeNewWorld);
//       AWholeNewWorldCard.playFromHand();
//
//       TestStore.resolveTopOfStack({}, true);
//       TestStore.resolveTopOfStack({}, true);
//       TestStore.resolveTopOfStack({}, true);
//       TestStore.resolveTopOfStack({}, true);
//       TestStore.resolveTopOfStack({}, true);
//       TestStore.resolveTopOfStack({}, true);
//
//       Expect(testStore.getPlayerLore("player_one")).toBe(7);
//       Expect(testStore.getPlayerLore("player_two")).toBe(0);
//     });
//   });
// });
//
