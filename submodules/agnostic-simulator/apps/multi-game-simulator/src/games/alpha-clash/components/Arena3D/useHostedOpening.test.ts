// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { finishMatchIntro } from "@tcg/shared/match-intro";
import { createAlphaClashVisualFixture } from "../../visual-fixtures";
import { useArenaOpening } from "./useArenaOpening";
import { useHostedOpening } from "./useHostedOpening";

vi.mock("@tcg/shared/match-intro", () => ({ finishMatchIntro: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  delete document.documentElement.dataset.tcgMatchIntro;
});

function harness(ready = true) {
  const engine = createAlphaClashVisualFixture("opening-preview");
  const projected = engine.getViewerState({ role: "player", actorId: "human" });
  const board = {
    cards: projected.cards,
    players: projected.players,
    activePlayer: projected.activePlayer,
    turnNumber: projected.turnNumber,
    portalOpen: projected.portalOpen,
    clash: projected.clash,
    phaseName: projected.phase.name,
    standbyCount: projected.standby.length,
    openingState: projected.mulligan,
    openingHandsReady: projected.mulligan.resolved,
  };
  const submit = vi.fn(() => true);
  const hook = renderHook(
    ({ ready }) => {
      const opening = useArenaOpening({
        board,
        viewerSeat: "player-one",
        view: engine.getInteractionView("human"),
        submit,
      });
      return useHostedOpening(board, "player-one", ready, opening, { p1: "Nova", p2: "Atlas" });
    },
    { initialProps: { ready } },
  );
  return { ...hook, engine, submit };
}

test("the matchmaking cover pauses the native controller, then reveals artwork and the full deal", () => {
  document.documentElement.dataset.tcgMatchIntro = "holding";
  const { result, rerender, engine, submit } = harness(false);
  const before = JSON.stringify(engine.state);
  expect(result.current?.beat.id).toBe("ready");
  expect(result.current?.pending).toBe(true);
  expect(finishMatchIntro).not.toHaveBeenCalled();
  act(() => result.current?.advance("contenders"));
  rerender({ ready: true });
  const presentation = vi.mocked(finishMatchIntro).mock.calls[0]?.[0];
  expect(presentation?.players?.map((player) => player.name)).toEqual(["Nova", "Atlas"]);
  expect(
    presentation?.players?.every((player) =>
      player.artwork?.startsWith("https://cdn.tcg.online/public/alpha-clash/cards/"),
    ),
  ).toBe(true);
  act(() => presentation?.onReveal?.(true));
  expect(result.current?.beat.id).toBe("contenders");
  for (const id of ["contenders", "dock", "shuffle", "deal"]) {
    expect(result.current?.beat.id).toBe(id);
    act(() => result.current?.advance(id));
  }
  expect(result.current?.beat.id).toBe("hand");
  expect(result.current?.pending).toBe(false);
  expect(submit).not.toHaveBeenCalled();
  expect(JSON.stringify(engine.state)).toBe(before);
  expect(finishMatchIntro).toHaveBeenCalledTimes(1);
});

test.each(["skip", "reduced motion", "timeout"])(
  "%s reveals the native hand without submitting an action",
  () => {
    document.documentElement.dataset.tcgMatchIntro = "holding";
    const { result, submit } = harness();
    act(() => vi.mocked(finishMatchIntro).mock.calls[0]?.[0]?.onReveal?.(false));
    expect(result.current?.beat.id).toBe("hand");
    expect(result.current?.pending).toBe(false);
    expect(submit).not.toHaveBeenCalled();
  },
);

test("without a matchmaking cover, the native opening continues unchanged", () => {
  const { result } = harness();
  act(() => vi.mocked(finishMatchIntro).mock.calls[0]?.[0]?.onReveal?.(false));
  expect(result.current?.beat.id).toBe("contenders");
  act(() => result.current?.advance("contenders"));
  expect(result.current?.beat.id).toBe("dock");
});
