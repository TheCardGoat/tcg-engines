import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { SimulatorApp } from "../src/SimulatorApp.tsx";
import { useClientBot } from "../src/game/bot/use-client-bot.ts";
import {
  FIXTURES,
  PARAMETERIZED_FIXTURES,
  resolveFixture,
  type FixtureName,
} from "../src/game/index.ts";
import {
  reconstructFromSnapshot,
  snapshotFromDevRuntime,
  type MatchSnapshot,
  type SnapshotBotConfig,
} from "../src/game/snapshot.ts";
import { SAMPLE_DECKS, type SampleDeckId } from "../src/data/sample-decks/index.ts";
import type { OpponentStrategyId } from "../src/game/match-factory.ts";
import { VsAiSetup } from "../src/components/vs-ai-setup/index.ts";

const VALID_STRATEGIES: ReadonlySet<OpponentStrategyId> = new Set(["greedy-legal", "pass-only"]);

function isSampleDeckId(v: string | null): v is SampleDeckId {
  return v !== null && Object.hasOwn(SAMPLE_DECKS, v);
}

function isStrategyId(v: string | null): v is OpponentStrategyId {
  return v !== null && VALID_STRATEGIES.has(v as OpponentStrategyId);
}

/**
 * Parse `?deck=&opponent=&strategy=&start=1` into a validated
 * `vs-ai-match` argument bag, or `null` if any required field is
 * missing / invalid. Returning `null` sends the loader back to the
 * setup screen — no partially-configured matches.
 */
function readVsAiMatchArgs(url: URL): {
  readonly playerDeckId: SampleDeckId;
  readonly opponentDeckId: SampleDeckId;
  readonly opponentStrategy: OpponentStrategyId;
  readonly seed?: string;
} | null {
  const start = url.searchParams.get("start");
  if (start !== "1") return null;

  const deck = url.searchParams.get("deck");
  const opponent = url.searchParams.get("opponent");
  const strategy = url.searchParams.get("strategy");

  if (!isSampleDeckId(deck)) return null;
  if (!isSampleDeckId(opponent)) return null;
  if (!isStrategyId(strategy)) return null;

  const seed = url.searchParams.get("seed") ?? undefined;
  return { playerDeckId: deck, opponentDeckId: opponent, opponentStrategy: strategy, seed };
}

/**
 * Loader outcomes:
 *   - `snapshot: null` — no match to render; the component shows the
 *     `<VsAiSetup />` picker. Happens on a bare `/vs-ai` visit and on
 *     any `?fixture=X` that's unknown or needs args it didn't get.
 *   - `snapshot: MatchSnapshot` — a match is ready; the component
 *     hydrates into `<SimulatorApp />`.
 *
 * The legacy `?fixture=X` override still works for dev / Playwright
 * specs; those always skip the setup screen.
 */
export type VsAiLoaderData = { readonly snapshot: MatchSnapshot | null };

/**
 * Server-side loader — builds a snapshot when the request has
 * enough information to boot a match, or returns `null` so the
 * component renders the deck-picker UI.
 *
 * Three branches:
 *   1. `?start=1` + valid deck/opponent/strategy → boot the
 *      parameterised `vs-ai-match` fixture with real decks.
 *   2. `?fixture=X` (legacy dev override) → resolve the named
 *      fixture as before. Unknown names fall through to branch 3.
 *   3. Neither → `{ snapshot: null }` so the setup screen renders.
 *
 * The `try / finally` disposes the fixture runtime's strategy bot
 * after snapshot creation so setTimeout callbacks + onStateUpdate
 * subscriptions don't keep the discarded runtime alive beyond the
 * request.
 */
async function loadVsAiSnapshot(url: URL): Promise<VsAiLoaderData> {
  const matchArgs = readVsAiMatchArgs(url);

  // Branch 1: real-deck match via URL params.
  if (matchArgs) {
    const factory = await resolveFixture("vs-ai-match");
    const dev = factory(matchArgs);
    try {
      const botConfig: SnapshotBotConfig = { strategy: matchArgs.opponentStrategy };
      return { snapshot: snapshotFromDevRuntime("vs-ai-match", dev, { botConfig }) };
    } finally {
      dev.bot?.dispose();
    }
  }

  // Branch 2: legacy / dev `?fixture=X` override. Only honours
  // non-parameterised fixtures — a bare `?fixture=vs-ai-match` would
  // crash inside the factory without arg validation, so it falls to
  // branch 3.
  const raw = url.searchParams.get("fixture");
  const isKnown = raw !== null && Object.hasOwn(FIXTURES, raw);
  const isParameterized = isKnown && PARAMETERIZED_FIXTURES.has(raw as FixtureName);
  if (isKnown && !isParameterized) {
    const fixtureName = raw as FixtureName;
    const factory = await resolveFixture(fixtureName);
    const dev = factory();
    try {
      return { snapshot: snapshotFromDevRuntime(fixtureName, dev) };
    } finally {
      dev.bot?.dispose();
    }
  }

  // Branch 3: no match — render the setup screen. Keep this the
  // cheapest path since it's the landing page.
  return { snapshot: null };
}

type SnapshotLoadState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly snapshot: MatchSnapshot | null }
  | { readonly status: "error"; readonly message: string };

export function VsAiPage() {
  const location = useLocation();
  const [loadState, setLoadState] = useState<SnapshotLoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    const url = new URL(`${location.pathname}${location.search}`, window.location.origin);
    loadVsAiSnapshot(url)
      .then(({ snapshot }) => {
        if (!cancelled) setLoadState({ status: "ready", snapshot });
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: error instanceof Error ? error.message : "Failed to start match.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);

  if (loadState.status === "loading") {
    return <RouteStatus title="Loading match" message="Preparing the Gundam simulator." />;
  }

  if (loadState.status === "error") {
    return <RouteStatus title="Match unavailable" message={loadState.message} />;
  }

  const { snapshot } = loadState;

  if (snapshot === null) {
    return <VsAiSetup />;
  }

  return <VsAiMatch snapshot={snapshot} />;
}

function RouteStatus({ title, message }: { readonly title: string; readonly message: string }) {
  return (
    <main className="min-h-screen grid place-items-center text-hud-text">
      <div className="font-mono text-center space-y-3 px-6">
        <div className="text-hud-xs tracking-hud-label text-hud-text-faint">VS AI</div>
        <div className="text-hud-lg font-bold">{title}</div>
        <div className="text-hud-sm text-hud-text-faint max-w-md">{message}</div>
      </div>
    </main>
  );
}

/**
 * Split the match-mounting path into its own component so the top
 * level can branch without calling hooks conditionally —
 * `useMemo` / `useClientBot` only run when there's actually a
 * match to mount.
 */
function VsAiMatch({ snapshot }: { readonly snapshot: MatchSnapshot }) {
  const match = useMemo(() => reconstructFromSnapshot(snapshot), [snapshot]);
  const bot = useClientBot(
    match.fixtureName,
    match.hasBot,
    match.runtime,
    match.staticResources,
    match.botConfig,
  );

  return (
    <SimulatorApp
      runtime={match.runtime}
      staticResources={match.staticResources}
      viewerId={match.p1Id}
      bot={bot}
    />
  );
}
