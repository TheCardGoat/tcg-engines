// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { balooFriendAndGuardian } from "@lorcanito/lorcana-engine/cards/010/characters/characters";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dragon Fire", () => {
//   It("should banish chosen opposing character when played", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: dragonFire.cost,
//         Hand: [dragonFire],
//       },
//       {
//         Play: [balooFriendAndGuardian],
//       },
//     );
//
//     Const dragonFireCard = testStore.getCard(dragonFire);
//     Const target = testStore.getCard(balooFriendAndGuardian);
//
//     Expect(target.zone).toBe("play");
//
//     DragonFireCard.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
//
//   It("should banish chosen own character when played", () => {
//     Const testStore = new TestStore({
//       Inkwell: dragonFire.cost,
//       Hand: [dragonFire],
//       Play: [balooFriendAndGuardian],
//     });
//
//     Const dragonFireCard = testStore.getCard(dragonFire);
//     Const target = testStore.getCard(balooFriendAndGuardian);
//
//     Expect(target.zone).toBe("play");
//
//     DragonFireCard.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
//
//   It("should work with multiple characters to choose from", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: dragonFire.cost,
//         Hand: [dragonFire],
//         Play: [balooFriendAndGuardian],
//       },
//       {
//         Play: [balooFriendAndGuardian],
//       },
//     );
//
//     Const dragonFireCard = testStore.getCard(dragonFire);
//     Const ownCharacter = testStore.getByZoneAndId(
//       "play",
//       BalooFriendAndGuardian.id,
//       "player_one",
//     );
//     Const opposingCharacter = testStore.getByZoneAndId(
//       "play",
//       BalooFriendAndGuardian.id,
//       "player_two",
//     );
//
//     Expect(ownCharacter.zone).toBe("play");
//     Expect(opposingCharacter.zone).toBe("play");
//
//     DragonFireCard.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [opposingCharacter] });
//
//     Expect(ownCharacter.zone).toBe("play");
//     Expect(opposingCharacter.zone).toBe("discard");
//   });
//
//   It("should allow choosing which character to banish when multiple targets exist", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: dragonFire.cost,
//         Hand: [dragonFire],
//         Play: [balooFriendAndGuardian],
//       },
//       {
//         Play: [balooFriendAndGuardian],
//       },
//     );
//
//     Const dragonFireCard = testStore.getCard(dragonFire);
//     Const ownCharacter = testStore.getByZoneAndId(
//       "play",
//       BalooFriendAndGuardian.id,
//       "player_one",
//     );
//     Const opposingCharacter = testStore.getByZoneAndId(
//       "play",
//       BalooFriendAndGuardian.id,
//       "player_two",
//     );
//
//     Expect(ownCharacter.zone).toBe("play");
//     Expect(opposingCharacter.zone).toBe("play");
//
//     DragonFireCard.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [ownCharacter] });
//
//     Expect(ownCharacter.zone).toBe("discard");
//     Expect(opposingCharacter.zone).toBe("play");
//   });
//
//   It("should cost 5 ink to play", () => {
//     Const testStore = new TestStore({
//       Inkwell: dragonFire.cost,
//       Hand: [dragonFire],
//     });
//
//     Const dragonFireCard = testStore.getCard(dragonFire);
//
//     Expect(
//       TestStore.store.tableStore
//         .getPlayerZone("player_one", "inkwell")
//         ?.inkAvailable(),
//     ).toBe(5);
//
//     DragonFireCard.playFromHand();
//
//     // Card should be played and ink should be spent
//     Expect(dragonFireCard.zone).toBe("discard"); // Actions go to discard after being played
//     Expect(
//       TestStore.store.tableStore
//         .getPlayerZone("player_one", "inkwell")
//         ?.inkAvailable(),
//     ).toBe(0);
//   });
//
//   It("should have correct card properties", () => {
//     Expect(dragonFire.name).toBe("Dragon Fire");
//     Expect(dragonFire.type).toBe("action");
//     Expect(dragonFire.cost).toBe(5);
//     Expect(dragonFire.colors).toContain("ruby");
//     Expect(dragonFire.set).toBe("010");
//     Expect(dragonFire.number).toBe(133);
//     Expect(dragonFire.rarity).toBe("uncommon");
//     Expect(dragonFire.text).toBe("Banish chosen character.");
//   });
//
//   It("should reference original card as reprint", () => {
//     Expect(dragonFire.reprints).toContain("buy"); // Original dragon-fire ID
//   });
//
//   It("should handle empty board state with auto-resolution", () => {
//     Const testStore = new TestStore({
//       Inkwell: dragonFire.cost,
//       Hand: [dragonFire],
//     });
//
//     Const dragonFireCard = testStore.getCard(dragonFire);
//
//     DragonFireCard.playFromHand();
//
//     // Should be able to play the card even with no characters in play
//     Expect(dragonFireCard.zone).toBe("discard");
//
//     // When no valid targets exist, the ability should auto-resolve automatically
//   });
// });
//
