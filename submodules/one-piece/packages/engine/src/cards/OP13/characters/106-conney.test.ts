import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Kaido094,
  op01Shanks120,
  op13SaintCharlos087,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Conney106 } from "../../../../../cards/src/cards/OP13/characters/106-conney.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-106 Conney", () => {
  test("plays its physical Trigger card and grants a field Conney Blocker only for that opponent turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [op13Conney106],
        life: [op13Conney106, eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
        deck: [op01Shanks120, op01Kaido094],
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op13SaintCharlos087, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fieldConneyId = engine.findCardInZone("south", "character", op13Conney106);
    const triggerConneyId = engine.findCardInZone("south", "life", op13Conney106);
    const damageAttackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const followUpAttackerId = engine.findCardInZone("north", "character", op13SaintCharlos087);

    engine.declareAttack(damageAttackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const trigger = engine.pendingDecision("lifeTrigger", "south");
    expect(trigger.actorId).toBe("south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([fieldConneyId, triggerConneyId]),
    );
    expect(view.prompts).toHaveLength(0);
    const lifeAfterTrigger = view.players.south.lifeCount;

    engine.declareAttack(followUpAttackerId, engine.leader("south"), "north");
    const blockerDecision = engine.pendingDecision("battleBlocker", "south");
    expect(blockerDecision.actorId).toBe("south");
    const blocker = blockerDecision.steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Conney's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(fieldConneyId);
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).not.toContain(triggerConneyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [fieldConneyId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === fieldConneyId)?.rested,
    ).toBe(true);
    expect(view.players.south.lifeCount).toBe(lifeAfterTrigger);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(damageAttackerId, engine.leader("south"), "north");

    expect(() => engine.pendingDecision("battleBlocker", "south")).toThrow();
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === fieldConneyId)?.rested,
    ).toBe(false);
    expect(view.players.south.lifeCount).toBe(lifeAfterTrigger - 1);
    expect(view.prompts).toHaveLength(0);
  });
});
