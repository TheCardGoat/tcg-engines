// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { balooFriendAndGuardian } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// import { dragonFire } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Dragon Fire", () => {
//   it("should banish chosen opposing character when played", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: dragonFire.cost,
//         hand: [dragonFire],
//       },
//       {
//         play: [balooFriendAndGuardian],
//       },
//     );
//
//     const dragonFireCard = testStore.getCard(dragonFire);
//     const target = testStore.getCard(balooFriendAndGuardian);
//
//     expect(target.zone).toBe("play");
//
//     dragonFireCard.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toBe("discard");
//   });
//
//   it("should banish chosen own character when played", () => {
//     const testStore = new TestStore({
//       inkwell: dragonFire.cost,
//       hand: [dragonFire],
//       play: [balooFriendAndGuardian],
//     });
//
//     const dragonFireCard = testStore.getCard(dragonFire);
//     const target = testStore.getCard(balooFriendAndGuardian);
//
//     expect(target.zone).toBe("play");
//
//     dragonFireCard.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toBe("discard");
//   });
//
//   it("should work with multiple characters to choose from", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: dragonFire.cost,
//         hand: [dragonFire],
//         play: [balooFriendAndGuardian],
//       },
//       {
//         play: [balooFriendAndGuardian],
//       },
//     );
//
//     const dragonFireCard = testStore.getCard(dragonFire);
//     const ownCharacter = testStore.getByZoneAndId(
//       "play",
//       balooFriendAndGuardian.id,
//       "player_one",
//     );
//     const opposingCharacter = testStore.getByZoneAndId(
//       "play",
//       balooFriendAndGuardian.id,
//       "player_two",
//     );
//
//     expect(ownCharacter.zone).toBe("play");
//     expect(opposingCharacter.zone).toBe("play");
//
//     dragonFireCard.playFromHand();
//     testStore.resolveTopOfStack({ targets: [opposingCharacter] });
//
//     expect(ownCharacter.zone).toBe("play");
//     expect(opposingCharacter.zone).toBe("discard");
//   });
//
//   it("should allow choosing which character to banish when multiple targets exist", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: dragonFire.cost,
//         hand: [dragonFire],
//         play: [balooFriendAndGuardian],
//       },
//       {
//         play: [balooFriendAndGuardian],
//       },
//     );
//
//     const dragonFireCard = testStore.getCard(dragonFire);
//     const ownCharacter = testStore.getByZoneAndId(
//       "play",
//       balooFriendAndGuardian.id,
//       "player_one",
//     );
//     const opposingCharacter = testStore.getByZoneAndId(
//       "play",
//       balooFriendAndGuardian.id,
//       "player_two",
//     );
//
//     expect(ownCharacter.zone).toBe("play");
//     expect(opposingCharacter.zone).toBe("play");
//
//     dragonFireCard.playFromHand();
//     testStore.resolveTopOfStack({ targets: [ownCharacter] });
//
//     expect(ownCharacter.zone).toBe("discard");
//     expect(opposingCharacter.zone).toBe("play");
//   });
//
//   it("should cost 5 ink to play", () => {
//     const testStore = new TestStore({
//       inkwell: dragonFire.cost,
//       hand: [dragonFire],
//     });
//
//     const dragonFireCard = testStore.getCard(dragonFire);
//
//     expect(
//       testStore.store.tableStore
//         .getPlayerZone("player_one", "inkwell")
//         ?.inkAvailable(),
//     ).toBe(5);
//
//     dragonFireCard.playFromHand();
//
//     // Card should be played and ink should be spent
//     expect(dragonFireCard.zone).toBe("discard"); // Actions go to discard after being played
//     expect(
//       testStore.store.tableStore
//         .getPlayerZone("player_one", "inkwell")
//         ?.inkAvailable(),
//     ).toBe(0);
//   });
//
//   it("should have correct card properties", () => {
//     expect(dragonFire.name).toBe("Dragon Fire");
//     expect(dragonFire.type).toBe("action");
//     expect(dragonFire.cost).toBe(5);
//     expect(dragonFire.colors).toContain("ruby");
//     expect(dragonFire.set).toBe("010");
//     expect(dragonFire.number).toBe(133);
//     expect(dragonFire.rarity).toBe("uncommon");
//     expect(dragonFire.text).toBe("Banish chosen character.");
//   });
//
//   it("should reference original card as reprint", () => {
//     expect(dragonFire.reprints).toContain("buy"); // Original dragon-fire ID
//   });
//
//   it("should handle empty board state with auto-resolution", () => {
//     const testStore = new TestStore({
//       inkwell: dragonFire.cost,
//       hand: [dragonFire],
//     });
//
//     const dragonFireCard = testStore.getCard(dragonFire);
//
//     dragonFireCard.playFromHand();
//
//     // Should be able to play the card even with no characters in play
//     expect(dragonFireCard.zone).toBe("discard");
//
//     // When no valid targets exist, the ability should auto-resolve automatically
//   });
// });
//
