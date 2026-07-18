import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Penguin050, op01Shachi044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-050 Penguin", () => {
  test("on play, plays Shachi from hand when Shachi is not already on its field", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Penguin050, op01Shachi044],
      activeDon: op01Penguin050.cost,
    });
    const shachiId = engine.findCardInZone("south", "hand", op01Shachi044);

    engine.playCard(op01Penguin050, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Penguin's Shachi play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([shachiId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [shachiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === shachiId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("is selected as a Blocker through the public battle blocker decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Penguin050, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const penguinId = engine.findCardInZone("south", "character", op01Penguin050);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected a Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(penguinId);
    engine.resolveDecision("battleBlocker", { selectedIds: [penguinId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      penguinId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
