// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { arielsGrottoASecretPlace } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ariel's Grotto - A Secret Place", () => {
//   It("(no items) While you have 3 or more items in play, this location gets +2 {L}.", () => {
//     Const testStore = new TestStore({}, { play: [arielsGrottoASecretPlace] });
//
//     TestStore.passTurn();
//     TestStore.changePlayer("player_two");
//     Expect(testStore.getPlayerLore("player_two")).toBe(0);
//   });
//   It("(3 items) While you have 3 or more items in play, this location gets +2 {L}.", () => {
//     Const testStore = new TestStore(
//       {},
//       { play: [arielsGrottoASecretPlace, pawpsicle, pawpsicle, pawpsicle] },
//     );
//
//     TestStore.passTurn();
//     TestStore.changePlayer("player_two");
//     Expect(testStore.getPlayerLore("player_two")).toBe(2);
//   });
// });
//
