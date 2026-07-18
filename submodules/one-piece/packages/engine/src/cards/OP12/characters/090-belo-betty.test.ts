import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op12BeloBetty090 } from "../../../../../cards/src/cards/OP12/characters/090-belo-betty.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-090 Belo Betty", () => {
  test("when attacking trashes two top cards before giving an opponent +2 cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op12BeloBetty090, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bettyId = engine.findCardInZone("south", "character", op12BeloBetty090);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;
    const targetCost = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId)?.cost;
    if (targetCost === null || targetCost === undefined) throw new Error("Expected target cost.");

    engine.declareAttack(bettyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Belo Betty's cost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 2);
    expect(view.players.south.trash).toHaveLength(2);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      targetCost + 2,
    );
  });
});
