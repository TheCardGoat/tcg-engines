import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Perona077 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-077 Perona", () => {
  test("on play reorders the top five cards to the chosen deck end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Perona077],
      activeDon: op01Perona077.cost,
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Fourtricks025],
    });
    const lookedIds = engine.getState().players.south.deck.slice(0, 5);

    engine.playCard(op01Perona077, "south");

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Perona's deck order.");
    const chosenOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-5)).toEqual(chosenOrder);
    const rearrangeMoveEvents = engine
      .getState()
      .eventHistory.filter(
        (event) =>
          event.type === "cardMoved" &&
          event.payload.fromZone === "deck" &&
          event.payload.toZone === "deck",
      );
    expect(rearrangeMoveEvents).toHaveLength(5);
    expect(
      rearrangeMoveEvents.every(
        (event) => event.sourceCardId === null && event.sourceInstanceId === null,
      ),
    ).toBe(true);
    const opponentView = engine.getView("north");
    expect(
      opponentView.logs.filter(
        (entry) => entry.sourceInstanceId && lookedIds.includes(entry.sourceInstanceId),
      ),
    ).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
