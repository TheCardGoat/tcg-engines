import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11Koby001, op11Tashigi007 } from "@tcg/op-cards";
import { op11Aramaki082 } from "../../../../../cards/src/cards/OP11/characters/082-aramaki.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-082 Aramaki", () => {
  test("with a Navy Leader grants an included Navy Character active-target attacks and mills two", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Koby001,
        character: [op11Aramaki082, { card: op11Tashigi007, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const aramakiId = engine.findCardInZone("south", "character", op11Aramaki082);
    const tashigiId = engine.findCardInZone("south", "character", op11Tashigi007);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.activateEffect(aramakiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Aramaki's Navy choice.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toContain(tashigiId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [tashigiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(aramakiId);
    expect(view.players.south.deckCount).toBe(deckBefore - 2);
    engine.declareAttack(tashigiId, activeTargetId, "south");
  });

  test("pays its cost and mills, but grants no attack benefit without a Navy Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Aramaki082, { card: op11Tashigi007, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const aramakiId = engine.findCardInZone("south", "character", op11Aramaki082);
    const tashigiId = engine.findCardInZone("south", "character", op11Tashigi007);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.activateEffect(aramakiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(aramakiId);
    expect(view.players.south.deckCount).toBe(deckBefore - 2);
    expect(view.prompts).toHaveLength(0);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: tashigiId,
        targetId: activeTargetId,
      }).accepted,
    ).toBe(false);
  });
});
