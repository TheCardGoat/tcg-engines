import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op09MarshallDTeach081,
  op10Franky090,
  op10Shiryu086,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-086 Shiryu", () => {
  test("on the opponent's turn gains 2000 power, then loses it on turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Shiryu086, rested: true }] },
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shiryuId = engine.findCardInZone("south", "character", op10Shiryu086);

    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === shiryuId)
        ?.power,
    ).toBe(7000);
    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === shiryuId)
        ?.power,
    ).toBe(5000);
  });

  test("when played this turn with a compound Blackbeard Pirates Leader K.O.'s base cost 3 or less once", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        hand: [op10Shiryu086],
        activeDon: op10Shiryu086.cost,
      },
      { character: [eb01Doma005, op10Franky090] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", op10Franky090);

    engine.playCard(op10Shiryu086, "south");
    const shiryuId = engine.findCardInZone("south", "character", op10Shiryu086);
    engine.activateEffect(shiryuId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Shiryu's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: shiryuId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
