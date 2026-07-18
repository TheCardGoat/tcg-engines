import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op02Hina110,
  op02Minokoala086,
  op02MonkeyDLuffy041,
  op02Saldeath074,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-110 Hina", () => {
  test("blocks, then prevents only a selected opposing cost-6-or-less Character from attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op02Minokoala086, playedOnTurn: 0 },
          { card: op02MonkeyDLuffy041, playedOnTurn: 0 },
        ],
      },
      { character: [op02Hina110] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const restrictedId = engine.findCardInZone("south", "character", op02Minokoala086);
    const excludedId = engine.findCardInZone("south", "character", op02MonkeyDLuffy041);
    const hinaId = engine.findCardInZone("north", "character", op02Hina110);

    engine.declareAttack(firstAttackerId, engine.leader("north"), "south");
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Hina's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(hinaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [hinaId] }, "north");

    const restriction = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(restriction?.kind).toBe("selectEntity");
    if (restriction?.kind !== "selectEntity") {
      throw new Error("Expected Hina's attack-restriction target.");
    }
    expect(restriction.candidates.map((candidate) => candidate.ref.id)).toContain(restrictedId);
    expect(restriction.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restrictedId] }, "north");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      hinaId,
    );
    expect(() => engine.declareAttack(restrictedId, engine.leader("north"), "south")).toThrow();
    expect(() => engine.declareAttack(excludedId, engine.leader("north"), "south")).not.toThrow();
  });

  test("may choose no Character after blocking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op02Minokoala086, playedOnTurn: 0 },
        ],
      },
      { character: [op02Hina110] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const nextAttackerId = engine.findCardInZone("south", "character", op02Minokoala086);
    const hinaId = engine.findCardInZone("north", "character", op02Hina110);

    engine.declareAttack(firstAttackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [hinaId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    expect(() =>
      engine.declareAttack(nextAttackerId, engine.leader("north"), "south"),
    ).not.toThrow();
  });

  test("cannot select its controller's Character and its attack restriction expires next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op02Minokoala086, playedOnTurn: 0 },
        ],
      },
      { character: [op02Hina110, op02Saldeath074] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const restrictedId = engine.findCardInZone("south", "character", op02Minokoala086);
    const hinaId = engine.findCardInZone("north", "character", op02Hina110);
    const ownCharacterId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.declareAttack(firstAttackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [hinaId] }, "north");

    const restriction = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(restriction?.kind).toBe("selectEntity");
    if (restriction?.kind !== "selectEntity") {
      throw new Error("Expected Hina's attack-restriction target.");
    }
    expect(restriction.candidates.map((candidate) => candidate.ref.id)).toContain(restrictedId);
    expect(restriction.candidates.map((candidate) => candidate.ref.id)).not.toContain(hinaId);
    expect(restriction.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      ownCharacterId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restrictedId] }, "north");

    expect(() => engine.declareAttack(restrictedId, engine.leader("north"), "south")).toThrow();

    engine.endTurn("south");
    engine.endTurn("north");

    expect(() => engine.declareAttack(restrictedId, engine.leader("north"), "south")).not.toThrow();
  });
});
