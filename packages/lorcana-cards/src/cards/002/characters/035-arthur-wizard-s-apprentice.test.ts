// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurWizardsApprentice,
//   ChipTheTeacupGentleSoul,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Arthur - Wizard's Apprentice", () => {
//   Describe("**STUDENT** Whenever this character quests, you may return another chosen character of yours to your hand to gain 2 lore.", () => {
//     It("returning character to hand should give 2 lore", () => {
//       Const testStore = new TestStore({
//         Inkwell: arthurWizardsApprentice.cost,
//         Play: [arthurWizardsApprentice, chipTheTeacupGentleSoul],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ArthurWizardsApprentice.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         ChipTheTeacupGentleSoul.id,
//       );
//
//       CardUnderTest.quest();
//       TestStore.resolveOptionalAbility();
//       Expect(testStore.stackLayers).toHaveLength(1);
//
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("hand");
//       Expect(testStore.store.tableStore.getTable().lore).toBe(
//         2 + arthurWizardsApprentice.lore,
//       );
//     });
//
//     It("Not returning character to hand should NOT give 2 lore", () => {
//       Const testStore = new TestStore({
//         Inkwell: arthurWizardsApprentice.cost,
//         Play: [arthurWizardsApprentice, chipTheTeacupGentleSoul],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ArthurWizardsApprentice.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         ChipTheTeacupGentleSoul.id,
//       );
//
//       CardUnderTest.quest();
//       TestStore.skipOptionalAbility();
//
//       Expect(target.zone).toBe("play");
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(testStore.store.tableStore.getTable().lore).toBe(
//         ArthurWizardsApprentice.lore,
//       );
//     });
//   });
// });
//
