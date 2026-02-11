// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { goofyFlyingFool } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   LadyKluckProtectiveConfidant,
//   MaidMarianBadmintonAce,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maid Marian - Badminton Ace", () => {
//   It("During an opponent’s turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.", async () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: goofyFlyingFool.cost,
//         Play: [goofyFlyingFool],
//       },
//       {
//         Inkwell: maidMarianBadmintonAce.cost,
//         Play: [maidMarianBadmintonAce, goonsMaleficent],
//         Hand: [],
//       },
//     );
//     Const allyToDamage = testStore.getCard(goonsMaleficent);
//     Const goodShotTarget = testStore.getCard(goofyFlyingFool);
//
//     AllyToDamage.updateCardMeta({ exerted: true });
//
//     GoodShotTarget.challenge(allyToDamage);
//
//     TestStore.changePlayer("player_two");
//     TestStore.resolveTopOfStack({ targets: [goodShotTarget] });
//     Expect(goodShotTarget.damage).toBe(goonsMaleficent.strength + 1);
//   });
//
//   It("Your characters named Lady Kluck gain Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: goonsMaleficent.cost,
//         Play: [goonsMaleficent],
//       },
//       {
//         Inkwell: maidMarianBadmintonAce.cost,
//         Play: [maidMarianBadmintonAce, ladyKluckProtectiveConfidant],
//       },
//     );
//
//     Const kluck = testEngine.getCardModel(ladyKluckProtectiveConfidant);
//     Kluck.updateCardMeta({ exerted: true });
//
//     Const attacker = testEngine.getCardModel(goonsMaleficent);
//     Attacker.challenge(kluck);
//     Expect(kluck.damage).toBe(goonsMaleficent.strength - 1);
//   });
// });
//
