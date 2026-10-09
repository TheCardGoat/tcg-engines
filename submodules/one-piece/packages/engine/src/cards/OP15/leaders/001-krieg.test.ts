import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op03Kuroobi026 } from "../../../../../cards/src/cards/characters/op03-026-kuroobi.ts";
import { op15Krieg001 } from "../../../../../cards/src/cards/leaders/op15-001-krieg.ts";

import { getLegalCommands, OnePieceTestEngine } from "../../../index.ts";

describe("OP15-001 Krieg", () => {
  test("does not reduce opposing power when its Character field is empty (Q1170)", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Krieg001, activeDon: 1 },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );

    engine.asSouth().attachDon(engine.leader("south"), 1);
    engine.asSouth().endTurn();

    expect(
      engine
        .getView("south")
        .players.north.characters.flatMap((card) => (card ? [card.power] : [])),
    ).toEqual([3000, 5000]);
  });

  test("[Activate: Main] rests an opposing Character with 2 or more DON!! once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Krieg001, activeDon: 2 },
      {
        character: [
          { card: eb01Doma005, attachedDon: 2 },
          { card: eb01Fourtricks025, attachedDon: 1 },
        ],
      },
    );
    const heavyId = engine.findCardInZone("north", "character", eb01Doma005);
    const lightId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const leaderId = engine.leader("south");

    engine.activateEffect(leaderId, "activateMain", "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Krieg's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([heavyId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [heavyId] }, "south");

    const rested = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === heavyId);
    expect(rested?.rested).toBe(true);
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === lightId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);

    const stillLegal = getLegalCommands(engine.getState(), "south").some(
      (command) => command.type === "activateEffect" && command.sourceId === engine.leader("south"),
    );
    expect(stillLegal).toBe(false);
  });

  test("[DON!! x1] [Opponent's Turn] gives opposing Characters -2000 power only on an all-East-Blue field", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Krieg001, character: [op03Kuroobi026], activeDon: 2 },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const leaderId = engine.leader("south");

    engine.attachDon(leaderId, 1);

    const baseline = engine
      .getView("south")
      .players.north.characters.flatMap((card) => (card ? [card.power] : []));
    expect(baseline).toEqual([3000, 5000]);

    engine.endTurn("south");

    const reduced = engine
      .getView("south")
      .players.north.characters.flatMap((card) => (card ? [card.power] : []));
    expect(reduced).toEqual([1000, 3000]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("keeps full opposing power when the field holds a non-East-Blue Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Krieg001,
        character: [op03Kuroobi026, eb01Doma005],
        activeDon: 2,
      },
      { character: [eb01Fourtricks025] },
    );
    const leaderId = engine.leader("south");

    engine.attachDon(leaderId, 1);
    engine.endTurn("south");

    const powers = engine
      .getView("south")
      .players.north.characters.flatMap((card) => (card ? [card.power] : []));
    expect(powers).toEqual([5000]);
  });
  test("choosing zero rest targets consumes the Main effect even with an eligible Character", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op15Krieg001 },
      { character: [{ card: eb01Doma005, attachedDon: 2 }] },
    );
    engine.asSouth().activateMain(engine.leader("south"));
    const step = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected rest choice");
    expect(step.candidates).toHaveLength(1);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.north.characters[0]?.rested).toBe(false);
    const result = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: engine.leader("south"),
      trigger: "activateMain",
    });
    expect(result.reason).toMatch(/already|once/i);
  });
});
