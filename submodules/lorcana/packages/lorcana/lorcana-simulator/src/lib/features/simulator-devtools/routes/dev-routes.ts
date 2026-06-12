import { LORCANA_SIMULATOR_FIXTURE_LIST } from "@/features/simulator-devtools/fixtures";
import { LORCANA_REGRESSION_FIXTURE_LIST } from "@/features/simulator-devtools/fixtures/regressions";
import {
  buildFixtureTestRouteHref,
  REGRESSION_FIXTURE_INDEX_ROUTE,
} from "@/features/simulator-devtools/routes/test-routes.js";

export type RouteLink = {
  href: string;
  label: string;
  description: string;
};

export type RoutePattern = {
  pattern: string;
  description: string;
};

export const staticRouteLinks: RouteLink[] = [
  {
    href: "/test",
    label: "Browser Harness",
    description: "Open the previous root harness page for fixture and view-based testing.",
  },
  {
    href: "/matchmaking",
    label: "Matchmaking",
    description: "Create or join a live match and navigate into active game sessions.",
  },
  {
    href: "/matchmaking/archetype",
    label: "Archetype Matchmaking",
    description: "Browse player-created matches and create a new archetype-based room.",
  },
  {
    href: "/sandbox/simulator",
    label: "Sandbox Simulator",
    description: "Open the local simulator harness with fixture-driven tabletop state.",
  },
  {
    href: "/sandbox/simulator/ai-match",
    label: "AI vs AI Match Setup",
    description: "Configure and launch an automated AI versus AI simulation.",
  },
  {
    href: "/sandbox/simulator/vs-ai",
    label: "Human vs AI Match Setup",
    description: "Prepare a playable local match against the AI opponent.",
  },
];

export const generalFixtureRouteLinks: RouteLink[] = LORCANA_SIMULATOR_FIXTURE_LIST.map(
  (fixture) => ({
    href: buildFixtureTestRouteHref(fixture.id),
    label: fixture.name,
    description: fixture.description,
  }),
);

export const visualValidationRouteLinks: RouteLink[] = [
  {
    href: "/tests/test?fixtureId=triage-2026-05-17-hades-target-clarity&view=playerOne&visual=hades-target-clarity&aiPlayMode=step",
    label: "Hades target clarity - take over opponent",
    description:
      "Open the Hades - Looking for a Deal repro from the Hades player's view, then take control of the AI opponent. Expected: only the opponent view shows the Simba - Protective Cub choice prompt.",
  },
];

export const regressionRouteLink: RouteLink = {
  href: REGRESSION_FIXTURE_INDEX_ROUTE,
  label: "Regression Fixtures",
  description:
    "Browse saved player-reported repro setups and open the dedicated regression test routes.",
};

export const regressionFixtureCount = LORCANA_REGRESSION_FIXTURE_LIST.length;

export const routePatterns: RoutePattern[] = [
  {
    pattern: "/match/[gameId]",
    description: "Player match route that requires a real game id.",
  },
  {
    pattern: "/spectate/[gameId]",
    description: "Spectator route that requires a live game id.",
  },
];
