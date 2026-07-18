import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07Carina005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-005 Carina", () => {
  test("reduces an opposing Character on play, then blocks an attack after the modifier expires", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07Carina005], activeDon: op07Carina005.cost },
      { character: [eb01Doma005] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const opposingPower = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === opposingId)?.power;
    if (opposingPower == null) throw new Error("Expected the opposing Character's power.");

    engine.playCard(op07Carina005, "south");
    const carinaId = engine.findCardInZone("south", "character", op07Carina005);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Carina's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(opposingPower - 2000);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(opposingPower);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Carina's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(carinaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [carinaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(carinaId);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
