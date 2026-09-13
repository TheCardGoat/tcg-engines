import { Suspense, lazy, type ComponentType } from "react";
import { TesterHub, type TesterHubProps } from "@tcg/simulator-ui/components/TesterHub";

type TesterHubDescriptor = Omit<TesterHubProps, "footer">;
export type TesterHubGame =
  | "flesh-and-blood"
  | "riftbound"
  | "one-piece"
  | "gundam"
  | "cyberpunk"
  | "naruto";

export const TESTER_HUB_GAMES = [
  "flesh-and-blood",
  "riftbound",
  "one-piece",
  "gundam",
  "cyberpunk",
  "naruto",
] as const satisfies readonly TesterHubGame[];

const base = (game: string) => `/${game}/simulator`;
const fixtureHref = (game: string, id: string) => `${base(game)}/tests/${encodeURIComponent(id)}`;

async function loadFleshAndBloodHub(): Promise<TesterHubDescriptor> {
  const { FAB_FIXTURE_GROUPS, FAB_VISUAL_FIXTURES } =
    await import("../games/flesh-and-blood/fixtures");
  return {
    title: "Flesh & Blood tester hub",
    description:
      "Launch engine-backed local games or inspect deterministic board and responsive-layout fixtures.",
    fixtureGroups: FAB_FIXTURE_GROUPS.map(({ id, label, description }) => ({
      id,
      label,
      description,
    })),
    fixtures: FAB_VISUAL_FIXTURES.map((fixture) => ({
      id: fixture.id,
      groupId: fixture.group,
      title: fixture.label,
      description: fixture.description,
      href: fixtureHref("flesh-and-blood", fixture.id),
      metadata: fixture.tags,
    })),
    sections: [
      {
        id: "local",
        title: "Local verification",
        capabilities: [
          {
            id: "fab-practice",
            kind: "practice",
            title: "Practice versus bot",
            description: "Run the real local play surface with fixture decks.",
            href: `${base("flesh-and-blood")}/play/practice`,
          },
        ],
      },
    ],
  };
}

async function loadRiftboundHub(): Promise<TesterHubDescriptor> {
  return {
    title: "Riftbound tester hub",
    description:
      "Inspect client-authoritative tabletop behavior, animation fixtures, and gateway-backed rooms.",
    fixtureGroups: [{ id: "animation", label: "Tabletop animation" }],
    fixtures: [
      {
        id: "tabletop-animation",
        groupId: "animation",
        title: "Tabletop animation controls",
        description: "Exercise ready, face, counter, shuffle, and result transitions.",
        href: `${base("riftbound")}/tests`,
        metadata: ["official fixture cards"],
      },
    ],
    sections: [
      {
        id: "surfaces",
        title: "Testing surfaces",
        capabilities: [
          {
            id: "riftbound-rooms",
            kind: "live-match",
            title: "Private rooms",
            description: "Create or join a gateway-backed room before opening the shared tabletop.",
            href: "/riftbound/matchmaking",
          },
          {
            id: "riftbound-replay",
            kind: "replay",
            title: "Replay route",
            description: "Open a recorded game through the replay viewer.",
            href: `${base("riftbound")}/replay/:gameId`,
            requirements: ["gameId"],
          },
        ],
      },
    ],
  };
}

async function loadOnePieceHub(): Promise<TesterHubDescriptor> {
  const { ONE_PIECE_VISUAL_FIXTURE_GROUPS, ONE_PIECE_VISUAL_FIXTURES } =
    await import("../games/one-piece/data/visualFixtures");
  return {
    title: "One Piece tester hub",
    description:
      "Start local practice, open named board fixtures, or hand a serialized engine state to the simulator.",
    fixtureGroups: ONE_PIECE_VISUAL_FIXTURE_GROUPS,
    fixtures: ONE_PIECE_VISUAL_FIXTURES.map((fixture) => ({
      id: fixture.id,
      groupId: fixture.group,
      title: fixture.label,
      description: fixture.description,
      href: fixtureHref("one-piece", fixture.id),
    })),
    sections: [
      {
        id: "local",
        title: "Local and deterministic states",
        capabilities: [
          {
            id: "one-piece-practice",
            kind: "practice",
            title: "Practice",
            description: "Start the local One Piece practice surface.",
            href: `${base("one-piece")}/practice`,
          },
          {
            id: "one-piece-state",
            kind: "state",
            title: "Serialized engine state",
            description: "Open a state supplied by the harness.",
            href: `${base("one-piece")}/tests/test-engine-state?state=:encoded-state`,
            requirements: ["state query parameter"],
          },
        ],
      },
    ],
  };
}

