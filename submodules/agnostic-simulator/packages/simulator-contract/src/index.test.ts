import { describe, expect, test } from "vite-plus/test";

import { resolveSimulatorTargetFilter, type SimulatorEntity, type SimulatorTable } from "./index";

const table: SimulatorTable = {
  status: {
    activeSeatId: "p1",
    phase: "Main",
    stateVersion: 1,
    turn: 1,
  },
  seats: [
    { id: "p1", label: "Player", role: "human", perspective: "bottom", counters: [] },
    { id: "p2", label: "Rival", role: "agent", perspective: "top", counters: [] },
  ],
  zones: [
    {
      id: "p-trash",
      label: "Trash",
      role: "discard",
      ownerId: "p1",
      visibility: "public",
      entityIds: ["p1-trash-card", "p1-hidden-trash-card"],
      count: 2,
      hint: "Player trash",
    },
    {
      id: "opp-trash",
      label: "Trash",
      role: "discard",
      ownerId: "p2",
      visibility: "public",
      entityIds: ["p2-trash-card"],
      count: 1,
      hint: "Rival trash",
    },
  ],
};

const entities: SimulatorEntity[] = [
  {
    id: "p1-trash-card",
    title: "Player Gear",
    subtitle: "Gear",
    kind: "card",
    ownerId: "p1",
    face: "public",
    states: [],
    stats: [],
    traits: [],
    dataAttributes: { zoneId: "p-trash" },
  },
  {
    id: "p1-hidden-trash-card",
    title: "Hidden Player Card",
    subtitle: "Card",
    kind: "card",
    ownerId: "p1",
    face: "hidden",
    states: ["hidden"],
    stats: [],
    traits: [],
    dataAttributes: { zoneId: "p-trash" },
  },
  {
    id: "p2-trash-card",
    title: "Rival Unit",
    subtitle: "Unit",
    kind: "card",
    ownerId: "p2",
    face: "public",
    states: [],
    stats: [],
    traits: [],
    dataAttributes: { "data-zone-id": "opp-trash" },
  },
  {
    id: "p1-trash-token",
    title: "Counter",
    subtitle: "Token",
    kind: "token",
    ownerId: "p1",
    face: "public",
    states: [],
    stats: [],
    traits: [],
    dataAttributes: { zoneId: "p-trash" },
  },
];

describe("resolveSimulatorTargetFilter", () => {
  test("filters card entities by zone id", () => {
    const matched = resolveSimulatorTargetFilter(
      { kind: "entity", entityKind: "card", zoneId: "opp-trash" },
      table,
      entities,
    );

    expect(matched.map((entity) => entity.id)).toEqual(["p2-trash-card"]);
  });

  test("filters entities by owner id", () => {
    const matched = resolveSimulatorTargetFilter(
      { kind: "entity", entityKind: "card", ownerId: "p1", includeHidden: true },
      table,
      entities,
    );

    expect(matched.map((entity) => entity.id)).toEqual(["p1-trash-card", "p1-hidden-trash-card"]);
  });

  test("excludes non-card entities when entityKind is card", () => {
    const matched = resolveSimulatorTargetFilter(
      { kind: "entity", entityKind: "card", ownerId: "p1", zoneId: "p-trash" },
      table,
      entities,
    );

    expect(matched.map((entity) => entity.id)).toEqual(["p1-trash-card"]);
  });
});
