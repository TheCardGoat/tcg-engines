import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { useLayoutMode } from "../src/lib/use-layout-mode.ts";
import { useClientBot } from "../src/game/bot/use-client-bot.ts";
import { resolveFixture } from "../src/game/index.ts";
import {
  reconstructFromSnapshot,
  snapshotFromDevRuntime,
  type MatchSnapshot,
  type SnapshotBotConfig,
} from "../src/game/snapshot.ts";
import type { BotVsBotArgs } from "../src/game/fixtures/bot-vs-bot.ts";
import { SAMPLE_DECKS, type SampleDeckId } from "../src/data/sample-decks/index.ts";
import {
  MatchOverviewModalContainer,
  MatchStatusBarContainer,
  PlayerSeatContainer,
  SubmitErrorProvider,
  GundamTargetingProvider,
} from "../src/components/containers/index.ts";
import { SubmitErrorToast } from "../src/components/ui/SubmitErrorToast.tsx";
import { CardHoverPreview } from "../src/components/ui/card/CardHoverPreview.tsx";
import { CardInspectProvider } from "../src/components/ui/card/card-inspect-context.tsx";
import { DualModeProvider } from "../src/components/ui/dual-mode-context.tsx";
import { PendingEffectSelectionProvider } from "../src/components/ui/pending-effect-selection-context.tsx";
import { CardInspectDialog } from "../src/components/ui/CardInspectDialogContainer.tsx";
import { GundamBoardLayout } from "../src/components/ui/GundamBoardLayout.tsx";
import { GameTable } from "../src/components/ui/GameTable.tsx";
import { HintsProvider } from "../src/lib/use-hints-enabled.ts";
import { SpectatorGundamGameProvider } from "../src/engine/spectator/SpectatorGundamGameProvider.tsx";
import { GundamSharedAnimationLayer } from "../src/animation/index.ts";

const VALID_DECKS = new Set(Object.keys(SAMPLE_DECKS));
const VALID_STRATEGIES = new Set([
  "combat-aware",
  "greedy-legal",
  "pass-only",
  "strategic",
  "tempo",
  "value-ranked",
]);
const VALID_SPEEDS = new Set(["fast", "balanced", "slow"]);

function isSampleDeckId(v: string | null): v is SampleDeckId {
  return v !== null && VALID_DECKS.has(v);
}

function isStrategyId(v: string | null): v is NonNullable<BotVsBotArgs["p1Strategy"]> {
  return v !== null && VALID_STRATEGIES.has(v);
}

function readArgs(url: URL): BotVsBotArgs {
  // Build a mutable scratch object first because BotVsBotArgs's
  // fields are `readonly` — direct assignment would fail
  // type-check. Cast to the readonly shape once at return.
  const scratch: {
    p1DeckId?: SampleDeckId;
    p2DeckId?: SampleDeckId;
    p1Strategy?: NonNullable<BotVsBotArgs["p1Strategy"]>;
    p2Strategy?: NonNullable<BotVsBotArgs["p2Strategy"]>;
    botSpeed?: NonNullable<BotVsBotArgs["botSpeed"]>;
    seed?: string;
  } = {};
  const p1Deck = url.searchParams.get("p1Deck");
  if (isSampleDeckId(p1Deck)) scratch.p1DeckId = p1Deck;
  const p2Deck = url.searchParams.get("p2Deck");
  if (isSampleDeckId(p2Deck)) scratch.p2DeckId = p2Deck;
  const p1Strategy = url.searchParams.get("p1Strategy");
  if (isStrategyId(p1Strategy)) scratch.p1Strategy = p1Strategy;
  const p2Strategy = url.searchParams.get("p2Strategy");
  if (isStrategyId(p2Strategy)) scratch.p2Strategy = p2Strategy;
  const speed = url.searchParams.get("speed");
  if (speed && VALID_SPEEDS.has(speed)) {
    scratch.botSpeed = speed as NonNullable<BotVsBotArgs["botSpeed"]>;
  }
  const seed = url.searchParams.get("seed");
  if (seed) scratch.seed = seed;
  return scratch;
}

export type BotVsBotLoaderData = { readonly snapshot: MatchSnapshot };

/**
 * `/bot-vs-bot` — spectator view of two strategy bots playing each
 * other.
 *
 * Browser-only: no backend wiring. The loader builds the SSR
 * snapshot from `loadBotVsBot`, the client hydrates it into a fresh
 * `MatchRuntime`, and `useClientBot` re-attaches a strategy bot to
 * BOTH seats via the `bot-vs-bot` entry in `bot-registry.ts`. From
 * the user's perspective the page just renders the gundam board and
 * watches the bots play.
 *
 * Query string overrides (all optional):
 *   - `?p1Deck=<SampleDeckId>` / `?p2Deck=<SampleDeckId>` — pick
 *     which sample deck each seat uses. Defaults to `ef-starter` on
 *     both sides.
 *   - `?p1Strategy=<id>` / `?p2Strategy=<id>` — pick strategies from
 *     greedy-legal / strategic / value-ranked / tempo / pass-only. Defaults to
 *     greedy-legal vs value-ranked.
 *   - `?speed=fast|balanced|slow` — choose spectator pacing.
 *   - `?seed=...` — deterministic shuffle seed for reproducible
 *     matches.
 */
