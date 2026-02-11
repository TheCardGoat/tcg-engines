import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { tamatoaSoShiny } from "./159-tamatoa-so-shiny";

describe("Tamatoa - So Shiny!", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [tamatoaSoShiny] });
  //   Expect(testEngine.getCardModel(tamatoaSoShiny).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tamatoaSoShiny } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   Coconutbasket,
//   DingleHopper,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tamatoa - So Shiny!", () => {
//   It("Glam - This character gets +1 {L} for each item you have in play.", () => {
//     Const testStore = new TestStore({
//       Inkwell: dingleHopper.cost + coconutbasket.cost,
//       Hand: [dingleHopper, coconutbasket],
//       Play: [tamatoaSoShiny],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", tamatoaSoShiny.id);
//     Const aTarget = testStore.getByZoneAndId("hand", dingleHopper.id);
//     Const anotherTarget = testStore.getByZoneAndId("hand", coconutbasket.id);
//
//     Expect(cardUnderTest.lore).toBe(1);
//     ATarget.playFromHand();
//     Expect(cardUnderTest.lore).toBe(2);
//     AnotherTarget.playFromHand();
//     Expect(cardUnderTest.lore).toBe(3);
//   });
//
//   Describe("WHAT HAVE WE HERE? - When you play this character and whenever he quests, you may return an item card from your discard to your hand.", () => {
//     It("On play", () => {
//       Const testStore = new TestStore({
//         Inkwell: tamatoaSoShiny.cost,
//         Hand: [tamatoaSoShiny],
//         Discard: [dingleHopper],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", tamatoaSoShiny.id);
//       Const aTarget = testStore.getByZoneAndId("discard", dingleHopper.id);
//
//       Expect(aTarget.zone).toBe("discard");
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targetId: aTarget.instanceId });
//       Expect(aTarget.zone).toBe("hand");
//     });
//
//     It("On quest", () => {
//       Const testStore = new TestStore({
//         Inkwell: tamatoaSoShiny.cost,
//         Play: [tamatoaSoShiny],
//         Discard: [coconutbasket],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", tamatoaSoShiny.id);
//       Const anotherTarget = testStore.getByZoneAndId(
//         "discard",
//         Coconutbasket.id,
//       );
//
//       CardUnderTest.quest();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targetId: anotherTarget.instanceId });
//       Expect(anotherTarget.zone).toBe("hand");
//     });
//
//     It("Can skip the effect.", () => {
//       Const testStore = new TestStore({
//         Inkwell: tamatoaSoShiny.cost,
//         Hand: [tamatoaSoShiny],
//         Discard: [dingleHopper],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", tamatoaSoShiny.id);
//       Const aTarget = testStore.getByZoneAndId("discard", dingleHopper.id);
//
//       Expect(aTarget.zone).toBe("discard");
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ skip: true });
//       Expect(aTarget.zone).toBe("discard");
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//   });
// });
//
