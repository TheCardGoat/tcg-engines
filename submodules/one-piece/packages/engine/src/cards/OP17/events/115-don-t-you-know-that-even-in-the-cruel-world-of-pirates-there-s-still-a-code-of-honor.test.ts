import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-115 Don't You Know That Even in the Cruel World of Pirates There's Still a Code of Honor?!", () => {
  test("[Main] gives the [Charlotte Linlin] Leader [Unblockable]", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP03-077", hand: ["OP17-115"], activeDon: 5 },
      { character: ["OP15-073"] },
    );

    engine.playCard("OP17-115");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the unblockable target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );
    const life = engine.getView("south").players.north.lifeCount;
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(life - 1);
    expect(engine.getView("south").players.north.characters[0]?.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] boosts a [Charlotte Linlin] Character with +4000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-115"], character: [{ cardId: "OP17-112", rested: true }], activeDon: 5 },
      { character: ["OP16-004"], activeDon: 5 },
    );
    const linlinId = engine.findCardInZone("south", "character", "OP17-112");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    const curielId = engine.findCardInZone("north", "character", "OP16-004");
    engine.declareAttack(curielId, linlinId, "north");
    engine.asSouth().chooseCounter("OP17-115");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [linlinId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
  test.each(["leader", "character"])("Counter saves named %s and excludes other names", (zone) => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP03-077",
        character: [{ cardId: "OP17-112", rested: true }, "EB01-005"],
        hand: ["OP17-115"],
        activeDon: 1,
      },
      { character: ["OP17-118"], activeDon: 3 },
      { activeSeat: "north" },
    );
    const leader = engine.leader("south");
    const character = engine.findCardInZone("south", "character", "OP17-112");
    const attacker =
      zone === "leader"
        ? engine.leader("north")
        : engine.findCardInZone("north", "character", "OP17-118");
    const target = zone === "leader" ? leader : character;
    const life = engine.getView("south").players.south.lifeCount;
    engine.attachDon(attacker, 3, "north");
    engine.declareAttack(attacker, target, "north");
    engine.asSouth().chooseCounter("OP17-115");
    const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected named target");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([leader, character]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(life);
    expect(
      engine.getView("south").players.south.characters.some((c) => c?.instanceId === character),
    ).toBe(true);
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test.each(["leader", "character"])(
    "Main excludes a differently named Leader and Linlin Characters: %s",
    (zone) => {
      const engine = OnePieceTestEngine.create(
        { character: ["OP17-112"], hand: ["OP17-115"], activeDon: 1 },
        { character: ["OP15-073"] },
      );
      engine.playCard("OP17-115");
      expect(engine.getView("south").prompts).toHaveLength(0);
      const attacker =
        zone === "leader"
          ? engine.leader("south")
          : engine.findCardInZone("south", "character", "OP17-112");
      engine.declareAttack(attacker, engine.leader("north"), "south");
      engine.pendingDecision("battleBlocker", "north");
    },
  );
});
