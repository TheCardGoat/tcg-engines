import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06KouzukiHiyori106, op06KouzukiMomonosuke107 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-107 Kouzuki Momonosuke", () => {
  test("on play puts only another Land of Wano Character into owner Life face-up", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06KouzukiMomonosuke107],
      character: [op06KouzukiHiyori106],
      activeDon: op06KouzukiMomonosuke107.cost,
    });
    const hiyoriId = engine.findCardInZone("south", "character", op06KouzukiHiyori106);

    engine.playCard(op06KouzukiMomonosuke107, "south");
    const momonosukeId = engine.findCardInZone("south", "character", op06KouzukiMomonosuke107);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Momonosuke's Life target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([hiyoriId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(momonosukeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hiyoriId] }, "south");

    const position = engine.pendingDecision("effectLifePosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(hiyoriId);
    expect(engine.getState().players.south.life.at(-1)).toBe(hiyoriId);
    expect(engine.getState().cards[hiyoriId]?.faceUp).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("blocks an attack against its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06KouzukiMomonosuke107] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const momonosukeId = engine.findCardInZone("south", "character", op06KouzukiMomonosuke107);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Momonosuke's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(momonosukeId);
    engine.resolveDecision("battleBlocker", { selectedIds: [momonosukeId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      momonosukeId,
    );
  });
});
