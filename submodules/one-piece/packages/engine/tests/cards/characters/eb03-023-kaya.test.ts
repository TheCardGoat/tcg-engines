import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01Funkfreed044,
  eb01MountainGod018,
  eb03Kaya023,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-023 Kaya", () => {
  test("orders the top five cards and places the chosen order at the bottom", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Kaya023],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01Funkfreed044,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
      ],
      activeDon: 2,
    });

    engine.playCard(eb03Kaya023, "south");
    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Kaya's five-card order.");
    expect(order.candidates).toHaveLength(5);
    const chosenOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") throw new Error("Expected Kaya's deck position.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-5)).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