async function loadGundamHub(): Promise<TesterHubDescriptor> {
  const { GUNDAM_FIXTURE_GROUPS, GUNDAM_FIXTURE_SCENARIOS } =
    await import("../games/gundam/src/game/fixtures/scenarios");
  return {
    title: "Gundam tester hub",
    description:
      "Reach local play, fixtures, server-backed match inspection, replay work, and bot diagnostics from one route directory.",
    fixtureGroups: GUNDAM_FIXTURE_GROUPS.map((label) => ({ id: label, label })),
    fixtures: GUNDAM_FIXTURE_SCENARIOS.map((fixture) => ({
      id: fixture.id,
      groupId: fixture.group,
      title: fixture.label,
      description: fixture.description,
      href: fixtureHref("gundam", fixture.id),
      metadata: [fixture.instructions, fixture.startPoint, ...(fixture.cards ?? [])],
    })),
    sections: [
      {
        id: "play",
        title: "Play and fixtures",
        capabilities: [
          {
            id: "gundam-practice",
            kind: "practice",
            title: "Practice versus AI",
            description: "Open the local practice setup.",
            href: `${base("gundam")}/practice`,
          },
          {
            id: "gundam-state",
            kind: "state",
            title: "Serialized engine state",
            description: "Render an engine state delivered by a test harness.",
            href: `${base("gundam")}/tests/test-engine-state?handoff=:encoded-state`,
            requirements: ["handoff query parameter"],
          },
        ],
      },
      {
        id: "integration",
        title: "Integration diagnostics",
        capabilities: [
          {
            id: "gundam-match",
            kind: "live-match",
            title: "Live match",
            description: "Resolve and inspect a server-authoritative match.",
            href: `${base("gundam")}/matches/:matchId`,
            requirements: ["matchId"],
          },
          {
            id: "gundam-replay",
            kind: "replay",
            title: "Replay",
            description: "Open or fork a recorded game.",
            href: `${base("gundam")}/replay/:gameId`,
            requirements: ["gameId"],
          },
          {
            id: "gundam-bots",
            kind: "bots",
            title: "Bot benches",
            description: "Run bot-versus-bot or inspect the bot bench UI.",
            href: `${base("gundam")}/bot-vs-bot`,
            featured: [
              {
                title: "Bot bench UI",
                description: "Inspect bot decisions and controls.",
                href: `${base("gundam")}/bot-bench-ui`,
              },
            ],
          },
        ],
      },
    ],
  };
}

async function loadCyberpunkHub(): Promise<TesterHubDescriptor> {
  const { listScenarios, SCENARIO_GROUPS } = await import("../games/cyberpunk/engine");
  return {
    title: "Cyberpunk tester hub",
    description:
      "Use named engine boards, local practice, match/replay workflows, and deck tooling without hiding specialized QA paths.",
    fixtureGroups: SCENARIO_GROUPS,
    fixtures: listScenarios().map((fixture) => ({
      id: fixture.id,
      groupId: fixture.group,
      title: fixture.label,
      description: fixture.description,
      href: fixtureHref("cyberpunk", fixture.id),
    })),
    sections: [
      {
        id: "local",
        title: "Local and deterministic states",
        capabilities: [
          {
            id: "cyberpunk-practice",
            kind: "practice",
            title: "Practice versus AI",
            description: "Start a local practice session.",
            href: `${base("cyberpunk")}/practice`,
          },
          {
            id: "cyberpunk-state",
            kind: "state",
            title: "Serialized engine state",
            description: "Render a harness-provided state.",
            href: `${base("cyberpunk")}/tests/test-engine-state?state=:encoded-state`,
            requirements: ["state query parameter"],
          },
        ],
      },
      {
        id: "integration",
        title: "Integration and tools",
        capabilities: [
          {
            id: "cyberpunk-matchmaking",
            kind: "live-match",
            title: "Matchmaking and saved replays",
            description: "Create a test match or open a stored replay.",
            href: `${base("cyberpunk")}/matchmaking`,
          },
          {
            id: "cyberpunk-replay",
            kind: "replay",
            title: "Replay route",
            description: "Open or fork a specific recorded game.",
            href: `${base("cyberpunk")}/replay/:gameId`,
            requirements: ["gameId"],
          },
          {
            id: "cyberpunk-decks",
            kind: "decks",
            title: "Deck tools",
            description: "Browse indexable simulator decks and open a practice match.",
            href: `${base("cyberpunk")}/decks`,
            featured: [
              {
                title: "Practice match",
                description: "Open a saved practice match configuration.",
                href: `${base("cyberpunk")}/practice/:matchId`,
              },
            ],
          },
        ],
      },
    ],
  };
}

