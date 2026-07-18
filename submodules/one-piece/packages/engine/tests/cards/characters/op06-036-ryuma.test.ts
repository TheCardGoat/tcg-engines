import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01TonyTonyChopper015,
  op06Ryuma036,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-036 Ryuma", () => {
  test("on play may K.O. only an opposing rested cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Ryuma036], activeDon: op06Ryuma036.cost },
      {
        character: [
          { card: eb01Doma005, rested: true },
          eb01Doma005,
          { card: eb01MountainGod018, rested: true },
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06Ryuma036, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Ryuma's On Play target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("on K.O. may remove an opposing rested cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06Ryuma036, rested: true }] },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01TonyTonyChopper015, rested: true },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ryumaId = engine.findCardInZone("south", "character", op06Ryuma036);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", op01TonyTonyChopper015);

    engine.declareAttack(attackerId, ryumaId, "north");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Ryuma's On K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const trashIds = engine.getView("south").players.south.trash.map((card) => card.instanceId);
    expect(trashIds).toContain(ryumaId);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});
