import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01EdwardWeevil023 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-023 Edward Weevil", () => {
  test("draws 1 after being played and paying its DON!! cost", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01EdwardWeevil023],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: 4,
    });

    engine.playCard(eb01EdwardWeevil023);

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.hand[0]?.cardId).toBe(eb01Doma005.id);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(4);
    expect(
      view.players.south.characters.some((card) => card?.cardId === eb01EdwardWeevil023.id),
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
