import { describe, expect, test } from "vite-plus/test";
import { op05Bellamy035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-035 Bellamy", () => {
  test("plays as a vanilla Character without opening an effect prompt", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Bellamy035],
      activeDon: op05Bellamy035.cost,
    });

    engine.playCard(op05Bellamy035, "south");
    const bellamyId = engine.findCardInZone("south", "character", op05Bellamy035);

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bellamyId),
    ).toMatchObject({ cardId: op05Bellamy035.id, power: 5000, rested: false });
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    expect(view.prompts).toHaveLength(0);
  });
});