async function loadBotVsBotSnapshot(url: URL): Promise<BotVsBotLoaderData> {
  const args = readArgs(url);
  const factory = await resolveFixture("bot-vs-bot");
  const dev = factory(args);
  try {
    const botConfig: SnapshotBotConfig = {
      strategy: args.p1Strategy ?? "greedy-legal",
      opponentStrategy: args.p2Strategy ?? "value-ranked",
      ...(args.botSpeed ? { speed: args.botSpeed } : {}),
    };
    return { snapshot: snapshotFromDevRuntime("bot-vs-bot", dev, { botConfig }) };
  } finally {
    dev.bot?.dispose();
  }
}

type BotVsBotLoadState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly snapshot: MatchSnapshot }
  | { readonly status: "error"; readonly message: string };

export function BotVsBotPage() {
  const location = useLocation();
  const [loadState, setLoadState] = useState<BotVsBotLoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    const url = new URL(`${location.pathname}${location.search}`, window.location.origin);
    loadBotVsBotSnapshot(url)
      .then(({ snapshot }) => {
        if (!cancelled) setLoadState({ status: "ready", snapshot });
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: error instanceof Error ? error.message : "Failed to start bot match.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);

  if (loadState.status === "loading") {
    return <RouteStatus title="Loading bot match" message="Preparing the spectator board." />;
  }
  if (loadState.status === "error") {
    return <RouteStatus title="Bot match unavailable" message={loadState.message} />;
  }
  return <BotVsBotMatch snapshot={loadState.snapshot} />;
}

function BotVsBotMatch({ snapshot }: { readonly snapshot: MatchSnapshot }) {
  const match = useMemo(() => reconstructFromSnapshot(snapshot), [snapshot]);

  // `useClientBot` returns the P2 handle (the registry's attacher
  // surfaces the P2 strategy bot via `handle`). The hook also
  // attaches P1's bot as a side effect — disposing both on unmount.
  useClientBot(
    match.fixtureName,
    match.hasBot,
    match.runtime,
    match.staticResources,
    match.botConfig,
  );

  return (
    <BotVsBotShell
      runtime={match.runtime}
      staticResources={match.staticResources}
      viewerId={match.p1Id}
    />
  );
}

interface BotVsBotShellProps {
  readonly runtime: ReturnType<typeof reconstructFromSnapshot>["runtime"];
  readonly staticResources: ReturnType<typeof reconstructFromSnapshot>["staticResources"];
  readonly viewerId: ReturnType<typeof reconstructFromSnapshot>["p1Id"];
}

export function BotVsBotShell({ runtime, staticResources, viewerId }: BotVsBotShellProps) {
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";

  const matchTree = (
    <GundamBoardLayout>
      <GameTable>
        <PlayerSeatContainer side="top" />
        {!isMobile && <MatchStatusBarContainer />}
        <PlayerSeatContainer side="bottom" />

        <MatchOverviewModalContainer />
        <SubmitErrorToast />
      </GameTable>
    </GundamBoardLayout>
  );

  return (
    <SpectatorGundamGameProvider
      runtime={runtime}
      staticResources={staticResources}
      viewerId={viewerId}
    >
      <SubmitErrorProvider>
        <HintsProvider>
          <GundamTargetingProvider>
            <PendingEffectSelectionProvider>
              <DualModeProvider>
                <CardInspectProvider>
                  <GundamSharedAnimationLayer runtime={runtime}>
                    {matchTree}
                  </GundamSharedAnimationLayer>
                  <CardHoverPreview />
                  <CardInspectDialog />
                  <SpectatorBadge />
                </CardInspectProvider>
              </DualModeProvider>
            </PendingEffectSelectionProvider>
          </GundamTargetingProvider>
        </HintsProvider>
      </SubmitErrorProvider>
    </SpectatorGundamGameProvider>
  );
}

function SpectatorBadge() {
  return (
    <div className="fixed top-4 right-4 z-50 rounded-md bg-black/80 px-3 py-1.5 font-mono text-hud-xs uppercase tracking-hud-label text-hud-text max-md:hidden">
      <span className="text-hud-text-faint">mode</span> · spectator
    </div>
  );
}

function RouteStatus({ title, message }: { readonly title: string; readonly message: string }) {
  return (
    <main className="min-h-screen grid place-items-center text-hud-text">
      <div className="font-mono text-center space-y-3 px-6">
        <div className="text-hud-xs tracking-hud-label text-hud-text-faint">BOT VS BOT</div>
        <div className="text-hud-lg font-bold">{title}</div>
        <div className="text-hud-sm text-hud-text-faint max-w-md">{message}</div>
      </div>
    </main>
  );
}
