// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { donaldDuckMusketeerSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Musketeer Soldier", () => {
//   It("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**WAIT FOR ME!** When you play this character, chosen character gets +1 {L} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: donaldDuckMusketeerSoldier.cost,
//       Hand: [donaldDuckMusketeerSoldier],
//       Play: [liloMakingAWish],
//     });
//
//     Const cardUnderTest = testStore.getCard(donaldDuckMusketeerSoldier);
//     Const target = testStore.getCard(liloMakingAWish);
//
//     CardUnderTest.playFromHand({ bodyguard: true });
//
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.lore).toBe(liloMakingAWish.lore + 1);
//   });
// });
//
