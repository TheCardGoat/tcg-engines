import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07MonkeyDDragon001,
  op09BartholomewKuma108,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function resolveKumaTrigger(opponentLife: number) {
  const engine = OnePieceTestEngine.create(
    {
      life: Array.from({ length: opponentLife }, () => eb01Doma005),
      character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
    },
    { leaderCardId: op07MonkeyDDragon001, life: [op09BartholomewKuma108] },
    { firstPlayer: "north", activeSeat: "south" },
  );
  const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
  const kumaId = engine.findCardInZone("north", "life", op09BartholomewKuma108);
  engine.declareAttack(attackerId, engine.leader("north"), "south");
  engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
  return { engine, kumaId };
}

describe("OP09-108 Bartholomew Kuma", () => {
  test("Life Trigger plays the physical card at five total Life", () => {
    const { engine, kumaId } = resolveKumaTrigger(5);
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(kumaId);
  });

  test("Life Trigger does not play above five total Life", () => {
    const { engine, kumaId } = resolveKumaTrigger(6);
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).not.toContain(kumaId);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      kumaId,
    );
  });
  test("Life Trigger does not apply when its printed Leader or Life gate fails", () => {
    for (const fixture of [{ leader: "ST01-001", life: 5 }]) {
      const engine = OnePieceTestEngine.create(
        { life: fixture.life, character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
        {
          leaderCardId: fixture.leader,
          life: ["OP09-108"],
          deck: ["EB01-005", "EB01-005", "EB01-005", "EB01-005"],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const trigger = engine.findCardInZone("north", "life", "OP09-108");
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
