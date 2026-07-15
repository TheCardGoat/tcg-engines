import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { developYourBrain } from "./161-develop-your-brain";

describe("Develop Your Brain", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [developYourBrain] });
  //   Expect(testEngine.getCardModel(developYourBrain).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { developYourBrain } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   ChiefTui,
//   HeiheiBoatSnack,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
// Import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
//
// Describe("Develop Your Brain", () => {
//   It("Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: developYourBrain.cost,
//       Hand: [developYourBrain],
//       Deck: [shieldOfVirtue, heiheiBoatSnack, chiefTui, moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", developYourBrain.id);
//     Const first = testStore.getByZoneAndId("deck", moanaOfMotunui.id);
//     Const second = testStore.getByZoneAndId("deck", chiefTui.id);
//     Const third = testStore.getByZoneAndId("deck", heiheiBoatSnack.id);
//     Const fourth = testStore.getByZoneAndId("deck", shieldOfVirtue.id);
//
//     CardUnderTest.playFromHand();
//
//     Const bottom: CardModel[] = [first];
//
//     TestStore.resolveTopOfStack({ scry: { bottom, hand: [second] } });
//
//     Const deck = testStore.store.tableStore
//       .getPlayerZoneCards("player_one", "deck")
//       .map((card) => card.lorcanitoCard?.name);
//
//     Expect(second.zone).toEqual("hand");
//     Expect(deck).toEqual([
//       First.lorcanitoCard?.name,
//       Fourth.lorcanitoCard?.name,
//       Third.lorcanitoCard?.name,
//     ]);
//   });
// });
//
