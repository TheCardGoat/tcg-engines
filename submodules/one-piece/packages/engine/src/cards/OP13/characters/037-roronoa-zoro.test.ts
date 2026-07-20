import { op01MonkeyDLuffy003, op06Uta001, op09Shanks001 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13RoronoaZoro037 } from "../../../../../cards/src/cards/OP13/characters/037-roronoa-zoro.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-037 Roronoa Zoro", () => {
  test.each([
    ["FILM", op06Uta001],
    ["Straw Hat Crew", op01MonkeyDLuffy003],
  ])("with a %s Leader, on play sets up to two DON!! active", (_trait, leader) => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: leader,
      hand: [op13RoronoaZoro037],
      activeDon: op13RoronoaZoro037.cost,
      restedDon: 3,
    });

    engine.playCard(op13RoronoaZoro037, "south");
    const choice = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(choice).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }, { id: "2" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 5 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not activate DON!! on play without either printed Leader trait", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Shanks001,
      hand: [op13RoronoaZoro037],
      activeDon: op13RoronoaZoro037.cost,
      restedDon: 2,
    });

    engine.playCard(op13RoronoaZoro037, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(view.prompts).toHaveLength(0);
  });

  test("sets itself active at the end of its controller's turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op13RoronoaZoro037, rested: true }],
    });
    const zoroId = engine.findCardInZone("south", "character", op13RoronoaZoro037);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === zoroId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
