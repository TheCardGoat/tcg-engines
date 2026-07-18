import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  prb01DraculeMihawkSt03005FullArt005,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST03-005 Dracule Mihawk", () => {
  test("with one DON!! attached, draws two then trashes two chosen hand cards when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        character: [{ card: prb01DraculeMihawkSt03005FullArt005, attachedDon: 1, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const mihawkId = engine.findCardInZone(
      "south",
      "character",
      prb01DraculeMihawkSt03005FullArt005,
    );
    const originalHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);

    engine.declareAttack(mihawkId, engine.leader("north"), "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Mihawk's hand trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([originalHandId, ...drawnIds]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: drawnIds }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([originalHandId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
