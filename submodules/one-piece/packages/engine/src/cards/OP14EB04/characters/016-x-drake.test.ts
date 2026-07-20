import { eb01Doma005, op02ArabesqueBrickFist067 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Urouge002 } from "../../../../../cards/src/cards/OP14EB04/characters/002-urouge.ts";
import { op14eb04XDrake016 } from "../../../../../cards/src/cards/OP14EB04/characters/016-x-drake.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-016 X.Drake", () => {
  test("once per opponent turn replaces effect removal of an included Supernovas Character with Leader minus 2000", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04XDrake016, op14eb04Urouge002, op14eb04Urouge002],
      },
      {
        hand: [op02ArabesqueBrickFist067, op02ArabesqueBrickFist067],
        activeDon: op02ArabesqueBrickFist067.cost * 2,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const protectedIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op14eb04Urouge002.id)
      .map((card) => card?.instanceId)
      .filter((id): id is string => Boolean(id));

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedIds[0]!] }, "north");
    expect(engine.pendingDecision("effectRemovalReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(
      protectedIds[0],
    );
    expect(view.players.south.leader.power).toBe(3000);

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedIds[1]!] }, "north");
    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(protectedIds[1]);
    expect(view.players.south.leader.power).toBe(3000);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace removal during its controller's turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04XDrake016, op14eb04Urouge002],
      hand: [op02ArabesqueBrickFist067],
      activeDon: op02ArabesqueBrickFist067.cost,
    });
    const targetId = engine.findCardInZone("south", "character", op14eb04Urouge002);

    engine.playCard(op02ArabesqueBrickFist067, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });

  test("with one attached DON!! reduces a selected opposing Character when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04XDrake016, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drakeId = engine.findCardInZone("south", "character", op14eb04XDrake016);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(drakeId, 1, "south");
    engine.declareAttack(drakeId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe((eb01Doma005.power ?? 0) - 2000);
  });

  test("without attached DON!! does not offer the attack reduction", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04XDrake016, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drakeId = engine.findCardInZone("south", "character", op14eb04XDrake016);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(drakeId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
