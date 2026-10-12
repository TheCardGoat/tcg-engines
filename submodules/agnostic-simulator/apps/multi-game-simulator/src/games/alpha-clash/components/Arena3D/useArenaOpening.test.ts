// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { createAlphaClashVisualFixture } from "../../visual-fixtures";
import { useArenaOpening, type OpeningOptions } from "./useArenaOpening";
import type { AcSeat } from "../board-types";

afterEach(cleanup);
function harness() {
  const engine = createAlphaClashVisualFixture("opening-preview");
  let actor = "human";
  let resetKey = 0;
  let disconnected = false;
  const submissions: { actor: string; submission: InteractionSubmission }[] = [];
  const submit = vi.fn((submission: InteractionSubmission) => {
    submissions.push({ actor, submission });
    return true;
  });
  const options = (): OpeningOptions => {
    const board = engine.getViewerState({ role: "player", actorId: actor });
    return {
      board: {
        cards: board.cards,
        players: board.players,
        activePlayer: board.activePlayer,
        decisionSeat: board.decisionSeat,
        phaseName: board.phase.name,
        openingHandsReady: board.mulligan.resolved,
        openingState: board.mulligan,
        turnNumber: board.turnNumber,
        portalOpen: board.portalOpen,
        clash: board.clash,
        standbyCount: board.standby.length,
      },
      viewerSeat: actor === "human" ? "player-one" : "player-two",
      view: engine.getInteractionView(actor),
      submit,
      resetKey,
      disabled: disconnected,
    };
  };
  const hook = renderHook((props: OpeningOptions) => useArenaOpening(props), {
    initialProps: options(),
  });
  const refresh = () => hook.rerender(options());
  const native = (who: string, id: string, values: InteractionSubmission["values"] = {}) => {
    const view = engine.getInteractionView(who);
    const action = view.actions.find((entry) => entry.id === id && entry.enabled);
    if (!action) throw new Error(`Missing native action ${who}: ${id}`);
    expect(
      engine.submitInteraction(
        who,
        {
          protocolVersion: INTERACTION_PROTOCOL_VERSION,
          stateVersion: view.stateVersion,
          requestId: action.requestId,
          actionId: id,
          values,
        },
        { gameId: "opening-test", sourceAuthority: "server" },
      ).success,
    ).toBe(true);
  };
  const finish = () => {
    let steps = 0;
    while (hook.result.current?.beat.duration) {
      if (++steps > 12) throw new Error("Opening animation did not finish");
      act(() => hook.result.current?.advance(hook.result.current.beat.id));
    }
  };
  const accept = () => {
    const request = submissions.shift();
    if (!request) throw new Error("No pending submission");
    expect(
      engine.submitInteraction(request.actor, request.submission, {
        gameId: "opening-test",
        sourceAuthority: "server",
      }).success,
    ).toBe(true);
    refresh();
  };
  const hand = (seat: AcSeat = "player-one") =>
    options().board.cards.filter((card) => card.controller === seat && card.zone === "hand");
  return {
    engine,
    hook,
    options,
    refresh,
    native,
    finish,
    accept,
    hand,
    submit,
    switchTo: (who: string) => {
      actor = who;
      refresh();
    },
    resync: () => {
      resetKey++;
      refresh();
    },
    disconnect: () => {
      disconnected = true;
      resetKey++;
      refresh();
    },
    reconnect: () => {
      disconnected = false;
      resetKey++;
      refresh();
    },
  };
}

test("fresh setup animates automatically; keep waits for confirmed state and enters turn one", () => {
  const h = harness();
  expect(h.hook.result.current?.beat.id).toBe("contenders");
  h.finish();
  expect(h.hook.result.current?.beat.id).toBe("hand");
  act(() => {
    h.hook.result.current?.declare(false);
    h.hook.result.current?.declare(false);
  });
  expect(h.submit).toHaveBeenCalledTimes(1);
  expect(h.hook.result.current?.pending).toBe(true);
  expect(h.engine.state.mulliganDeclarations["player-one"]).toBeUndefined();
  h.accept();
  h.native("bot", "declareMulligan:keep");
  h.refresh();
  expect(h.submit.mock.lastCall?.[0].actionId).toBe("startGame");
  expect(h.hook.result.current?.beat.id).toBe("hand");
  h.accept();
  expect(h.engine.state.phase.name).toBe("expansion");
  expect(h.hook.result.current?.beat.id).toBe("settle");
  h.finish();
  expect(h.hook.result.current).toBeUndefined();
});

