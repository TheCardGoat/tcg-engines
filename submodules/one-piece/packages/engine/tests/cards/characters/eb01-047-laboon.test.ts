import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Laboon047, eb01MountainGod018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-047 Laboon", () => {
  test("draws then maps a discard when Laboon itself is K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [{ card: eb01Laboon047, rested: true }],
        hand: [eb01Doma005],
        deck: [eb01Doma005, "EB01-025"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const laboonId = engine.findCardInZone("north", "character", eb01Laboon047);

    engine.declareAttack(attackerId, laboonId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") {
      throw new Error("Expected Laboon's controller to choose the post-draw discard.");
    }
    expect(discard.candidates).toHaveLength(2);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [discard.candidates[0]!.ref.id] },
      "north",
    );

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      laboonId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("draws and discards for an opposing effect K.O. only once despite a second K.O.", () => {
    const e = OnePieceTestEngine.create(
      {
        character: ["EB01-047"],
        hand: ["EB01-049", "EB01-049"],
        deck: ["EB01-025", "EB01-018", "EB01-005"],
        activeDon: 10,
      },
      { character: ["EB01-005", "EB01-005"] },
    );
    const drawn = e.findCardInZone("south", "deck", "EB01-025");
    const victims = e
      .getView("south")
      .players.north.characters.flatMap((c) => (c ? [c.instanceId] : []));
    e.playCard("EB01-049");
    e.resolveDecision("effectTargetSelection", { selectedIds: [victims[0]!] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(drawn);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [drawn] }, "south");
    expect(e.getView("south").players.south.deckCount).toBe(2);
    e.playCard("EB01-049");
    e.resolveDecision("effectTargetSelection", { selectedIds: [victims[1]!] }, "south");
    expect(e.getView("south").players.south.deckCount).toBe(2);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(drawn);
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toEqual(victims);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
