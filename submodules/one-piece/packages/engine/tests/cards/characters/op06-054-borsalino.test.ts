import { describe, expect, test } from "vite-plus/test";
import { op06Aramaki043, op06Borsalino054 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function attackBorsalinoController(handCount: number) {
  const engine = OnePieceTestEngine.create(
    { character: [{ card: op06Aramaki043, playedOnTurn: 0 }] },
    { hand: handCount, character: [op06Borsalino054] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const attackerId = engine.findCardInZone("south", "character", op06Aramaki043);
  const borsalinoId = engine.findCardInZone("north", "character", op06Borsalino054);
  const lifeBefore = engine.getView("north").players.north.lifeCount;

  engine.declareAttack(attackerId, engine.leader("north"), "south");

  return { borsalinoId, engine, lifeBefore };
}

describe("OP06-054 Borsalino", () => {
  test("gains Blocker with four cards in hand", () => {
    const { borsalinoId, engine, lifeBefore } = attackBorsalinoController(4);
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];

    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Borsalino's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(borsalinoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [borsalinoId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === borsalinoId)?.rested,
    ).toBe(true);
  });

  test("does not gain Blocker with five cards in hand", () => {
    const { borsalinoId, engine, lifeBefore } = attackBorsalinoController(5);

    expect(() => engine.pendingDecision("battleBlocker", "north")).toThrow();
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === borsalinoId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
