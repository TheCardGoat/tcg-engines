import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op01RoronoaZoro001 } from "../../../../../cards/src/cards/OP01/leaders/001-roronoa-zoro.ts";
import { op13Vegapunk112 } from "../../../../../cards/src/cards/OP13/characters/112-vegapunk.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-112 Vegapunk", () => {
  test("gains Blocker when two DON!! are given across its controller's field", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [op13Vegapunk112, eb01Doma005],
        activeDon: 2,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const vegapunkId = engine.findCardInZone("south", "character", op13Vegapunk112);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.attachDon(allyId, 1, "south");
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === allyId)
        ?.attachedDon,
    ).toBe(1);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const decision = engine.pendingDecision("battleBlocker", "south");
    expect(decision.actorId).toBe("south");
    const blocker = decision.steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Vegapunk's Blocker choice.");
    expect(blocker).toMatchObject({ min: 0, max: 1 });
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(vegapunkId);
    engine.resolveDecision("battleBlocker", { selectedIds: [vegapunkId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(vegapunkId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not gain Blocker with only one total given DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op01RoronoaZoro001, character: [op13Vegapunk112], activeDon: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const vegapunkId = engine.findCardInZone("south", "character", op13Vegapunk112);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(() => engine.pendingDecision("battleBlocker", "south")).toThrow();
    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(vegapunkId);
  });
});
