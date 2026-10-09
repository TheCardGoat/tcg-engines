// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { createAlphaClashVisualFixture } from "../../visual-fixtures";
import { useArenaOpening } from "./useArenaOpening";

afterEach(cleanup);

test("opening animation submits the real mulligan after return, then hands off to the same engine", () => {
  const engine = createAlphaClashVisualFixture("opening-preview");
  const execute = vi.fn((id: string, values: InteractionSubmission["values"] = {}) => {
    const view = engine.getInteractionView("human");
    const action = view.actions.find((a) => a.id === id && a.enabled);
    if (!action) return false;
    return engine.submitInteraction(
      "human",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: id,
        values,
      },
      { gameId: "opening-test", sourceAuthority: "server" },
    ).success;
  });
  const handIds = Object.values(engine.state.cards)
    .filter((card) => card.zone === "hand" && card.controller === "player-one")
    .map((card) => card.instanceId);
  const selected = handIds.slice(0, 2);
  const { result } = renderHook(() => useArenaOpening(true, execute));
  act(() => result.current?.keep());
  expect(execute).not.toHaveBeenCalled();
  act(() => result.current?.begin());
  while (result.current?.beat.duration) act(() => result.current?.advance(result.current.beat.id));
  expect(result.current?.beat.id).toBe("hand");
  expect(engine.state.phase.name).toBe("setup");
  expect(execute).not.toHaveBeenCalled();
  act(() => result.current?.redraw(selected, handIds));
  expect(execute).not.toHaveBeenCalled();
  act(() => result.current?.advance("return"));
  expect(execute).not.toHaveBeenCalled();
  act(() => result.current?.advance("reshuffle"));
  expect(execute).toHaveBeenCalledExactlyOnceWith("mulligan", { cardIds: selected });
  for (const id of handIds.slice(2)) expect(engine.state.cards[id].zone).toBe("hand");
  expect(result.current?.retainedIds.size).toBe(6);
  expect(engine.getInteractionView("human").actions.some((a) => a.id === "mulligan")).toBe(false);
  act(() => result.current?.advance("reshuffle"));
  expect(execute).toHaveBeenCalledTimes(1);
  act(() => result.current?.advance("redraw"));
  act(() => {
    result.current?.keep();
    result.current?.keep();
  });
  expect(execute).toHaveBeenCalledTimes(2);
  expect(engine.state.phase.name).toBe("expansion");
  expect(engine.state.turnNumber).toBe(1);
  expect(result.current?.beat.id).toBe("settle");
  act(() => result.current?.advance("settle"));
  expect(result.current).toBeUndefined();
});

test("a rejected native action restores the review instead of presenting a false result", () => {
  const execute = vi.fn(() => false);
  const { result } = renderHook(() => useArenaOpening(true, execute));
  act(() => result.current?.begin());
  while (result.current?.beat.duration) act(() => result.current?.advance(result.current.beat.id));
  act(() => result.current?.keep());
  expect(result.current?.beat.id).toBe("hand");
  act(() => result.current?.redraw(["a"], ["a", "b"]));
  act(() => result.current?.advance("return"));
  act(() => result.current?.advance("reshuffle"));
  expect(result.current?.beat.id).toBe("hand");
  expect(execute.mock.calls).toEqual([["startGame"], ["mulligan", { cardIds: ["a"] }]]);
});

test("WebGL failure cancels a queued redraw without changing the engine", () => {
  const execute = vi.fn(() => true);
  const { result } = renderHook(() => useArenaOpening(true, execute));
  act(() => result.current?.begin());
  while (result.current?.beat.duration) act(() => result.current?.advance(result.current.beat.id));
  act(() => result.current?.redraw(["a"], ["a", "b"]));
  const advance = result.current?.advance;
  act(() => result.current?.cancel());
  act(() => advance?.("reshuffle"));
  expect(result.current).toBeUndefined();
  expect(execute).not.toHaveBeenCalled();
});
