import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op08CharlotteBrulee066 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-066 Charlotte Brulee", () => {
  test("blocks an attack and adds up to 1 rested DON!! when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08CharlotteBrulee066], donDeckCount: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bruleeId = engine.findCardInZone("south", "character", op08CharlotteBrulee066);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Brulee's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bruleeId);
    engine.resolveDecision("battleBlocker", { selectedIds: [bruleeId] }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Brulee's rested DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(bruleeId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
