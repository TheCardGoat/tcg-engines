import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01Pacifista075,
  op02Kuzan096,
  op02Minokoala086,
  op02MonkeyDLuffy041,
  op02Saldeath074,
  op02Strawberry101,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-101 Strawberry", () => {
  test("with a cost-0 Character, prevents only cost-5-or-less Characters from blocking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Kuzan096, playedOnTurn: 0 },
          { card: op02Strawberry101, playedOnTurn: 0 },
        ],
      },
      {
        character: [
          op01Pacifista075,
          op02MonkeyDLuffy041,
          { card: op02Minokoala086, rested: true },
          { card: op02Saldeath074, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kuzanId = engine.findCardInZone("south", "character", op02Kuzan096);
    const strawberryId = engine.findCardInZone("south", "character", op02Strawberry101);
    const lowCostBlockerId = engine.findCardInZone("north", "character", op01Pacifista075);
    const highCostBlockerId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);
    const attackTargetId = engine.findCardInZone("north", "character", op02Minokoala086);
    const firstAttackTargetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.declareAttack(kuzanId, firstAttackTargetId, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostBlockerId] }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    engine.declareAttack(strawberryId, attackTargetId, "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Strawberry's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(highCostBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(lowCostBlockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      attackTargetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a cost-0 Character, permits both low- and high-cost Blockers", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Strawberry101, playedOnTurn: 0 }] },
      {
        character: [
          op01Pacifista075,
          op02MonkeyDLuffy041,
          { card: op02Minokoala086, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const strawberryId = engine.findCardInZone("south", "character", op02Strawberry101);
    const lowCostBlockerId = engine.findCardInZone("north", "character", op01Pacifista075);
    const highCostBlockerId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);
    const attackTargetId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.declareAttack(strawberryId, attackTargetId, "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected ordinary Blocker choices.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(lowCostBlockerId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(highCostBlockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      attackTargetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is not itself offered as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02Strawberry101] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const strawberryId = engine.findCardInZone("south", "character", op02Strawberry101);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.players.south.characters.some((card) => card?.instanceId === strawberryId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
