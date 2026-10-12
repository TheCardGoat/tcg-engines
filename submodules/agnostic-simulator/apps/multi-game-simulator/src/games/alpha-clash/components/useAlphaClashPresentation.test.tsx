import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";
import type { LiveBoardState, LiveBoardCard } from "./board-types";
import { useAlphaClashPresentation } from "./useAlphaClashPresentation";

afterEach(cleanup);
const card: LiveBoardCard = {
  instanceId: "target",
  zone: "clash",
  controller: "player-one",
  ready: true,
  faceDown: false,
  definitionId: "public-card",
  name: "Target",
  clashDamage: 0,
  phaseDamage: 0,
};
const player = { name: "Player", health: 30, maxHealth: 30, handSize: 0, deckSize: 0 };
const board: LiveBoardState = {
  cards: [card],
  players: { "player-one": player, "player-two": player },
  activePlayer: "player-one",
  turnNumber: 1,
  phaseName: "primary",
  portalOpen: false,
  clash: null,
  standbyCount: 0,
};
const view: EngineInteractionView = {
  protocolVersion: INTERACTION_PROTOCOL_VERSION,
  gameSlug: "alpha-clash",
  actorId: "human",
  stateVersion: 1,
  status: "choosing",
  actions: [],
};
const anchors = {
  cards: [{ id: "target", left: 20, top: 30, width: 100, height: 140 }],
  zones: [],
};

test("draft rerenders do not deal damage; confirmed changes emit one impact", () => {
  const { result, rerender } = renderHook(
    ({ board, view }) => useAlphaClashPresentation(board, view),
    { initialProps: { board, view } },
  );
  act(() => result.current.onSceneAnchors(anchors));
  rerender({ board: { ...board }, view: { ...view } });
  expect(result.current.strike).toBeNull();
  const damaged = { ...board, cards: [{ ...card, phaseDamage: 2 }] };
  rerender({ board: damaged, view: { ...view, stateVersion: 2 } });
  expect(result.current.strike?.targets).toEqual([{ x: 70, y: 100, amount: 2 }]);
  act(() => result.current.finishStrike());
  rerender({ board: damaged, view: { ...view, stateVersion: 2 } });
  expect(result.current.busy).toBe(false);
});

test("seat changes and rewinds establish a baseline instead of replaying effects", () => {
  const { result, rerender } = renderHook(
    ({ board, view }) => useAlphaClashPresentation(board, view),
    { initialProps: { board, view } },
  );
  act(() => result.current.onSceneAnchors(anchors));
  rerender({
    board: { ...board, cards: [] },
    view: { ...view, actorId: "opponent", stateVersion: 2 },
  });
  expect(result.current.busy).toBe(false);
  rerender({ board, view });
  expect(result.current.busy).toBe(false);
});

test("native damage receipts survive cleanup and emit a single simultaneous batch", () => {
  const { result, rerender } = renderHook(
    ({ board, view }) => useAlphaClashPresentation(board, view),
    { initialProps: { board: { ...board, damageEvents: [] } as LiveBoardState, view } },
  );
  act(() => result.current.onSceneAnchors(anchors));
  const resolved: LiveBoardState = {
    ...board,
    cards: [{ ...card, zone: "oblivion" }],
    damageEvents: [{ sequence: 2, targetId: "target", amount: 2 }],
  };
  rerender({ board: resolved, view: { ...view, stateVersion: 2 } });
  expect(result.current.strike).toMatchObject({
    localImpacts: true,
    targets: [{ x: 70, y: 100, amount: 2 }],
  });
  act(() => result.current.finishStrike());
  rerender({ board: resolved, view: { ...view, stateVersion: 3 } });
  expect(result.current.strike).toBeNull();
});
