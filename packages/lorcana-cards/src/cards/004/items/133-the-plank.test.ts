// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tamatoaSoShiny } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { robinHoodChampionOfSherwood } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { thePlank } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Plank", () => {
//   It("**WALK!** 2 {I}, Banish this item: Banish chosen Hero character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 2,
//       Play: [thePlank, robinHoodChampionOfSherwood],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", thePlank.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       RobinHoodChampionOfSherwood.id,
//     );
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ mode: "1" }, true);
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
//
//   It("**WALK!** 2 {I}, Banish this item: Ready chosen Villain character. They can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 2,
//       Play: [thePlank, tamatoaSoShiny],
//     });
//     Const cardUnderTest = testStore.getByZoneAndId("play", thePlank.id);
//
//     Const target = testStore.getCard(tamatoaSoShiny);
//     Target.updateCardMeta({ exerted: true });
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ mode: "2" }, true);
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.meta.exerted).toEqual(false);
//   });
// });
//
