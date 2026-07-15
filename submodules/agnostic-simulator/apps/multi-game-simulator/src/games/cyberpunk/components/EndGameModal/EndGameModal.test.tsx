// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { EndGameModal } from "./EndGameModal";

const mocks = vi.hoisted(() => {
  const playCue = vi.fn();
  const gameState = {
    activeSide: "player",
    prioritySide: "player",
    phase: "main",
    gameEnded: true,
    overtimeActive: false,
    winnerSide: "player",
    winReason: "gig_victory",
    turnNumber: 7,
    advancePhase: vi.fn(),
  };
  const engine = {
    humanSide: "player",
    resetScenario: vi.fn(),
    canResetScenario: true,
    isRemote: false,
    remoteReturnUrl: null,
    postGameContext: null,
    postGameSurface: "deck-builder-practice",
    matchState: {
      ctx: {
        playerIds: ["player-1", "player-2"],
        stateID: 42,
      },
    },
  };

  return { engine, gameState, playCue };
});

vi.mock("../../engine", () => ({
  PLAYER_SIDE_TO_ID: {
    player: "player-1",
    opponent: "player-2",
  },
  useEngine: () => mocks.engine,
}));

vi.mock("../GameBoard/gameStateContext", () => ({
  useGameState: () => mocks.gameState,
}));

vi.mock("../../../../simulator/audio", () => ({
  useSimulatorAudio: () => ({
    playCue: mocks.playCue,
    scheduleAnimationSteps: vi.fn(),
    cancelScheduledCues: vi.fn(),
  }),
}));

vi.mock("@tcg/simulator-ui", () => ({
  PostGameModal: ({ actions }: { actions?: React.ReactNode }) => (
    <div data-testid="post-game-modal">{actions}</div>
  ),
}));

describe("EndGameModal", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("plays the win cue once when the player wins a finished game", () => {
    const view = render(<EndGameModal />);

    expect(mocks.playCue).toHaveBeenCalledTimes(1);
    expect(mocks.playCue).toHaveBeenCalledWith("game.win");

    view.rerender(<EndGameModal />);

    expect(mocks.playCue).toHaveBeenCalledTimes(1);
  });
});
