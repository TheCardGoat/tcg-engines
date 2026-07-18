import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb03Stussy043,
  op03Fukurou088,
  op03Jerry084,
  op03Nero087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-043 Stussy", () => {
  test("orders two included CP trash cards before mapping a cost-4-or-less K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Stussy043],
        trash: [op03Fukurou088, op03Nero087, eb01Doma005],
        activeDon: 7,
      },
      {
        character: [op03Jerry084, eb01MountainGod018],
      },
    );
    const fukurouId = engine.findCardInZone("south", "trash", op03Fukurou088);
    const neroId = engine.findCardInZone("south", "trash", op03Nero087);
    const nonCpId = engine.findCardInZone("south", "trash", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", op03Jerry084);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb03Stussy043);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Stussy's ordered CP trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([fukurouId, neroId]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonCpId);
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [neroId, fukurouId] },
      "south",
    );

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Stussy's K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([neroId, fukurouId]);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("blocks a Leader attack through the public battle choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb03Stussy043] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const stussyId = engine.findCardInZone("south", "character", eb03Stussy043);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Stussy's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(stussyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [stussyId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === stussyId)
        ?.rested,
    ).toBe(true);
  });
});
