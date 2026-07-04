import { describe, expect, it } from "vite-plus/test";
import { getCard } from "@tcg/star-wars-unlimited-cards";
import {
  applyCommand,
  createInitialState,
  executeEffects,
  projectState,
  resolveTarget,
} from "./index.ts";

const baseId = "8327910265";
const leaderId = "4626028465";
const unitId = "7109944284";

function testState() {
  return createInitialState({
    id: "test-match",
    firstPlayer: "player-one",
    players: {
      "player-one": {
        name: "Player One",
        deck: { baseId, leaderId, deckIds: [unitId] },
      },
      "player-two": {
        name: "Player Two",
        deck: { baseId, leaderId, deckIds: [unitId] },
      },
    },
  });
}

describe("native Star Wars Unlimited runtime", () => {
  it("creates runtime state from typed card definitions", () => {
    const state = testState();
    expect(state.phase).toBe("setup");
    expect(Object.values(state.cards)).toHaveLength(6);
    expect(state.definitions[unitId]).toBe(getCard(unitId));
  });

  it("resolves card targets through native target DSL", () => {
    const state = testState();
    const sourceId = Object.values(state.cards).find(
      (card) => card.owner === "player-one" && card.definitionId === unitId,
    )?.instanceId;
    expect(sourceId).toBeDefined();
    const targets = resolveTarget(
      { type: "card", controller: "friendly", zones: ["deck"], cardTypes: ["unit"] },
      { state, playerId: "player-one", sourceId: sourceId ?? "" },
    );
    expect(targets).toHaveLength(1);
  });

  it("executes effects and records replay-safe public logs", () => {
    const state = testState();
    const sourceId =
      Object.values(state.cards).find(
        (card) => card.owner === "player-one" && card.definitionId === unitId,
      )?.instanceId ?? "";
    const targetId =
      Object.values(state.cards).find(
        (card) => card.owner === "player-two" && card.definitionId === unitId,
      )?.instanceId ?? "";
    state.cards[sourceId].zone = "groundArena";
    state.cards[targetId].zone = "groundArena";

    executeEffects([{ type: "damage", amount: 2, target: { type: "choice", id: "target" } }], {
      state,
      playerId: "player-one",
      sourceId,
      choices: { target: targetId },
    });

    expect(state.cards[targetId].damage).toBe(2);
    expect(state.moveLog.at(-1)?.type).toBe("effect.damage");
  });

  it("moves reordered discard cards into their owner's deck", () => {
    const state = testState();
    const sourceId =
      Object.values(state.cards).find(
        (card) => card.owner === "player-one" && card.definitionId === unitId,
      )?.instanceId ?? "";
    const targetId =
      Object.values(state.cards).find(
        (card) => card.owner === "player-two" && card.definitionId === unitId,
      )?.instanceId ?? "";
    state.cards[sourceId].zone = "hand";
    state.cards[targetId].zone = "discard";

    executeEffects(
      [
        {
          type: "reorder",
          target: { type: "card", controller: "opponent", zones: ["discard"], limit: 1 },
          destination: "bottomOfDeck",
          order: "random",
        },
      ],
      { state, playerId: "player-one", sourceId },
    );

    expect(state.cards[targetId].zone).toBe("deck");
    expect(state.moveLog.at(-1)?.type).toBe("effect.reorder");
  });

  it("applies commands and projects hidden information by viewer", () => {
    const state = testState();
    state.phase = "action";
    const cardId =
      Object.values(state.cards).find(
        (card) => card.owner === "player-one" && card.definitionId === unitId,
      )?.instanceId ?? "";
    state.cards[cardId].zone = "hand";

    const result = applyCommand(state, { type: "playCard", playerId: "player-one", cardId });
    expect(result.success).toBe(true);
    expect(state.cards[cardId].zone).toBe("groundArena");

    const projected = projectState(state, "player-two");
    expect(projected.cards.some((card) => card.zone === "deck" && card.title === null)).toBe(true);
  });
});
