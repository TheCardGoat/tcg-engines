import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08EdwardWeevil042,
  op09Shanks004,
  op09SilversRayleigh005,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-005 Silvers Rayleigh", () => {
  test("counts base power despite Shanks reductions, draws 2, then trashes a chosen hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09SilversRayleigh005],
        character: [op09Shanks004],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op09SilversRayleigh005.cost,
      },
      { character: [op08EdwardWeevil042, op08EdwardWeevil042] },
    );
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const opposingIds = engine
      .getView("south")
      .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));

    engine.playCard(op09SilversRayleigh005, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.filter((card) => card && opposingIds.includes(card.instanceId))
        .map((card) => card?.power),
    ).toEqual([4000, 4000]);

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Rayleigh's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(firstDrawnId);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawnId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(firstDrawnId);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw when fewer than two opposing Characters meet the base-power threshold", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09SilversRayleigh005],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op09SilversRayleigh005.cost,
      },
      { character: [eb01MountainGod018, eb01Doma005] },
    );

    engine.playCard(op09SilversRayleigh005, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("is offered through the defending player's Blocker decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09SilversRayleigh005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op09SilversRayleigh005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Rayleigh's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
