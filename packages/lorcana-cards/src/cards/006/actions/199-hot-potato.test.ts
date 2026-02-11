// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aladdinHeroicOutlaw } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { fryingPan } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { hotPotato } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hot Potato", () => {
//   It("Deal 2 damage to chosen character", () => {
//     Const testStore = new TestStore({
//       Inkwell: hotPotato.cost,
//       Hand: [hotPotato],
//       Play: [aladdinHeroicOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getCard(hotPotato);
//     Const target = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);
//
//     CardUnderTest.playFromHand();
//
//     // Choose the damage option (mode 1)
//     TestStore.resolveTopOfStack({ mode: "1" }, true);
//
//     // Resolve the damage effect
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toBe(2);
//   });
//
//   It("Banish chosen item", () => {
//     Const testStore = new TestStore({
//       Inkwell: hotPotato.cost,
//       Hand: [hotPotato],
//       Play: [fryingPan],
//     });
//
//     Const cardUnderTest = testStore.getCard(hotPotato);
//     Const target = testStore.getByZoneAndId("play", fryingPan.id);
//
//     CardUnderTest.playFromHand();
//
//     // Choose the banish option (mode 2)
//     TestStore.resolveTopOfStack({ mode: "2" }, true);
//
//     // Resolve the banish effect
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
// });
//
