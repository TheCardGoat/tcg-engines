import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04KungFuJugon005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-005 Kung Fu Jugon", () => {
  test("gains Blocker while another physical Kung Fu Jugon is present", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04KungFuJugon005, op04KungFuJugon005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const jugons = engine
      .getView("south")
      .players.south.characters.filter(
        (card): card is NonNullable<typeof card> => card?.cardId === op04KungFuJugon005.id,
      );
    const blockerId = jugons[0]?.instanceId;
    if (!blockerId) throw new Error("Expected two Kung Fu Jugon instances.");
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity")
      throw new Error("Expected Kung Fu Jugon's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual([
      "skip",
      ...jugons.map((card) => card.instanceId),
    ]);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.players.south.lifeCount).toBe(4);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not gain Blocker when it is the only Kung Fu Jugon", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04KungFuJugon005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
