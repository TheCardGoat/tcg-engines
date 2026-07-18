import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op07RobLucci093 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-093 Rob Lucci", () => {
  test("orders three trash cards, makes the opponent trash from hand, then bottoms their trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07RobLucci093],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op07RobLucci093.cost,
      },
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        trash: [eb01MountainGod018],
      },
    );
    const ownTrashIds = [...engine.getState().players.south.trash];
    const discardedId = engine.findCardInZone("north", "hand", eb01Doma005);
    const retainedId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const returnedId = engine.findCardInZone("north", "trash", eb01MountainGod018);

    engine.playCard(op07RobLucci093, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 3, max: 3, ordered: true });
    if (cost?.kind !== "payCost") throw new Error("Expected Rob Lucci's ordered trash cost.");
    const submittedOrder = [...ownTrashIds].reverse();
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: submittedOrder }, "south");

    const handTrash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(handTrash).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (handTrash?.kind !== "selectEntity") {
      throw new Error("Expected the opponent's hand-trash choice.");
    }
    expect(handTrash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardedId, retainedId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    const returnTrash = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(returnTrash).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (returnTrash?.kind !== "selectEntity") {
      throw new Error("Expected Rob Lucci's opponent-trash choice.");
    }
    expect(returnTrash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([returnedId, discardedId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "south");

    expect(engine.getState().players.south.deck.slice(-3)).toEqual(submittedOrder);
    expect(engine.getState().players.north.deck.at(-1)).toBe(returnedId);
    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without moving trash or changing the opponent's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07RobLucci093],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op07RobLucci093.cost,
      },
      { hand: [eb01Doma005] },
    );
    const ownTrashBefore = [...engine.getState().players.south.trash];
    const opposingHandId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(op07RobLucci093, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().players.south.trash).toEqual(ownTrashBefore);
    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(opposingHandId);
    expect(view.prompts).toHaveLength(0);
  });
});
