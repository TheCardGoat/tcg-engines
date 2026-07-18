import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op05Viola079 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-079 Viola", () => {
  test("the opponent chooses and orders three cards from their trash for deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Viola079], activeDon: op05Viola079.cost },
      { trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005] },
    );
    const trashIds = [...engine.getState().players.north.trash];
    const submittedOrder = [trashIds[2]!, trashIds[0]!, trashIds[3]!];

    engine.playCard(op05Viola079, "south");
    const choice = engine.pendingDecision("effectTargetSelection", "north");
    expect(choice.actorId).toBe("north");
    const step = choice.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Viola's trash-card choice.");
    expect(step).toMatchObject({ min: 3, max: 3 });
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual(trashIds);

    engine.resolveDecision("effectTargetSelection", { selectedIds: submittedOrder }, "north");

    const orderChoice = engine.pendingDecision("effectReturnToDeckOwnerOrder", "north");
    const orderStep = orderChoice.steps[0];
    expect(orderStep?.kind).toBe("orderItems");
    if (orderStep?.kind !== "orderItems") throw new Error("Expected Viola's deck-order choice.");
    expect(orderStep.candidates.map((candidate) => candidate.ref.id)).toEqual(submittedOrder);
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: submittedOrder },
      "north",
    );

    const view = engine.getView("north");
    const spectatorView = engine.getView("spectator");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual([trashIds[1]]);
    // Bottom-deck order is intentionally asserted at the narrow hidden-zone identity boundary.
    expect(engine.getState().players.north.deck.slice(-3)).toEqual(submittedOrder);
    expect(spectatorView.players.north.deckTop).toMatchObject({ hidden: true, instanceId: null });
    const publicLogText = spectatorView.logs.map((log) => log.message).join(" ");
    expect(publicLogText).toContain(eb01Doma005.name);
    expect(publicLogText).toContain(eb01MountainGod018.name);
    expect(publicLogText).not.toContain("Order:");
    expect(view.logs.map((log) => log.message).join(" ")).toContain("Order:");
    expect(view.prompts).toHaveLength(0);
  });
});
