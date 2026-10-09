import { describe, expect, test } from "vite-plus/test";

import { getCard } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-105 Gecko Moria", () => {
  test("[Trigger] with 1 or less Life plays Absalom, Hogback, and Perona from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: ["OP16-005"],
        life: ["OP16-105"],
        trash: ["OP06-081", "OP06-090", "OP12-034"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );

    // The attack drains the last Life, revealing Moria for his [Trigger].
    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseBlocker(null);
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    const ids = ["OP06-081", "OP06-090", "OP12-034"].map((cardId) =>
      engine.findCardInZone("south", "trash", cardId),
    );
    const play = engine.pendingDecision("effectGroupedPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected all three named play groups.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(ids),
    );
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(ids),
    );
    engine.resolveDecision("effectGroupedPlaySelection", { selectedIds: ids }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP06-081");
    expect(south.characters.map((card) => card?.cardId)).toContain("OP06-090");
    expect(south.characters.map((card) => card?.cardId)).toContain("OP12-034");
    expect(
      south.characters
        .filter((card) => card?.instanceId && ids.includes(card.instanceId))
        .every((card) => card?.rested === false),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("each named group is optional but cannot play two Absaloms", () => {
    let engine = OnePieceTestEngine.create(
      { life: ["OP16-105"], trash: ["OP06-081", "OP15-079", "OP06-090"] },
      {},
      { activeSeat: "north" },
    );
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.asSouth().activateLifeTrigger();
    const first = engine.findCardInZone("south", "trash", "OP06-081");
    const second = engine.findCardInZone("south", "trash", "OP15-079");
    const hogback = engine.findCardInZone("south", "trash", "OP06-090");
    const choice = engine.pendingDecision("effectGroupedPlaySelection", "south");
    const beforeInvalid = engine.getView("south");
    const failed = engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: choice.id,
      selectedIds: [first, second],
    });
    engine = OnePieceTestEngine.fromState(failed.state);
    const rejected = engine.getView("south");
    expect(rejected.logs).toHaveLength(beforeInvalid.logs.length + 1);
    expect(rejected.logs.at(-1)?.message).toBe("Prompt resolution could not be applied.");
    expect({ ...rejected, logs: rejected.logs.slice(0, -1) }).toEqual(beforeInvalid);
    expect(engine.pendingDecision("effectGroupedPlaySelection", "south")).toEqual(choice);
    expect(engine.getView("south").players.south.characters.every((card) => card === null)).toBe(
      true,
    );
    engine.resolveDecision("effectGroupedPlaySelection", { selectedIds: [hogback] }, "south");
    // Hogback can now pay its own On Play cost using the unplayed Absaloms.
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.characters.filter(Boolean).map((card) => card?.instanceId)).toEqual([
      hogback,
    ]);
    expect(view.players.south.characters.find((card) => card?.instanceId === hogback)?.rested).toBe(
      false,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([first, second]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("[Trigger] cannot play Characters with more than 1 Life remaining", () => {
    const engine = OnePieceTestEngine.create(
      { life: ["OP16-105", "EB01-005", "EB01-005"], trash: ["OP06-081", "OP06-090", "OP12-034"] },
      {},
      { activeSeat: "north" },
    );
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.asSouth().activateLifeTrigger();

    const south = engine.getView("south").players.south;
    expect(south.lifeCount).toBe(2);
    expect(south.characters.every((card) => card === null)).toBe(true);
    expect(south.trash.map((card) => card.cardId)).toEqual(
      expect.arrayContaining(["OP06-081", "OP06-090", "OP12-034"]),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("Absalom selection respects the cost-4 cap (synthetic cost boundary)", () => {
    // No printed Absalom currently exceeds cost4. Restore catalog metadata.
    const absalom = getCard("OP15-079");
    if (absalom.cardType !== "character") throw new Error("Expected Character");
    const originalCost = absalom.cost;
    absalom.cost = 5;
    try {
      const engine = OnePieceTestEngine.create(
        { life: ["OP16-105"], trash: ["OP06-081", "OP15-079"] },
        {},
        { activeSeat: "north" },
      );
      engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
      engine.asSouth().activateLifeTrigger();
      const step = engine.pendingDecision("effectGroupedPlaySelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected Absalom choice");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([
        engine.findCardInZone("south", "trash", "OP06-081"),
      ]);
      engine.resolveDecision("effectGroupedPlaySelection", { selectedIds: [] }, "south");
      expect(engine.getView("south").players.south.characters.every((c) => c === null)).toBe(true);
    } finally {
      absalom.cost = originalCost;
    }
  });
});
