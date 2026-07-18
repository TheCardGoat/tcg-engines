import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Funkfreed044,
  eb01MountainGod018,
  op07EdwardWeevil039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-039 Edward Weevil", () => {
  test("with one DON!!, privately orders the top three cards at the chosen end of the deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07EdwardWeevil039, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Funkfreed044, eb01MountainGod018],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const weevilId = engine.findCardInZone("south", "character", op07EdwardWeevil039);
    engine.attachDon(weevilId, 1, "south");

    engine.declareAttack(weevilId, engine.leader("north"), "south");
    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Weevil's three-card order.");
    expect(order.candidates).toHaveLength(3);
    const chosenOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") throw new Error("Expected Weevil's deck position.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-3)).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine
        .getView("north")
        .logs.map((entry) => entry.message)
        .join("\n"),
    ).not.toContain("Doma");
  });

  test("does not look at the deck when attacking without a given DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07EdwardWeevil039, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Funkfreed044, eb01MountainGod018],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const weevilId = engine.findCardInZone("south", "character", op07EdwardWeevil039);

    engine.declareAttack(weevilId, engine.leader("north"), "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
