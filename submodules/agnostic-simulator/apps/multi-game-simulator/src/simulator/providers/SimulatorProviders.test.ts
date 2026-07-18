import { describe, expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import type { SharedSimulatorRouteData } from "../routeData";

import { buildSimulatorProviderValues, SimulatorProviders } from "./SimulatorProviders";
import { useSimulatorTransition } from "./transition-context";

const routeData: SharedSimulatorRouteData = {
  gameSlug: "cyberpunk",
  routeKind: "live-match",
  matchId: "m1",
  gameId: "g1",
  matchResolution: null,
  error: null,
  matchPageData: {
    viewerSeat: 0,
    realtime: {
      wsUrl: "wss://gateway.example.test",
      ticket: "ticket",
      protocolVersion: 1,
    },
    match: {
      matchId: "m1",
      gameType: "cyberpunk",
      format: "constructed",
      matchType: "ranked",
      status: "in_progress",
      gameIds: ["g1"],
      participants: [
        {
          id: "p1",
          seat: 0,
          userId: "u1",
          displayName: "Current",
          mmrAtMatch: 1510,
          isPremium: true,
        },
        {
          id: "p2",
          seat: 1,
          userId: "u2",
          displayName: "Opponent",
          mmrAtMatch: 1490,
          subscriptionTier: "supporter",
        },
      ],
    },
    game: {
      gameId: "g1",
      gameNumber: 1,
      status: "in_progress",
      authority: "server",
      stateVersion: 1,
      state: {},
      cardsMaps: { cardInstances: {}, owners: {} },
    },
    userSettings: {
      locale: "en-US",
      reducedMotion: true,
    },
  },
};

describe("SimulatorProviders", () => {
  test("organizes server-loaded simulator data into concept-specific values", () => {
    const values = buildSimulatorProviderValues({
      auth: {
        user: {
          id: "u1",
          email: "player@example.test",
          name: "Account",
          displayUsername: "Player",
          emailVerified: true,
          role: "user",
          subscriptionTier: "tier2",
          createdAt: new Date(0),
          updatedAt: new Date(0),
        },
        session: {
          id: "s1",
          userId: "u1",
          token: "token",
          expiresAt: new Date(1),
          createdAt: new Date(0),
          updatedAt: new Date(0),
        },
      },
      gameSlug: "cyberpunk",
      gatewayTicket: { ticket: "ticket", authToken: "auth-token" },
      simulatorRouteData: routeData,
      viewerSettings: {
        playerSettings: { animationSpeed: "fast" },
        gameSettings: {
          cyberpunk: { visual: { cardBackId: "neon" } },
        },
      },
      rootSocketReady: true,
    });

    expect(values.route.routeKind).toBe("live-match");
    expect(values.auth).toMatchObject({
      userId: "u1",
      displayName: "Player",
      isAuthenticated: true,
      isPremium: true,
    });
    expect(values.runtime).toMatchObject({
      gameSlug: "cyberpunk",
      rootSocketReady: true,
    });
    expect(values.match.match?.matchId).toBe("m1");
    expect(values.game.game?.gameId).toBe("g1");
    expect(values.players.currentPlayer).toMatchObject({ isPremium: true, mmr: 1510 });
    expect(values.players.opponentPlayer).toMatchObject({ isPremium: true, mmr: 1490 });
    expect(values.userSettings.userSettings?.locale).toBe("en-US");
    expect(values.userSettings.viewerSettings).toMatchObject({
      playerSettings: { animationSpeed: "fast" },
      gameSettings: { cyberpunk: { visual: { cardBackId: "neon" } } },
    });
    expect(values.diagnostics).toMatchObject({
      matchId: "m1",
      gameId: "g1",
      error: null,
    });
  });

  test("seeds transition state from server-loaded game snapshots", async () => {
    render(
      createElement(
        SimulatorProviders,
        {
          auth: null,
          gameSlug: "cyberpunk",
          gatewayTicket: null,
          simulatorRouteData: routeData,
        },
        createElement(TransitionProbe),
      ),
    );

    await waitFor(() => {
      expect(screen.getByTestId("display-game").textContent).toBe("g1:1");
    });
    expect(screen.getByTestId("authoritative-game").textContent).toBe("g1:1");
    expect(screen.getByTestId("active-transition").textContent).toBe("none");
  });
});

function TransitionProbe() {
  const transition = useSimulatorTransition();
  return createElement(
    "div",
    null,
    createElement(
      "span",
      { "data-testid": "display-game" },
      transition.displayGame
        ? `${transition.displayGame.gameId}:${transition.displayGame.stateVersion}`
        : "none",
    ),
    createElement(
      "span",
      { "data-testid": "authoritative-game" },
      transition.authoritativeGame
        ? `${transition.authoritativeGame.gameId}:${transition.authoritativeGame.stateVersion}`
        : "none",
    ),
    createElement(
      "span",
      { "data-testid": "active-transition" },
      transition.activeTransition?.id ?? "none",
    ),
  );
}
