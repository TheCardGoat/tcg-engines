// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { scepterOfArendelle } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scepter Of Arendelle", () => {
//   It("Command - Chosen character gains **Support** this turn.", () => {
//     Const testStore = new TestStore({
//       Play: [scepterOfArendelle, moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ScepterOfArendelle.id,
//     );
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.activate();
//
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.hasSupport).toEqual(true);
//   });
// });
//
