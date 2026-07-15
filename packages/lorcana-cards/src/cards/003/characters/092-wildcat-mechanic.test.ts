// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { wildcatMechanic } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Wildcat - Mechanic", () => {
//   It("**DISASSEMBLE** {E} – Banish chosen item.", () => {
//     Const testStore = new TestStore({
//       Play: [wildcatMechanic, pawpsicle],
//     });
//
//     Const cardUnderTest = testStore.getCard(wildcatMechanic);
//     Const target = testStore.getCard(pawpsicle);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
