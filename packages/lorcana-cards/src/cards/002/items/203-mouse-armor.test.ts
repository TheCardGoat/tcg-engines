// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tianaDiligentWaitress } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { mouseArmor } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mouse Armor", () => {
//   it("**PROTECTION** {E} − Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     const testStore = new TestStore({
//       play: [mouseArmor, tianaDiligentWaitress],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", mouseArmor.id);
//     const target = testStore.getByZoneAndId("play", tianaDiligentWaitress.id);
//
//     expect(target.hasResist).toBeFalsy();
//
//     cardUnderTest.activate();
//     expect(testStore.stackLayers).toHaveLength(1);
//
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(cardUnderTest.meta.exerted).toBeTruthy();
//
//     expect(target.hasResist).toBeTruthy();
//     expect(target.damageReduction()).toEqual(1);
//   });
// });
//
