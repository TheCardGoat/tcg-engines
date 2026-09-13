import { describe, expect, it } from "vitest";

import { presentRuntime } from "../projection";
import { MARK_BINDINGS_BOARD_SCENARIOS } from "./mark-bindings-board";

describe("FAB engine scenario · crowded Mark bindings board", () => {
  it("keeps every Mark associated with its named Zombie in state and history", () => {
    const scenario = MARK_BINDINGS_BOARD_SCENARIOS["mark-bindings-zombie-board"];
    const match = scenario.boot();
    const state = presentRuntime(match.runtime, match.player1Id);
    const cardName = (instanceId: string) => {
      const card = state.cards[instanceId];
      return card ? state.cardDefinitions[card.cardId]?.name : undefined;
    };
    const bindings = Object.values(state.cards)
      .filter((card) => card.zone === "hosted" && card.hostInstanceId)
      .map((card) => `${cardName(card.id)} → ${cardName(card.hostInstanceId!)}`)
      .sort();

    expect(bindings).toEqual([
      "Mark of Neverest → Restless Commander",
      "Mark of Pathstone → Restless Corporal",
      "Mark of Ushering → Restless Looter",
    ]);
    expect(state.actionPoints[match.player1Id]).toBe(9);
    expect(
      Object.values(state.cards).filter(
        (card) => card.ownerId === match.player1Id && card.zone === "weapon",
      ),
    ).toHaveLength(1);
    expect(
      Object.values(state.cards).filter(
        (card) => card.ownerId === match.player1Id && card.zone === "permanent",
      ),
    ).toHaveLength(6);
    expect(
      Object.values(state.cards).filter(
        (card) => card.ownerId === match.player1Id && card.zone === "hand",
      ),
    ).toHaveLength(3);
    expect(match.engine.renderedPlayerNarrative(match.player1Id)).toEqual([
      "You played Mark of Neverest.",
      "Mark of Neverest bound to Restless Commander.",
      "You played Mark of Pathstone.",
      "Mark of Pathstone bound to Restless Corporal.",
      "You played Mark of Ushering.",
      "Mark of Ushering bound to Restless Looter.",
    ]);
  });
});
