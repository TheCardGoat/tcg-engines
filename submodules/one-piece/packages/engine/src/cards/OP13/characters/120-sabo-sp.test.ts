import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op13SaboSp120 } from "../../../../../cards/src/cards/OP13/characters/120-sabo-sp.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-120 Sabo (SP)", () => {
  test("raises one own Character's cost through the opponent's next turn and gives one rested DON!! to its Leader once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13SaboSp120, eb01Doma005],
        restedDon: 1,
      },
      { character: [eb01Doma005] },
    );
    const saboId = engine.findCardInZone("south", "character", op13SaboSp120);
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(saboId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const targetStep = target.steps[0];
    if (targetStep?.kind !== "selectEntity") throw new Error("Expected Sabo's Character choice.");
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([saboId, ownTargetId]),
    );
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    expect(engine.pendingDecision("effectGiveDonCount", "south").steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownTargetId)?.cost,
    ).toBe((eb01Doma005.cost ?? 0) + 2);
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.south.restedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(() => engine.activateEffect(saboId, "activateMain", "south")).toThrow(
      "This effect has already been used this turn.",
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownTargetId)?.cost,
    ).toBe((eb01Doma005.cost ?? 0) + 2);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownTargetId)?.cost,
    ).toBe(eb01Doma005.cost);
  });

  test("may choose neither a Character nor a rested DON!! card", () => {
    const engine = OnePieceTestEngine.create({
      character: [op13SaboSp120, eb01Doma005],
      restedDon: 1,
    });
    const saboId = engine.findCardInZone("south", "character", op13SaboSp120);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(saboId, "activateMain", "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      eb01Doma005.cost,
    );
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13SaboSp120], hand: [] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], hand: [] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const saboId = engine.findCardInZone("south", "character", op13SaboSp120);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Sabo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(saboId);
    engine.resolveDecision("battleBlocker", { selectedIds: [saboId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(saboId);
    expect(view.prompts).toHaveLength(0);
  });
});
