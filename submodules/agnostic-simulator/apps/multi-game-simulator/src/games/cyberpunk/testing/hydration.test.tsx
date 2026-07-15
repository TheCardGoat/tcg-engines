// @vitest-environment jsdom

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import type { EngineInteractionView } from "@tcg/protocol";
import { act, type ReactElement } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, test, vi } from "vite-plus/test";

import { CardPreviewProvider } from "../components/CardPreview/CardPreviewContext";
import { PassTurnControl } from "../components/GameBoard";
import { GameStateContext, type GameState } from "../components/GameBoard/gameStateContext";
import { getScenario, PLAYER_SIDE_TO_ID, UserConfigProvider, type MoveLog } from "../engine";
import { EngineContext } from "../engine/engineContext";
import type { EngineContextValue } from "../engine/EngineProvider";
import { BoardSharedPage } from "../pages/BoardShared.page";
import { theme } from "../theme";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return {
    ...actual,
    CyberpunkSharedAnimationLayer: ({ children }: { children: React.ReactNode }) => children,
  };
});

function buildUndoablePassTurnControl(): ReactElement {
  const engine = getScenario("gameStart").build();
  const matchState = engine.getState();
  const interactionView: EngineInteractionView = {
    protocolVersion: 1,
    gameSlug: "cyberpunk",
    actorId: "player",
    stateVersion: matchState.ctx.stateID,
    status: "idle",
    actions: [],
  };
  const gameState: GameState = {
    activeSide: "player",
    prioritySide: "player",
    phase: "MAIN",
    gameEnded: false,
    overtimeActive: false,
    winnerSide: null,
    winReason: null,
    turnNumber: matchState.G.turnMetadata.turnNumber,
    advancePhase: vi.fn(),
  };
  const engineContext: EngineContextValue = {
    scenarioId: "gameStart",
    setScenario: vi.fn(),
    resetScenario: vi.fn(),
    matchState,
    prompts: {
      player: { status: "idle", availableMoves: [], choice: null },
      opponent: { status: "idle", availableMoves: [], choice: null },
    },
    interactionViews: {
      player: interactionView,
      opponent: { ...interactionView, actorId: "opponent" },
    },
    activeSide: "player",
    prioritySide: "player",
    humanSide: "player",
    aiStrategies: { player: null, opponent: null },
    aiMode: "step",
    aiSpeed: "balanced",
    lastAiError: null,
    aiTakeover: null,
    eventLog: [],
    moveLogs: [],
    rawEngineEvents: [],
    canUndo: true,
    canUndoToTurnStart: true,
    canResetScenario: true,
    chatMessages: [],
    canSendChat: true,
    freeTextEnabled: false,
    freeTextProposalPending: false,
    canRequestFreeText: false,
    sendChatPreset: vi.fn(),
    sendChatText: vi.fn(),
    requestFreeTextChat: vi.fn(() => false),
    setHumanSide: vi.fn(),
    toggleHumanSide: vi.fn(),
    setStrategy: vi.fn(),
    takeOverAiSide: vi.fn(() => false),
    releaseAiTakeover: vi.fn(() => false),
    setAiMode: vi.fn(),
    setAiSpeed: vi.fn(),
    stepOnce: vi.fn(),
    clearLog: vi.fn(),
    clearRawEngineEvents: vi.fn(),
    postGameSurface: "default",
    effectCardTargetSelection: null,
    toggleEffectCardTarget: vi.fn(() => false),
    submitEffectCardTargets: vi.fn(() => false),
    dispatch: vi.fn(() => ({ success: false as const, error: "test dispatch" })),
    isRemote: false,
    hasPendingRemoteMove: false,
  };

  return (
    <EngineContext.Provider value={engineContext}>
      <GameStateContext.Provider value={gameState}>
        <PassTurnControl docked />
      </GameStateContext.Provider>
    </EngineContext.Provider>
  );
}

describe("Cyberpunk simulator hydration", () => {
  test("keeps phase undo disabled in SSR markup even when engine history is undoable", () => {
    const html = renderToString(buildUndoablePassTurnControl());

    expect(html).toMatch(/<button[^>]*data-testid="phase-undo"[^>]*disabled=""/);
    expect(html).toContain('aria-label="No undoable move available"');
  });

  test("hydrates phase undo without a disabled attribute mismatch when history is undoable", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(buildUndoablePassTurnControl());
    document.body.append(container);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    let root: Root | null = null;

    await act(async () => {
      root = hydrateRoot(container, buildUndoablePassTurnControl());
      await Promise.resolve();
    });

    const hydrationErrors = errorSpy.mock.calls.filter((args) =>
      args.some(
        (arg) =>
          typeof arg === "string" &&
          (arg.includes("hydration-mismatch") ||
            arg.includes("didn't match the client properties") ||
            arg.includes("did not match")),
      ),
    );

    expect(hydrationErrors).toEqual([]);

    await act(async () => {
      root?.unmount();
    });
    errorSpy.mockRestore();
    container.remove();
  });

  test("renders remote undo disabled in SSR markup until client effects hydrate history controls", () => {
    const remoteMoveLogs: MoveLog[] = [
      {
        type: "turnStarted",
        timestamp: 0,
        playerId: PLAYER_SIDE_TO_ID.player,
        turnNumber: 1,
      },
    ];

    const html = renderToString(
      <MantineProvider theme={theme} env="test">
        <Notifications position="top-right" />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="gameStart"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
              remoteMoveLogs={remoteMoveLogs}
              remoteDispatch={() => true}
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>,
    );

    expect(html).toContain('data-testid="phase-undo"');
    expect(html).toMatch(/<button[^>]*data-testid="phase-undo"[^>]*disabled=""/);
  });
});
