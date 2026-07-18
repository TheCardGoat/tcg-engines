import { describe, expect, test } from "vite-plus/test";
import { op02Minokoala086, op02Tsuru106 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-106 Tsuru", () => {
  test("on play may give an opposing Character -2 cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Tsuru106], activeDon: op02Tsuru106.cost },
      { character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.playCard(op02Tsuru106, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Tsuru's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(2);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
  });

  test("may choose no opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Tsuru106], activeDon: op02Tsuru106.cost },
      { character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.playCard(op02Tsuru106, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
