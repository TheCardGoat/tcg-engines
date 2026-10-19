import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import type { EngineInteractionView, EntityPartitionInput } from "@tcg/protocol";
import type { useInteractionSurface } from "@tcg/simulator-ui";
import type { LiveBoardState } from "../board-types";
import { useDeckOrderReturn } from "./useDeckOrderReturn";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});
beforeEach(() => {
  document.body.innerHTML =
    '<div data-order-card="a"><img src="/a.jpg"></div><div data-order-card="b"><img src="/b.jpg"></div>';
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(20, 30, 100, 140),
  );
});
const input: EntityPartitionInput = {
  kind: "entity-partition",
  id: "deckOrder",
  required: true,
  text: { key: "Order" },
  entityKind: "card",
  assignment: "exhaustive",
  candidates: ["a", "b"].map((id) => ({ entity: { kind: "card", instanceId: id }, enabled: true })),
  routes: ["top", "bottom"].map((id) => ({
    id,
    kind: "destination",
    text: { key: id },
    min: 0,
    max: 2,
    ordered: true,
    orderDirection: "top-first",
  })),
};
const action = {
  id: "choice",
  requestId: "choice:1",
  intent: "choose-option" as const,
  text: { key: "Order" },
  enabled: true,
  inputs: [input],
};
const view: EngineInteractionView = {
  protocolVersion: 2,
  gameSlug: "alpha-clash",
  actorId: "human",
  stateVersion: 1,
  status: "choosing",
  actions: [action],
};
const noop = () => {};
const surface: ReturnType<typeof useInteractionSurface> = {
  action,
  input,
  requestId: "choice",
  spatial: false,
  minimized: false,
  locked: false,
  opened: true,
  title: "Order",
  selectedIds: new Set(),
  candidateIds: new Set(),
  values: { deckOrder: { top: ["a", "b"], bottom: [] } },
  rejected: false,
  canRetry: false,
  canConfirm: true,
  canSkip: false,
  canCancel: false,
  retry: noop,
  select: noop,
  confirm: noop,
  skip: noop,
  cancel: noop,
  clear: noop,
  minimize: noop,
  restore: noop,
};
const player = { name: "Player", health: 30, maxHealth: 30, handSize: 0, deckSize: 40 };
const board: LiveBoardState = {
  cards: ["a", "b"].map((id) => ({
    instanceId: id,
    zone: "deck",
    controller: "player-one",
    ready: true,
    faceDown: false,
    definitionId: id,
    name: id,
    clashDamage: 0,
    phaseDamage: 0,
  })),
  players: { "player-one": player, "player-two": player },
  activePlayer: "player-one",
  turnNumber: 1,
  phaseName: "primary",
  portalOpen: false,
  clash: null,
  standbyCount: 0,
};
const initial: Parameters<typeof useDeckOrderReturn>[0] = {
  surface,
  view,
  board,
  viewer: "player-one",
  zones: [
    {
      id: "player-one:deck",
      left: 600,
      top: 400,
      width: 100,
      height: 140,
      captionLeft: 600,
      captionTop: 540,
    },
  ],
  reducedMotion: false,
  cards: [],
};
const resolved = {
  ...initial,
  surface: { ...surface, input: undefined, action: undefined },
  view: { ...view, stateVersion: 2, actions: [] },
};