test("replacement uses native acceptance, retains other cards, and ignores duplicate updates", () => {
  const h = harness();
  h.finish();
  act(() => h.hook.result.current?.declare(true));
  h.accept();
  h.native("bot", "declareMulligan:keep");
  h.refresh();
  const hand = h.hand();
  const selected = hand.slice(0, 2).map((card) => card.instanceId);
  act(() =>
    h.hook.result.current?.redraw(
      selected,
      hand.map((card) => card.instanceId),
      hand,
    ),
  );
  expect(h.hook.result.current?.beat.id).toBe("hand");
  expect(h.hook.result.current?.outgoingHand).toBeUndefined();
  h.accept();
  expect(h.hook.result.current?.beat.id).toBe("return");
  expect(h.hook.result.current?.outgoingHand?.cards).toEqual(hand);
  expect(h.hook.result.current?.retainedIds.size).toBe(6);
  expect(h.submit).toHaveBeenCalledTimes(2);
  act(() => h.hook.result.current?.advance("return"));
  act(() => h.hook.result.current?.advance("reshuffle"));
  expect(h.submit).toHaveBeenCalledTimes(2);
  expect(h.hook.result.current?.beat.id).toBe("redraw");
  h.finish();
  h.refresh();
  h.refresh();
  expect(h.hook.result.current?.beat.id).toBe("hand");
  expect(h.hook.result.current?.outgoingHand).toBeUndefined();
  expect(h.submit).toHaveBeenCalledTimes(3);
  expect(h.submit.mock.lastCall?.[0].actionId).toBe("startGame");
  h.accept();
  expect(h.hook.result.current?.beat.id).toBe("settle");
  h.finish();
  expect(h.hook.result.current).toBeUndefined();
  expect(h.engine.state.phase.name).toBe("expansion");
});

test("one replacement choice waits for declarations, then sends the selected native redraw once", () => {
  const h = harness();
  h.finish();
  const hand = h.hand();
  const selected = hand.slice(0, 2).map((card) => card.instanceId);
  act(() => {
    h.hook.result.current?.redraw(
      selected,
      hand.map((card) => card.instanceId),
      hand,
    );
    h.hook.result.current?.redraw(
      selected,
      hand.map((card) => card.instanceId),
      hand,
    );
  });
  expect(h.submit).toHaveBeenCalledTimes(1);
  expect(h.submit.mock.calls[0][0].actionId).toBe("declareMulligan:take");
  h.accept();
  expect(h.hook.result.current?.pending).toBe(true);
  expect(h.submit).toHaveBeenCalledTimes(1);
  h.native("bot", "declareMulligan:keep");
  h.refresh();
  expect(h.submit).toHaveBeenCalledTimes(2);
  expect(h.submit.mock.calls[1][0]).toMatchObject({
    actionId: "mulligan",
    values: { cardIds: selected },
  });
  h.refresh();
  expect(h.submit).toHaveBeenCalledTimes(2);
  h.accept();
  expect(h.engine.state.mulligansResolved).toBe(true);
  expect(h.hook.result.current?.beat.id).toBe("return");
  expect(h.hook.result.current?.retainedIds.size).toBe(6);
});

test("a rejected direct replacement releases the choice for retry", () => {
  const h = harness();
  h.finish();
  const hand = h.hand();
  h.submit.mockReturnValueOnce(false);
  act(() =>
    h.hook.result.current?.redraw(
      [hand[0].instanceId],
      hand.map((card) => card.instanceId),
      hand,
    ),
  );
  expect(h.hook.result.current?.pending).toBe(false);
  act(() =>
    h.hook.result.current?.redraw(
      [hand[0].instanceId],
      hand.map((card) => card.instanceId),
      hand,
    ),
  );
  expect(h.submit).toHaveBeenCalledTimes(2);
  expect(h.hook.result.current?.pending).toBe(true);
});

test("a rejected queued redraw leaves the native selection available for retry", () => {
  const h = harness();
  h.finish();
  const hand = h.hand();
  const selected = [hand[0].instanceId];
  act(() =>
    h.hook.result.current?.redraw(
      selected,
      hand.map((card) => card.instanceId),
      hand,
    ),
  );
  h.accept();
  h.submit.mockReturnValueOnce(false);
  h.native("bot", "declareMulligan:keep");
  h.refresh();
  expect(h.hook.result.current?.pending).toBe(false);
  expect(h.hook.result.current?.outgoingHand).toBeUndefined();
  act(() =>
    h.hook.result.current?.redraw(
      selected,
      hand.map((card) => card.instanceId),
      hand,
    ),
  );
  expect(h.submit).toHaveBeenCalledTimes(3);
  expect(h.submit.mock.calls[2][0]).toMatchObject({
    actionId: "mulligan",
    values: { cardIds: selected },
  });
});

