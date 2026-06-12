import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { expandDeck, type MatchRuntime, type MatchStaticResources } from "@tcg/gundam-engine";

import {
  SAMPLE_DECKS,
  buildGundamCardCatalog,
  type SampleDeckId,
} from "../src/data/sample-decks/index.ts";
import {
  createDevRuntime,
  resetDevRuntimeInstanceCounter,
  type DevRuntime,
} from "../src/game/dev-runtime.ts";
import { asViewerId } from "../src/game/types.ts";
import {
  reconstructFromSnapshot,
  snapshotFromDevRuntime,
  type MatchSnapshot,
} from "../src/game/snapshot.ts";
import { useLayoutMode } from "../src/lib/use-layout-mode.ts";
import {
  AttackTargetingOverlayContainer,
  MatchOverviewModalContainer,
  PendingEffectsContainer,
  PlayerSeatContainer,
  PromptContainer,
  SetupPromptContainer,
  SubmitErrorProvider,
} from "../src/components/containers/index.ts";
import { SubmitErrorToast } from "../src/components/ui/SubmitErrorToast.tsx";
import { TargetingProvider } from "../src/components/ui/targeting-context.tsx";
import { DualModeProvider } from "../src/components/ui/dual-mode-context.tsx";
import { PendingEffectSelectionProvider } from "../src/components/ui/pending-effect-selection-context.tsx";
import { GameBoard } from "../src/components/ui/GameBoard.tsx";
import { GameTable } from "../src/components/ui/GameTable.tsx";
import { PhaseRibbon } from "../src/components/ui/PhaseRibbon.tsx";
import { PriorityActionButton } from "../src/components/ui/PriorityActionButton.tsx";
import { HintsProvider } from "../src/lib/use-hints-enabled.ts";
import { createEngineAdapter } from "../src/game/adapter.ts";
import { createPendingController } from "../src/game/pending.ts";
import { createGameStore } from "../src/game/store.ts";
import { GundamGameContext } from "../src/game/context-internals.ts";
import type { ViewerId } from "../src/game/types.ts";

const VALID_DECKS = new Set(Object.keys(SAMPLE_DECKS));

function isSampleDeckId(v: string | null): v is SampleDeckId {
  return v !== null && VALID_DECKS.has(v);
}

function readDeck(url: URL, key: string, fallback: SampleDeckId): SampleDeckId {
  const value = url.searchParams.get(key);
  return isSampleDeckId(value) ? value : fallback;
}

function createBotBenchRuntime(url: URL): DevRuntime {
  resetDevRuntimeInstanceCounter();
  const catalog = buildGundamCardCatalog();
  const p1Deck = expandDeck(SAMPLE_DECKS[readDeck(url, "p1Deck", "ef-starter")], { catalog });
  const p2Deck = expandDeck(SAMPLE_DECKS[readDeck(url, "p2Deck", "ef-starter")], { catalog });
  return createDevRuntime({
    seed: url.searchParams.get("seed") ?? "bot-bench-ui",
    skipToMainPhase: false,
    p1: { deck: p1Deck.deck, resourceDeck: p1Deck.resourceDeck },
    p2: { deck: p2Deck.deck, resourceDeck: p2Deck.resourceDeck },
  });
}

export type BotBenchUiLoaderData = { readonly snapshot: MatchSnapshot };

async function loadBotBenchSnapshot(url: URL): Promise<BotBenchUiLoaderData> {
  if (import.meta.env.PROD && import.meta.env.VITE_BOT_BENCH_UI_ENABLED !== "1") {
    throw new Error("Bot bench UI is not available in production.");
  }
  const dev = createBotBenchRuntime(url);
  return { snapshot: snapshotFromDevRuntime("bot-bench-ui", dev) };
}

interface BotBenchGameProviderProps {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly children: ReactNode;
}

