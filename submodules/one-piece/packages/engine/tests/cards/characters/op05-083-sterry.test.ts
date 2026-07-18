import { describe, expect, test } from "vite-plus/test";
import { op05Sterry083 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-083 Sterry", () => {
  test("plays as a vanilla Character without opening an effect prompt", () => {
    expect(op05Sterry083.effect).toBeUndefined();
    expect(op05Sterry083.effects).toBeUndefined();

    const engine = OnePieceTestEngine.create({
      hand: [op05Sterry083],
      activeDon: op05Sterry083.cost,
    });
    const handId = engine.findCardInZone("south", "hand", op05Sterry083);

    engine.playCard(op05Sterry083, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(handId);
    expect(view.players.south.restedDon).toBe(op05Sterry083.cost);
    expect(view.prompts).toHaveLength(0);
  });
});
