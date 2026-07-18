import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11VinsmokeIchiji043,
  op11VinsmokeJudge044,
  op11Vito042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-044 Vinsmoke Judge", () => {
  test("trashes a chosen hand card to boost every included GERMA 66 Character once", () => {
    const engine = OnePieceTestEngine.create({
      character: [op11VinsmokeJudge044, op11VinsmokeIchiji043, op11Vito042],
      hand: [eb01Doma005, eb01MountainGod018],
    });
    const judgeId = engine.findCardInZone("south", "character", op11VinsmokeJudge044);
    const ichijiId = engine.findCardInZone("south", "character", op11VinsmokeIchiji043);
    const vitoId = engine.findCardInZone("south", "character", op11Vito042);
    const paidId = engine.findCardInZone("south", "hand", eb01Doma005);
    const otherHandId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.activateEffect(judgeId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Judge's hand payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paidId, otherHandId]),
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paidId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(view.players.south.characters.find((card) => card?.instanceId === judgeId)?.power).toBe(
      9000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === ichijiId)?.power).toBe(
      8000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === vitoId)?.power).toBe(
      4000,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: judgeId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === judgeId)?.power).toBe(
      8000,
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === ichijiId)?.power).toBe(
      7000,
    );
  });
});
