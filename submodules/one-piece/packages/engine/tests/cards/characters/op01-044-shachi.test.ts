import { describe, expect, test } from "vite-plus/test";
import { op01Nekomamushi048, op01Penguin050, op01Shachi044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-044 Shachi", () => {
  test("plays Penguin from hand only while no Penguin is on the field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Shachi044, op01Penguin050],
      activeDon: 3,
    });
    const penguinId = engine.findCardInZone("south", "hand", op01Penguin050);

    engine.playCard(op01Shachi044, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Shachi's Penguin choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([penguinId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [penguinId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === penguinId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("can become the attack target as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Shachi044, playedOnTurn: 0 }] },
      { character: [{ card: op01Nekomamushi048, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shachiId = engine.findCardInZone("south", "character", op01Shachi044);
    const attackerId = engine.findCardInZone("north", "character", op01Nekomamushi048);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shachi as a Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shachiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [shachiId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === shachiId)
        ?.rested,
    ).toBe(true);
  });
});
