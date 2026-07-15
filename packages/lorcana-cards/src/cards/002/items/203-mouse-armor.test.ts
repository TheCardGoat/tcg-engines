// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tianaDiligentWaitress } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mouseArmor } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mouse Armor", () => {
//   It("**PROTECTION** {E} − Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     Const testStore = new TestStore({
//       Play: [mouseArmor, tianaDiligentWaitress],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", mouseArmor.id);
//     Const target = testStore.getByZoneAndId("play", tianaDiligentWaitress.id);
//
//     Expect(target.hasResist).toBeFalsy();
//
//     CardUnderTest.activate();
//     Expect(testStore.stackLayers).toHaveLength(1);
//
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(cardUnderTest.meta.exerted).toBeTruthy();
//
//     Expect(target.hasResist).toBeTruthy();
//     Expect(target.damageReduction()).toEqual(1);
//   });
// });
//
