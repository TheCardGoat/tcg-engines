import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno033,
  eb01Cavendish012,
  eb01Fourtricks025,
  eb01Izo002,
  eb01MountainGod018,
  eb01ThereSNoWayYouCouldDefeatMe010,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-010 There's No Way You Could Defeat Me!!", () => {
  test("pays for its Counter and maps the opponent's base-6000-or-less K.O. choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Izo002, playedOnTurn: 0 },
          eb01Cavendish012,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
      {
        hand: [eb01ThereSNoWayYouCouldDefeatMe010],
        activeDon: 3,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Izo002);
    const eventId = engine.findCardInZone("north", "hand", eb01ThereSNoWayYouCouldDefeatMe010);
    const sixThousandId = engine.findCardInZone("south", "character", eb01Cavendish012);
    const fiveThousandId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const sevenThousandId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const counterDecision = engine.pendingDecision("battleCounter", "north");
    const counterStep = counterDecision.steps[0];
    expect(counterDecision.actorId).toBe("north");
    expect(counterStep?.kind).toBe("selectEntity");
    if (counterStep?.kind !== "selectEntity") {
      throw new Error("Expected the defending player to receive the Counter selection.");
    }
    expect(counterStep.candidates.find((candidate) => candidate.ref.id === eventId)).toMatchObject({
      legal: true,
    });
    const donBeforeCounter = engine.getView("north").players.north;

    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("north");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the Event controller to receive the K.O. choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      sixThousandId,
      fiveThousandId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      sevenThousandId,
    );

    engine.resolveDecision("effectTargetSelection", { selectedIds: [sixThousandId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sixThousandId);
    expect(view.players.south.characters.some((card) => card?.instanceId === fiveThousandId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === sevenThousandId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.north).toMatchObject({
      activeDon: donBeforeCounter.activeDon - 3,
      restedDon: donBeforeCounter.restedDon + 3,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player activate its Life Trigger and choose a base-5000 target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Izo002, playedOnTurn: 0 },
          eb01Fourtricks025,
          eb01Blueno033,
          eb01Cavendish012,
        ],
      },
      {
        life: [eb01ThereSNoWayYouCouldDefeatMe010],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Izo002);
    const firstEligibleId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const selectedId = engine.findCardInZone("south", "character", eb01Blueno033);
    const sixThousandId = engine.findCardInZone("south", "character", eb01Cavendish012);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    const pendingView = engine.getView("north");
    expect(triggerDecision).toMatchObject({
      actorId: "north",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: triggerDecision.id },
    });
    expect(pendingView.players.north.lifeCount).toBe(0);
    const handCountBeforeTrigger = pendingView.players.north.handCount;
    const activeDonBeforeTrigger = pendingView.players.north.activeDon;

    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("north");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger controller to receive the K.O. choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstEligibleId,
      selectedId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(sixThousandId);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.south.characters.some((card) => card?.instanceId === firstEligibleId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === sixThousandId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb01ThereSNoWayYouCouldDefeatMe010.id,
    );
    expect(view.players.north.handCount).toBe(handCountBeforeTrigger);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
