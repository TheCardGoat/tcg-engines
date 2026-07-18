import { describe, expect, test } from "vite-plus/test";
import {
  op01BartholomewKuma074,
  op07DraculeMihawk044,
  op07Jinbe045,
  op07PerfumeFemur057,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-045 Jinbe", () => {
  test("may play a cost-4 compound Warlords Character other than any Jinbe from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        op07Jinbe045,
        op01BartholomewKuma074,
        op07Jinbe045,
        op07DraculeMihawk044,
        op07PerfumeFemur057,
      ],
      activeDon: op07Jinbe045.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op01BartholomewKuma074);
    const highCostId = engine.findCardInZone("south", "hand", op07DraculeMihawk044);
    const eventId = engine.findCardInZone("south", "hand", op07PerfumeFemur057);

    engine.playCard(op07Jinbe045, "south");
    const remainingJinbeId = engine
      .getView("south")
      .players.south.hand.find((card) => card.cardId === op07Jinbe045.id)?.instanceId;

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Jinbe's Warlords play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([remainingJinbeId, highCostId, eventId]),
    );
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
