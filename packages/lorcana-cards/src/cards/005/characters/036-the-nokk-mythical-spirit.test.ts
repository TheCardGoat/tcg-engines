// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FixitFelixJrNicelandSteward,
//   MonstroWhaleOfAWhale,
//   TheNokkMythicalSpirit,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Nokk - Mythical Spirit", () => {
//   It.skip("**TURNING TIDES** When you play this character, you may move up to 2 damage counters from chosen character to chosen opposing character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: theNokkMythicalSpirit.cost,
//         Hand: [theNokkMythicalSpirit, fixitFelixJrNicelandSteward],
//       },
//       {
//         Play: [monstroWhaleOfAWhale],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(theNokkMythicalSpirit);
//     Const damagedCharacter = testStore.getCard(fixitFelixJrNicelandSteward);
//     DamagedCharacter.updateCardDamage(2);
//     Const opposingCharacter = testStore.getCard(monstroWhaleOfAWhale);
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       Targets: [opposingCharacter],
//     });
//     TestStore.resolveTopOfStack({
//       Targets: [damagedCharacter],
//     });
//     Expect(damagedCharacter.damage).toBe(0);
//     Expect(opposingCharacter.damage).toBe(2);
//   });
// });
//
