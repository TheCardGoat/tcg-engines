import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op06BaronOmatsuri004, op06Saga006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-006 Saga", () => {
  test("with DON!! x1 gains power until its next turn and trashes a FILM Character at end of turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op06Saga006, playedOnTurn: 0 }, op06BaronOmatsuri004, eb01Doma005],
        activeDon: 1,
        deck: [eb01Doma005, eb01Doma005],
      },
      { deck: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sagaId = engine.findCardInZone("south", "character", op06Saga006);
    const filmId = engine.findCardInZone("south", "character", op06BaronOmatsuri004);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.attachDon(sagaId, 1, "south");
    engine.declareAttack(sagaId, engine.leader("north"), "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sagaId)
        ?.power,
    ).toBe(7000);

    engine.endTurn("south");
    const trash = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Saga's end-turn FILM choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual([sagaId, filmId]);
    expect(trash.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [filmId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(filmId);
    expect(view.players.south.characters.find((card) => card?.instanceId === sagaId)?.power).toBe(
      6000,
    );

    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === sagaId)?.power).toBe(
      5000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("without a given DON!! neither gains power nor schedules a trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06Saga006, playedOnTurn: 0 }, op06BaronOmatsuri004] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sagaId = engine.findCardInZone("south", "character", op06Saga006);

    engine.declareAttack(sagaId, engine.leader("north"), "south");
    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === sagaId)?.power).toBe(
      5000,
    );
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
