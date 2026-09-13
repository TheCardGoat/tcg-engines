// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import type { Card } from "@tcg/gundam-types";

import type { BoardProjection } from "../../game/index.ts";
import type { PlayerSeatProjection } from "./player-seat-projection.ts";
import { projectPlayerSeat, usePlayerSeatProjection } from "./player-seat-projection.ts";

type FilteredCardView = BoardProjection["zones"]["zones"][string]["cards"][number];

function definition(name: string, type: Card["type"], overrides: Partial<Card> = {}): Card {
  return {
    name,
    type,
    cost: 1,
    level: 1,
    cardNumber: `TEST-${name.toUpperCase().replace(/\s+/gu, "-")}`,
    rarity: "C",
    traits: [],
    keywordEffects: [],
    effect: "",
    ...overrides,
  } as Card;
}

function card(
  instanceId: string,
  zoneId: string,
  cardDefinition: Card | null,
  meta: FilteredCardView["meta"] = null,
): FilteredCardView {
  return {
    instanceId,
    definition: cardDefinition,
    definitionId: cardDefinition?.cardNumber ?? null,
    meta,
    ownerId: "p1",
    controllerId: "p1",
    faceDown: cardDefinition === null,
    zoneId,
  };
}

function makeView(): BoardProjection {
  const unit = card("unit-1", "battleArea:p1", definition("Gundam", "unit", { ap: 4, hp: 5 }));
  const pilot = card("pilot-1", "battleArea:p1", definition("Amuro", "pilot"));
  const readyResource = card(
    "resource-ready",
    "resourceArea:p1",
    definition("Resource A", "resource"),
  );
  const restedResource = card(
    "resource-rested",
    "resourceArea:p1",
    definition("Resource B", "resource"),
    { exhausted: true },
  );

  return {
    G: { pilotAssignments: { "unit-1": "pilot-1" } },
    stateID: 1,
    status: { phase: "main", activePlayer: "p1", turn: 2, pendingDecision: [] } as never,
    zones: {
      zones: {
        "battleArea:p1": { count: 2, cards: [unit, pilot] },
        "resourceArea:p1": { count: 2, cards: [readyResource, restedResource] },
        "baseSection:p1": {
          count: 1,
          cards: [card("base-1", "baseSection:p1", definition("White Base", "base", { hp: 10 }))],
        },
        "shieldArea:p1": {
          count: 3,
          cards: [card("shield-1", "shieldArea:p1", null)],
        },
        "trash:p1": {
          count: 1,
          cards: [card("trash-1", "trash:p1", definition("Discarded", "command"))],
        },
        "removalArea:p1": {
          count: 1,
          cards: [card("removed-1", "removalArea:p1", definition("Removed", "unit"))],
        },
        "deck:p1": { count: 27, cards: [] },
        "resourceDeck:p1": { count: 8, cards: [] },
      },
    },
    players: [
      { playerId: "p1", publicData: {} },
      { playerId: "p2", publicData: {} },
    ],
    availableMoves: [],
    myPlayerId: "p1",
    timerView: { serverTimestamp: 0 },
  } as unknown as BoardProjection;
}

describe("player seat projection", () => {
  it("projects zones, counts, active resources, and paired pilots", () => {
    const projection = projectPlayerSeat(makeView(), "p1");

    expect(projection.play).toHaveLength(1);
    expect(projection.play[0]).toMatchObject({
      id: "unit-1",
      name: "Gundam",
      pairedPilot: { id: "pilot-1", name: "Amuro" },
    });
    expect(projection.resourceArea.map((resource) => resource.id)).toEqual([
      "resource-ready",
      "resource-rested",
    ]);
    expect(projection.base[0]?.id).toBe("base-1");
    expect(projection.shields[0]).toMatchObject({ id: "shield-1", faceDown: true });
    expect(projection.discard[0]?.id).toBe("trash-1");
    expect(projection.removalArea[0]).toMatchObject({ id: "removed-1", name: "Removed" });
    expect(projection.availableResources).toBe(1);
    expect(projection.player).toMatchObject({
      name: "p1",
      deck: 27,
      resourceDeck: 8,
      discard: 1,
      shields: 3,
    });
  });

  it("preserves the projection identity until the board view changes", () => {
    const initialView = makeView();
    const observed: PlayerSeatProjection[] = [];

    function Probe({
      view,
      renderMarker,
    }: {
      readonly view: BoardProjection;
      readonly renderMarker: number;
    }) {
      observed.push(usePlayerSeatProjection(view, "p1"));
      return <output>{renderMarker}</output>;
    }

    const { rerender } = render(<Probe view={initialView} renderMarker={0} />);
    rerender(<Probe view={initialView} renderMarker={1} />);
    const nextView = { ...initialView, stateID: initialView.stateID + 1 };
    rerender(<Probe view={nextView} renderMarker={2} />);

    expect(observed).toHaveLength(3);
    expect(observed[1]).toBe(observed[0]);
    expect(observed[2]).not.toBe(observed[1]);
  });
});
