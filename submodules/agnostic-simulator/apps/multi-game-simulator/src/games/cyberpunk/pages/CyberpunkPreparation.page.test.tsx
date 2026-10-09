// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MatchSessionSchema, type MatchSession } from "@tcg/game-page-contract";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { installBrowserShims } from "../../../testing/browser-shims";
import {
  CyberpunkPreparationDialog,
  CyberpunkPreparationPage,
  poolSchema,
  selectionSchema,
} from "./CyberpunkPreparation.page";

const recovery = vi.hoisted(() => ({
  refresh: vi.fn(async () => {}),
  refreshing: false,
  error: null,
  submitPreparation: vi.fn(async () => ({ status: "accepted" })),
}));
vi.mock("../../../simulator/MatchSessionProvider", () => ({ useMatchSession: () => recovery }));
beforeEach(() => {
  installBrowserShims();
  recovery.submitPreparation.mockClear();
});
afterEach(cleanup);

function preparation(
  stage: "game-one" | "between-games",
  locked = false,
  opponentReady = false,
  turnOrder: Extract<MatchSession, { phase: "preparation" }>["preparation"]["turnOrder"] = {
    stage: "choosing",
    chooserId: "p1",
  },
) {
  const session = MatchSessionSchema.parse({
    schemaVersion: 2,
    revision: 1,
    phase: "preparation",
    gameId: stage === "game-one" ? "g1" : "g2",
    match: {
      matchId: "m1",
      gameType: "cyberpunk",
      format: "best_of_3",
      matchType: "casual",
      status: "waiting",
      participants: [],
      gameIds: stage === "game-one" ? [] : ["g1", "g2"],
      scores: stage === "game-one" ? { p1: 0, p2: 0 } : { p1: 1, p2: 0 },
    },
    viewer: {
      role: "player",
      userId: "u1",
      actorId: "p1",
      seat: 1,
      permissions: {
        act: true,
        chat: true,
        propose: false,
        useManualControls: false,
        concede: true,
        spectate: false,
        viewReplay: true,
        downloadReplay: false,
        forkReplay: false,
      },
    },
    preparation: {
      object: "game_pregame",
      phase: locked && opponentReady ? "choosing-first-player" : "selecting",
      phaseToken: "test-phase",
      serverTime: new Date().toISOString(),
      selectionOutcome: "pending",
      kind: "cyberpunk",
      matchId: "m1",
      gameId: stage === "game-one" ? "g1" : "g2",
      status: "waiting",
      playerId: "p1",
      deadlineAt: new Date(Date.now() + 120_000).toISOString(),
      turnOrder,
      pool: {
        stage,
        legends: [{ cardId: "legend", quantity: 1, card: { name: "Legend" } }],
        main: [{ cardId: "main", quantity: 40, card: { name: "Main Card", type: "Unit" } }],
        sideboard: [{ cardId: "side", quantity: 7, card: { name: "Side Card", type: "Gear" } }],
      },
      selection: {
        legends: [{ cardId: "legend", quantity: 1 }],
        main: [{ cardId: "main", quantity: 40 }],
        sideboard: [{ cardId: "side", quantity: 7 }],
      },
      locked,
      opponentReady,
      player: { playerId: "p1", label: "NightRunner", mmr: 1438, subscriptionTier: "tier4" },
      opponent: {
        playerId: "p2",
        label: "ChromeJack",
        mmr: 1512,
        legends: [{ cardId: "rival-legend", quantity: 1, card: { name: "Rival Legend" } }],
      },
    },
  });
  if (session.phase !== "preparation") throw new Error("Expected preparation");
  return session;
}

function show(session: ReturnType<typeof preparation>) {
  return render(
    <MantineProvider>
      <CyberpunkPreparationPage session={session} />
    </MantineProvider>,
  );
}

it("shows the registered Game 1 deck without sideboarding", () => {
  show(preparation("game-one", true, true));
  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(screen.getByRole("region", { name: "Your Legends" }).textContent).toContain("NightRunner");
  expect(screen.getByRole("button", { name: "Preview Rival Legend" })).toBeTruthy();
  expect(screen.getByText("1,438 MMR")).toBeTruthy();
  expect(screen.getByText("1,512 MMR")).toBeTruthy();
  expect(screen.getByText(/Sideboarding opens after Game 1/)).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Move one/ })).toBeNull();
  expect(screen.getByRole("button", { name: "Go first" })).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Confirm deck" })).toBeNull();
});

