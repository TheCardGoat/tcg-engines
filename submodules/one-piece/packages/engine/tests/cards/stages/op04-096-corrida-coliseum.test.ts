import { describe, expect, test } from "vite-plus/test";
import {
  op02Magellan085,
  op04Cavendish081,
  op04CorridaColiseum096,
  op04Rebecca039,
  op13Higuma013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-096 Corrida Coliseum", () => {
  test("lets newly played Dressrosa Characters attack only Characters with a Dressrosa Leader", () => {
    const unavailableEngine = OnePieceTestEngine.create(
      {
        stage: op04CorridaColiseum096,
        character: [{ card: op04Cavendish081, playedOnTurn: 1 }],
      },
      {
        character: [{ card: op02Magellan085, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const unavailableCavendishId = unavailableEngine.findCardInZone(
      "south",
      "character",
      op04Cavendish081,
    );
    const unavailableActionStep = unavailableEngine
      .getView("south")
      .decisions.find((decision) => decision.kind === "chooseAction")?.steps[0];
    expect(unavailableActionStep?.kind).toBe("chooseAction");
    if (unavailableActionStep?.kind !== "chooseAction") {
      throw new Error("Expected the turn player to have an action decision.");
    }
    expect(
      unavailableActionStep.actions.some(
        (action) =>
          action.commandType === "declareAttack" && action.source?.id === unavailableCavendishId,
      ),
    ).toBe(false);

    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        stage: op04CorridaColiseum096,
        character: [
          { card: op04Cavendish081, playedOnTurn: 1 },
          { card: op13Higuma013, playedOnTurn: 1 },
        ],
      },
      {
        character: [{ card: op02Magellan085, rested: true }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cavendishId = engine.findCardInZone("south", "character", op04Cavendish081);
    const unrelatedId = engine.findCardInZone("south", "character", op13Higuma013);
    const targetId = engine.findCardInZone("north", "character", op02Magellan085);
    const view = engine.getView("south");
    const actionStep = view.decisions.find((decision) => decision.kind === "chooseAction")
      ?.steps[0];
    expect(actionStep?.kind).toBe("chooseAction");
    if (actionStep?.kind !== "chooseAction") {
      throw new Error("Expected Corrida Coliseum to publish an attack action.");
    }
    const attack = actionStep.actions.find(
      (action) => action.commandType === "declareAttack" && action.source?.id === cavendishId,
    );
    expect(attack?.targets?.map((target) => target.id)).toEqual([targetId]);
    expect(attack?.targets?.map((target) => target.id)).not.toContain(engine.leader("north"));
    expect(
      actionStep.actions.some(
        (action) => action.commandType === "declareAttack" && action.source?.id === unrelatedId,
      ),
    ).toBe(false);

    engine.declareAttack(cavendishId, targetId, "south");

    expect(engine.getView("south").battle).toMatchObject({
      attackerId: cavendishId,
      targetId,
    });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