test.each(["resync", "switch seat", "cancel"])("%s discards a queued replacement", (operation) => {
  const h = harness();
  h.finish();
  const hand = h.hand();
  act(() =>
    h.hook.result.current?.redraw(
      [hand[0].instanceId],
      hand.map((card) => card.instanceId),
      hand,
    ),
  );
  h.accept();
  if (operation === "resync") h.resync();
  else if (operation === "switch seat") h.switchTo("bot");
  else act(() => h.hook.result.current?.cancel());
  h.native("bot", "declareMulligan:keep");
  h.switchTo("human");
  expect(h.submit).toHaveBeenCalledTimes(1);
  expect(h.hook.result.current?.pending).toBe(false);
  expect(h.hook.result.current?.outgoingHand).toBeUndefined();
});

test("rejection releases the pending lock without a replacement animation", () => {
  const h = harness();
  h.finish();
  h.submit.mockReturnValueOnce(false);
  act(() => h.hook.result.current?.declare(true));
  expect(h.hook.result.current?.pending).toBe(false);
  act(() => h.hook.result.current?.declare(true));
  expect(h.hook.result.current?.pending).toBe(true);
  h.resync();
  expect(h.hook.result.current?.pending).toBe(false);
  expect(h.hook.result.current?.beat.id).toBe("hand");
});

test("disconnect disables commands and reconnect restores current setup without replay", () => {
  const h = harness();
  h.finish();
  act(() => h.hook.result.current?.declare(false));
  h.disconnect();
  act(() => h.hook.result.current?.declare(false));
  expect(h.submit).toHaveBeenCalledTimes(1);
  h.accept();
  h.reconnect();
  expect(h.hook.result.current?.beat.id).toBe("hand");
  expect(h.hook.result.current?.pending).toBe(false);
  act(() => h.hook.result.current?.declare(false));
  expect(h.submit).toHaveBeenCalledTimes(1);
});

test("reloading after a declaration resumes review; joining turn one skips opening", () => {
  const h = harness();
  h.native("human", "declareMulligan:take");
  h.hook.unmount();
  const resumed = renderHook(() => useArenaOpening(h.options()));
  expect(resumed.result.current?.beat.id).toBe("hand");
  resumed.unmount();
  h.native("bot", "declareMulligan:keep");
  h.native("human", "mulligan", { cardIds: [] });
  h.native("human", "startGame");
  const joined = renderHook(() => useArenaOpening(h.options()));
  expect(joined.result.current).toBeUndefined();
  expect(h.submit).not.toHaveBeenCalled();
});

test("two players replace privately; switching seats never renders the other hand snapshot", () => {
  const h = harness();
  h.finish();
  act(() => h.hook.result.current?.declare(true));
  h.accept();
  h.switchTo("bot");
  act(() => h.hook.result.current?.declare(true));
  h.accept();
  h.switchTo("human");
  const first = h.hand();
  act(() =>
    h.hook.result.current?.redraw(
      [first[0].instanceId],
      first.map((card) => card.instanceId),
      first,
    ),
  );
  h.accept();
  expect(h.engine.state.mulligansResolved).toBe(false);
  expect(h.hook.result.current?.outgoingHand).toBeUndefined();
  h.switchTo("bot");
  const second = h.hand("player-two");
  act(() =>
    h.hook.result.current?.redraw(
      [second[0].instanceId],
      second.map((card) => card.instanceId),
      second,
    ),
  );
  h.accept();
  expect(h.hook.result.current?.outgoingHand?.seat).toBe("player-two");
  h.switchTo("human");
  expect(h.hook.result.current?.outgoingHand?.seat).toBe("player-one");
  h.finish();
  h.switchTo("bot");
  h.finish();
  h.switchTo("human");
  expect(h.hook.result.current?.beat.id).toBe("hand");
  expect(h.hook.result.current?.outgoingHand).toBeUndefined();
});

test("renderer recovery cancels motion, preserves setup, and does not resubmit", () => {
  const h = harness();
  act(() => h.hook.result.current?.cancel());
  expect(h.hook.result.current?.beat.id).toBe("hand");
  expect(h.submit).not.toHaveBeenCalled();
});
