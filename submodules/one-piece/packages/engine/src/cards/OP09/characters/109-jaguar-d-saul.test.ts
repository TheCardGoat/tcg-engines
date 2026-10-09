import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09JaguarDSaul109, op09NicoRobin062 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-109 Jaguar.D.Saul", () => {
  test("Blocker redirects a public attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09JaguarDSaul109] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const saulId = engine.findCardInZone("south", "character", op09JaguarDSaul109);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [saulId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      saulId,
    );
  });

  test("Life Trigger plays the physical card for Nico Robin", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { leaderCardId: op09NicoRobin062, life: [op09JaguarDSaul109] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const saulId = engine.findCardInZone("north", "life", op09JaguarDSaul109);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(saulId);
  });
  test("Life Trigger does not apply when its printed Leader or Life gate fails", () => {
    for (const fixture of [{ leader: "ST01-001", life: 5 }]) {
      const engine = OnePieceTestEngine.create(
        { life: fixture.life, character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
        {
          leaderCardId: fixture.leader,
          life: ["OP09-109"],
          deck: ["EB01-005", "EB01-005", "EB01-005", "EB01-005"],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const trigger = engine.findCardInZone("north", "life", "OP09-109");
      engine
        .asSouth()
        .attack(engine.findCardInZone("south", "character", "EB01-018"), engine.leader("north"));
      engine.asNorth().activateLifeTrigger();
      expect(engine.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
      expect(engine.getView("north").players.north.lifeCount).toBe(0);
      expect(engine.getView("north").players.north.deckCount).toBe(4);
      expect(engine.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(
        trigger,
      );
      expect(engine.getView("north").prompts).toHaveLength(0);
    }
  });
});
