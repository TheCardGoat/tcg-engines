import { describe, expect, it } from "vite-plus/test";
import { applyOpeningHand } from "../src/state/initial-state.ts";
import { CyberpunkTestEngine, P1, P2 } from "../src/testing/index.ts";
import type { PlayerId } from "../src/types/branded.ts";
import type { FilteredCardView } from "../src/view/filter.ts";

function identifiedHand(viewHand: FilteredCardView[] | number | undefined): FilteredCardView[] {
  expect(Array.isArray(viewHand)).toBe(true);
  if (!Array.isArray(viewHand)) throw new Error("expected an identified hand");
  expect(viewHand).toHaveLength(6);
  expect(
    viewHand.every(
      (card) =>
        card.definitionId.length > 0 &&
        !card.definitionId.startsWith("viewer:") &&
        card.faceDown === false,
    ),
  ).toBe(true);
  return viewHand;
}

function handAndDeckSizes(engine: CyberpunkTestEngine): { hands: number[]; decks: number[] } {
  const state = engine.getState();
  return {
    hands: state.ctx.playerIds.map((id) => state.G.players[id]!.zones.hand.length),
    decks: state.ctx.playerIds.map((id) => state.G.players[id]!.zones.deck.length),
  };
}

describe("opening hand visibility around the first-player choice", () => {
  it("leaves both hands empty until the choice, then reveals six real cards after going first", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {},
      {},
      { skipSetup: false, autoChooseFirstPlayer: false, seed: "opening-go-first" },
    );
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(pending?.type).toBe("chooseFirstPlayer");
    if (pending?.type !== "chooseFirstPlayer") throw new Error("expected chooseFirstPlayer");
    const chooser = pending.chooserId;
    const rival = chooser === P1 ? P2 : P1;

    expect(engine.getCardsInZone("hand", chooser)).toHaveLength(0);
    expect(engine.getCardsInZone("hand", rival)).toHaveLength(0);
    const before = engine.getFilteredView(chooser);
    expect(before.players[chooser]?.zones.hand).toEqual([]);
    expect(before.players[rival]?.zones.hand).toBe(0);

    engine.resolveFirstPlayer(true, { as: chooser });

    const after = engine.getFilteredView(chooser);
    identifiedHand(after.players[chooser]?.zones.hand as FilteredCardView[]);
    expect(typeof after.players[rival]?.zones.hand).toBe("number");
    expect(after.players[rival]?.zones.hand).toBe(6);

    const dealt = handAndDeckSizes(engine);
    applyOpeningHand(engine.getState(), chooser);
    expect(handAndDeckSizes(engine)).toEqual(dealt);
  });

  it("reveals the chooser's own hand after they choose to go second", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {},
      {},
      { skipSetup: false, autoChooseFirstPlayer: false, seed: "opening-go-second" },
    );
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type !== "chooseFirstPlayer") throw new Error("expected chooseFirstPlayer");
    const chooser = pending.chooserId;
    const rival = chooser === P1 ? P2 : P1;

    engine.resolveFirstPlayer(false, { as: chooser });

    const chooserView = engine.getFilteredView(chooser);
    identifiedHand(chooserView.players[chooser]?.zones.hand as FilteredCardView[]);
    expect(typeof chooserView.players[rival]?.zones.hand).toBe("number");
    expect(chooserView.players[rival]?.zones.hand).toBe(6);

    const rivalView = engine.getFilteredView(rival);
    identifiedHand(rivalView.players[rival]?.zones.hand as FilteredCardView[]);
    expect(typeof rivalView.players[chooser]?.zones.hand).toBe("number");
    expect(rivalView.players[chooser]?.zones.hand).toBe(6);

    const dealt = handAndDeckSizes(engine);
    const firstPlayer = engine.getState().ctx.playerIds.find((id) => engine.isFirstPlayer(id));
    if (!firstPlayer) throw new Error("expected a first player");
    applyOpeningHand(engine.getState(), firstPlayer);
    expect(handAndDeckSizes(engine)).toEqual(dealt);
  });

  it("refuses a placeholder identity and leaves that card in the deck", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {},
      {},
      { skipSetup: false, autoChooseFirstPlayer: false, seed: "opening-placeholder" },
    );
    const state = engine.getState();
    const pending = state.G.turnMetadata.pendingChoice;
    if (pending?.type !== "chooseFirstPlayer") throw new Error("expected chooseFirstPlayer");
    const tops = new Map<PlayerId, string>();
    for (const [index, playerId] of state.ctx.playerIds.entries()) {
      const top = state.G.players[playerId]!.zones.deck[0]!;
      tops.set(playerId, String(top));
      state.G.cardIndex[String(top)]!.definitionId = index === 0 ? "viewer:unknown-card" : "";
    }
    const decksBefore = handAndDeckSizes(engine).decks;

    engine.resolveFirstPlayer(true, { as: pending.chooserId });

    expect(handAndDeckSizes(engine).hands).toEqual([0, 0]);
    expect(handAndDeckSizes(engine).decks).toEqual(decksBefore);
    for (const playerId of state.ctx.playerIds) {
      expect(String(engine.getState().G.players[playerId]!.zones.deck[0])).toBe(tops.get(playerId));
    }
  });
});