it("names the player who will decide first-player order", () => {
  show(preparation("between-games", true, true));
  expect(screen.getByText("You decide who goes first")).toBeTruthy();
});

it("names the rival when the rival decides first-player order", () => {
  show(preparation("between-games", true, true, { stage: "choosing", chooserId: "p2" }));
  expect(screen.getByText("Rival decides who goes first")).toBeTruthy();
});

it.each([
  ["p1", "You go first · shuffling"],
  ["p2", "Rival goes first · shuffling"],
] as const)("shows who goes first after the choice is made (%s)", (firstPlayerId, label) => {
  show(
    preparation("between-games", true, true, {
      stage: "chosen",
      chooserId: "p1",
      firstPlayerId,
      source: "player",
    }),
  );
  expect(screen.getByText(label)).toBeTruthy();
});

it("lets a player swap equal counts in Game 2 before the turn-order choice", () => {
  show(preparation("between-games"));
  expect(screen.getByRole("button", { name: "Filter Main deck by Unit" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Filter Sideboard by Gear" })).toBeTruthy();
  const statusTab = screen.getByRole("tab", { name: "Match status" });
  fireEvent.click(statusTab);
  expect(statusTab.getAttribute("aria-selected")).toBe("true");
  expect(screen.getByText("Best of 3")).toBeTruthy();
  expect(screen.getByText("Game 2")).toBeTruthy();
  expect(screen.getByText("Series 1–0")).toBeTruthy();
  fireEvent.click(screen.getByRole("tab", { name: "Sideboard" }));
  const confirm = screen.getByRole("button", { name: "Confirm deck" });
  expect(confirm.hasAttribute("disabled")).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Move one Main Card to sideboard" }));
  expect(confirm.hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Move one Side Card to main deck" }));
  expect(confirm.hasAttribute("disabled")).toBe(false);
  expect(screen.queryByRole("button", { name: "Go first" })).toBeNull();
});

it("shows both move actions for a split card and updates deck statistics", () => {
  const session = preparation("between-games");
  const pool = poolSchema.parse({
    stage: "between-games",
    legends: [{ cardId: "v-corporate-exile", quantity: 1, card: { name: "V: Corporate Exile" } }],
    main: [
      { cardId: "corpo-security", quantity: 2, card: { name: "Corpo Security", type: "Unit" } },
    ],
    sideboard: [
      { cardId: "corpo-security", quantity: 1, card: { name: "Corpo Security", type: "Unit" } },
    ],
  });
  const initial = selectionSchema.parse({
    legends: [{ cardId: "v-corporate-exile", quantity: 1 }],
    main: [{ cardId: "corpo-security", quantity: 2 }],
    sideboard: [{ cardId: "corpo-security", quantity: 1 }],
  });
  render(
    <MantineProvider>
      <CyberpunkPreparationDialog
        session={session}
        pool={pool}
        initial={initial}
        busy={false}
        error={null}
        onSubmit={vi.fn()}
        showRecovery={false}
      />
    </MantineProvider>,
  );
  const stats = screen.getByRole("region", { name: "Main deck statistics" });
  expect(stats.textContent).toContain("Units 2");
  expect(
    screen.getAllByRole("button", { name: "Move one Corpo Security to sideboard" }),
  ).toHaveLength(2);
  expect(
    screen.getAllByRole("button", { name: "Move one Corpo Security to main deck" }),
  ).toHaveLength(2);
  fireEvent.click(
    screen.getAllByRole("button", { name: "Move one Corpo Security to main deck" })[0]!,
  );
  expect(stats.textContent).toContain("Units 3");
});

it("moves a card with the row default action while keeping buttons independent", () => {
  show(preparation("between-games"));
  const sideboardRow = screen.getByRole("group", {
    name: "Side Card, click to side in",
  });
  const mainRow = screen.getByRole("group", {
    name: "Main Card, click to side out",
  });

  fireEvent.click(sideboardRow);
  fireEvent.click(mainRow);

  expect(sideboardRow.textContent).toContain("1 main · 6 side");
  expect(mainRow.textContent).toContain("39 main · 1 side");
});

it("opens card previews only from the image or name, not the count line", () => {
  const originalMatchMedia = window.matchMedia;
  try {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query === "(any-hover: hover)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    show(preparation("between-games"));
    const name = screen.getAllByRole("button", { name: "Preview Main Card" })[1]!;
    const count = screen.getByLabelText("40 in main deck, 0 in sideboard");

    fireEvent.mouseEnter(count);
    expect(name.getAttribute("aria-expanded")).toBe("false");

    fireEvent.mouseEnter(name);
    expect(name.getAttribute("aria-expanded")).toBe("true");
  } finally {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: originalMatchMedia });
  }
});

it("requires a matching side out when a card is sided in", () => {
  show(preparation("between-games"));
  const confirm = screen.getByRole("button", { name: "Confirm deck" });

  fireEvent.click(screen.getByRole("button", { name: "Move one Side Card to main deck" }));

  expect(confirm.hasAttribute("disabled")).toBe(true);
  expect(screen.getByText("Deck invalid")).toBeTruthy();
  expect(screen.getByText("Side out 1 more card to restore the registered counts.")).toBeTruthy();
  expect(screen.getByRole("region", { name: "Main deck" }).textContent).toContain("41 / 40");
  fireEvent.click(screen.getByRole("button", { name: "Move one Main Card to sideboard" }));
  expect(confirm.hasAttribute("disabled")).toBe(false);
  expect(screen.getByText("Deck not sent")).toBeTruthy();
  expect(screen.getByText("Click Confirm deck to send your selection.")).toBeTruthy();
});

it("filters each deck list by card type and restores all cards", () => {
  show(preparation("between-games"));
  const sideboard = screen.getByRole("region", { name: "Sideboard" });

  fireEvent.click(screen.getByRole("button", { name: "Filter Sideboard by Gear" }));
  expect(screen.getByRole("group", { name: "Side Card, click to side in" })).toBeTruthy();
  expect(
    screen.getByRole("button", { name: "Filter Sideboard by Gear" }).getAttribute("aria-pressed"),
  ).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "Filter Sideboard by Unit" }));
  expect(sideboard.textContent).toContain("No cards in this type.");
  expect(screen.queryByRole("group", { name: "Side Card, click to side in" })).toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Filter Sideboard by All" }));
  expect(screen.getByRole("group", { name: "Side Card, click to side in" })).toBeTruthy();
});

