import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01BoaHancock078 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-078 Boa Hancock", () => {
  test("when attacking, draws only with DON!! attached and five or fewer hand cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01BoaHancock078, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const boaId = engine.findCardInZone("south", "character", op01BoaHancock078);

    engine.declareAttack(boaId, engine.leader("north"), "south");

    expect(engine.getView("south").players.south).toMatchObject({
      handCount: 6,
      deckCount: 0,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);

    const aboveBoundary = OnePieceTestEngine.create(
      {
        character: [{ card: op01BoaHancock078, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const aboveBoundaryId = aboveBoundary.findCardInZone("south", "character", op01BoaHancock078);
    aboveBoundary.declareAttack(aboveBoundaryId, aboveBoundary.leader("north"), "south");
    expect(aboveBoundary.getView("south").players.south).toMatchObject({
      handCount: 6,
      deckCount: 1,
    });

    const noDon = OnePieceTestEngine.create(
      {
        character: [{ card: op01BoaHancock078, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const noDonId = noDon.findCardInZone("south", "character", op01BoaHancock078);
    noDon.declareAttack(noDonId, noDon.leader("north"), "south");
    expect(noDon.getView("south").players.south).toMatchObject({
      handCount: 5,
      deckCount: 1,
    });
  });

  test("on block with DON!! attached draws at five hand cards and protects Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01BoaHancock078, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005],
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op01BoaHancock078);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(6);
    expect(view.players.south.deckCount).toBe(0);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
