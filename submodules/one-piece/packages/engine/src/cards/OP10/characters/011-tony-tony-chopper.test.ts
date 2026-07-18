import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10TonyTonyChopper011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-011 Tony Tony.Chopper", () => {
  test("gains +2000 on the opponent's turn and blocks at that power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10TonyTonyChopper011] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chopperId = engine.findCardInZone("south", "character", op10TonyTonyChopper011);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === chopperId)?.power,
    ).toBe(4000);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === chopperId)?.power,
    ).toBe(6000);

    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Chopper's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(chopperId);
    engine.resolveDecision("battleBlocker", { selectedIds: [chopperId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(chopperId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chopperId)?.rested,
    ).toBe(true);
  });
});
