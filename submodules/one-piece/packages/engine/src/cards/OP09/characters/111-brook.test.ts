import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Vegapunk097, op09Brook111 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-111 Brook", () => {
  test("Life Trigger makes the six-card opponent choose two cards to trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: Array.from({ length: 6 }, () => eb01Doma005),
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { leaderCardId: op07Vegapunk097, life: [op09Brook111] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Brook's opponent discard.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    const selectedIds = trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds }, "south");
    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(selectedIds),
    );
  });
});
