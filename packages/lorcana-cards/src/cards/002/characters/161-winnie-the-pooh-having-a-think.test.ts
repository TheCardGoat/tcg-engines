// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   TheNokkWaterSpirit,
//   WinnieThePoohHavingAThink,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Winnie the Pooh - Having a Think", () => {
//   It("**HUNNY POT** Whenever this character quests, you may put a card from your hand into your inkwell facedown.", () => {
//     Const testStore = new TestStore({
//       Play: [winnieThePoohHavingAThink],
//       Hand: [theNokkWaterSpirit],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       WinnieThePoohHavingAThink.id,
//     );
//     Const target = testStore.getByZoneAndId("hand", theNokkWaterSpirit.id);
//
//     CardUnderTest.quest();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("inkwell");
//   });
// });
//
