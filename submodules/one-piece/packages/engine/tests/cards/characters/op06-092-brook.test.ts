import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op06Brook092 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-092 Brook", () => {
  test("chooses to trash only an opponent Character with cost 4 or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Brook092], activeDon: op06Brook092.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06Brook092, "south");
    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Brook's printed choice.");
    expect(choice.options.map((option) => option.label)).toEqual([
      "trashFromField",
      "returnToDeck",
    ]);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Brook's trash target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("makes the opponent select and order three trash cards for the bottom of their deck", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Brook092], activeDon: op06Brook092.cost },
      { trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005] },
    );
    const trashIds = engine
      .getView("north")
      .players.north.trash.map((card) => card.instanceId)
      .filter((instanceId): instanceId is string => instanceId !== null);
    const selectedIds = trashIds.slice(0, 3);
    const retainedId = trashIds[3]!;

    engine.playCard(op06Brook092, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const selection = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity")
      throw new Error("Expected Brook's opponent trash choice.");
    expect(selection).toMatchObject({ min: 3, max: 3 });
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual(trashIds);
    engine.resolveDecision("effectTargetSelection", { selectedIds }, "north");

    const order = engine.pendingDecision("effectReturnToDeckOwnerOrder", "north").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Brook's opponent deck order.");
    const returnedOrder = [selectedIds[2]!, selectedIds[0]!, selectedIds[1]!];
    engine.resolveDecision("effectReturnToDeckOwnerOrder", { selectedIds: returnedOrder }, "north");

    expect(engine.getState().players.north.deck.slice(-3)).toEqual(returnedOrder);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toEqual([
      retainedId,
    ]);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
