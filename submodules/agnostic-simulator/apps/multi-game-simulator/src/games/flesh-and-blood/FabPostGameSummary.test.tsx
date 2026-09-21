// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render as testingLibraryRender,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ReactElement } from "react";
import { FabPresentationTestProvider } from "./presentation-test-provider";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FAB_ANALYTICS_SCHEMA_VERSION_V2,
  buildFabGameAnalyticsV2,
  type FabAnalyticsFactV2,
} from "@tcg/flesh-and-blood-server-adapter";

import { createOpeningFixtureState } from "./fixtures";
import { FabPostGameSummary } from "./FabPostGameSummary";
import {
  createFabPostGameSummary,
  fabMatchSummaryFromAnalytics,
  fabPostGameBackendDataFromAnalytics,
  type FabPostGameBackendData,
} from "./FabPostGameSummary.model";
import type { FabPresentationState } from "./state";

function render(ui: ReactElement) {
  return testingLibraryRender(ui, { wrapper: FabPresentationTestProvider });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(
      JSON.stringify({
        heroes: ["Rhinar", "Bravo"].map((name) => ({
          name,
          portrait: `${name.toLocaleLowerCase()}-portrait.webp`,
          background: `${name.toLocaleLowerCase()}-background.webp`,
          video: `${name.toLocaleLowerCase()}.mp4`,
        })),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ),
  );
});

function terminalPresentation(): FabPresentationState {
  const state = createOpeningFixtureState();
  return {
    ...state,
    life: { ...state.life, "player-1": 14, "player-2": 0 },
    turnNumber: 7,
    terminal: true,
    result: {
      kind: "win",
      winnerId: "player-1",
      loserId: "player-2",
      reason: "lethal damage",
    },
  };
}

function buildSummary(
  backend?: FabPostGameBackendData,
  participantSubscriptionTier?: (playerId: string) => string | undefined,
) {
  return createFabPostGameSummary({
    presentation: terminalPresentation(),
    viewerId: "player-1",
    participantLabel: (playerId) => (playerId === "player-1" ? "You" : "Practice bot"),
    ...(participantSubscriptionTier ? { participantSubscriptionTier } : {}),
    sessionFormatLabel: "Classic Constructed",
    backend,
  });
}

function authoritativeGame(gameId: string, winnerId: "player-1" | "player-2", damage: number) {
  const loserId = winnerId === "player-1" ? "player-2" : "player-1";
  const attack = {
    canonicalId: "attack-red",
    instanceId: `${gameId}:attack`,
    name: "Test Attack",
    ownerId: winnerId,
    controllerId: winnerId,
  };
  const base = {
    schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
    activePlayerId: winnerId,
    turn: 1,
    phase: "action" as const,
    combatNumber: 1,
    chainLinkNumber: 1,
  };
  const facts: readonly FabAnalyticsFactV2[] = [
    {
      ...base,
      eventId: `${gameId}:combat`,
      kind: "combat-resolved",
      attackingPlayerId: winnerId,
      defendingPlayerId: loserId,
      attack,
      attackPower: damage,
      totalDefense: 0,
      unpreventedDamageBeforePrevention: damage,
      defenders: [],
    },
    {
      ...base,
      eventId: `${gameId}:damage`,
      kind: "damage-dealt",
      sourcePlayerId: winnerId,
      source: attack,
      targetPlayerId: loserId,
      amount: damage,
      damageType: "physical",
    },
    {
      ...base,
      eventId: `${gameId}:hit`,
      kind: "attack-hit",
      playerId: winnerId,
      attack,
      targetPlayerId: loserId,
      damage,
    },
    {
      ...base,
      eventId: `${gameId}:lost`,
      kind: "game-lost",
      playerId: loserId,
      reason: "lethal damage",
    },
  ];
  return buildFabGameAnalyticsV2({
    gameId,
    players: [
      {
        playerId: "player-1",
        seat: 1,
        heroName: "Hero One",
        heroCanonicalId: "hero-one",
        initialLife: 20,
        openingHand: [],
      },
      {
        playerId: "player-2",
        seat: 2,
        heroName: "Hero Two",
        heroCanonicalId: "hero-two",
        initialLife: 20,
        openingHand: [],
      },
    ],
    initialTurnPlayerId: winnerId,
    startedAt: 1_000,
    completedAt: 2_000,
    transitionReceipts: [
      {
        schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
        commandId: `${gameId}:command`,
        stateVersion: 1,
        timestamp: 2_000,
        facts,
      },
    ],
  });
}

