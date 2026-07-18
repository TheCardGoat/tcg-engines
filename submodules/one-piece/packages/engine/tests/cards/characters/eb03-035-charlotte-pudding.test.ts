import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, eb03CharlottePudding035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-035 Charlotte Pudding", () => {
  test("adds rested DON!! at the field-count boundary and maps itself as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03CharlottePudding035],
        activeDon: 4,
        donDeckCount: 1,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 4,
      },
    );

    engine.playCard(eb03CharlottePudding035);
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Pudding's DON!! choice.");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const puddingId = engine.findCardInZone("south", "character", eb03CharlottePudding035);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    expect(engine.getView("south").players.south.restedDon).toBe(5);

    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Pudding's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", puddingId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [puddingId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      puddingId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not add DON!! when its field already has more than the opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03CharlottePudding035],
        deck: [eb01Doma005],
        activeDon: 5,
        donDeckCount: 1,
      },
      { activeDon: 4 },
    );

    engine.playCard(eb03CharlottePudding035);

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(1);
    expect(view.players.south.restedDon).toBe(4);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
