import { describe, expect, test } from "vite-plus/test";
import { op03EniesLobby098, op03RobLucci076, op13Higuma013, op02Magellan085 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-098 Enies Lobby", () => {
  test("rests for a non-CP Leader before its cost reduction is skipped", () => {
    const engine = OnePieceTestEngine.create(
      { stage: op03EniesLobby098 },
      { character: [op02Magellan085] },
    );
    const stageId = engine.findCardInZone("south", "stage", op03EniesLobby098);
    const opposingId = engine.findCardInZone("north", "character", op02Magellan085);
    const costBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === opposingId)?.cost;

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.cost,
    ).toBe(costBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("uses a CP-including Leader and lets its controller choose an opposing Character for -2 cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03RobLucci076,
        stage: op03EniesLobby098,
      },
      {
        character: [op02Magellan085, op13Higuma013],
      },
    );
    const stageId = engine.findCardInZone("south", "stage", op03EniesLobby098);
    const selectedId = engine.findCardInZone("north", "character", op02Magellan085);
    const unselectedId = engine.findCardInZone("north", "character", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Enies Lobby to publish an opposing Character selection.");
    }
    expect(step).toMatchObject({ min: 0, max: 1 });
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      unselectedId,
    ]);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    let northCharacters = engine.getView("south").players.north.characters;
    expect(engine.getView("south").players.south.stage?.rested).toBe(true);
    expect(northCharacters.find((card) => card?.instanceId === selectedId)?.cost).toBe(3);
    expect(northCharacters.find((card) => card?.instanceId === unselectedId)?.cost).toBe(1);

    engine.endTurn("south");
    northCharacters = engine.getView("south").players.north.characters;
    expect(northCharacters.find((card) => card?.instanceId === selectedId)?.cost).toBe(5);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the defending player use its Life Trigger to play it without paying DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        activeDon: 3,
      },
      {
        life: [op03EniesLobby098],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op13Higuma013);
    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 3, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const triggerDecision = engine.pendingDecision("lifeTrigger", "north");
    expect(triggerDecision).toMatchObject({ actorId: "north", kind: "confirm" });
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;

    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.stage?.cardId).toBe(op03EniesLobby098.id);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
