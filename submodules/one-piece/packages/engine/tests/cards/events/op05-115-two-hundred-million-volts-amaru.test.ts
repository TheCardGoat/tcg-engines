import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op05TwoHundredMillionVoltsAmaru115,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-115 Two-Hundred Million Volts Amaru", () => {
  test("Main maps power before the one-Life effective cost-4 rest boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05TwoHundredMillionVoltsAmaru115],
        life: 1,
        activeDon: 2,
      },
      {
        character: [op01Hajrudin018, eb01MountainGod018],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op01Hajrudin018);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op05TwoHundredMillionVoltsAmaru115);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const restDecision = engine.pendingDecision("effectTargetSelection", "south");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the low-Life cost-4 rest choice.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger optionally trashes 2 hand cards before adding the top deck card to Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        life: [op05TwoHundredMillionVoltsAmaru115],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ lifeCount: 1, deckCount: 1 });
    expect(view.players.north.hand).toHaveLength(0);
    expect(view.players.north.trash.map((card) => card.cardId)).toEqual(
      expect.arrayContaining([eb01Doma005.id, eb01Fourtricks025.id]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
