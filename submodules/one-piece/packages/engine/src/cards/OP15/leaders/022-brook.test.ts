import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08ImperialFlame094 } from "@tcg/op-cards";
import { op15Brook022 } from "../../../../../cards/src/cards/leaders/op15-022-brook.ts";

import { getLegalCommands, OnePieceTestEngine } from "../../../index.ts";

describe("OP15-022 Brook", () => {
  test.each([0, 1, 2, 3, 4])(
    "with %i deck cards, resolves the restand and defers defeat to turn end",
    (deck) => {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: op15Brook022,
          deck,
          character: [{ card: eb01Doma005, rested: true }],
        },
        {},
      );
      const domaId = engine.findCardInZone("south", "character", eb01Doma005);

      engine.activateEffect(engine.leader("south"), "activateMain", "south");

      expect(engine.getState().status).toBe("active");
      expect(engine.getView("south").players.south.deckCount).toBe(0);

      const setActive = engine.pendingDecision("effectTargetSelection", "south").steps[0];
      if (setActive?.kind !== "selectEntity")
        throw new Error("Expected Brook's set-active choice.");
      expect(setActive.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
      engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");
      expect(
        engine.getView("south").players.south.characters.find((card) => card?.instanceId === domaId)
          ?.rested,
      ).toBe(false);

      engine.endTurn("south");
      expect(engine.getState().status).toBe("finished");
      expect(engine.getState().winner).toBe("north");
      expect(engine.getState().finishReason).toBe("emptyDeck");
    },
  );

  test("refilling the deck does not cancel the defeat due this turn (OP15 Q1196)", () => {
    let engine = OnePieceTestEngine.create({
      leaderCardId: op15Brook022,
      deck: 4,
      hand: [op08ImperialFlame094],
      activeDon: 2,
    });

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    expect(engine.getView("south").players.south.deckCount).toBe(0);
    expect(engine.getView("south").status).toBe("active");

    const paymentIds = engine
      .getView("south")
      .players.south.trash.slice(0, 3)
      .map((card) => card.instanceId)
      .filter((id): id is string => id !== null);
    engine.playCard(op08ImperialFlame094);
    engine.acceptLeadingOptional("south");
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentIds }, "south");
    expect(engine.getView("south").players.south.deckCount).toBe(3);
    expect(engine.getView("south").status).toBe("active");

    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.endTurn("south");
    expect(engine.getView("south").status).toBe("finished");
    expect(engine.getView("south").winner).toBe("north");
    expect(engine.getState().finishReason).toBe("emptyDeck");
  });

  test("keeps the game going when the deck still has cards after the trash", () => {
    const engine = OnePieceTestEngine.create({ leaderCardId: op15Brook022, deck: 5 }, {});

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    expect(engine.getView("south").players.south.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);

    const stillLegal = getLegalCommands(engine.getState(), "south").some(
      (command) => command.type === "activateEffect" && command.sourceId === engine.leader("south"),
    );
    expect(stillLegal).toBe(false);

    engine.endTurn("south");
    expect(engine.getState().status).toBe("active");
    expect(engine.getState().turnNumber).toBe(4);
  });
});
