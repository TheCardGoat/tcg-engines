import { describe, expect, test } from "vite-plus/test";
import { op04CharlottePerospero107 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-107 Charlotte Perospero", () => {
  test("is vanilla and can be played through the public command", () => {
    expect(op04CharlottePerospero107.effect).toBeUndefined();
    expect(op04CharlottePerospero107.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({
      hand: [op04CharlottePerospero107],
      activeDon: op04CharlottePerospero107.cost,
    });
    const handId = engine.findCardInZone("south", "hand", op04CharlottePerospero107);

    engine.playCard(op04CharlottePerospero107, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(handId);
    expect(view.players.south.restedDon).toBe(op04CharlottePerospero107.cost);
    expect(view.prompts).toHaveLength(0);
  });
});
