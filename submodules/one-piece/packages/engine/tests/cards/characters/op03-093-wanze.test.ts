import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op03Camie101,
  op03Jerry084,
  op03Wanze093,
  op07RobLucci079,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-093 Wanze", () => {
  test("a compound CP Leader enables the post-cost K.O. against cost 1 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07RobLucci079,
        hand: [op03Wanze093, eb01Doma005],
        activeDon: op03Wanze093.cost,
      },
      { character: [op03Camie101, op03Jerry084] },
    );
    const eligibleId = engine.findCardInZone("north", "character", op03Camie101);
    const excludedId = engine.findCardInZone("north", "character", op03Jerry084);

    engine.playCard(op03Wanze093, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Wanze's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("may pay the hand cost without a CP Leader, but does not K.O. a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Wanze093, eb01Doma005], activeDon: op03Wanze093.cost },
      { character: [op03Camie101] },
    );
    const targetId = engine.findCardInZone("north", "character", op03Camie101);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op03Wanze093, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      paymentId,
    );
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === targetId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
