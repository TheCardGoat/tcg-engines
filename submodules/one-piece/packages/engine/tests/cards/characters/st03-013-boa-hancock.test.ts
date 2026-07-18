import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, prb01BoaHancockSt03013JollyRogerFoil013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST03-013 Boa Hancock", () => {
  test("Life Trigger plays the resolving physical card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [prb01BoaHancockSt03013JollyRogerFoil013] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const boaId = engine.findCardInZone("north", "life", prb01BoaHancockSt03013JollyRogerFoil013);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === boaId)).toBe(true);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(boaId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(boaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("can block an attack aimed at its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb01BoaHancockSt03013JollyRogerFoil013] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const boaId = engine.findCardInZone(
      "south",
      "character",
      prb01BoaHancockSt03013JollyRogerFoil013,
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [boaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(boaId);
    expect(view.prompts).toHaveLength(0);
  });
});
