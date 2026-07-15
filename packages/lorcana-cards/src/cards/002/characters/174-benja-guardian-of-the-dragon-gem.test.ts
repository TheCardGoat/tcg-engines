// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { benjaGuardianOfTheDragonGem } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mouseArmor } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Benja- Guardian of the Dragon Gem", () => {
//   It("**WE HAVE A CHOICE** When you play this character, you may banish chosen item.", () => {
//     Const testStore = new TestStore({
//       Inkwell: benjaGuardianOfTheDragonGem.cost,
//       Hand: [benjaGuardianOfTheDragonGem],
//       Play: [mouseArmor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       BenjaGuardianOfTheDragonGem.id,
//     );
//     Const target = testStore.getByZoneAndId("play", mouseArmor.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
