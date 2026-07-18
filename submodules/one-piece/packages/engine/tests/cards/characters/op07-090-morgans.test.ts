import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07Morgans090 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-090 Morgans", () => {
  test("makes the opponent choose a hand card to trash before revealing and drawing", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op07Morgans090], activeDon: op07Morgans090.cost },
      { hand: [eb01Doma005, eb01MountainGod018], deck: [eb01Doma005, eb01Doma005] },
    );
    const opposingHandIds = engine
      .getView("north")
      .players.north.hand.map((card) => card.instanceId);
    const discardedId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(op07Morgans090, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected Morgans's opponent discard.");
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toEqual(opposingHandIds);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    const opponent = engine.getView("north");
    expect(opponent.players.north.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(opponent.players.north.handCount).toBe(2);
    expect(
      engine
        .getView("spectator")
        .logs.some((entry) => entry.message.includes(eb01MountainGod018.name)),
    ).toBe(true);
    expect(opponent.prompts).toHaveLength(0);
  });
});
