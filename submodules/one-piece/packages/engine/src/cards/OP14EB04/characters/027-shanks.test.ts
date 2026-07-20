import { eb01Doma005, op14eb04IsshoOp14021021, op14eb04ScaledNeptunian011 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Shanks027 } from "../../../../../cards/src/cards/OP14EB04/characters/027-shanks.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-027 Shanks", () => {
  test("only its own rest on its turn offers an optional 7000-base-power opponent target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op14eb04Shanks027, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        character: [op14eb04IsshoOp14021021, op14eb04ScaledNeptunian011],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shanksId = engine.findCardInZone("south", "character", op14eb04Shanks027);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const exactBoundaryId = engine.findCardInZone("north", "character", op14eb04IsshoOp14021021);
    const aboveBoundaryId = engine.findCardInZone("north", "character", op14eb04ScaledNeptunian011);

    engine.declareAttack(allyId, engine.leader("north"), "south");
    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();

    engine.declareAttack(shanksId, engine.leader("north"), "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Shanks's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(exactBoundaryId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(aboveBoundaryId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(allyId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [exactBoundaryId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === exactBoundaryId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === aboveBoundaryId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no Character when its own rest triggers", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04Shanks027, playedOnTurn: 0 }] },
      { character: [op14eb04IsshoOp14021021] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shanksId = engine.findCardInZone("south", "character", op14eb04Shanks027);
    const targetId = engine.findCardInZone("north", "character", op14eb04IsshoOp14021021);

    engine.declareAttack(shanksId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("while rested on the opponent's turn gives every opposing Character minus 1000 power", () => {
    const activeEngine = OnePieceTestEngine.create(
      { character: [op14eb04Shanks027] },
      { character: [eb01Doma005, op14eb04ScaledNeptunian011] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const activeOpponentId = activeEngine.findCardInZone("north", "character", eb01Doma005);
    expect(
      activeEngine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === activeOpponentId)?.power,
    ).toBe(eb01Doma005.power);

    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04Shanks027, rested: true }] },
      { character: [eb01Doma005, op14eb04ScaledNeptunian011] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const opponentIds = engine
      .getView("south")
      .players.north.characters.map((card) => card?.instanceId)
      .filter((id): id is string => Boolean(id));

    let view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentIds[0])?.power,
    ).toBe((eb01Doma005.power ?? 0) - 1000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentIds[1])?.power,
    ).toBe((op14eb04ScaledNeptunian011.power ?? 0) - 1000);
    expect(view.players.south.characters[0]?.power).toBe(op14eb04Shanks027.power);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentIds[0])?.power,
    ).toBe(eb01Doma005.power);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentIds[1])?.power,
    ).toBe(op14eb04ScaledNeptunian011.power);
    expect(view.prompts).toHaveLength(0);
  });
});
