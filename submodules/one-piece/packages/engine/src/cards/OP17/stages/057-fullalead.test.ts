import { describe, expect, test } from "vite-plus/test";
import { op17Fullalead057 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP17-057 Fullalead", () => {
  test("rests itself and trashes a hand card to boost the Rocks Leader for this battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-039",
        stage: op17Fullalead057,
        hand: ["OP16-039", "OP16-096"],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-109", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const fodderId = engine.findCardInZone("south", "hand", "OP16-039");
    const leaderPower = () => engine.getView("south").players.south.leader?.power;
    expect(leaderPower()).toBe(5000);

    engine.declareAttack(
      engine.findCardInZone("north", "character", "OP16-109"),
      engine.leader("south"),
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const trashCost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (trashCost?.kind !== "payCost") throw new Error("Expected the trash cost.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [fodderId] }, "south");

    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    expect(boost.candidates.map((candidate) => candidate.ref.id)).toEqual([engine.leader("south")]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    // Both costs are unambiguous (one Stage, one hand card) and auto-pay;
    // the Leader is the only {Rocks Pirates} card, so the boost auto-targets.
    // Mid-battle the Leader reads 6000.
    expect(leaderPower()).toBe(6000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    // The battle-scoped boost expires when the battle ends.
    const view = engine.getView("south");
    expect(view.players.south.leader?.power).toBe(5000);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(fodderId);
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("never opens under a non-Rocks Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        stage: op17Fullalead057,
        hand: ["OP16-039"],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-109", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );

    engine.declareAttack(
      engine.findCardInZone("north", "character", "OP16-109"),
      engine.leader("south"),
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader?.power).toBe(5000);
    expect(view.players.south.trash).toHaveLength(0);
  });
});
