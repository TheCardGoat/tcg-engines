// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { robinHoodBelovedOutlaw } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { sherwoodForestOutlawHideaway } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sherwood Forest - Outlaw Hideaway", () => {
//   It("**FOREST HOME** Your characters named Robin Hood may move here for free.", () => {
//     Const testStore = new TestStore({
//       Play: [sherwoodForestOutlawHideaway, robinHoodBelovedOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getCard(sherwoodForestOutlawHideaway);
//     Const target = testStore.getCard(robinHoodBelovedOutlaw);
//
//     Target.enterLocation(cardUnderTest);
//
//     Expect(cardUnderTest.containsCharacter(target)).toBe(true);
//     Expect(target.isAtLocation(cardUnderTest)).toBe(true);
//   });
//
//   Describe("**FAMILIAR TERRAIN** Characters gain **Ward** and '{E} , 1 {I} − Deal 2 damage to chosen damaged character' while here. _(Opponents can't choose them except to challenge.)_", () => {
//     It("{E} – Deal 2 damage to chosen damaged character.", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: sherwoodForestOutlawHideaway.moveCost + 1,
//           Play: [sherwoodForestOutlawHideaway, liloMakingAWish],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(sherwoodForestOutlawHideaway);
//       Const target = testStore.getCard(liloMakingAWish);
//       Const opponent = testStore.getCard(goofyKnightForADay);
//       Opponent.updateCardMeta({ damage: 1 });
//
//       Expect(target.activatedAbilities).toHaveLength(0);
//       Target.enterLocation(cardUnderTest);
//       Expect(target.activatedAbilities).toHaveLength(1);
//
//       Target.activate();
//       TestStore.resolveTopOfStack({ targets: [opponent] });
//
//       Expect(opponent.damage).toBe(3);
//     });
//
//     It("Characters gain **Ward** _(Opponents can't choose them except to challenge.)_", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: sherwoodForestOutlawHideaway.moveCost,
//           Play: [sherwoodForestOutlawHideaway, liloMakingAWish],
//         },
//         {
//           Play: [goofyKnightForADay],
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(sherwoodForestOutlawHideaway);
//       Const attacker = testStore.getCard(liloMakingAWish);
//
//       Expect(attacker.hasWard).toBeFalsy();
//       Attacker.enterLocation(cardUnderTest);
//       Expect(attacker.hasWard).toBeTruthy();
//     });
//   });
// });
//
