import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-050 I'll Whip You Into Shape", () => {
  test.each(["leader", "character"])(
    "Main lets the chosen SWORD %s attack active Characters only this turn",
    (recipient) => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: "OP11-001",
          character: ["EB04-047", "EB01-005"],
          hand: ["EB04-050"],
          activeDon: 1,
        },
        { character: ["EB01-005", "EB01-025"] },
      );
      const leader = engine.leader("south");
      const helmeppo = engine.findCardInZone("south", "character", "EB04-047");
      const chosen = recipient === "leader" ? leader : helmeppo;
      const first = engine.findCardInZone("north", "character", "EB01-005");
      const second = engine.findCardInZone("north", "character", "EB01-025");
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: chosen,
        targetId: first,
      });
      engine.playCard("EB04-050");
      const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      if (choice?.kind !== "selectEntity") throw new Error("Expected SWORD recipient.");
      expect(choice.candidates.map((c) => c.ref.id).sort()).toEqual([leader, helmeppo].sort());
      engine.resolveDecision("effectTargetSelection", { selectedIds: [chosen] }, "south");
      engine.declareAttack(chosen, first, "south");
      expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(first);
      engine.endTurn("south");
      engine.endTurn("north");
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: chosen,
        targetId: second,
      });
      expect(
        engine.getView("south").players.north.characters.find((c) => c?.instanceId === second)
          ?.rested,
      ).toBe(false);
      expect(engine.getView("south").prompts).toHaveLength(0);
    },
  );

  test("[Counter] saves the Leader with +3000 power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-050"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("EB04-050");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("[Counter] resolves as a battle counter", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-050"], activeDon: 5 },
      { activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().chooseCounter("EB04-050");
    const boost = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (boost?.extensions?.resolutionIntent === "effectTargetSelection") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("EB04-050");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
