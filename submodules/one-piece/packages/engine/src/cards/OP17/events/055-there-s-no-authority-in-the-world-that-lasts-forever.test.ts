import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-055 There's No Authority in the World That Lasts Forever", () => {
  test("[Main] resting 1 DON!! gives a [Rocks.D.Xebec] [Unblockable]", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-039",
        character: ["OP17-118"],
        hand: ["OP17-055"],
        activeDon: 5,
      },
      {},
    );
    const xebecId = engine.findCardInZone("south", "character", "OP17-118");

    engine.playCard("OP17-055");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the unblockable target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [xebecId] }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] saves a Rocks Pirates card with +2000", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-039", hand: ["OP17-055"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-055");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
  test.each(["leader", "character"])(
    "Main grants Unblockable to named %s and excludes other names",
    (zone) => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: "OP17-039",
          character: ["OP17-118", "EB01-005"],
          hand: ["OP17-055"],
          activeDon: 1,
        },
        { character: ["OP15-073"] },
      );
      const leader = engine.leader("south");
      const character = engine.findCardInZone("south", "character", "OP17-118");
      const life = engine.getView("south").players.north.lifeCount;
      engine.playCard("OP17-055");
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected named target");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([leader, character]);
      const target = zone === "leader" ? leader : character;
      engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      expect(engine.getView("south").players.south.activeDon).toBe(0);
      expect(engine.getView("south").players.south.restedDon).toBe(1);
      engine.declareAttack(target, engine.leader("north"), "south");
      expect(engine.getView("south").players.north.lifeCount).toBe(life - 1);
      expect(engine.getView("south").players.north.characters[0]?.rested).toBe(false);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("Main cost may be declined without resting DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-039", hand: ["OP17-055"], activeDon: 1 },
      { character: ["OP15-073"] },
    );
    engine.playCard("OP17-055");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").players.south.restedDon).toBe(0);
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.pendingDecision("battleBlocker", "north");
  });

  test("Counter supports Rocks Pirates Characters and excludes unrelated cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-039",
        character: [{ cardId: "OP17-118", rested: true }, "EB01-005"],
        hand: ["OP17-055"],
      },
      { character: ["OP17-118"], activeDon: 1 },
      { activeSeat: "north" },
    );
    const target = engine.findCardInZone("south", "character", "OP17-118");
    const attacker = engine.findCardInZone("north", "character", "OP17-118");
    engine.attachDon(attacker, 1, "north");
    engine.declareAttack(attacker, target, "north");
    engine.asSouth().chooseCounter("OP17-055");
    const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Rocks Pirates targets");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([engine.leader("south"), target]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(
      engine.getView("south").players.south.characters.some((c) => c?.instanceId === target),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
