import { eb01Doma005, eb01Fourtricks025, op02Uta120 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02MonkeyDLuffyP075PirateFoil075 } from "../../../../../cards/src/cards/PRB02/characters/075-monkey-d-luffy-p-075-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-075 Monkey.D.Luffy - P-075 (Pirate Foil)", () => {
  test("on play gives up to one rested DON!! to a selected own Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb02MonkeyDLuffyP075PirateFoil075],
        character: [eb01Doma005],
        activeDon: prb02MonkeyDLuffyP075PirateFoil075.cost,
        restedDon: 1,
      },
      { character: [eb01Doma005] },
    );
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(prb02MonkeyDLuffyP075PirateFoil075, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Luffy's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Luffy's DON!! target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), recipientId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking draws then trashes with an own cost-8 Character on the field", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02MonkeyDLuffyP075PirateFoil075, playedOnTurn: 0 }, op02Uta120],
        life: 4,
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone(
      "south",
      "character",
      prb02MonkeyDLuffyP075PirateFoil075,
    );
    const before = engine.getView("south").players.south;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(before.deckCount - 1);
    expect(view.players.south.handCount).toBe(before.handCount);
    expect(view.players.south.trash).toHaveLength(before.trash.length + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking does not replace a hand card below the cost-8 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02MonkeyDLuffyP075PirateFoil075, playedOnTurn: 0 }],
        life: 4,
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone(
      "south",
      "character",
      prb02MonkeyDLuffyP075PirateFoil075,
    );
    const before = engine.getView("south").players.south;

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      deckCount: before.deckCount,
      handCount: before.handCount,
    });
    expect(view.players.south.trash).toHaveLength(before.trash.length);
    expect(view.prompts).toHaveLength(0);
  });
});
