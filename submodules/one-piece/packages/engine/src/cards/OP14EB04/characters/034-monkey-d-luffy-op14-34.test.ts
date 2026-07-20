import {
  eb01Doma005,
  op01Jinbe014,
  op01Shanks120,
  op02Vista011,
  op13Franky033,
  op13RoronoaZoro037,
  op13SunnyKun026,
  op13Uta023,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04MonkeyDLuffyOp1434034 } from "../../../../../cards/src/cards/OP14EB04/characters/034-monkey-d-luffy-op14-34.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function targetWithVista(engine: OnePieceTestEngine, targetId: string) {
  engine.playCard(op02Vista011, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
}

describe("OP14-034 Monkey.D.Luffy", () => {
  test("on its turn gives only own green included-Straw-Hat Characters with base cost 4 or more plus 1000 power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          op14eb04MonkeyDLuffyOp1434034,
          op13RoronoaZoro037,
          op13Franky033,
          op13Uta023,
          op01Jinbe014,
        ],
      },
      { character: [op13RoronoaZoro037] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const qualifyingId = engine.findCardInZone("south", "character", op13RoronoaZoro037);
    const lowCostId = engine.findCardInZone("south", "character", op13Franky033);
    const wrongTraitId = engine.findCardInZone("south", "character", op13Uta023);
    const wrongColorId = engine.findCardInZone("south", "character", op01Jinbe014);
    const opposingId = engine.findCardInZone("north", "character", op13RoronoaZoro037);

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === qualifyingId)?.power,
    ).toBe((op13RoronoaZoro037.power ?? 0) + 1000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === lowCostId)?.power,
    ).toBe(op13Franky033.power);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wrongTraitId)?.power,
    ).toBe(op13Uta023.power);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === wrongColorId)?.power,
    ).toBe(op01Jinbe014.power);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(op13RoronoaZoro037.power);

    engine.endTurn("south");
    view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === qualifyingId)?.power,
    ).toBe(op13RoronoaZoro037.power);
    expect(view.prompts).toHaveLength(0);
  });

  test("once per turn may rest one own active card instead of opponent-effect K.O. of a Straw Hat Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04MonkeyDLuffyOp1434034, op13SunnyKun026, eb01Doma005] },
      { hand: [op02Vista011, op02Vista011], activeDon: op02Vista011.cost * 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const luffyId = engine.findCardInZone("south", "character", op14eb04MonkeyDLuffyOp1434034);
    const protectedId = engine.findCardInZone("south", "character", op13SunnyKun026);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    targetWithVista(engine, protectedId);

    expect(engine.pendingDecision("effectKoReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (payment?.kind !== "selectEntity") throw new Error("Expected Luffy's replacement rest.");
    expect(payment).toMatchObject({ min: 1, max: 1 });
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([luffyId, protectedId, allyId]),
    );
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      engine.leader("south"),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [allyId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.rested).toBe(
      true,
    );

    targetWithVista(engine, luffyId);
    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the opponent-effect K.O. replacement", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04MonkeyDLuffyOp1434034, eb01Doma005] },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const luffyId = engine.findCardInZone("south", "character", op14eb04MonkeyDLuffyOp1434034);
    targetWithVista(engine, luffyId);

    engine.resolveDecision("effectKoReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace opponent-effect K.O. of a non-Straw-Hat Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04MonkeyDLuffyOp1434034, eb01Doma005] },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const luffyId = engine.findCardInZone("south", "character", op14eb04MonkeyDLuffyOp1434034);
    const nonTraitId = engine.findCardInZone("south", "character", eb01Doma005);

    targetWithVista(engine, nonTraitId);

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(nonTraitId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(luffyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace battle K.O. even when an own card could be rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04MonkeyDLuffyOp1434034, rested: true }, eb01Doma005],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const luffyId = engine.findCardInZone("south", "character", op14eb04MonkeyDLuffyOp1434034);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.declareAttack(attackerId, luffyId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
