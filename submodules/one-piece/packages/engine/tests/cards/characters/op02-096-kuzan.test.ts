import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Kuzan096, op02Minokoala086 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-096 Kuzan", () => {
  test("draws 1 on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Kuzan096],
      deck: [eb01Doma005],
      activeDon: op02Kuzan096.cost,
    });

    engine.playCard(op02Kuzan096, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.deckCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("may give an opposing Character -4 cost until turn end", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Kuzan096, playedOnTurn: 0 }] },
      { character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kuzanId = engine.findCardInZone("south", "character", op02Kuzan096);
    const targetId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.declareAttack(kuzanId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Kuzan's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(0);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
  });

  test("may choose no cost target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Kuzan096, playedOnTurn: 0 }] },
      { character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kuzanId = engine.findCardInZone("south", "character", op02Kuzan096);
    const targetId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.declareAttack(kuzanId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
