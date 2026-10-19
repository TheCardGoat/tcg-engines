import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import type { LiveBoardCard } from "../board-types";
import type { PlacedCard } from "./layout";
import type { ArenaZone } from "./zones";
import { departingPlacements, useZoneTransitions } from "./useZoneTransitions";

afterEach(cleanup);
afterEach(() => vi.useRealTimers());
const card: LiveBoardCard = {
  instanceId: "one",
  zone: "hand",
  controller: "player-one",
  ready: true,
  faceDown: false,
  definitionId: "known",
  name: "Card",
  clashDamage: 0,
  phaseDamage: 0,
};
const placed: PlacedCard = { card, x: 0, y: -400, z: 85, height: 200, angle: 0, hand: true };
const pile: ArenaZone = {
  id: "player-one:oblivion",
  seat: "player-one",
  zone: "oblivion",
  name: "Oblivion",
  count: 1,
  x: -730,
  y: -300,
  width: 80,
  height: 80,
  captionY: -300,
  scaleX: true,
  counter: true,
};

test("a committed hand-to-accessory move has only its existing destination mesh", () => {
  const next = { ...placed, card: { ...card, zone: "accessory", faceDown: true }, hand: false };
  expect(departingPlacements([placed], [next], [next.card], [pile], 1)).toEqual([]);
});

test("pile departure retains exactly one mesh until its matching arrival", () => {
  const before = { ...placed, card: { ...card, zone: "clash" }, hand: false };
  const after = { ...card, zone: "oblivion" };
  const { result, rerender } = renderHook(
    ({ current, board }) => useZoneTransitions(current, board, [pile], "player-one", 0.8, false),
    { initialProps: { current: [before], board: [before.card] } },
  );
  rerender({ current: [], board: [after] });
  expect(result.current.cards).toHaveLength(1);
  expect(result.current.cards[0]).toMatchObject({ card: after, departing: true, x: -584 });
  act(() => result.current.arrived("one", "accessory"));
  expect(result.current.cards).toHaveLength(1);
  act(() => result.current.arrived("one", "oblivion"));
  expect(result.current.cards).toHaveLength(0);
});

test("a new destination supersedes an unfinished pile flight without a duplicate", () => {
  const { result, rerender } = renderHook(
    ({ current, board }) => useZoneTransitions(current, board, [pile], "player-one", 1, false),
    { initialProps: { current: [placed], board: [card] } },
  );
  rerender({ current: [], board: [{ ...card, zone: "oblivion" }] });
  rerender({ current: [placed], board: [card] });
  expect(result.current.cards).toEqual([placed]);
  act(() => result.current.arrived("one", "oblivion"));
  expect(result.current.cards).toEqual([placed]);
});

test("hidden projection removals do not retain private card artwork", () => {
  expect(departingPlacements([placed], [], [], [pile], 1)).toEqual([]);
  const hidden = { ...card, zone: "oblivion", faceDown: true, definitionId: null, name: null };
  expect(departingPlacements([placed], [], [hidden], [pile], 1)[0].card).toEqual(hidden);
});

test("reduced motion retires a hidden-zone move immediately", () => {
  const { result, rerender } = renderHook(
    ({ current, board }) => useZoneTransitions(current, board, [pile], "player-one", 1, true),
    { initialProps: { current: [placed], board: [card] } },
  );
  rerender({ current: [], board: [{ ...card, zone: "oblivion" }] });
  expect(result.current.cards).toHaveLength(0);
});

test("confirmed damage keeps departing artwork at contact until the number is readable", () => {
  vi.useFakeTimers();
  const before = { ...placed, card: { ...card, zone: "clash" }, hand: false };
  const after = { ...card, zone: "oblivion" };
  const { result, rerender } = renderHook(
    ({ current, board, events }) =>
      useZoneTransitions(current, board, [pile], "player-one", 1, false, events),
    {
      initialProps: {
        current: [before],
        board: [before.card],
        events: [] as { sequence: number; targetId: string; amount: number }[],
      },
    },
  );
  rerender({ current: [], board: [after], events: [{ sequence: 1, targetId: "one", amount: 2 }] });
  expect(result.current.cards[0]).toMatchObject({ x: before.x, y: before.y, departing: false });
  act(() => {
    vi.advanceTimersByTime(1200);
  });
  expect(result.current.cards[0]).toMatchObject({ x: pile.x, departing: true });
});

test("survivors close the gap only after defeated cards arrive, while hands stay live", () => {
  vi.useFakeTimers();
  const defeated = { ...placed, card: { ...card, zone: "clash" }, hand: false };
  const survivor = { ...defeated, x: 180, card: { ...defeated.card, instanceId: "survivor" } };
  const hand = { ...placed, card: { ...card, instanceId: "hand" } };
  const after = { ...card, zone: "oblivion" };
  const { result, rerender } = renderHook(
    ({ current, board, events }) =>
      useZoneTransitions(current, board, [pile], "player-one", 1, false, events),
    {
      initialProps: {
        current: [defeated, survivor, hand],
        board: [defeated.card, survivor.card, hand.card],
        events: [] as { sequence: number; targetId: string; amount: number }[],
      },
    },
  );
  rerender({
    current: [
      { ...survivor, x: 0 },
      { ...hand, x: 120 },
    ],
    board: [after, survivor.card, hand.card],
    events: [{ sequence: 1, targetId: "one", amount: 2 }],
  });
  expect(result.current.cards.find((p) => p.card.instanceId === "hand")?.x).toBe(120);
  act(() => {
    vi.advanceTimersByTime(1200);
  });
  expect(result.current.cards.find((p) => p.card.instanceId === "survivor")?.x).toBe(180);
  expect(result.current.cards.find((p) => p.card.instanceId === "one")?.departing).toBe(true);
  act(() => result.current.arrived("one", "oblivion"));
  expect(result.current.cards.find((p) => p.card.instanceId === "survivor")?.x).toBe(0);
});
