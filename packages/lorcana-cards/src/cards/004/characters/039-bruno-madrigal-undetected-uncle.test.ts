// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BrunoMadrigalUndetectedUncle,
//   LuisaMadrigalMagicallyStrongOne,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { luisaMadrigalEntertainingMuscle } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bruno Madrigal - Undetected Uncle", () => {
//   It("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Play: [brunoMadrigalUndetectedUncle],
//     });
//
//     Const cardUnderTest = testStore.getCard(brunoMadrigalUndetectedUncle);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   Describe("**YOU JUST HAVE TO SEE IT** {E} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.", () => {
//     It("Hit", () => {
//       Const testStore = new TestStore({
//         Play: [brunoMadrigalUndetectedUncle],
//         Deck: [
//           LuisaMadrigalMagicallyStrongOne,
//           LuisaMadrigalEntertainingMuscle,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(brunoMadrigalUndetectedUncle);
//       Const target = testStore.getCard(luisaMadrigalEntertainingMuscle);
//       Const notTarget = testStore.getCard(luisaMadrigalMagicallyStrongOne);
//
//       CardUnderTest.activate();
//       Expect(testStore.stackLayers.length).toBe(1);
//
//       TestStore.resolveTopOfStack({
//         NameACard: target.name,
//       });
//
//       Expect(target.zone).toBe("hand");
//       Expect(notTarget.zone).toBe("deck");
//       Expect(testStore.getPlayerLore("player_one")).toBe(3);
//     });
//
//     It("Miss", () => {
//       Const testStore = new TestStore({
//         Play: [brunoMadrigalUndetectedUncle],
//         Deck: [
//           LuisaMadrigalMagicallyStrongOne,
//           LuisaMadrigalEntertainingMuscle,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getCard(brunoMadrigalUndetectedUncle);
//       Const target = testStore.getCard(luisaMadrigalEntertainingMuscle);
//       Const notTarget = testStore.getCard(luisaMadrigalMagicallyStrongOne);
//
//       CardUnderTest.activate();
//       Expect(testStore.stackLayers.length).toBe(1);
//
//       TestStore.resolveTopOfStack({
//         NameACard: cardUnderTest.name,
//       });
//
//       Expect(target.meta.revealed).toBe(true);
//       Expect(target.zone).toBe("deck");
//       Expect(notTarget.zone).toBe("deck");
//       Expect(testStore.getPlayerLore("player_one")).toBe(0);
//     });
//   });
// });
//
