// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { brunosReturn } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe.skip("Bruno's Return", () => {
//   It("Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: brunosReturn.cost,
//       Hand: [brunosReturn],
//       Discard: [mickeyBraveLittleTailor],
//       Play: [mickeyBraveLittleTailor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", brunosReturn.id);
//     Const characterInDiscard = testStore.getByZoneAndId(
//       "discard",
//       MickeyBraveLittleTailor.id,
//     );
//     Const characterInPlay = testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//     );
//
//     // Add damage to the character in play
//     CharacterInPlay.updateCardDamage(2);
//
//     CardUnderTest.playFromHand();
//
//     // With resolveEffectsIndividually, the effects are resolved in the order they appear on the stack
//     // First resolve the heal effect (top of stack)
//     TestStore.resolveTopOfStack(
//       {
//         Targets: [characterInPlay],
//       },
//       True,
//     );
//
//     // Then resolve the move effect (next on stack)
//     TestStore.resolveTopOfStack({
//       Targets: [characterInDiscard],
//     });
//
//     Expect(testStore.getZonesCardCount().hand).toBe(1); // character returned to hand
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // Bruno's Return goes to discard
//     Expect(characterInDiscard.zone).toBe("hand");
//     Expect(characterInPlay.meta.damage).toBe(0); // damage removed
//   });
// });
//
