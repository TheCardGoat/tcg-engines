import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09MarshallDTeach081, prb02Shiryu015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-015 Shiryu", () => {
  test("with a Blackbeard Pirates Leader gains cost and Blocker, then K.O.s by base cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [prb02Shiryu015],
      },
      { character: [{ card: eb01Doma005, attachedDon: 2, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shiryuId = engine.findCardInZone("south", "character", prb02Shiryu015);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === shiryuId)
        ?.cost,
    ).toBe(8);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shiryu's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shiryuId);
    engine.resolveDecision("battleBlocker", { selectedIds: [shiryuId] }, "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (ko?.kind !== "selectEntity") throw new Error("Expected Shiryu's On K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([attackerId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(shiryuId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(attackerId);
    expect(view.prompts).toHaveLength(0);
  });
});
