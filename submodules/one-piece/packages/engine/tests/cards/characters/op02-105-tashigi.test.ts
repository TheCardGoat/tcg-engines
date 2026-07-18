import { describe, expect, test } from "vite-plus/test";
import { op02Minokoala086, op02Saldeath074, op02Tashigi105 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-105 Tashigi", () => {
  test("with DON!! attached may give an opposing Character -3 cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Tashigi105, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [op02Minokoala086, { card: op02Saldeath074, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const tashigiId = engine.findCardInZone("south", "character", op02Tashigi105);
    const targetId = engine.findCardInZone("north", "character", op02Minokoala086);
    const attackTargetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.declareAttack(tashigiId, attackTargetId, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Tashigi's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(1);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
  });

  test("without attached DON!! publishes no cost-reduction choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Tashigi105, playedOnTurn: 0 }] },
      { character: [op02Minokoala086, { card: op02Saldeath074, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const tashigiId = engine.findCardInZone("south", "character", op02Tashigi105);
    const targetId = engine.findCardInZone("north", "character", op02Minokoala086);
    const attackTargetId = engine.findCardInZone("north", "character", op02Saldeath074);

    engine.declareAttack(tashigiId, attackTargetId, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(4);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may choose no target and never offers its controller's Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02Tashigi105, attachedDon: 1, playedOnTurn: 0 }, op02Saldeath074],
      },
      { character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const tashigiId = engine.findCardInZone("south", "character", op02Tashigi105);
    const ownCharacterId = engine.findCardInZone("south", "character", op02Saldeath074);
    const opponentId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.declareAttack(tashigiId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Tashigi's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(opponentId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCharacterId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tashigiId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentId)?.cost,
    ).toBe(4);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownCharacterId)?.cost,
    ).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
