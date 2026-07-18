import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05DonquixoteRosinante022,
  op05Enel098,
  op05LetUsBeginTheWorldOfViolence059,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP05-059 Let Us Begin the World of Violence!!", () => {
  test("with a monocolored Leader, skips only the draw and still returns an either-field Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op05Enel098,
        hand: [op05LetUsBeginTheWorldOfViolence059],
        character: [eb01Doma005],
        deck: [eb01Fourtricks025],
        activeDon: 5,
      },
      {
        character: [eb01Doma005],
      },
    );
    const selfId = engine.findCardInZone("south", "character", eb01Doma005);
    const opponentId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05LetUsBeginTheWorldOfViolence059);

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the unconditional cost-5-or-less Character choice.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selfId,
      opponentId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId] }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      opponentId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws 2 for a multicolored Leader without Main payment or return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op05DonquixoteRosinante022,
        life: [op05LetUsBeginTheWorldOfViolence059],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand).toHaveLength(2);
    expect(engine.getView("north").players.north.deckCount).toBe(1);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
