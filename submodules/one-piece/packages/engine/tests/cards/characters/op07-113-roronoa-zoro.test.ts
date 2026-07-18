import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07RoronoaZoro113,
  op07Vegapunk097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-113 Roronoa Zoro", () => {
  test("Trigger with an included Egghead Leader may rest an opposing Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        leaderCardId: op07Vegapunk097,
        life: [op07RoronoaZoro113],
        deck: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);
    const zoroId = engine.findCardInZone("north", "life", op07RoronoaZoro113);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const rest = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (rest?.kind !== "selectEntity") throw new Error("Expected Zoro's rest choice.");
    expect(rest).toMatchObject({ min: 0, max: 1 });
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), characterId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "north");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === characterId)?.rested,
    ).toBe(true);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      zoroId,
    );
  });

  test("does not rest a card without an Egghead Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      {
        life: [op07RoronoaZoro113],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === characterId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
