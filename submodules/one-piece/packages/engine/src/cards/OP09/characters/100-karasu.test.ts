import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05BeloBetty002 } from "@tcg/op-cards";
import { op09Karasu100 } from "../../../../../cards/src/cards/characters/op09-100-karasu.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-100 Karasu", () => {
  test("Life Trigger offers to play this physical card at five total Life or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { cardId: "EB01-005", playedOnTurn: 0 },
        ],
      },
      { leaderCardId: op05BeloBetty002, life: [op09Karasu100] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const karasuId = engine.findCardInZone("north", "life", op09Karasu100);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(karasuId);
    engine
      .asSouth()
      .attack(engine.findCardInZone("south", "character", "EB01-005"), engine.leader("north"));
    engine.asNorth().chooseBlocker(karasuId);
    expect(engine.getView("north").players.north.lifeCount).toBe(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    expect(engine.getView("south").players.south.lifeCount).toBeGreaterThanOrEqual(0);
  });
  test("Life Trigger does not apply when its printed Leader or Life gate fails", () => {
    for (const fixture of [
      { leader: "ST01-001", life: 5 },
      { leader: "OP05-002", life: 6 },
    ]) {
      const engine = OnePieceTestEngine.create(
        { life: fixture.life, character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
        {
          leaderCardId: fixture.leader,
          life: ["OP09-100"],
          deck: ["EB01-005", "EB01-005", "EB01-005", "EB01-005"],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const trigger = engine.findCardInZone("north", "life", "OP09-100");
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
