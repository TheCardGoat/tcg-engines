// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import App from "../../../App.tsx";
import { OnePieceSimulatorProviders } from "../App.tsx";
import { OnePieceSimulatorShell } from "../components/OnePieceSimulatorShell.tsx";
import {
  buildDefaultOnePieceBoard,
  buildOnePieceBoardFromFixture,
} from "../data/projectVisualFixture.ts";
import { getOnePieceVisualFixture } from "../data/visualFixtures.ts";

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

  it("mounts through MountedBrowserSimulator at /one-piece/simulator", async () => {
    window.history.pushState({}, "", "/one-piece/simulator");

    render(<App initialPath="/one-piece/simulator" />);

    expect(await screen.findByTestId("one-piece-shell")).not.toBeNull();
    expect(screen.getByTestId("one-piece-tabletop-board")).not.toBeNull();
  });

  it("mounts the dev fixture index and fixture route", async () => {
    window.history.pushState({}, "", "/one-piece/simulator/tests");

    render(<App initialPath="/one-piece/simulator/tests" />);

    expect(await screen.findByTestId("one-piece-fixture-index")).not.toBeNull();
    expect(screen.getByText("Main phase reference")).not.toBeNull();
    expect(screen.getByText("/tests/main-phase-reference")).not.toBeNull();

    cleanup();
    window.history.pushState({}, "", "/one-piece/simulator/tests/main-phase-reference");

    render(<App initialPath="/one-piece/simulator/tests/main-phase-reference" />);

    expect(await screen.findByTestId("one-piece-shell")).not.toBeNull();
    expect(screen.getByTestId("one-piece-tabletop-board")).not.toBeNull();
  });

  it("renders a 404 for an unknown visual fixture id", async () => {
    window.history.pushState({}, "", "/one-piece/simulator/tests/nope");

    render(<App initialPath="/one-piece/simulator/tests/nope" />);

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
    expect(screen.getByTestId("player-don-area").textContent).toContain("Active 1");
    expect(screen.getByTestId("player-don-area").textContent).toContain("Rested 1");
    expect(
      screen.getByTestId("player-don-area").querySelectorAll("[aria-label^='DON ']"),
    ).toHaveLength(10);

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

  it("shows face-up card details only while hovering a card", async () => {
    renderShell();

    const nami = screen.getAllByLabelText("Nami, character, player")[0];
    fireEvent.mouseOver(nami);

    const preview = screen.getByTestId("one-piece-hover-preview");
    expect(preview.textContent).toContain("Nami");
    expect(preview.textContent).toContain("3000 power");
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
    const board = buildDefaultOnePieceBoard();
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
    expect(zoro?.imageUrl).toBe("https://cdn.tcg.online/public/one-piece/cards/OP04/OP04-015.webp");
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

function renderShell() {
  const board = buildDefaultOnePieceBoard();
  return render(
    <OnePieceSimulatorProviders>
      <OnePieceSimulatorShell board={board} />
    </OnePieceSimulatorProviders>,
  );
}

function installBrowserShims() {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};

  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}
