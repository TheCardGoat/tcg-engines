import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Sanji014,
  eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011,
  eb03NefeltariVivi001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-011 But If We Ever See Each Other Again... Will You Call Me Your Shipmate?!!", () => {
  test("gates the Counter by Nefeltari Vivi and maps her battle-power recipient", () => {
    const unavailableEngine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      {
        hand: [eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011],
        activeDon: 1,
        life: 2,
      },
    );
    const unavailableAttackerId = unavailableEngine.findCardInZone(
      "south",
      "character",
      eb01Doma005,
    );
    const unavailableEventId = unavailableEngine.findCardInZone(
      "north",
      "hand",
      eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011,
    );
    unavailableEngine.endTurn("south");
    unavailableEngine.endTurn("north");
    unavailableEngine.declareAttack(
      unavailableAttackerId,
      unavailableEngine.leader("north"),
      "south",
    );
    unavailableEngine.resolveDecision(
      "battleCounter",
      { selectedIds: [unavailableEventId] },
      "north",
    );
    expect(unavailableEngine.getView("north").prompts).toHaveLength(0);

    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: eb03NefeltariVivi001,
        hand: [eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011],
        character: [eb01Doma005],
        activeDon: 1,
        life: 2,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011,
    );
    const characterRecipientId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.endTurn("south");
    engine.endTurn("north");
    const lifeBeforeAttack = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Vivi's controller to receive the Counter power choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      characterRecipientId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBeforeAttack);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player give a chosen opposing Character −2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Sanji014, playedOnTurn: 0 },
        ],
      },
      {
        life: [eb03ButIfWeEverSeeEachOtherAgainWillYouCallMeYourShipmate011],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", eb01Sanji014);

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
      throw new Error("Expected the damaged player to receive the opposing Character choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      attackerId,
      selectedId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(3000);
    engine.endTurn("south");
    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
