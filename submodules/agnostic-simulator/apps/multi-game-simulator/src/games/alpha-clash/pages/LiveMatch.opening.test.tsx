// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { MantineProvider } from "@mantine/core";
import type { ComponentProps, ReactNode } from "react";
import type Arena from "../components/Arena3D/AlphaClashArena3D";
import { createAlphaClashVisualFixture } from "../visual-fixtures";
import {
  composeDropEligibility,
  unsupportedTimeoutChannel,
  type InteractionSubmission,
} from "@tcg/protocol";
const gateway = vi.hoisted(() => ({
  route: vi.fn(),
  emit: vi.fn(),
  events: new Map<string, (payload: unknown) => void>(),
  auth: () => {},
  disconnect: () => {},
}));
vi.mock("../../../simulator/providers", () => ({ useSimulatorRoute: () => gateway.route() }));
vi.mock("../../../lib/gateway/root-socket", () => ({
  acquireRootGatewayHandle: () => ({
    emit: gateway.emit,
    join: vi.fn(),
    leave: vi.fn(),
    release: vi.fn(),
    wouldHoldEmit: () => false,
    onAuthenticated: (callback: () => void) => {
      gateway.auth = callback;
      callback();
      return () => {};
    },
    onDisconnected: (callback: () => void) => {
      gateway.disconnect = callback;
      return () => {};
    },
    on: (event: string, callback: (payload: unknown) => void) => {
      gateway.events.set(event, callback);
      return () => gateway.events.delete(event);
    },
  }),
}));
vi.mock("../../../simulator/providers/live-chat-context", () => ({
  SimulatorLiveChatProvider: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("../../../simulator/chat/LiveMatchChatPanel", () => ({ LiveMatchChatPanel: () => null }));
vi.mock("../../../simulator/correction/useGameStateCorrection", () => ({
  useGameStateCorrection: () => ({ enabled: false }),
}));
vi.mock("../components/GameStateCorrection", () => ({
  CorrectionBanner: () => null,
  GameStateCorrection: () => null,
}));
vi.mock("../../../simulator/attention/LiveActionAttention", () => ({
  LiveActionAttention: () => null,
}));
vi.mock("../../../simulator/attention/useLiveMatchDocumentTitle", () => ({
  useLiveMatchDocumentTitle: () => {},
}));
vi.mock("../components/useAlphaClashPresentation", () => ({
  useAlphaClashPresentation: () => ({
    busy: false,
    strike: null,
    finishStrike: vi.fn(),
    onSceneAnchors: vi.fn(),
  }),
}));
// Replace WebGL only. The live page, shared board/controller, protocol validation,
// and authoritative native engine remain real.
vi.mock("../components/Arena3D/AlphaClashArena3D", () => ({
  default: ({
    openingScene: opening,
    board,
    viewerSeat,
    disabled,
    controls,
  }: ComponentProps<typeof Arena>) => {
    const hand = board.cards.filter(
      (card) => card.controller === viewerSeat && card.zone === "hand",
    );
    return (
      <>
        <output data-testid="opening">{opening?.beat.id ?? "board"}</output>
        <output data-testid="hand">{hand.map((card) => card.instanceId).join(",")}</output>
        {opening?.beat.duration && (
          <button onClick={() => opening.advance(opening.beat.id)}>Finish motion</button>
        )}
        <button disabled={disabled} onClick={() => opening?.declare(false)}>
          Keep test hand
        </button>
        <button disabled={disabled} onClick={() => opening?.declare(true)}>
          Mulligan test hand
        </button>
        <button
          disabled={disabled}
          onClick={() =>
            opening?.redraw(
              [hand[0].instanceId],
              hand.map((card) => card.instanceId),
              hand,
            )
          }
        >
          Replace test card
        </button>
        <button disabled={disabled} onClick={() => opening?.keep()}>
          Begin test game
        </button>
        {controls}
      </>
    );
  },
}));
import { AlphaClashLiveMatchPage } from "./LiveMatch.page";
beforeEach(() => {
  vi.clearAllMocks();
  gateway.events.clear();
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });
});
afterEach(cleanup);
test("hosted keep/keep starts from the new server action without a reload", async () => {
  const f = fixture();
  await screen.findByTestId("opening");
  f.finish();
  fireEvent.click(screen.getByText("Keep test hand"));
  f.accept();
  expect(
    f.engine.takeAutomatedAction(
      { strategyId: "default" },
      { gameId: f.initial.gameId, sourceAuthority: "server" },
    ).finalResult.success,
  ).toBe(true);
  f.event("state_update", f.payload());
  expect(f.sent.map((submission) => submission.actionId)).toEqual(["startGame"]);
  expect(screen.queryByText(/That action is no longer available/)).toBeNull();
  f.accept();
  f.finish();
  expect(screen.getByTestId("opening").textContent).toBe("board");
});

test("hosted terminal game hides existing and late disconnect claims", async () => {
  const f = fixture("finish-deckout");
  const nowMs = Date.now();
  const eligibility = composeDropEligibility({
    nowMs,
    timeout: unsupportedTimeoutChannel(),
    disconnect: { connected: false, disconnectedAtMs: nowMs - 31_000 },
  });
  const disconnect = { gameId: f.initial.gameId, dropEligibility: eligibility };
  f.event("drop_eligibility", disconnect);
  expect(screen.getByRole("button", { name: "Drop" }).hasAttribute("disabled")).toBe(false);
  expect(
    f.engine.dispatch(
      "endTurn",
      "human",
      {},
      {
        gameId: f.initial.gameId,
        sourceAuthority: "server",
      },
    ).success,
  ).toBe(true);
  f.event("state_update", f.payload());
  await screen.findByTestId("ac-post-game-summary");
  fireEvent.click(screen.getByRole("button", { name: "Inspect board" }));
  expect(screen.queryByRole("button", { name: "Drop" })).toBeNull();
  f.event("drop_eligibility", disconnect);
  f.event("game_joined", { ...f.payload(), ...disconnect });
  expect(screen.queryByText("Opponent disconnected. You can drop them.")).toBeNull();
  expect(screen.queryByRole("button", { name: "Drop" })).toBeNull();
});

function fixture(fixtureId = "opening-preview", seat: 1 | 2 = 1) {
  const engine = createAlphaClashVisualFixture(fixtureId);
  const payload = () => ({
    gameId: "hosted-opening",
    stateVersion: engine.getStateID(),
    state: engine.getViewerState({ role: "player", actorId: seat === 1 ? "human" : "bot" }),
    interactionView: engine.getInteractionView(seat === 1 ? "human" : "bot"),
  });
  const initial = payload();
  gateway.route.mockReturnValue({
    error: null,
    matchPageData: {
      game: {
        gameId: initial.gameId,
        stateVersion: initial.stateVersion,
        view: initial.state,
        interactionView: initial.interactionView,
      },
      viewer: { role: "player", actorId: seat === 1 ? "human" : "bot", seat },
      match: {
        participants: [
          { seat: 1, displayName: "One" },
          { seat: 2, displayName: "Two" },
        ],
      },
      history: { engineLogs: [], chatMessages: [], freeTextEnabled: false },
    },
  });
  const result = render(
    <MantineProvider>
      <AlphaClashLiveMatchPage />
    </MantineProvider>,
  );
  const event = (name: string, value: unknown) => act(() => gateway.events.get(name)?.(value));
  const sent: InteractionSubmission[] = [];
  gateway.emit.mockImplementation((name: string, value: { submission?: InteractionSubmission }) => {
    if (name === "submit_interaction" && value.submission) sent.push(value.submission);
  });
  const accept = () => {
    const submission = sent.shift();
    if (!submission) throw new Error("No submitted opening action");
    expect(
      engine.submitInteraction("human", submission, {
        gameId: initial.gameId,
        sourceAuthority: "server",
      }).success,
    ).toBe(true);
    event("state_update", payload());
  };
  const finish = () => {
    let n = 0;
    while (screen.queryByText("Finish motion")) {
      if (++n > 12) throw new Error("Motion loop");
      fireEvent.click(screen.getByText("Finish motion"));
    }
  };
  return { engine, payload, initial, result, event, accept, sent, finish };
}
test("live opening waits for acceptance, handles rejection, duplicates, reconnect and turn-one resume", async () => {
  const f = fixture();
  await screen.findByTestId("opening");
  f.finish();
  expect(screen.queryByText("Available actions")).toBeNull();
  fireEvent.click(screen.getByText("Mulligan test hand"));
  expect(f.sent).toHaveLength(1);
  fireEvent.click(screen.getByText("Mulligan test hand"));
  expect(f.sent).toHaveLength(1);
  f.event("move_rejected", { gameId: "hosted-opening", reason: "Retry this choice" });
  expect(screen.getByText("Retry this choice")).toBeTruthy();
  f.sent.length = 0;
  fireEvent.click(screen.getByText("Mulligan test hand"));
  f.accept();
  expect(
    f.engine.takeAutomatedAction(
      { strategyId: "default" },
      { gameId: "hosted-opening", sourceAuthority: "server" },
    ).finalResult.success,
  ).toBe(true);
  f.event("state_update", f.payload());
  const before = screen.getByTestId("hand").textContent;
  fireEvent.click(screen.getByText("Replace test card"));
  expect(screen.getByTestId("opening").textContent).toBe("hand");
  expect(screen.getByTestId("hand").textContent).toBe(before);
  f.accept();
  expect(screen.getByTestId("opening").textContent).toBe("return");
  f.finish();
  f.event("move_accepted", f.payload());
  expect(screen.getByTestId("opening").textContent).toBe("hand");
  f.event("state_update", f.initial);
  expect(screen.getByTestId("hand").textContent).not.toBe(before);
  expect(f.sent).toHaveLength(1);
  expect(f.sent[0].actionId).toBe("startGame");
  // The connection drops before this automatic request is accepted.
  f.sent.length = 0;
  act(() => gateway.disconnect());
  expect(f.sent).toHaveLength(0);
  act(() => gateway.auth());
  f.event("state_sync", f.payload());
  expect(screen.getByTestId("opening").textContent).toBe("hand");
  expect(f.sent).toHaveLength(1);
  expect(f.sent[0].actionId).toBe("startGame");
  f.accept();
  f.finish();
  expect(screen.getByTestId("opening").textContent).toBe("board");
  f.event("state_sync", f.payload());
  expect(screen.getByTestId("opening").textContent).toBe("board");
});

test("a direct replacement choice submits its redraw against the newly accepted projection", () => {
  const f = fixture();
  f.finish();
  fireEvent.click(screen.getByText("Replace test card"));
  expect(f.sent[0]?.actionId).toBe("declareMulligan:take");
  f.accept();
  expect(
    f.engine.takeAutomatedAction(
      { strategyId: "default" },
      { gameId: "hosted-opening", sourceAuthority: "server" },
    ).finalResult.success,
  ).toBe(true);
  f.event("state_update", f.payload());
  expect(f.sent).toHaveLength(1);
  expect(f.sent[0]?.actionId).toBe("mulligan");
  expect(f.sent[0]?.stateVersion).toBe(f.payload().interactionView.stateVersion);
  f.accept();
  expect(screen.getByTestId("opening").textContent).toBe("return");
});

test.each([1, 2] as const)(
  "hosted seat %s sees the native ending and can inspect/reopen after reconnect",
  async (seat) => {
    const f = fixture("finish-deckout", seat);
    expect(screen.queryByTestId("ac-post-game-summary")).toBeNull();
    expect(
      f.engine.dispatch(
        "endTurn",
        "human",
        {},
        { gameId: f.initial.gameId, sourceAuthority: "server" },
      ).success,
    ).toBe(true);
    f.event("state_update", f.payload());
    const modal = await screen.findByTestId("ac-post-game-summary");
    expect(modal.getAttribute("data-end-reason")).toBe("decked");
    expect(screen.getByTestId("post-game-headline").textContent).toBe(
      seat === 1 ? "Victory" : "Defeat",
    );
    expect(screen.getByTestId("post-game-reason").textContent).toBe(
      seat === 1 ? "Opponent could not draw a card" : "You could not draw a card",
    );
    expect(screen.getByRole("button", { name: "Finalizing match" }).hasAttribute("disabled")).toBe(
      true,
    );
    fireEvent.click(screen.getByRole("button", { name: "Inspect board" }));
    expect(screen.queryByTestId("ac-post-game-summary")).toBeNull();
    act(() => gateway.disconnect());
    act(() => gateway.auth());
    f.event("state_sync", { ...f.payload(), stateVersion: f.payload().stateVersion + 1 });
    expect(screen.queryByTestId("ac-post-game-summary")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "View summary" }));
    expect(screen.getByTestId("ac-post-game-summary")).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("button", { name: "Inspect board" }), { key: "Escape" });
    expect(screen.queryByTestId("ac-post-game-summary")).toBeNull();
    expect(screen.getByRole("button", { name: "View summary" })).toBe(document.activeElement);
    expect(screen.getByRole("button", { name: "Keep test hand" }).hasAttribute("disabled")).toBe(
      true,
    );

    const route = gateway.route();
    route.matchPageData.match.status = "completed";
    f.result.rerender(
      <MantineProvider>
        <AlphaClashLiveMatchPage />
      </MantineProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "View summary" }));
    expect(screen.queryByRole("button", { name: "Finalizing match" })).toBeNull();
    expect(screen.getByRole("link", { name: "Back to lobby" }).getAttribute("href")).toBe(
      "/alpha-clash/matchmaking",
    );

    route.matchPageData.match.matchId = "series-1";
    route.session = { phase: "finished", match: { currentGameId: "next-game" } };
    f.result.rerender(
      <MantineProvider>
        <AlphaClashLiveMatchPage />
      </MantineProvider>,
    );
    expect(screen.getByRole("link", { name: "Continue to next game" }).getAttribute("href")).toBe(
      "/alpha-clash/simulator/matches/series-1/games/next-game?returnTo=%2Falpha-clash%2Fmatchmaking",
    );
  },
);

test.each([
  ["Undo", "last_move"],
  ["Undo turn", "turn_start"],
])(
  "hosted %s submits its explicit approval scope without mutating locally",
  async (label, scope) => {
    const f = fixture("board-actions");
    await screen.findByTestId("opening");
    f.finish();
    expect(
      f.engine.dispatch(
        "activatePortal",
        "human",
        {},
        { gameId: f.initial.gameId, sourceAuthority: "server" },
      ).success,
    ).toBe(true);
    f.event("state_update", {
      ...f.payload(),
      undoable: f.engine.canUndo("human"),
      undoTurnAvailable: f.engine.canUndoToTurnStart("human"),
    });
    f.finish();
    const before = structuredClone(f.engine.state);
    const button = screen.getByRole("button", { name: label });
    expect(button.hasAttribute("disabled")).toBe(false);
    fireEvent.click(button);
    expect(gateway.emit).toHaveBeenCalledWith("proposal_send", {
      gameId: f.initial.gameId,
      actionType: "undo",
      undoScope: scope,
    });
    expect(f.engine.state).toEqual(before);
    expect(f.sent).toHaveLength(0);
  },
);
