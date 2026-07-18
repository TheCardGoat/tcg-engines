import { describe, expect, test } from "vite-plus/test";
import { op06Aramaki043, op06MonkeyDGarp055 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function attackWithGarp(handCount: number, attachedDon: number) {
  const engine = OnePieceTestEngine.create(
    {
      hand: handCount,
      character: [{ card: op06MonkeyDGarp055, attachedDon, playedOnTurn: 0 }],
    },
    { character: [op06Aramaki043] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const garpId = engine.findCardInZone("south", "character", op06MonkeyDGarp055);
  const blockerId = engine.findCardInZone("north", "character", op06Aramaki043);

  engine.declareAttack(garpId, engine.leader("north"), "south");

  return { blockerId, engine };
}

describe("OP06-055 Monkey.D.Garp", () => {
  test("prevents Blocker with two DON!! and four cards in hand", () => {
    const { blockerId, engine } = attackWithGarp(4, 2);

    expect(() => engine.pendingDecision("battleBlocker", "north")).toThrow();
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("allows Blocker with only one DON!!", () => {
    const { blockerId, engine } = attackWithGarp(4, 1);
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];

    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Aramaki's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
  });

  test("allows Blocker with five cards in hand", () => {
    const { blockerId, engine } = attackWithGarp(5, 2);
    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];

    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Aramaki's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
  });
});
