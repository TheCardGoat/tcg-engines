import { describe, expect, test } from "vite-plus/test";
import { op07Foxy059, op07Monda074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-074 Monda", () => {
  test("trashes itself and may add one rested DON!! with a Foxy Pirates Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07Foxy059,
      character: [op07Monda074],
      donDeckCount: 2,
    });
    const mondaId = engine.findCardInZone("south", "character", op07Monda074);

    engine.activateEffect(mondaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Monda's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mondaId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the self-trash cost but adds no DON!! with a non-Foxy Leader", () => {
    const engine = OnePieceTestEngine.create({
      character: [op07Monda074],
      donDeckCount: 1,
    });
    const mondaId = engine.findCardInZone("south", "character", op07Monda074);

    engine.activateEffect(mondaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(mondaId);
    expect(view.players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself or adding DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07Foxy059,
      character: [op07Monda074],
      donDeckCount: 1,
    });
    const mondaId = engine.findCardInZone("south", "character", op07Monda074);

    engine.activateEffect(mondaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(mondaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(mondaId);
    expect(view.players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
