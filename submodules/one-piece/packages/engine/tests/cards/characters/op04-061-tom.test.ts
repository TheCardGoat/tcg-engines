import { describe, expect, test } from "vite-plus/test";
import { op03Iceburg058, op04Tom061 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-061 Tom", () => {
  test("may trash itself with a Water Seven Leader to add one rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Iceburg058,
      character: [op04Tom061],
      donDeckCount: 1,
    });
    const tomId = engine.findCardInZone("south", "character", op04Tom061);
    engine.activateEffect(tomId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Tom's DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(tomId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may trash itself with another Leader but adds no DON!!", () => {
    const engine = OnePieceTestEngine.create({ character: [op04Tom061], donDeckCount: 1 });
    const tomId = engine.findCardInZone("south", "character", op04Tom061);
    engine.activateEffect(tomId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(tomId);
    expect(view.players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Iceburg058,
      character: [op04Tom061],
      donDeckCount: 1,
    });
    const tomId = engine.findCardInZone("south", "character", op04Tom061);
    engine.activateEffect(tomId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(tomId);
    expect(engine.getView("south").players.south.donDeckCount).toBe(1);
  });

  test("may trash itself and choose not to add DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Iceburg058,
      character: [op04Tom061],
      donDeckCount: 1,
    });
    const tomId = engine.findCardInZone("south", "character", op04Tom061);

    engine.activateEffect(tomId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(tomId);
    expect(view.players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });
});
