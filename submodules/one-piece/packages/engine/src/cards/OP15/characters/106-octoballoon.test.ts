import { describe, expect, test } from "vite-plus/test";
import { op15Octoballoon106 } from "../../../../../cards/src/cards/characters/op15-106-octoballoon.ts";
import { eb01MontBlancCricket058 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-106 Octoballoon", () => {
  test("[Trigger] draws and replays a yellow cost-2-or-less card from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01MontBlancCricket058],
        activeDon: 2,
        life: [op15Octoballoon106, op15Octoballoon106, op15Octoballoon106],
      },
      { activeDon: 6 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cricketId = engine
      .getView("south")
      .players.south.hand.find((card) => card.cardId === "EB01-058")!.instanceId!;

    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    // Declining the held Counter lets the battle resolve into Life damage.
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([cricketId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [cricketId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === cricketId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Trigger] declined replay leaves the hand card unplayed", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01MontBlancCricket058],
        activeDon: 2,
        life: [op15Octoballoon106, op15Octoballoon106, op15Octoballoon106],
      },
      { activeDon: 6 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cricketId = engine
      .getView("south")
      .players.south.hand.find((card) => card.cardId === "EB01-058")!.instanceId!;

    engine.endTurn("south");
    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === cricketId)).toBe(false);
    expect(south.hand.map((card) => card.instanceId)).toContain(cricketId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