test("waits for native resolution, returns top cards deepest first and does not replay", () => {
  const { result, rerender } = renderHook<
    ReturnType<typeof useDeckOrderReturn>,
    Parameters<typeof useDeckOrderReturn>[0]
  >(useDeckOrderReturn, { initialProps: initial });
  expect(result.current.flights).toEqual([]);
  rerender({ ...initial });
  expect(result.current.flights).toEqual([]);
  rerender(resolved);
  expect(result.current.flights.map((f) => f.imageUrl)).toEqual(["/b.jpg", "/a.jpg"]);
  expect(result.current.flights.map((f) => f.delayMs)).toEqual([0, 110]);
  expect(result.current.flights.every((f) => f.flipToBack && f.to.left === 600)).toBe(true);
});
test("a rejected submission never animates", () => {
  const { result, rerender } = renderHook<
    ReturnType<typeof useDeckOrderReturn>,
    Parameters<typeof useDeckOrderReturn>[0]
  >(useDeckOrderReturn, { initialProps: initial });
  rerender({ ...initial, surface: { ...surface, rejected: true } });
  rerender(resolved);
  expect(result.current.flights).toEqual([]);
});
test("changing viewer clears private snapshots even on the resolving update", () => {
  const { result, rerender } = renderHook<
    ReturnType<typeof useDeckOrderReturn>,
    Parameters<typeof useDeckOrderReturn>[0]
  >(useDeckOrderReturn, { initialProps: initial });
  rerender({ ...resolved, viewer: "player-two" });
  expect(result.current.flights).toEqual([]);
  rerender(resolved);
  expect(result.current.flights).toEqual([]);
});
test("an opponent with no choice receives no return order or faces", () => {
  const hidden = {
    ...initial,
    viewer: "player-two" as const,
    surface: resolved.surface,
    board: { ...board, cards: [] },
  };
  const { result, rerender } = renderHook<
    ReturnType<typeof useDeckOrderReturn>,
    Parameters<typeof useDeckOrderReturn>[0]
  >(useDeckOrderReturn, { initialProps: hidden });
  rerender({ ...hidden, view: resolved.view });
  expect(result.current.flights).toEqual([]);
});
test("bottom returns retain draw order and reduced motion uses an unstaggered fade", () => {
  const { result, rerender } = renderHook<
    ReturnType<typeof useDeckOrderReturn>,
    Parameters<typeof useDeckOrderReturn>[0]
  >(useDeckOrderReturn, {
    initialProps: {
      ...initial,
      reducedMotion: true,
      surface: { ...surface, values: { deckOrder: { top: [], bottom: ["a", "b"] } } },
    },
  });
  rerender({ ...resolved, reducedMotion: true });
  expect(result.current.flights.map((f) => f.imageUrl)).toEqual(["/a.jpg", "/b.jpg"]);
  expect(
    result.current.flights.every((f) => f.reducedMotion && f.durationMs === 160 && f.delayMs === 0),
  ).toBe(true);
});
test("concealed candidate uses a card back even if a stale DOM face exists", () => {
  const { result, rerender } = renderHook<
    ReturnType<typeof useDeckOrderReturn>,
    Parameters<typeof useDeckOrderReturn>[0]
  >(useDeckOrderReturn, {
    initialProps: {
      ...initial,
      board: {
        ...board,
        cards: board.cards.map((card) => ({ ...card, definitionId: null, name: null })),
      },
    },
  });
  rerender(resolved);
  expect(
    result.current.flights.every(
      (f) => !f.flipToBack && !["/a.jpg", "/b.jpg"].includes(f.imageUrl!),
    ),
  ).toBe(true);
});

test("holds the displayed board until all returns finish, then releases the draw", () => {
  const drawn = {
    ...board,
    cards: board.cards.map((card) => (card.instanceId === "a" ? { ...card, zone: "hand" } : card)),
  };
  const { result, rerender } = renderHook<
    ReturnType<typeof useDeckOrderReturn>,
    Parameters<typeof useDeckOrderReturn>[0]
  >(useDeckOrderReturn, { initialProps: initial });
  rerender({ ...resolved, board: drawn });
  expect(result.current.board.cards.find((card) => card.instanceId === "a")?.zone).toBe("deck");
  const ids = result.current.flights.map((flight) => flight.id);
  for (const id of ids) act(() => result.current.finish(id));
  expect(result.current.flights).toEqual([]);
  expect(result.current.board).toBe(drawn);
  rerender({ ...resolved, board: drawn });
  expect(result.current.flights).toEqual([]);
});

test("changing seats during playback discards it permanently", () => {
  const { result, rerender } = renderHook<
    ReturnType<typeof useDeckOrderReturn>,
    Parameters<typeof useDeckOrderReturn>[0]
  >(useDeckOrderReturn, { initialProps: initial });
  rerender(resolved);
  expect(result.current.flights).toHaveLength(2);
  rerender({ ...resolved, viewer: "player-two" });
  expect(result.current.flights).toEqual([]);
  rerender(resolved);
  expect(result.current.flights).toEqual([]);
});
