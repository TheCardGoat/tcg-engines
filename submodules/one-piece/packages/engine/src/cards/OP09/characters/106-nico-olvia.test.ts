import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09NicoOlvia106,
  op09NicoRobin062,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-106 Nico Olvia", () => {
  test("On Play gives the Nico Robin Leader +3000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09NicoRobin062,
      hand: [op09NicoOlvia106],
      activeDon: op09NicoOlvia106.cost,
    });
    const leaderId = engine.leader("south");

    engine.playCard(op09NicoOlvia106, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(8000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });

  test("Life Trigger draws three, then trashes two chosen cards for Nico Robin", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op09NicoRobin062,
        life: [op09NicoOlvia106],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Olvia's discard choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    const selectedIds = trash.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds }, "north");

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(selectedIds),
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
  test("Life Trigger does not apply when its printed Leader or Life gate fails", () => {
    for (const fixture of [{ leader: "ST01-001", life: 5 }]) {
      const engine = OnePieceTestEngine.create(
        { life: fixture.life, character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
        {
          leaderCardId: fixture.leader,
          life: ["OP09-106"],
          deck: ["EB01-005", "EB01-005", "EB01-005", "EB01-005"],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const trigger = engine.findCardInZone("north", "life", "OP09-106");
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
