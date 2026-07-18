import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  eb01TonyTonyChopper006,
  eb02ClovenRoseBlizzard007,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-007 Cloven Rose Blizzard", () => {
  test("maps up to 3 Leader-or-Character power recipients before the power-3000 K.O. choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02ClovenRoseBlizzard007],
        character: [eb01MountainGod018, eb01Sanji014, eb01Doma005],
        activeDon: 3,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", eb02ClovenRoseBlizzard007);
    const firstRecipientId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const secondRecipientId = engine.findCardInZone("south", "character", eb01Sanji014);
    const unselectedRecipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const koTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooPowerfulId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(eb02ClovenRoseBlizzard007);

    const powerDecision = engine.pendingDecision("effectTargetSelection", "south");
    const powerStep = powerDecision.steps[0];
    expect(powerDecision.actorId).toBe("south");
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the Event controller to receive the power recipient choice.");
    }
    expect(powerStep).toMatchObject({ min: 0, max: 3 });
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      firstRecipientId,
      secondRecipientId,
      unselectedRecipientId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south"), firstRecipientId, secondRecipientId] },
      "south",
    );

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the Event controller to receive the K.O. choice after power.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([koTargetId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koTargetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(6000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === firstRecipientId)?.power,
    ).toBe(8000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === secondRecipientId)?.power,
    ).toBe(6000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === unselectedRecipientId)
        ?.power,
    ).toBe(3000);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koTargetId);
    expect(view.players.north.characters.some((card) => card?.instanceId === tooPowerfulId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player use its Life Trigger on only power-4000-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          eb01TonyTonyChopper006,
          eb01Fourtricks025,
        ],
      },
      {
        life: [eb02ClovenRoseBlizzard007],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("south", "character", eb01TonyTonyChopper006);
    const tooPowerfulId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("north");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the Trigger K.O. choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.some((card) => card?.instanceId === tooPowerfulId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb02ClovenRoseBlizzard007.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
