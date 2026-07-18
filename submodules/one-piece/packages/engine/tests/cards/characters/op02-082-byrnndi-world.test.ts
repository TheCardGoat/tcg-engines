import { describe, expect, test } from "vite-plus/test";
import { op02ByrnndiWorld082 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-082 Byrnndi World", () => {
  test("may return 8 DON!! to gain +792000 power for the turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op02ByrnndiWorld082],
      activeDon: 8,
    });
    const worldId = engine.findCardInZone("south", "character", op02ByrnndiWorld082);
    const powerBefore = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === worldId)?.power;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(worldId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === worldId)?.power).toBe(
      (powerBefore ?? 0) + 792000,
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: donDeckBefore + 8 });
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");

    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === worldId)?.power).toBe(
      powerBefore,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or gaining power", () => {
    const engine = OnePieceTestEngine.create({
      character: [op02ByrnndiWorld082],
      activeDon: 8,
    });
    const worldId = engine.findCardInZone("south", "character", op02ByrnndiWorld082);
    const powerBefore = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === worldId)?.power;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(worldId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === worldId)?.power).toBe(
      powerBefore,
    );
    expect(view.players.south).toMatchObject({ activeDon: 8, donDeckCount: donDeckBefore });
    expect(view.prompts).toHaveLength(0);
  });
});
