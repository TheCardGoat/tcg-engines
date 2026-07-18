import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09JaguarDSaul109,
  op09NicoRobin107,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-107 Nico Robin", () => {
  test("On Play may trash the opponent's top Life only at three or more Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09NicoRobin107], activeDon: op09NicoRobin107.cost },
      { life: [eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    const topLifeId = engine.getState().players.north.life[0]!;

    engine.playCard(op09NicoRobin107, "south");
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      topLifeId,
    );
    expect(engine.getView("south").players.north.lifeCount).toBe(2);
  });

  test("Life Trigger plays a selected yellow cost-3 Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op09NicoRobin107], hand: [op09JaguarDSaul109] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const saulId = engine.findCardInZone("north", "hand", op09JaguarDSaul109);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Robin's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([saulId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [saulId] }, "north");

    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(saulId);
  });
});
