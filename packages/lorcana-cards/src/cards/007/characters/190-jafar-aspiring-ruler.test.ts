// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { jafarAspiringRuler } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jafar - Aspiring Ruler", () => {
//   It("THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
//     Const testStore = new TestStore({
//       Inkwell: jafarAspiringRuler.cost,
//       Hand: [jafarAspiringRuler],
//       Play: [goonsMaleficent],
//     });
//
//     Const cardUnderTest = testStore.getCard(jafarAspiringRuler);
//     Const target = testStore.getCard(goonsMaleficent);
//     Expect(target.hasChallenger).toEqual(false);
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.hasChallenger).toEqual(true);
//   });
// });
//
