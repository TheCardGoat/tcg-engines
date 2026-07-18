import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04Rabiyan113, op05Pagaya109 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-109 Pagaya", () => {
  test("draws two and trashes two when a Trigger activates", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        character: [op05Pagaya109],
        life: [op04Rabiyan113],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        hand: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const firstTrash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(firstTrash?.kind).toBe("selectEntity");
    if (firstTrash?.kind !== "selectEntity") throw new Error("Expected Pagaya's hand choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: firstTrash.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.hand).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });
});
