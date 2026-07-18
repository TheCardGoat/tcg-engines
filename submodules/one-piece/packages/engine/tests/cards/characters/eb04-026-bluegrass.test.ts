import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op14eb04Bluegrass026,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-026 Bluegrass", () => {
  test("places only an opposing cost-1-or-less Character at the bottom of its owner's deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op14eb04Bluegrass026], activeDon: op14eb04Bluegrass026.cost },
      { character: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018] },
    );
    const costOneId = engine.findCardInZone("north", "character", eb01Doma005);
    const costTwoId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op14eb04Bluegrass026, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Bluegrass's deck-bottom target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([costOneId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(costTwoId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costOneId] }, "south");

    expect(engine.getState().players.north.deck.at(-1)).toBe(costOneId);
    expect(
      engine
        .getView("south")
        .players.north.characters.flatMap((card) => (card ? [card.instanceId] : [])),
    ).toEqual([costTwoId, highCostId]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("draws one and trashes one card from hand when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Bluegrass026, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bluegrassId = engine.findCardInZone("south", "character", op14eb04Bluegrass026);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.getState().players.south.deck[0]!;

    engine.declareAttack(bluegrassId, engine.leader("north"), "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Bluegrass's attack discard.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual([discardId, drawnId]);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
  });
});
