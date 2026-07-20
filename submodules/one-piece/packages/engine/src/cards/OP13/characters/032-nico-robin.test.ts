import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120 } from "@tcg/op-cards";
import { op13NicoRobin032 } from "../../../../../cards/src/cards/OP13/characters/032-nico-robin.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-032 Nico Robin", () => {
  test("protects the selected cost-8-or-less opposing Character from resting through its next End Phase", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13NicoRobin032], activeDon: op13NicoRobin032.cost },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op01Shanks120, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const protectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.playCard(op13NicoRobin032, "south");
    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    expect(targetDecision.actorId).toBe("south");
    const target = targetDecision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Robin's protection target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(protectedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.endTurn("south");
    const protectedAttack = engine.expectFailure({
      type: "declareAttack",
      seat: "north",
      attackerId: protectedId,
      targetId: engine.leader("south"),
    });
    expect(protectedAttack.reason).toBe("The selected attacker cannot attack.");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === protectedId)?.rested,
    ).toBe(false);

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(protectedId, engine.leader("south"), "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === protectedId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no Character and leaves an eligible attacker unrestricted", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13NicoRobin032], activeDon: op13NicoRobin032.cost },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13NicoRobin032, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.endTurn("south");
    engine.declareAttack(opposingId, engine.leader("south"), "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
