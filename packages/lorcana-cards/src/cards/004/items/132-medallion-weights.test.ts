// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mulanImperialSoldier } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { scuttleExpertOnHumans } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { medallionWeights } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Medallion Weights", () => {
//   It("**DISCIPLINE AND STRENGTH** {E}, 2 {I} - Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: medallionWeights.cost + 2,
//         Play: [medallionWeights, mulanImperialSoldier],
//         Deck: 1,
//       },
//       {
//         Play: [scuttleExpertOnHumans],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(medallionWeights);
//     Const target = testStore.getCard(mulanImperialSoldier);
//     Const opponent = testStore.getCard(scuttleExpertOnHumans);
//
//     Opponent.updateCardMeta({ exerted: true });
//
//     Const initialStrength = target.strength;
//     Const initialHandSize = testStore.getZonesCardCount().hand;
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toBe(initialStrength + 2);
//
//     // Simulate a challenge with Scuttle as the opponent
//     Target.challenge(opponent);
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount().hand).toBe(initialHandSize + 1);
//
//     TestStore.passTurn();
//
//     Expect(target.strength).toBe(initialStrength);
//   });
// });
//