async function loadNarutoHub(): Promise<TesterHubDescriptor> {
  const { NARUTO_FIXTURE_GROUPS, NARUTO_FIXTURES } =
    await import("../games/naruto/stories/fixtures");
  return {
    title: "Naruto Preview tester hub",
    description:
      "A route directory for the provisional Naruto engine: local practice, named board states, harness handoffs, and live match inspection.",
    notices: [
      "Offline practice uses provisional rules; this is not an official game client or a live-match service.",
      "Community-preview card art is included for this prototype. Rules and card text remain provisional.",
    ],
    fixtureGroups: NARUTO_FIXTURE_GROUPS,
    fixtures: NARUTO_FIXTURES.map((fixture) => ({
      id: fixture.id,
      groupId: fixture.group,
      title: fixture.label,
      description: fixture.description,
      href: fixtureHref("naruto", fixture.id),
    })),
    sections: [
      {
        id: "local",
        title: "Local and visual verification",
        capabilities: [
          {
            id: "naruto-practice",
            kind: "practice",
            title: "Deterministic practice",
            description: "Choose preview decks, an AI or hot-seat opponent, and a seed.",
            href: `${base("naruto")}/practice`,
          },
        ],
      },
      {
        id: "handoff",
        title: "Harness and live-route handoffs",
        capabilities: [
          {
            id: "naruto-state",
            kind: "state",
            title: "Serialized engine state",
            description:
              "Render a GameState supplied by the test harness; this directory does not create state payloads.",
            href: `${base("naruto")}/tests/test-engine-state?state=:encoded-state`,
            requirements: ["state query parameter"],
          },
          {
            id: "naruto-match",
            kind: "live-match",
            title: "Live match inspection",
            description:
              "Resolve an existing match and open its current server-authoritative game.",
            href: `${base("naruto")}/matches/:matchId`,
            requirements: ["matchId"],
          },
        ],
      },
    ],
  };
}

const HUB_LOADERS: Record<TesterHubGame, () => Promise<TesterHubDescriptor>> = {
  "flesh-and-blood": loadFleshAndBloodHub,
  riftbound: loadRiftboundHub,
  "one-piece": loadOnePieceHub,
  gundam: loadGundamHub,
  cyberpunk: loadCyberpunkHub,
  naruto: loadNarutoHub,
};

export async function loadTesterHub(game: TesterHubGame): Promise<TesterHubDescriptor> {
  return HUB_LOADERS[game]();
}

function hubPage(game: TesterHubGame): ComponentType {
  return lazy(async () => {
    const descriptor = await HUB_LOADERS[game]();
    return {
      default: function GameTesterHub() {
        return <TesterHub {...descriptor} />;
      },
    };
  });
}

const HUB_PAGES: Record<TesterHubGame, ComponentType> = {
  "flesh-and-blood": hubPage("flesh-and-blood"),
  riftbound: hubPage("riftbound"),
  "one-piece": hubPage("one-piece"),
  gundam: hubPage("gundam"),
  cyberpunk: hubPage("cyberpunk"),
  naruto: hubPage("naruto"),
};

export function TesterHubPage({ game }: { readonly game: TesterHubGame }) {
  const Page = HUB_PAGES[game];
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
}
