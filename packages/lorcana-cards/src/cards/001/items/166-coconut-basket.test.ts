import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { coconutBasketundefined } from "./166-coconut-basket";

describe("Coconut Basket - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [coconutbasket] });
  //   Expect(testEngine.getCardModel(coconutbasket).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MauiHeroToAll,
//   MickeyBraveLittleTailor,
//   PeterPanNeverLanding,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { coconutbasket } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Coconut Basket", () => {
//   It("Consider the Coconut - Whenever you play a character, you may remove up to 2 damage from chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: peterPanNeverLanding.cost + mickeyBraveLittleTailor.cost,
//       Hand: [peterPanNeverLanding, mickeyBraveLittleTailor],
//       Play: [coconutbasket, mauiHeroToAll],
//     });
//
//     Const mauiu = testStore.getByZoneAndId("play", mauiHeroToAll.id);
//     Const peter = testStore.getByZoneAndId("hand", peterPanNeverLanding.id);
//     Const mickey = testStore.getByZoneAndId("hand", mickeyBraveLittleTailor.id);
//
//     Mauiu.updateCardMeta({ damage: 4 });
//
//     Peter.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targetId: mauiu.instanceId });
//
//     Expect(peter.zone).toEqual("play");
//     Expect(mauiu.meta.damage).toEqual(2);
//
//     Mickey.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targetId: mauiu.instanceId });
//
//     Expect(mauiu.meta.damage).toEqual(0);
//     Expect(peter.zone).toEqual("play");
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
//
//   It("it doesn't trigger when an opponent plays a character", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: peterPanNeverLanding.cost,
//         Hand: [peterPanNeverLanding],
//       },
//       {
//         Play: [coconutbasket, mauiHeroToAll],
//       },
//     );
//
//     Const peter = testStore.getByZoneAndId("hand", peterPanNeverLanding.id);
//
//     Peter.playFromHand();
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
