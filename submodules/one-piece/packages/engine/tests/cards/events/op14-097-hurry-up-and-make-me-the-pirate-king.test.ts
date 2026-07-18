import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op14eb04HurryUpAndMakeMeThePirateKing097,
  op14eb04PeronaOp14111111,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-097 Hurry Up and Make Me the Pirate King!", () => {
  test("Life Trigger activates Main, finds an included Thriller Bark Pirates card, and trashes the rest", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04HurryUpAndMakeMeThePirateKing097],
        deck: [
          op14eb04PeronaOp14111111,
          op14eb04HurryUpAndMakeMeThePirateKing097,
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
          eb01MountainGod018,
        ],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "deck", op14eb04PeronaOp14111111);
    const excludedId = engine.findCardInZone(
      "north",
      "deck",
      op14eb04HurryUpAndMakeMeThePirateKing097,
    );
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const decision = engine.pendingDecision("effectSearchSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a private search choice.");
    expect(step.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(true);
    expect(step.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "north");
    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(excludedId);
    expect(view.prompts).toHaveLength(0);
  });
});
