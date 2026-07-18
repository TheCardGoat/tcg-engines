import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02EmporioIvankov049, op02Minokoala086 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-086 Minokoala", () => {
  test("blocks, then adds a rested DON!! after K.O. with a compound Impel Down Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EmporioIvankov049,
        character: [op02Minokoala086],
        donDeckCount: 1,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const minokoalaId = engine.findCardInZone("south", "character", op02Minokoala086);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [minokoalaId] }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") {
      throw new Error("Expected Minokoala's rested DON!! choice after K.O.");
    }
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(minokoalaId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("still blocks but does not add DON!! without an Impel Down Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02Minokoala086], donDeckCount: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const minokoalaId = engine.findCardInZone("south", "character", op02Minokoala086);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [minokoalaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(minokoalaId);
    expect(view.players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
