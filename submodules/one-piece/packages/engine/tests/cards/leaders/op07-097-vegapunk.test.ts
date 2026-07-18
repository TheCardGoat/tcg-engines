import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op07HePossessesTheWorldSMostBrilliantMind114,
  op07Vegapunk097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-097 Vegapunk", () => {
  test("cannot attack and maps an eligible Egghead card into face-up Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07Vegapunk097,
        hand: [op07HePossessesTheWorldSMostBrilliantMind114, eb01Doma005],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eggheadId = engine.findCardInZone(
      "south",
      "hand",
      op07HePossessesTheWorldSMostBrilliantMind114,
    );
    const excludedId = engine.findCardInZone("south", "hand", eb01Doma005);

    const attackFailure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: engine.leader("south"),
      targetId: engine.leader("north"),
    });
    expect(attackFailure.reason).toBe("The selected attacker cannot attack.");

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Vegapunk's two branches.");
    expect(choice.options.map((option) => option.label)).toEqual(["play", "addToLife"]);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const lifeChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(lifeChoice?.kind).toBe("selectEntity");
    if (lifeChoice?.kind !== "selectEntity") throw new Error("Expected Vegapunk's Life choice.");
    expect(lifeChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([eggheadId]);
    expect(lifeChoice.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eggheadId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1, lifeCount: 3 });
    expect(
      engine.findCardInZone("south", "life", op07HePossessesTheWorldSMostBrilliantMind114),
    ).toBe(eggheadId);
    expect(engine.getState().cards[eggheadId]?.faceUp).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
