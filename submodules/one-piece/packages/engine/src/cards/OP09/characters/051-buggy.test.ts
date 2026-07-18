import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09Buggy051 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-051 Buggy", () => {
  test("bottom-decks itself after its target when its controller has fewer than five cost-5-or-more Characters", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09Buggy051], activeDon: op09Buggy051.cost },
      { character: [eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op09Buggy051, "south");
    const buggyId = engine.findCardInZone("south", "character", op09Buggy051);
    const deckBefore = engine.getView("south").players.south.deckCount;
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Buggy's opposing target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(opposingId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(buggyId);
    expect(view.players.south.deckCount).toBe(deckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("remains in play when it is the fifth cost-5-or-more Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09Buggy051],
        character: [eb01MountainGod018, eb01MountainGod018, eb01MountainGod018, eb01MountainGod018],
        activeDon: op09Buggy051.cost,
      },
      { character: [eb01Doma005] },
    );
    engine.playCard(op09Buggy051, "south");
    const buggyId = engine.findCardInZone("south", "character", op09Buggy051);
    const deckBefore = engine.getView("south").players.south.deckCount;
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(buggyId);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
