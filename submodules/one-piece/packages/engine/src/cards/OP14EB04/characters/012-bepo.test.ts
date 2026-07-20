import { eb01Doma005 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Bepo012 } from "../../../../../cards/src/cards/OP14EB04/characters/012-bepo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-012 Bepo", () => {
  test("at 5000 power gives up to two rested DON!! to one selected own card when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Bepo012, playedOnTurn: 0 }, eb01Doma005],
        activeDon: 3,
        restedDon: 2,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bepoId = engine.findCardInZone("south", "character", op14eb04Bepo012);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.attachDon(bepoId, 3, "south");
    engine.declareAttack(bepoId, engine.leader("north"), "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Bepo's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Bepo's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), bepoId, recipientId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("below 5000 power neither offers nor gives rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Bepo012, playedOnTurn: 0 }],
        activeDon: 2,
        restedDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bepoId = engine.findCardInZone("south", "character", op14eb04Bepo012);

    engine.attachDon(bepoId, 2, "south");
    engine.declareAttack(bepoId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(2);
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