function BotBenchGameProvider({
  runtime,
  staticResources,
  viewerId,
  children,
}: BotBenchGameProviderProps) {
  const value = useMemo(() => {
    const adapter = createEngineAdapter({ runtime, staticResources, viewerId });
    const store = createGameStore(adapter);
    const pending = createPendingController(adapter);
    return { adapter, store, pending, viewerId };
  }, [runtime, staticResources, viewerId]);

  useEffect(() => {
    return () => value.store.dispose();
  }, [value]);

  return <GundamGameContext.Provider value={value}>{children}</GundamGameContext.Provider>;
}

type BotBenchLoadState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly snapshot: MatchSnapshot }
  | { readonly status: "error"; readonly message: string };

export function BotBenchUiPage() {
  const location = useLocation();
  const [loadState, setLoadState] = useState<BotBenchLoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    const url = new URL(`${location.pathname}${location.search}`, window.location.origin);
    loadBotBenchSnapshot(url)
      .then(({ snapshot }) => {
        if (!cancelled) setLoadState({ status: "ready", snapshot });
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: error instanceof Error ? error.message : "Failed to start bot bench.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.search]);

  if (loadState.status === "loading") {
    return <RouteStatus title="Loading bot bench" message="Preparing the bench runtime." />;
  }
  if (loadState.status === "error") {
    return <RouteStatus title="Bot bench unavailable" message={loadState.message} />;
  }
  return <BotBenchMatch snapshot={loadState.snapshot} />;
}

function BotBenchMatch({ snapshot }: { readonly snapshot: MatchSnapshot }) {
  const match = useMemo(() => reconstructFromSnapshot(snapshot), [snapshot]);
  const state = useSyncExternalStore(
    (listener) => match.runtime.onStateUpdate(listener),
    () => match.runtime.getState(),
    () => match.runtime.getState(),
  );
  const activePlayer = state.ctx.status.activePlayer;
  const layoutMode = useLayoutMode();
  const isMobile = layoutMode === "mobile";
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <BotBenchGameProvider
      runtime={match.runtime}
      staticResources={match.staticResources}
      viewerId={asViewerId(String(activePlayer))}
    >
      <SubmitErrorProvider>
        <HintsProvider>
          <TargetingProvider>
            <PendingEffectSelectionProvider>
              <DualModeProvider>
                <GameBoard
                  isMobile={isMobile}
                  drawerOpen={drawerOpen}
                  onDrawerOpenChange={setDrawerOpen}
                >
                  <GameTable>
                    <PlayerSeatContainer side="top" />
                    {!isMobile && (
                      <div className="relative h-0">
                        <div className="centerline -top-px" />
                        <PhaseRibbon />
                      </div>
                    )}
                    <PlayerSeatContainer side="bottom" />
                    <PromptContainer />
                    <SetupPromptContainer />
                    {!isMobile && <PriorityActionButton />}
                    <AttackTargetingOverlayContainer />
                    <PendingEffectsContainer />
                    <MatchOverviewModalContainer />
                    <SubmitErrorToast />
                  </GameTable>
                </GameBoard>
                <pre data-testid="bot-bench-state" hidden>
                  {JSON.stringify({
                    stateId: state.ctx._stateID,
                    activePlayer: state.ctx.status.activePlayer,
                    phase: state.ctx.status.phase,
                    step: state.ctx.status.step,
                    gameEnded: state.ctx.status.gameEnded,
                  })}
                </pre>
              </DualModeProvider>
            </PendingEffectSelectionProvider>
          </TargetingProvider>
        </HintsProvider>
      </SubmitErrorProvider>
    </BotBenchGameProvider>
  );
}

function RouteStatus({ title, message }: { readonly title: string; readonly message: string }) {
  return (
    <main className="min-h-screen grid place-items-center text-hud-text">
      <div className="font-mono text-center space-y-3 px-6">
        <div className="text-hud-xs tracking-hud-label text-hud-text-faint">BOT BENCH</div>
        <div className="text-hud-lg font-bold">{title}</div>
        <div className="text-hud-sm text-hud-text-faint max-w-md">{message}</div>
      </div>
    </main>
  );
}