describe("FAB post-game summary", () => {
  it("keeps terminal facts live and marks unavailable analytics as mock data", () => {
    const summary = buildSummary();

    expect(summary.outcome).toBe("victory");
    expect(summary.viewer.life).toBe(14);
    expect(summary.opponent.life).toBe(0);
    expect(summary.reason).toEqual({ value: "lethal damage", source: "runtime" });
    expect(summary.turnNumber).toEqual({ value: 7, source: "runtime" });
    expect(summary.formatLabel).toEqual({ value: "Classic Constructed", source: "session" });
    expect(summary.durationSeconds.source).toBe("mock");
    expect(summary.comparison.every((entry) => entry.source === "mock")).toBe(true);
    expect(summary.match.source).toBe("mock");
    expect(summary.hasMockData).toBe(true);
  });

  it("accepts backend analytics without changing the component-facing model", () => {
    const summary = buildSummary({
      durationSeconds: 905,
      formatLabel: "Silver Age",
      comparison: [
        {
          id: "damage",
          label: "Attack damage",
          viewer: "37",
          opponent: "29",
          source: "backend",
        },
      ],
    });

    expect(summary.durationSeconds).toEqual({ value: 905, source: "backend" });
    expect(summary.formatLabel).toEqual({ value: "Silver Age", source: "backend" });
    expect(summary.comparison).toEqual([
      expect.objectContaining({ id: "damage", source: "backend" }),
    ]);
  });

  it("uses authoritative game facts without retaining illustrative values", () => {
    const presentation = terminalPresentation();
    const game = authoritativeGame("game-1", "player-1", 20);
    const backend = fabPostGameBackendDataFromAnalytics(game, presentation, "player-1");
    const summary = createFabPostGameSummary({
      presentation,
      viewerId: "player-1",
      participantLabel: (playerId) => playerId,
      sessionFormatLabel: "Classic Constructed",
      backend: {
        ...backend,
        match: fabMatchSummaryFromAnalytics([game], "player-1", "player-2"),
      },
    });

    expect(summary.hasMockData).toBe(false);
    expect(summary.comparison).toContainEqual(
      expect.objectContaining({ id: "attack-damage", viewer: "20", source: "backend" }),
    );
    expect(summary.match).toMatchObject({ source: "backend", viewerWins: 1, opponentWins: 0 });
    expect(summary.lifeByTurn).toEqual({
      turns: [0, 1],
      viewer: [20, 20],
      opponent: [20, 0],
      source: "backend",
    });
    render(
      <FabPostGameSummary
        summary={summary}
        onInspectBoard={() => {}}
        onMainMenu={() => {}}
        onPlayAgain={() => {}}
      />,
    );
    const homeLink = screen.getByRole("link", { name: "The Card Goat home" });
    expect(homeLink.getAttribute("href")).toBe("/");
    expect(homeLink.querySelector("img")?.getAttribute("src")).toBe(
      "https://cdn.tcg.online/public/thecardgoat/branding/icon-square-72.webp",
    );
    const chart = screen.getByRole("img", { name: "Life totals by turn" });
    expect(
      Array.from(
        chart.querySelectorAll("text.fab-summary-chart-dot--opponent"),
        (label) => label.textContent,
      ),
    ).toEqual(["20", "0"]);
  });

  it("sums match numerators across games instead of averaging game averages", () => {
    const first = authoritativeGame("game-1", "player-1", 12);
    const second = authoritativeGame("game-2", "player-2", 7);

    const match = fabMatchSummaryFromAnalytics([first, second], "player-1", "player-2");

    expect(match).toMatchObject({ viewerWins: 1, opponentWins: 1 });
    expect(match.comparison).toContainEqual(
      expect.objectContaining({ id: "attack-damage", viewer: "12", opponent: "7" }),
    );
    expect(match.opponentCards).toContainEqual(
      expect.objectContaining({ id: "attack-red", hits: 1 }),
    );
    expect(
      fabPostGameBackendDataFromAnalytics(second, terminalPresentation(), "player-1").opponentCards,
    ).toContainEqual(expect.objectContaining({ id: "attack-red", hits: 1 }));
    expect(match.cards).toContainEqual(
      expect.objectContaining({ id: "attack-red", hits: 1, source: "backend" }),
    );
  });

  it("describes a claimed timeout from the viewing player's perspective", () => {
    const game = { ...authoritativeGame("game-timeout", "player-1", 12), endReason: "timeout" };

    expect(fabMatchSummaryFromAnalytics([game], "player-1", "player-2").games[0]?.ending).toBe(
      "Opponent timed out",
    );
    expect(fabMatchSummaryFromAnalytics([game], "player-2", "player-1").games[0]?.ending).toBe(
      "You timed out",
    );
  });

  it("removes spatial entrance motion when the player prefers reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }));

    render(
      <FabPostGameSummary
        summary={buildSummary()}
        onInspectBoard={vi.fn()}
        onMainMenu={vi.fn()}
        onPlayAgain={vi.fn()}
      />,
    );

    const summary = screen.getByTestId("fab-post-game-summary");
    expect(summary.getAttribute("data-reduced-motion")).toBe("true");
    expect(summary.style.transform).not.toContain("12px");
  });

  it("filters public card usage by player and preserves separate rows for shared cards", () => {
    const card = {
      id: "shared",
      name: "Shared card",
      played: 2,
      pitched: 0,
      defended: 0,
      hits: 0,
      source: "backend" as const,
    };
    render(
      <FabPostGameSummary
        summary={buildSummary({ cards: [card], opponentCards: [{ ...card, played: 5 }] })}
        onInspectBoard={vi.fn()}
        onMainMenu={vi.fn()}
        onPlayAgain={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cards" }));
    expect(screen.getByRole("cell", { name: "2" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Opponent" }));
    expect(screen.getByRole("cell", { name: "5" })).toBeTruthy();
    expect(screen.queryByRole("cell", { name: "2" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getAllByRole("rowheader")).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "2" })).toBeTruthy();
    expect(screen.getByRole("cell", { name: "5" })).toBeTruthy();
  });

  it("shows a hand lifecycle and Arsenal-origin turn usage", () => {
    render(
      <FabPostGameSummary
        summary={buildSummary({
          turns: [
            {
              turn: 1,
              cardsPlayed: 2,
              cardsPlayedFromArsenal: 1,
              cardsPitched: 1,
              resourcesGenerated: 3,
              damageDealt: 4,
              cardsDefended: 0,
              source: "backend",
            },
          ],
          hands: [
            {
              cycle: 1,
              openedAfterTurn: null,
              openedBy: "opening-hand",
              startingCards: [
                { id: "alpha", name: "Alpha" },
                { id: "beta", name: "Beta" },
              ],
              carriedCards: [],
              endingCards: [{ id: "beta", name: "Beta" }],
              actions: [
                {
                  sequence: 0,
                  turn: 1,
                  kind: "played",
                  cardId: "alpha",
                  cardName: "Alpha",
                  origin: "arsenal",
                  destination: "stack",
                },
              ],
              closedAfterTurn: 1,
              source: "backend",
            },
          ],
        })}
        onInspectBoard={vi.fn()}
        onMainMenu={vi.fn()}
        onPlayAgain={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Turns" }));
    expect(screen.getByRole("columnheader", { name: "From Arsenal" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Hands" }));
    expect(screen.getByText("Started with")).toBeTruthy();
    // Card names render as underlined hover-preview references.
    expect(screen.getAllByRole("button", { name: "Preview Alpha" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Preview Beta" })).toHaveLength(2);
    expect(screen.getByText("None")).toBeTruthy();
    expect(
      screen.getByText(
        (_content, element) =>
          element?.tagName === "SMALL" && element.textContent === "from Arsenal",
      ),
    ).toBeTruthy();
  });

  it("marks name-only card references as all-color aggregates", () => {
    render(
      <FabPostGameSummary
        summary={buildSummary({
          cards: [
            {
              id: "name:Mystery",
              name: "Mystery",
              played: 1,
              pitched: 0,
              defended: 0,
              hits: 0,
              source: "backend",
            },
            {
              id: "known-card",
              name: "Known card",
              played: 2,
              pitched: 0,
              defended: 0,
              hits: 0,
              source: "backend",
            },
          ],
          hands: [
            {
              cycle: 1,
              openedAfterTurn: null,
              openedBy: "opening-hand",
              startingCards: [{ id: null, name: "Mystery" }],
              carriedCards: [],
              endingCards: [],
              actions: [],
              closedAfterTurn: null,
              source: "backend",
            },
          ],
        })}
        onInspectBoard={vi.fn()}
        onMainMenu={vi.fn()}
        onPlayAgain={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Hands" }));
    expect(screen.getAllByRole("img", { name: /covers every color/ })).not.toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Cards" }));
    // Only the name-keyed usage row carries the aggregate hint.
    expect(screen.getAllByRole("img", { name: /covers every color/ })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Preview Mystery" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Preview Known card" })).toBeTruthy();
  });

  it("reuses hero media and reserves animation for subscribed participants", async () => {
    const summary = buildSummary(undefined, (playerId) =>
      playerId === "player-1" ? "tier4" : "free",
    );

    render(
      <FabPostGameSummary
        summary={summary}
        onInspectBoard={vi.fn()}
        onMainMenu={vi.fn()}
        onPlayAgain={vi.fn()}
      />,
    );

    expect(await screen.findByTestId("fab-summary-hero-video-viewer")).not.toBeNull();
    expect(screen.queryByTestId("fab-summary-hero-video-opponent")).toBeNull();
    await waitFor(() =>
      expect(
        document.querySelector<HTMLElement>(
          '.fab-summary-participant[data-side="opponent"] .fab-summary-participant-media',
        )?.style.backgroundImage,
      ).toContain("bravo-background.webp"),
    );
  });

  it("withholds combat value when aggregate totals do not match retained turns", () => {
    const analytics = authoritativeGame("inconsistent", "player-1", 6);
    const presentation = terminalPresentation();
    expect(
      fabPostGameBackendDataFromAnalytics({ ...analytics, turns: [] }, presentation, "player-1")
        .combatValue,
    ).toBeNull();
    const firstTurn = analytics.turns[0]!;
    const stats = firstTurn.players["player-1"]!;
    const mismatched = {
      ...analytics,
      turns: [
        {
          ...firstTurn,
          players: { ...firstTurn.players, "player-1": { ...stats, attackPowerThreatened: 100 } },
        },
      ],
    };
    expect(
      fabPostGameBackendDataFromAnalytics(mismatched, presentation, "player-1").combatValue,
    ).toBeNull();
  });

  it("carries backend combat value into overview and turn analysis with explanations", () => {
    const presentation = terminalPresentation();
    const backend = fabPostGameBackendDataFromAnalytics(
      authoritativeGame("pilot", "player-1", 6),
      presentation,
      "player-1",
    );
    render(
      <FabPostGameSummary
        summary={buildSummary(backend)}
        onInspectBoard={vi.fn()}
        onMainMenu={vi.fn()}
        onPlayAgain={vi.fn()}
      />,
    );
    expect(screen.getByText("Combat value").closest("details")?.hasAttribute("open")).toBe(false);
    fireEvent.click(screen.getByText("Combat value"));
    expect(screen.getByText("Combat value").closest("details")?.hasAttribute("open")).toBe(true);
    expect(screen.getByRole("row", { name: "Total observed combat value 6 0" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Turns" }));
    fireEvent.click(screen.getByText("Combat value"));
    expect(screen.getByText("Combat value").closest("details")?.hasAttribute("open")).toBe(true);
    expect(screen.getByRole("row", { name: "1 · partial 6 0" })).toBeTruthy();
    expect(
      screen
        .getAllByRole("link", { name: /Analytics methodology/ })
        .every(
          (link) =>
            link.getAttribute("href") === "/flesh-and-blood/simulator/analytics-methodology",
        ),
    ).toBe(true);
  });

  it("switches between game and match analysis and lets the player inspect the board", () => {
    const inspectBoard = vi.fn();
    render(
      <FabPostGameSummary
        summary={buildSummary()}
        onInspectBoard={inspectBoard}
        onMainMenu={vi.fn()}
        onPlayAgain={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: "Victory" })).not.toBeNull();
    expect(screen.getByTestId("fab-summary-mock-disclosure").textContent).toContain(
      "post-match series remain illustrative",
    );

    fireEvent.click(screen.getByRole("button", { name: "Post-match" }));
    expect(screen.getByRole("heading", { name: "2–1" })).not.toBeNull();
    expect(screen.getByText("Best of three preview")).not.toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: "Inspect board" })[0]);
    expect(inspectBoard).toHaveBeenCalledOnce();
  });

  it("offers the same hosted replay actions as the shared library", () => {
    const watch = vi.fn();
    const save = vi.fn();
    const download = vi.fn();
    render(
      <FabPostGameSummary
        summary={buildSummary()}
        onWatchReplay={watch}
        onSaveReplay={save}
        onDownloadReplay={download}
        onInspectBoard={vi.fn()}
        onMainMenu={vi.fn()}
        onPlayAgain={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Watch replay" }));
    fireEvent.click(screen.getByRole("button", { name: "Save on this device" }));
    fireEvent.click(screen.getByRole("button", { name: "Download replay" }));
    expect(watch).toHaveBeenCalledOnce();
    expect(save).toHaveBeenCalledOnce();
    expect(download).toHaveBeenCalledOnce();
  });
});