it("offers first or second only after both players confirm", () => {
  show(preparation("between-games", true, true));
  expect(screen.getByRole("button", { name: "Go first" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Go second" })).toBeTruthy();
});

it("keeps the same dialog and shows the chosen order while the game initializes", () => {
  const initial = preparation("between-games", true, true);
  const view = show(initial);
  const dialog = screen.getByRole("dialog");
  const starting = preparation("between-games", true, true);
  starting.preparation.phase = "starting";
  starting.preparation.deadlineAt = new Date(Date.now() - 1000).toISOString();
  starting.preparation.turnOrder = {
    stage: "chosen",
    chooserId: "p1",
    firstPlayerId: "p2",
    source: "player",
  };
  view.rerender(
    <MantineProvider>
      <CyberpunkPreparationPage session={starting} />
    </MantineProvider>,
  );
  expect(screen.getByRole("dialog")).toBe(dialog);
  expect(screen.getByText("Starting game")).toBeTruthy();
  expect(screen.getByText("You go second. Shuffling Legends and deck…")).toBeTruthy();
  expect(screen.queryByText("Time ended. Waiting for the server…")).toBeNull();
  expect(screen.queryByRole("button", { name: "Go first" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Go second" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Confirm deck" })).toBeNull();
});

it("recognizes the player's confirmed deck when the locked view hides sideboard cards", () => {
  const initial = preparation("between-games");
  const { rerender } = show(initial);
  fireEvent.click(screen.getByRole("button", { name: "Move one Main Card to sideboard" }));
  fireEvent.click(screen.getByRole("button", { name: "Move one Side Card to main deck" }));
  const confirmed = preparation("between-games", true);
  confirmed.preparation.selectionOutcome = "confirmed";
  confirmed.preparation.selection = {
    legends: [{ cardId: "legend", quantity: 1 }],
    main: [
      { cardId: "side", quantity: 1 },
      { cardId: "main", quantity: 39 },
    ],
    sideboardLocked: true,
  };
  confirmed.preparation.pool = {
    stage: "between-games",
    legends: confirmed.preparation.pool.legends,
  };
  rerender(
    <MantineProvider>
      <CyberpunkPreparationPage session={confirmed} />
    </MantineProvider>,
  );
  expect(screen.queryByText(/confirmed in another session/)).toBeNull();
  expect(screen.queryByText(/Return one card to each deck/)).toBeNull();
  expect(screen.getByText("Deck confirmed")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Move one/ })).toBeNull();
});

it("explains when another session confirms while this tab has unsent edits", () => {
  const initial = preparation("between-games");
  const { rerender } = show(initial);
  fireEvent.click(screen.getByRole("button", { name: "Move one Main Card to sideboard" }));
  const confirmed = preparation("between-games", true, true);
  confirmed.preparation.selectionOutcome = "confirmed";
  rerender(
    <MantineProvider>
      <CyberpunkPreparationPage session={confirmed} />
    </MantineProvider>,
  );
  expect(
    screen.getByText(
      "Your deck was confirmed in another session. Unsubmitted edits in this tab were not saved.",
    ),
  ).toBeTruthy();
  expect(screen.queryByRole("button", { name: /Move one/ })).toBeNull();
  expect(screen.queryByRole("button", { name: "Confirm deck" })).toBeNull();
});

it("shows the exact number to side in and sends only after confirmation", () => {
  show(preparation("between-games"));
  fireEvent.click(screen.getByRole("button", { name: "Move one Main Card to sideboard" }));
  fireEvent.click(screen.getAllByRole("button", { name: "Move one Main Card to sideboard" })[0]!);
  expect(screen.getByText("Side in 2 more cards to restore the registered counts.")).toBeTruthy();
  expect(recovery.submitPreparation).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Move one Side Card to main deck" }));
  fireEvent.click(screen.getAllByRole("button", { name: "Move one Side Card to main deck" })[0]!);
  expect(screen.getByText("Deck valid")).toBeTruthy();
  expect(recovery.submitPreparation).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirm deck" }));
  expect(recovery.submitPreparation).toHaveBeenCalledWith({
    type: "confirm_preparation",
    selection: {
      legends: [{ cardId: "legend", quantity: 1 }],
      main: [
        { cardId: "main", quantity: 38 },
        { cardId: "side", quantity: 2 },
      ],
      sideboard: [
        { cardId: "side", quantity: 5 },
        { cardId: "main", quantity: 2 },
      ],
    },
  });
});

it("keeps submission errors next to the confirmation action and permits retry", () => {
  const session = preparation("between-games");
  const onSubmit = vi.fn();
  render(
    <MantineProvider>
      <CyberpunkPreparationDialog
        session={session}
        pool={poolSchema.parse(session.preparation.pool)}
        initial={selectionSchema.parse(session.preparation.selection)}
        busy={false}
        error="Could not send deck. Try again."
        onSubmit={onSubmit}
        showRecovery={false}
      />
    </MantineProvider>,
  );
  expect(screen.getByText("Deck not sent · submission failed")).toBeTruthy();
  expect(screen.getByRole("alert").parentElement).toBe(
    screen.getByRole("contentinfo", { name: "Deck confirmation" }).parentElement,
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirm deck" }));
  expect(onSubmit).toHaveBeenCalledOnce();
});

it("does not report a pending submission as sent or allow more edits", () => {
  const session = preparation("between-games");
  render(
    <MantineProvider>
      <CyberpunkPreparationDialog
        session={session}
        pool={poolSchema.parse(session.preparation.pool)}
        initial={selectionSchema.parse(session.preparation.selection)}
        busy
        error={null}
        onSubmit={vi.fn()}
        showRecovery={false}
      />
    </MantineProvider>,
  );
  expect(screen.getByText("Sending deck…")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirm deck" }).hasAttribute("disabled")).toBe(true);
  expect(
    screen
      .getByRole("button", { name: "Move one Main Card to sideboard" })
      .hasAttribute("disabled"),
  ).toBe(true);
});

it("distinguishes timeout from a sent selection", () => {
  const session = preparation("between-games", true);
  session.preparation.selectionOutcome = "timeout";
  show(session);
  expect(screen.getByText("Time ended · edits not sent")).toBeTruthy();
  expect(screen.queryByText("Deck sent · confirmed")).toBeNull();
});
