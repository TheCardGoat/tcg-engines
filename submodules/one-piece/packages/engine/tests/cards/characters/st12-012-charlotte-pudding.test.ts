import { describe, expect, test } from "vite-plus/test";
import { op10CharlottePuddingSp012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST12-012 Charlotte Pudding", () => {
  test("returns itself to its owner's hand through Activate: Main", () => {
    const engine = OnePieceTestEngine.create({ character: [op10CharlottePuddingSp012] });
    const puddingId = engine.findCardInZone("south", "character", op10CharlottePuddingSp012);

    engine.activateEffect(puddingId, "activateMain", "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(puddingId);
    expect(view.players.south.characters.some((card) => card?.instanceId === puddingId)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
