import { describe, expect, it } from "vite-plus/test";
import { createMatchState } from "../src/state/initial-state.ts";
import { createMockLegend, createMockUnit } from "../src/testing/card-mocks.ts";
import { CyberpunkTestEngine } from "../src/testing/test-engine.ts";
import { createPlayerId } from "../src/types/branded.ts";
import type { CardCatalog, DeckList } from "../src/types/match-state.ts";
import type { CardDefinition } from "@tcg/cyberpunk-types";

const P1 = createPlayerId("p1");
const P2 = createPlayerId("p2");

function catalogOf(cards: CardDefinition[]): CardCatalog {
  const byId = new Map(cards.map((card) => [card.id, card]));
  return {
    get: (id) => byId.get(id),
    entries: () => byId.entries(),
    size: byId.size,
  };
}

function deck(playerId: string, legends: string[], mainSize: number, unitId: string): DeckList {
  return {
    playerId,
    playerName: playerId,
    legends,
    mainDeck: Array.from({ length: mainSize }, () => unitId),
  };
}

describe("6-pack blank Eddies", () => {
  it("fills a short Legend crew from the top of the deck before the opening hand", () => {
    const legends = [
      createMockLegend({ id: "legend-a", name: "Legend A" }),
      createMockLegend({ id: "legend-b", name: "Legend B" }),
      createMockLegend({ id: "legend-c", name: "Legend C" }),
    ];
    const unit = createMockUnit({ id: "unit-a", name: "Visible Unit", hasSellTag: true });
    const cards = [...legends, unit];
    const state = createMatchState({
      players: [
        { id: P1, name: "One" },
        { id: P2, name: "Three" },
      ],
      catalog: catalogOf(cards),
      deckLists: [
        deck("p1", ["legend-a"], 30, unit.id),
        deck("p2", ["legend-a", "legend-b", "legend-c"], 40, unit.id),
      ],
      seed: "six-pack-setup",
      setup: { blankEddiesForMissingLegends: true },
    });

    const engine = CyberpunkTestEngine.fromState(state, {
      autoChooseFirstPlayer: false,
      autoGainGig: false,
    });
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type !== "chooseFirstPlayer") throw new Error("expected a first-player choice");
    engine.resolveFirstPlayer(true, { as: pending.chooserId });

    const after = engine.getState();
    const firstId = pending.chooserId;
    const p1 = after.G.players[P1]!;
    const p2 = after.G.players[P2]!;

    expect(p1.zones.eddieArea).toHaveLength(2);
    expect(p1.eddies).toBe(2);
    expect(p1.soldThisTurn).toBe(false);
    expect(p1.zones.hand).toHaveLength(6);
    expect(p1.zones.deck).toHaveLength(30 - 2 - 6);
    for (const eddieId of p1.zones.eddieArea) {
      expect(after.G.cardIndex[eddieId as string]?.meta).toMatchObject({
        faceDown: true,
        revealed: false,
        spent: false,
      });
    }

    expect(p2.zones.eddieArea).toHaveLength(0);
    expect(p2.eddies).toBe(0);
    expect(p2.zones.hand).toHaveLength(6);
    expect(p2.soldThisTurn).toBe(false);

    const spentLegends = (playerId: string) =>
      after.G.players[playerId]!.zones.legendArea.filter(
        (id) => after.G.cardIndex[id as string]?.meta.spent,
      ).length;
    expect(spentLegends(firstId)).toBe(
      Math.min(2, after.G.players[firstId]!.zones.legendArea.length),
    );

    const rivalId = firstId === P1 ? P2 : P1;
    const rivalView = engine.getFilteredView(rivalId);
    const seen = rivalView.players[P1]?.zones.eddieArea;
    if (!Array.isArray(seen)) throw new Error("expected Eddie cards");
    expect(seen).toHaveLength(2);
    expect(seen.every((card) => card.cardName === null && card.definitionId === "")).toBe(true);

    expect(engine.getLastActionLog()).toMatchObject({
      messageKey: "setup.blankEddie",
      params: { count: 2 },
      playerId: P1,
    });
    const logged = engine.getLastActionLog();
    expect(logged && "cardIds" in logged ? logged.cardIds : undefined).toBeUndefined();
  });

  it("adds three ready blank Eddies when a player registers no Legends", () => {
    const unit = createMockUnit({ id: "unit-b" });
    const legend = createMockLegend({ id: "legend-d", name: "Legend D" });
    const state = createMatchState({
      players: [
        { id: P1, name: "Empty" },
        { id: P2, name: "Full" },
      ],
      catalog: catalogOf([unit, legend]),
      deckLists: [deck("p1", [], 30, unit.id), deck("p2", [legend.id], 30, unit.id)],
      seed: "six-pack-empty-crew",
      setup: { blankEddiesForMissingLegends: true },
    });
    const engine = CyberpunkTestEngine.fromState(state, {
      autoChooseFirstPlayer: false,
      autoGainGig: false,
    });
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type !== "chooseFirstPlayer") throw new Error("expected a first-player choice");
    engine.resolveFirstPlayer(true, { as: pending.chooserId });
    const after = engine.getState();
    expect(after.G.players[P1]!.zones.eddieArea).toHaveLength(3);
    expect(after.G.players[P1]!.eddies).toBe(3);
    expect(after.G.players[P1]!.zones.hand).toHaveLength(6);
    expect(after.G.players[P2]!.zones.eddieArea).toHaveLength(2);
    const firstId = pending.chooserId;
    const spent = after.G.players[firstId]!.zones.legendArea.filter(
      (id) => after.G.cardIndex[id as string]?.meta.spent,
    );
    expect(spent).toHaveLength(Math.min(2, after.G.players[firstId]!.zones.legendArea.length));
  });
});
