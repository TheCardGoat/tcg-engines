import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb03Ain002,
  eb03ThereYouAreSoreLoser020,
  eb03UtaSp003,
  op01Okiku035,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-020 There You Are, Sore Loser!", () => {
  test("reuses the chosen Counter recipient for the conditional FILM bonus", () => {
    const qualifyingEngine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb03ThereYouAreSoreLoser020],
        character: [eb03Ain002, eb03UtaSp003],
        activeDon: 1,
        life: 2,
      },
    );
    const qualifyingAttackerId = qualifyingEngine.findCardInZone(
      "south",
      "character",
      eb01MountainGod018,
    );
    const qualifyingEventId = qualifyingEngine.findCardInZone(
      "north",
      "hand",
      eb03ThereYouAreSoreLoser020,
    );
    const firstFilmId = qualifyingEngine.findCardInZone("north", "character", eb03Ain002);
    const secondFilmId = qualifyingEngine.findCardInZone("north", "character", eb03UtaSp003);

    qualifyingEngine.endTurn("south");
    qualifyingEngine.endTurn("north");
    qualifyingEngine.attachDon(qualifyingAttackerId, 1, "south");
    qualifyingEngine.declareAttack(qualifyingAttackerId, qualifyingEngine.leader("north"), "south");
    qualifyingEngine.resolveDecision(
      "battleCounter",
      { selectedIds: [qualifyingEventId] },
      "north",
    );

    const targetDecision = qualifyingEngine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Counter power choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      qualifyingEngine.leader("north"),
      firstFilmId,
      secondFilmId,
    ]);
    qualifyingEngine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [qualifyingEngine.leader("north")] },
      "north",
    );
    expect(qualifyingEngine.getView("north").players.north.lifeCount).toBe(2);
    expect(qualifyingEngine.getView("north").prompts).toHaveLength(0);

    const nonqualifyingEngine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb03ThereYouAreSoreLoser020],
        character: [eb03Ain002],
        activeDon: 1,
        life: 2,
      },
    );
    const nonqualifyingAttackerId = nonqualifyingEngine.findCardInZone(
      "south",
      "character",
      eb01MountainGod018,
    );
    const nonqualifyingEventId = nonqualifyingEngine.findCardInZone(
      "north",
      "hand",
      eb03ThereYouAreSoreLoser020,
    );
    nonqualifyingEngine.endTurn("south");
    nonqualifyingEngine.endTurn("north");
    nonqualifyingEngine.attachDon(nonqualifyingAttackerId, 1, "south");
    nonqualifyingEngine.declareAttack(
      nonqualifyingAttackerId,
      nonqualifyingEngine.leader("north"),
      "south",
    );
    nonqualifyingEngine.resolveDecision(
      "battleCounter",
      { selectedIds: [nonqualifyingEventId] },
      "north",
    );
    nonqualifyingEngine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [nonqualifyingEngine.leader("north")] },
      "north",
    );
    expect(nonqualifyingEngine.getView("north").players.north.lifeCount).toBe(1);
    expect(nonqualifyingEngine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player set a chosen Character as active from its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Okiku035, playedOnTurn: 0 }],
      },
      {
        character: [eb01Doma005],
        life: [eb03ThereYouAreSoreLoser020],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op01Okiku035);
    const selectedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 1, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the Character activation choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(false);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(
      eb03ThereYouAreSoreLoser020.id,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
