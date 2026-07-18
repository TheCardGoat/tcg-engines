import { describe, expect, test } from "vite-plus/test";
import { op05SanGorou065 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-065 San-Gorou", () => {
  test("plays as a vanilla Character without opening an effect prompt", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05SanGorou065],
      activeDon: op05SanGorou065.cost,
    });

    engine.playCard(op05SanGorou065, "south");

    const sanGorouId = engine.findCardInZone("south", "character", op05SanGorou065);
    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(sanGorouId);
    expect(view.players.south.restedDon).toBe(op05SanGorou065.cost);
    expect(view.prompts).toHaveLength(0);
  });
});
