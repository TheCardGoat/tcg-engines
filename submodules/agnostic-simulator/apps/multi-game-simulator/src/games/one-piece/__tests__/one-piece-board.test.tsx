// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createMatch, createSt01MirrorPracticeConfig } from "@tcg/op-engine/practice-st01";

import { OnePieceSimulatorProviders } from "../App.tsx";
import { OnePieceSimulatorShell } from "../components/OnePieceSimulatorShell.tsx";
import {
  buildDefaultOnePieceBoard,
  buildOnePieceBoardFromState,
  buildOnePieceBoardFromFixture,
} from "../data/projectVisualFixture.ts";
import { getOnePieceVisualFixture } from "../data/visualFixtures.ts";
import { OnePieceFixtureIndexPage, OnePieceFixturePage } from "../pages/FixtureRoutes.page.tsx";
import { OnePiecePracticePage } from "../pages/Practice.page.tsx";
import { installBrowserShims } from "../../../testing/browser-shims.ts";

describe("One Piece simulator board prototype", () => {
  beforeEach(() => {
    installBrowserShims();
    window.history.pushState({}, "", "/");
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
  });

  afterEach(() => {
    cleanup();
    window.history.pushState({}, "", "/");
  });

  it("renders the simulator index page at /one-piece/simulator", async () => {
    renderOnePieceRoutes("/one-piece/simulator");

    expect(await screen.findByTestId("one-piece-shell")).not.toBeNull();
    expect(screen.getByTestId("one-piece-tabletop-board")).not.toBeNull();
    expect(screen.getByTestId("one-piece-phase-ribbon").textContent).toContain("Setup");
    expect(screen.getByTestId("player-life").textContent).toContain("5");
    expect(screen.getByTestId("player-don-area").textContent).toContain("0/10");
    expect(screen.getByTestId("player-don-area").textContent).toContain("Deck 10");
    expect(screen.getByTestId("player-character-area").textContent).not.toContain("No characters");
    expect(screen.getByTestId("player-trash-stack").textContent).toContain("0");
    expect(screen.getByTestId("one-piece-jo-ken-po-modal")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Rock" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Paper" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Scissors" })).not.toBeNull();
  });

  it("mounts the dev fixture index and fixture route", async () => {
    renderOnePieceRoutes("/one-piece/simulator/tests");

    expect(await screen.findByTestId("one-piece-fixture-index")).not.toBeNull();
    expect(screen.getByText("Main phase reference")).not.toBeNull();
    const fixturePath = screen.getByText("/one-piece/simulator/tests/main-phase-reference");
    expect(fixturePath).not.toBeNull();
    expect(fixturePath.closest("a")?.getAttribute("href")).toBe(
      "/one-piece/simulator/tests/main-phase-reference",
    );

    cleanup();
    renderOnePieceRoutes("/one-piece/simulator/tests/main-phase-reference");

    expect(await screen.findByTestId("one-piece-shell")).not.toBeNull();
    expect(screen.getByTestId("one-piece-tabletop-board")).not.toBeNull();
  });

  it("renders a 404 for an unknown visual fixture id", async () => {
    renderOnePieceRoutes("/one-piece/simulator/tests/nope");

    expect(await screen.findByTestId("one-piece-fixture-not-found")).not.toBeNull();
    expect(screen.getByText("Fixture not found.")).not.toBeNull();
  });

  it("renders both player halves and the required tabletop zones", () => {
    const { container } = renderShell();

    expect(screen.getByTestId("one-piece-tabletop-board")).not.toBeNull();
    expect(screen.getByTestId("one-piece-phase-ribbon").textContent).toContain("Main Phase");
    expect(
      screen.getByTestId("one-piece-phase-ribbon").getAttribute("data-turn-indicator-variant"),
    ).toBe("ribbon");

    expect(screen.getByTestId("opponent-hand")).not.toBeNull();
    expect(screen.getByTestId("player-hand")).not.toBeNull();
    expect(container.querySelector(".compact-hand-zone")).toBeNull();
    expect(screen.getByTestId("opponent-character-area")).not.toBeNull();
    expect(screen.getByTestId("player-character-area")).not.toBeNull();
    expect(container.querySelector("[data-zone-layout='row']")).not.toBeNull();
    expect(screen.getByTestId("opponent-life").textContent).toContain("5");
    expect(screen.getByTestId("player-life").textContent).toContain("5");
    expect(screen.getByTestId("opponent-command-rail")).not.toBeNull();
    expect(screen.getByTestId("player-command-rail")).not.toBeNull();
    expect(screen.getByTestId("opponent-leader-command")).not.toBeNull();
    expect(screen.getByTestId("player-leader-command")).not.toBeNull();
    expect(screen.getByTestId("opponent-don-area").textContent).toContain("1/10");
    expect(screen.getByTestId("player-don-area").textContent).toContain("2/10");
    expect(screen.getByTestId("player-don-area").textContent).toContain("Active DON!! 1");
    expect(screen.getByTestId("player-don-area").textContent).toContain("Rested DON!! 1");
    expect(
      screen.getByTestId("player-don-area").querySelectorAll("[aria-label^='Active DON ']"),
    ).toHaveLength(1);
    expect(
      screen.getByTestId("player-don-area").querySelectorAll("[aria-label^='Rested DON ']"),
    ).toHaveLength(1);

    expect(container.querySelector("[data-zone-id='opponent-leader']")).not.toBeNull();
    expect(container.querySelector("[data-zone-id='player-leader']")).not.toBeNull();
    expect(container.querySelector("[data-zone-id='opponent-stage']")).not.toBeNull();
    expect(container.querySelector("[data-zone-id='player-stage']")).not.toBeNull();
    expect(container.querySelector("[data-zone-layout='single-card']")).not.toBeNull();
    expect(container.querySelector("[data-zone-id='player-leader'] .card-grid")).toBeNull();
    expect(screen.getByTestId("opponent-deck-stack")).not.toBeNull();
    expect(screen.getByTestId("opponent-deck-stack").className).toContain("deck-stack-zone");
    expect(screen.getByTestId("opponent-deck-stack").getAttribute("data-zone-layout")).toBe(
      "deck-stack",
    );
    expect(screen.getByTestId("player-deck-stack")).not.toBeNull();
    expect(screen.getByTestId("opponent-trash-stack")).not.toBeNull();
    expect(screen.getByTestId("opponent-trash-stack").className).toContain("discard-pile-zone");
    expect(screen.getByTestId("opponent-trash-stack").getAttribute("data-zone-layout")).toBe(
      "discard-pile",
    );
    expect(screen.getByTestId("player-trash-stack")).not.toBeNull();
  });

  it("does not render private opponent hand titles", () => {
    renderShell();

    expect(screen.getAllByLabelText("Hidden card").length).toBeGreaterThan(0);
  });

  it("shows only the face-up card image while hovering a card", async () => {
    renderShell();

    const nami = screen.getAllByLabelText("Nami, character, player")[0];
    fireEvent.mouseOver(nami);

    const preview = screen.getByTestId("one-piece-hover-preview");
    expect(preview.textContent).toBe("");
    expect(preview.querySelector("img")?.getAttribute("src")).toBe(
      "https://www.optcgapi.com/media/static/Card_Images/OP04-011.jpg",
    );
    expect(preview.querySelector("img")?.getAttribute("alt")).toBe("Nami");
    expect(screen.queryByTestId("one-piece-selection")).toBeNull();

    fireEvent.mouseOut(nami);

    await waitFor(() => {
      expect(screen.queryByTestId("one-piece-hover-preview")).toBeNull();
    });
  });

  it("renders a board-only shell with a floating event log", async () => {
    renderShell();

    expect(screen.queryByTestId("one-piece-sidebar")).toBeNull();
    expect(screen.queryByLabelText("Collapse sidebar")).toBeNull();
    expect(screen.queryByLabelText("Expand sidebar")).toBeNull();
    expect(screen.queryByTestId("event-log")).toBeNull();

    fireEvent.click(screen.getByLabelText("Expand event log"));

    expect(screen.getByTestId("event-log")).not.toBeNull();
    expect(screen.getByText("Loaded visual fixture: Main phase reference.")).not.toBeNull();

    fireEvent.click(screen.getByLabelText("Collapse event log"));

    await waitFor(() => {
      expect(screen.queryByTestId("event-log")).toBeNull();
    });

    expect(screen.queryByLabelText("Settings")).toBeNull();
  });

  it("projects relevant setup history into categorized event log entries", () => {
    const state = createMatch(createSt01MirrorPracticeConfig({ firstPlayer: "south" }));
    const board = buildOnePieceBoardFromState(state, {
      id: "setup-history",
      label: "Setup history",
      description: "Setup history projection test.",
    });

    expect(board.eventLog.length).toBeGreaterThan(5);
    expect(board.eventLog.some((entry) => entry.message.includes("Cards drawn"))).toBe(true);
    expect(board.eventLog.some((entry) => entry.tags.includes("move"))).toBe(true);
    expect(board.eventLog.some((entry) => entry.tags.includes("system"))).toBe(true);
  });

  it("keeps the board-only shell on narrow landscape widths", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 720,
    });

    renderShell();

    expect(screen.getByTestId("one-piece-tabletop-board")).not.toBeNull();
    expect(screen.queryByTestId("one-piece-sidebar")).toBeNull();
    expect(screen.queryByLabelText("Expand sidebar")).toBeNull();
  });

  it("projects fixture state into normalized board zones and counts", () => {
    const fixture = getOnePieceVisualFixture("main-phase-reference");
    expect(fixture).toBeDefined();

    const board = buildOnePieceBoardFromFixture(fixture!);
    const zone = (id: string) => board.table.zones.find((candidate) => candidate.id === id);

    expect(zone("player-hand")?.count).toBe(5);
    expect(zone("opponent-hand")?.count).toBe(5);
    expect(zone("player-hand")?.layoutHint).toBe("fan");
    expect(zone("player-characters")?.layoutHint).toBe("row");
    expect(zone("player-deck")?.layoutHint).toBe("stack");
    expect(zone("player-stage")?.entityIds.length).toBe(1);
    expect(zone("opponent-stage")?.entityIds.length).toBe(0);
    expect(
      board.entities.find((entity) => entity.id === zone("player-trash")?.entityIds[0])
        ?.dataAttributes?.["data-card-printing-id"],
    ).toBe("OP04-016");
    expect(
      board.entities.find((entity) => entity.id === zone("opponent-trash")?.entityIds[0])
        ?.dataAttributes?.["data-card-printing-id"],
    ).toBe("OP04-074");
    expect(zone("player-don-area")?.count).toBe(2);
    expect(zone("opponent-don-deck")?.count).toBe(8);
    expect(board.donTokens.player.map((token) => token.value).join("/")).toBe("1/1/7");
    expect(
      board.donTokens.player.reduce((total, token) => total + Number(token.value), 0) +
        board.entities.filter(
          (entity) => entity.ownerId === "player" && entity.states.includes("attached"),
        ).length,
    ).toBe(10);
    expect(
      board.donTokens.opponent.reduce((total, token) => total + Number(token.value), 0) +
        board.entities.filter(
          (entity) => entity.ownerId === "opponent" && entity.states.includes("attached"),
        ).length,
    ).toBe(10);

    const zoro = board.entities.find(
      (entity) => entity.dataAttributes?.["data-card-printing-id"] === "OP04-015",
    );
    expect(zoro?.imageUrl).toBe("https://www.optcgapi.com/media/static/Card_Images/OP04-015.jpg");
  });

  it("projects the default board as a fresh One Piece game setup", () => {
    const board = buildDefaultOnePieceBoard();
    const zone = (id: string) => board.table.zones.find((candidate) => candidate.id === id);
    const playerLeader = board.entities.find(
      (entity) => entity.id === zone("player-leader")?.entityIds[0],
    );

    expect(board.table.status.phase).toBe("Setup");
    expect(zone("player-stage")?.count).toBe(0);
    expect(zone("player-trash")?.count).toBe(0);
    expect(zone("player-characters")?.count).toBe(0);
    expect(zone("player-hand")?.count).toBe(5);
    expect(zone("player-life")?.count).toBe(5);
    expect(zone("player-don-area")?.count).toBe(0);
    expect(zone("player-don-deck")?.count).toBe(10);
    expect(playerLeader?.face).toBe("public");
    expect(playerLeader?.states).toContain("ready");
    expect(playerLeader?.states).not.toContain("attached");
    expect(playerLeader?.imageUrl).toBe(
      "https://www.optcgapi.com/media/static/Card_Images/ST01-001.jpg",
    );
    expect(board.donTokens.player.map((token) => token.value).join("/")).toBe("0/0/10");
  });

  it("shows a mulligan modal with accept and deny actions during setup", () => {
    const board = buildDefaultOnePieceBoard();
    const onAction = vi.fn();
    const takeMulligan = {
      type: "mulligan" as const,
      seat: "south" as const,
      label: "Take a mulligan",
    };
    const keepHand = {
      type: "keepHand" as const,
      seat: "south" as const,
      label: "Keep opening hand",
    };

    render(
      <OnePieceSimulatorProviders>
        <OnePieceSimulatorShell
          board={board}
          actions={[takeMulligan, keepHand]}
          onAction={onAction}
        />
      </OnePieceSimulatorProviders>,
    );

    expect(screen.getByRole("dialog", { name: "Opening Hand" })).not.toBeNull();
    expect(screen.getByText("First to play")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Take Mulligan" }));
    expect(onAction).toHaveBeenCalledWith(takeMulligan);

    fireEvent.click(screen.getByRole("button", { name: "Keep Hand" }));
    expect(onAction).toHaveBeenCalledWith(keepHand);
  });

  it("shows a Jo Ken Po modal with hidden opponent choice during setup", () => {
    const board = buildDefaultOnePieceBoard();
    const onAction = vi.fn();
    const rock = {
      type: "chooseJoKenPo" as const,
      seat: "south" as const,
      label: "Choose rock",
      options: [{ id: "rock", label: "rock", value: "rock" }],
    };
    const paper = {
      type: "chooseJoKenPo" as const,
      seat: "south" as const,
      label: "Choose paper",
      options: [{ id: "paper", label: "paper", value: "paper" }],
    };
    const scissors = {
      type: "chooseJoKenPo" as const,
      seat: "south" as const,
      label: "Choose scissors",
      options: [{ id: "scissors", label: "scissors", value: "scissors" }],
    };

    render(
      <OnePieceSimulatorProviders>
        <OnePieceSimulatorShell
          board={board}
          actions={[rock, paper, scissors]}
          onAction={onAction}
        />
      </OnePieceSimulatorProviders>,
    );

    expect(screen.getByRole("dialog", { name: "Jo Ken Po" })).not.toBeNull();
    expect(screen.getByText("30s remaining")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Paper" }));
    expect(onAction).toHaveBeenCalledWith(paper);
  });

  it("dispatches Jo Ken Po timeout at most once per modal round", () => {
    vi.useFakeTimers();
    const board = buildDefaultOnePieceBoard();
    const onJoKenPoTimeout = vi.fn();
    const actions = [
      {
        type: "chooseJoKenPo" as const,
        seat: "south" as const,
        label: "Choose rock",
        options: [{ id: "rock", label: "rock", value: "rock" }],
      },
    ];

    try {
      const { rerender } = render(
        <OnePieceSimulatorProviders>
          <OnePieceSimulatorShell
            board={board}
            actions={actions}
            onJoKenPoTimeout={onJoKenPoTimeout}
          />
        </OnePieceSimulatorProviders>,
      );

      act(() => {
        vi.advanceTimersByTime(31_000);
      });
      rerender(
        <OnePieceSimulatorProviders>
          <OnePieceSimulatorShell
            board={board}
            actions={actions}
            onJoKenPoTimeout={onJoKenPoTimeout}
          />
        </OnePieceSimulatorProviders>,
      );

      expect(onJoKenPoTimeout).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it("resets the Jo Ken Po timer when a drawn round exposes a new state version", () => {
    vi.useFakeTimers();
    const board = buildDefaultOnePieceBoard();
    const onJoKenPoTimeout = vi.fn();
    const actions = [
      {
        type: "chooseJoKenPo" as const,
        seat: "south" as const,
        label: "Choose rock",
        options: [{ id: "rock", label: "rock", value: "rock" }],
      },
    ];

    try {
      const { rerender } = render(
        <OnePieceSimulatorProviders>
          <OnePieceSimulatorShell
            board={board}
            actions={actions}
            onJoKenPoTimeout={onJoKenPoTimeout}
          />
        </OnePieceSimulatorProviders>,
      );

      act(() => {
        vi.advanceTimersByTime(29_000);
      });

      rerender(
        <OnePieceSimulatorProviders>
          <OnePieceSimulatorShell
            board={{
              ...board,
              table: {
                ...board.table,
                status: {
                  ...board.table.status,
                  stateVersion: board.table.status.stateVersion + 1,
                },
              },
            }}
            actions={actions}
            onJoKenPoTimeout={onJoKenPoTimeout}
          />
        </OnePieceSimulatorProviders>,
      );

      expect(screen.getByText("30s remaining")).not.toBeNull();
      act(() => {
        vi.advanceTimersByTime(1_000);
      });
      expect(screen.getByText("29s remaining")).not.toBeNull();
      expect(onJoKenPoTimeout).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("shows a first-player choice modal after winning Jo Ken Po", () => {
    const board = buildDefaultOnePieceBoard();
    const onAction = vi.fn();
    const takeFirst = {
      type: "chooseFirstPlayer" as const,
      seat: "south" as const,
      label: "Take the first turn",
      targetIds: ["south"],
    };
    const letBotStart = {
      type: "chooseFirstPlayer" as const,
      seat: "south" as const,
      label: "Let Practice Bot take the first turn",
      targetIds: ["north"],
    };

    render(
      <OnePieceSimulatorProviders>
        <OnePieceSimulatorShell
          board={board}
          actions={[takeFirst, letBotStart]}
          onAction={onAction}
        />
      </OnePieceSimulatorProviders>,
    );

    expect(screen.getByRole("dialog", { name: "Choose First Turn" })).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Let Practice Bot take the first turn" }));
    expect(onAction).toHaveBeenCalledWith(letBotStart);
  });

  it("redacts private opponent fixture cards before rendering data", () => {
    const fixture = getOnePieceVisualFixture("privacy-hidden-zones");
    expect(fixture).toBeDefined();

    const board = buildOnePieceBoardFromFixture(fixture!);
    const renderedText = board.entities
      .map((entity) => [entity.title, entity.subtitle, ...entity.traits].join(" "))
      .join(" ");
    const opponentHidden = board.entities.filter(
      (entity) => entity.ownerId === "opponent" && entity.face === "hidden",
    );

    expect(renderedText).not.toContain("Kaido");
    expect(renderedText).not.toContain("Dragon Twister");
    expect(opponentHidden.length).toBeGreaterThan(0);
    expect(opponentHidden.every((entity) => entity.stats.length === 0)).toBe(true);
    expect(opponentHidden.every((entity) => entity.imageUrl === undefined)).toBe(true);
    expect(
      board.entities.some((entity) => entity.title === "Nami" && entity.ownerId === "player"),
    ).toBe(true);
  });
});

function renderOnePieceRoutes(initialEntry: string) {
  return render(
    <OnePieceSimulatorProviders>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/one-piece/simulator" element={<OnePiecePracticePage />} />
          <Route path="/one-piece/simulator/tests" element={<OnePieceFixtureIndexPage />} />
          <Route path="/one-piece/simulator/tests/:fixtureId" element={<OnePieceFixturePage />} />
        </Routes>
      </MemoryRouter>
    </OnePieceSimulatorProviders>,
  );
}

function renderShell() {
  const fixture = getOnePieceVisualFixture("main-phase-reference");
  const board = buildOnePieceBoardFromFixture(fixture!);
  return render(
    <OnePieceSimulatorProviders>
      <OnePieceSimulatorShell board={board} />
    </OnePieceSimulatorProviders>,
  );
}
