import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06GeckoMoria080,
  op06Inuppe082,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-082 Inuppe", () => {
  test("on play recognizes a compound Thriller Bark Pirates Leader, draws two, then trashes two", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06GeckoMoria080,
      hand: [op06Inuppe082, eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      activeDon: op06Inuppe082.cost,
    });
    const originalHandIds = [
      engine.findCardInZone("south", "hand", eb01Doma005),
      engine.findCardInZone("south", "hand", eb01Fourtricks025),
    ];
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);

    engine.playCard(op06Inuppe082, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity")
      throw new Error("Expected Inuppe's post-draw trash choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([...originalHandIds, ...drawnIds]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: drawnIds }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(originalHandIds);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. resolves from trash for a compound Thriller Bark Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op06GeckoMoria080,
        character: [{ card: op06Inuppe082, rested: true }],
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const inuppeId = engine.findCardInZone("north", "character", op06Inuppe082);
    const originalHandIds = [...engine.getState().players.north.hand];
    const drawnIds = engine.getState().players.north.deck.slice(0, 2);

    engine.declareAttack(attackerId, inuppeId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Inuppe's On K.O. trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([...originalHandIds, ...drawnIds]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: drawnIds }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([inuppeId, ...drawnIds]),
    );
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual(originalHandIds);
    expect(view.prompts).toHaveLength(0);
  });
});
