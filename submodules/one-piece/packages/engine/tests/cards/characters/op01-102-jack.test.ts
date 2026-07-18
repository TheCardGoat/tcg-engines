import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Jack102 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-102 Jack", () => {
  test("returns DON!! when attacking, then the opponent chooses the physical card they trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Jack102, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { hand: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jackId = engine.findCardInZone("south", "character", op01Jack102);
    const discardedId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const keptId = engine.findCardInZone("north", "hand", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(jackId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected Jack's opposing discard.");
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardedId, keptId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });
});
