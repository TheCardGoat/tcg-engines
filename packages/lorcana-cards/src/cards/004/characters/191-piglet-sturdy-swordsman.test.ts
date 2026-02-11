// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ursulaDeceiverOfAll } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { pigletSturdySwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Piglet - Sturdy Swordsman", () => {
//   It("**Resist +1** _(Damage dealt to this character is reduced by 1.)_**NOT SO SMALL ANYMORE** While you have no cards in your hand, this character can challenge ready characters.", () => {
//     Const testStore = new TestStore(
//       {
//         Hand: [pigletSturdySwordsman],
//         Play: [pigletSturdySwordsman],
//       },
//       { play: [ursulaDeceiverOfAll] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PigletSturdySwordsman.id,
//     );
//
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       UrsulaDeceiverOfAll.id,
//       "player_two",
//     );
//
//     Expect(cardUnderTest.canChallenge(defender)).toBeFalsy();
//
//     Const cardInHand = testStore.getByZoneAndId(
//       "hand",
//       PigletSturdySwordsman.id,
//     );
//
//     CardInHand.discard();
//
//     Expect(cardUnderTest.canChallenge(defender)).toBeTruthy();
//
//     CardUnderTest.challenge(defender);
//     Expect(cardUnderTest.damage).toBe(1);
//   });
// });
//
