import {
  captureFabZoneLocations,
  fabLatestAnnouncementTransition,
  fabHiddenZoneTransfers,
  type FabZoneLocations,
} from "@tcg/flesh-and-blood-server-adapter/animation";
import { fixturePresentationDefinitions } from "./fixture-presentation";
import { useSyncExternalStore } from "react";
import { FabMatchClockFixture } from "./FabMatchClock.fixture";
import { FabHistoryFixture } from "./FabHistory.fixture";
import { persistFabPracticePreparation, restoreFabPracticePreparation } from "./practice-session";
import {
  classifyFabPracticeUndoMove,
  fabPracticeUndoBlockedByBarrier,
  nextFabPracticeUndoPoint,
  type FabPracticeUndoPoint,
} from "./practice-undo";
import { FabPracticePreparation } from "./FabFirstPlayerChoice";
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { animateView } from "motion";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  FAB_AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_BOT_DECK_ID,
  DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID,
  createFabMatchContext,
  getSafeFabAutomatedActionStrategyOption,
  chooseAutomatedAction,
  decodeFabCommand,
  botEligibleFabCommands,
  listLegalCommands,
  seatMustAct,
  submitAutomatedAction,
  seedFromString,
  nextRandom,
  type FabCommandExecutionContext,
  type FabLegalCommand,
  FabMatchRuntime,
  restoreFabMatchSnapshot,
  visibleFabPlayerLogMessages,
  type FabMatchSnapshotV21,
  type FabMoveLog,
  type FabPlayerLog,
  type FabPracticeMatch,
  type FabWaitState,
} from "@tcg/flesh-and-blood-engine/simulator";
import {
  buildFabGameAnalyticsV2,
  projectFabAnalyticsFactsV2,
  type FabAnalyticsPlayerSeedV2,
  type FabAnalyticsTransitionReceiptV2,
} from "@tcg/flesh-and-blood-server-adapter";
import { fabBoardTransfers } from "./transfers";
import {
  commandForFabSubmission,
  projectFabInteraction,
} from "@tcg/flesh-and-blood-server-adapter/interaction";
import type { InteractionSubmission } from "@tcg/protocol";
import { safeStringify } from "@tcg/simulator-runtime/debug";
import {
  AiControlPanel,
  type AiControlPanelProps,
  type SimulatorActivityTab,
  type SimulatorTransitionSettledEvent,
} from "@tcg/simulator-ui";

import type { ResolvedPracticeSeat } from "./data/resolve-text-deck";
import {
  getFabPracticeMatchupFixture,
  type FabPracticeMatchupCatalogFixture,
} from "./practice-matchup-fixtures";
import {
  FAB_ENGINE_SCENARIOS,
  getFabEngineScenario,
  type FabEngineScenario,
  type FabScenarioBotMode,
} from "./engineScenarios";
import {
  FabPriorityAutomationParticipantMenuItems,
  FabPriorityAutomationSettingsPanel,
  FleshAndBloodTabletop,
  type FabAnimationTransition,
} from "./FleshAndBloodTabletop";
import { fabAutomationSeedForSeat, useFabAutomationSettings } from "./fab-automation-settings";
import {
  EMPTY_FAB_CARD_ART,
  type FabCardArtResolver,
  definitionsForFabMatchPresentation,
} from "./cardArt";
import {
  FabPresentationCatalogProvider,
  useFabPresentationRegistry,
  useFabCardLocale,
} from "./FabPresentationCatalog";
import {
  fabPregameDefinitionName,
  fabPregameDefinitionTypes,
  FabPregameSideboard,
} from "./FabPregameSideboard";
import { FabPostGameSummary } from "./FabPostGameSummary";
import { FabSymbolText } from "./FabSymbolText";
import { FabPostGameSummaryFixturePage } from "./FabPostGameSummary.fixture";
import { projectFabPostGameSessionAnalytics } from "./FabPostGameAnalytics";
import {
  createFabPostGameSummary,
  fabMatchSummaryFromAnalytics,
  fabPostGameBackendDataFromAnalytics,
} from "./FabPostGameSummary.model";
import {
  SimulatorOpponentParticipantActions,
  SimulatorSelfParticipantActions,
} from "../../simulator/participant-actions";
import { useSimulatorAuth } from "../../simulator/providers";
import { useRegisterSimulatorDebugExportSource } from "../../simulator/debug-export/SimulatorDebugExportContext";
import { LocalSimulatorDebugHistoryRecorder } from "../../simulator/debug-export/local-debug-history";
import {
  SIMULATOR_BOT_SPEED_MS,
  SimulatorBotQuickControls,
  type SimulatorBotPacing,
  type SimulatorBotSpeed,
} from "../../simulator/SimulatorBotQuickControls";
import {
  createFabPracticeSidebarActivity,
  type FabPracticeChatMessage,
  type FabPracticeDecisionSnapshot,
  type FabPracticeNowState,
  type FabPracticeTelemetryEntry,
} from "./FabPracticeSidebarActivity";
import { engineDefToPresentation, presentRuntime } from "./projection";
import {
  clearFabPracticeSession,
  EMPTY_FAB_PRACTICE_HISTORY,
  persistFabPracticeSession,
  restoreFabPracticeSession,
  type StoredFabPracticeHistory,
} from "./practice-session";
import type { FabPresentationState } from "./state";
import { useFabCardPresentation } from "./useFabCardPresentation";
import {
  reportFabPracticeCommandFailure,
  reportFabPracticeDispatchException,
  reportFabPracticeCommandSubmitted,
  reportFabPracticeRulesReversal,
  runFabPracticePostCommandWork,
} from "./practice-observability";
import {
  createFabPracticeDeferredWorkQueue,
  type FabPracticeDeferredCommandWork,
} from "./practice-deferred-work";
import {
  nextFabDeckRevealRecalls,
  nextFabHandRevealRecalls,
  projectFabDeckReveal,
  projectFabHandRevealCards,
  type FabDeckRevealRecall,
  type FabHandRevealRecall,
} from "./deckRevealRecall";
import "./flesh-and-blood.css";

const HUMAN_DEFAULT = "player-1";
const BOT_DEFAULT = "player-2";
const FAB_SIMULATOR_BASE = "/flesh-and-blood/simulator";
const RULES_LIGHT_PRACTICE_DISCLOSURE =
  "Rules-light local combat practice. Named starter cards, weapons, hero abilities, and many printed effects are not fully modeled.";

interface PracticeDependencies {
  readonly createFabLocalPracticeMatch: (typeof import("./data/create-local-practice-match"))["createFabLocalPracticeMatch"];
  readonly createFabLocalPracticeMatchFromPlayerSeat: (typeof import("./data/create-local-practice-match"))["createFabLocalPracticeMatchFromPlayerSeat"];
  readonly createFabPracticeMatchup: (typeof import("./data/practice-matchup-fixture"))["createFabPracticeMatchup"];
  readonly materializeFabPracticeSeat: (typeof import("./data/resolve-text-deck"))["materializeFabPracticeSeat"];
  readonly resolvePracticeDeckSelection: (typeof import("./data/resolve-text-deck"))["resolvePracticeDeckSelection"];
  readonly resolveFabPracticeDeckPayload: (typeof import("./data/deck-payload"))["resolveFabPracticeDeckPayload"];
  readonly FAB_PRACTICE_DECK_OPTIONS: (typeof import("./data/practice-deck-options"))["FAB_PRACTICE_DECK_OPTIONS"];
  readonly FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL: (typeof import("./data/practice-deck-options"))["FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL"];
  readonly getFabPracticeDeckOption: (typeof import("./data/practice-deck-options"))["getFabPracticeDeckOption"];
  readonly listFabPracticeDeckOptionGroups: (typeof import("./data/practice-deck-options"))["listFabPracticeDeckOptionGroups"];
  readonly pickRandomClassicConstructedDeckId: (typeof import("./data/practice-deck-options"))["pickRandomClassicConstructedDeckId"];
  readonly pickRandomClassicConstructedMatchup: (typeof import("./data/practice-deck-options"))["pickRandomClassicConstructedMatchup"];
}

/**
 * Keep these heavy deck dependencies route-local so unrelated simulator routes
 * do not eagerly load them. In development, Vite HMR recreates this module and
 * resets the cache while React Fast Refresh may preserve
 * `DeferredPracticeContent`'s prior ready state. That mismatch can trip the
 * invariant in `practiceDependencies()` until the practice route is reloaded;
 * it does not mean the dynamic imports themselves failed.
 */
let loadedPracticeDependencies: PracticeDependencies | null = null;
let pendingPracticeDependencies: Promise<PracticeDependencies> | null = null;

async function loadPracticeDependencies(): Promise<PracticeDependencies> {
  if (loadedPracticeDependencies) return loadedPracticeDependencies;
  pendingPracticeDependencies ??= Promise.all([
    import("./data/create-local-practice-match"),
    import("./data/practice-matchup-fixture"),
    import("./data/resolve-text-deck"),
    import("./data/deck-payload"),
    import("./data/practice-deck-options"),
  ]).then(([matchModule, matchupModule, deckModule, payloadModule, optionsModule]) => {
    loadedPracticeDependencies = {
      createFabLocalPracticeMatch: matchModule.createFabLocalPracticeMatch,
      createFabLocalPracticeMatchFromPlayerSeat:
        matchModule.createFabLocalPracticeMatchFromPlayerSeat,
      createFabPracticeMatchup: matchupModule.createFabPracticeMatchup,
      materializeFabPracticeSeat: deckModule.materializeFabPracticeSeat,
      resolvePracticeDeckSelection: deckModule.resolvePracticeDeckSelection,
      resolveFabPracticeDeckPayload: payloadModule.resolveFabPracticeDeckPayload,
      FAB_PRACTICE_DECK_OPTIONS: optionsModule.FAB_PRACTICE_DECK_OPTIONS,
      FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL: optionsModule.FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL,
      getFabPracticeDeckOption: optionsModule.getFabPracticeDeckOption,
      listFabPracticeDeckOptionGroups: optionsModule.listFabPracticeDeckOptionGroups,
      pickRandomClassicConstructedDeckId: optionsModule.pickRandomClassicConstructedDeckId,
      pickRandomClassicConstructedMatchup: optionsModule.pickRandomClassicConstructedMatchup,
    };
    return loadedPracticeDependencies;
  });
  return pendingPracticeDependencies;
}

function practiceDependencies(): PracticeDependencies {
  if (!loadedPracticeDependencies) {
    throw new Error("FAB practice dependencies were used before the practice route loaded them.");
  }
  return loadedPracticeDependencies;
}

function DeferredPracticeContent({
  children,
}: {
  readonly children: (dependencies: PracticeDependencies) => ReactNode;
}) {
  const [state, setState] = useState<
    | { readonly kind: "loading" }
    | { readonly kind: "ready"; dependencies: PracticeDependencies }
    | { readonly kind: "error"; message: string }
  >(() =>
    loadedPracticeDependencies
      ? { kind: "ready", dependencies: loadedPracticeDependencies }
      : { kind: "loading" },
  );
  useEffect(() => {
    if (state.kind !== "loading") return;
    let active = true;
    void loadPracticeDependencies()
      .then((dependencies) => {
        if (active) setState({ kind: "ready", dependencies });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            kind: "error",
            message: error instanceof Error ? error.message : "Practice data failed to load.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [state.kind]);

  if (state.kind === "loading") {
    return <main data-testid="fab-practice-data-loading">Loading practice decks…</main>;
  }
  if (state.kind === "error") {
    return (
      <main role="alert" data-testid="fab-practice-data-error">
        Practice decks unavailable: {state.message}
      </main>
    );
  }
  // Fast Refresh may preserve this boundary's ready state while recreating
  // the module-scoped cache. Rehydrate the cache from the preserved state so
  // an in-progress practice match survives the next render.
  loadedPracticeDependencies ??= state.dependencies;
  return children(state.dependencies);
}

interface PracticeSessionConfig {
  readonly playerDeckId: string;
  readonly botDeckId: string;
  readonly botStrategyId: string | null;
  readonly seed: string;
}

function practiceBotParticipant(deckId: string, seed: string) {
  const bot = practiceDependencies().resolvePracticeDeckSelection(deckId, seed);
  return {
    label: "Practice bot",
    subscriptionTier: "Practice",
    // A hero is public during pregame. Resolve the exact bot seat here rather
    // than leaving its identity as a placeholder until the local match starts.
    heroName: fabPregameDefinitionName(
      bot.cardPool.cardDefinitions[bot.cardPool.heroId],
      bot.cardPool.heroId,
    ),
  };
}

type PracticePhase =
  | { readonly kind: "setup" }
  | {
      readonly kind: "sideboard";
      readonly config: PracticeSessionConfig;
      readonly player: ResolvedPracticeSeat;
    }
  | {
      readonly kind: "match";
      readonly config: PracticeSessionConfig;
      /**
       * Practice owns its local runtime for the whole selected session. Keeping
       * it above the board means a board reconciliation cannot silently reseat
       * either deck after a combat-state update.
       */
      readonly match: FabPracticeMatch;
      readonly history: StoredFabPracticeHistory;
    };

type FabPracticeTransitionKind = "setup-to-sideboard" | "sideboard-to-match";

function supportsViewTransitions(value: Document): boolean {
  return typeof Reflect.get(value, "startViewTransition") === "function";
}

/**
 * Preserve the causal link between pregame states without making the
 * transition a requirement for reaching the next state.
 */
export function transitionFabPracticeState(
  kind: FabPracticeTransitionKind,
  update: () => void,
): void {
  if (
    typeof document === "undefined" ||
    !supportsViewTransitions(document) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }

  try {
    const incomingTransform =
      kind === "setup-to-sideboard"
        ? "translate3d(0, 12px, 0) scale(0.985)"
        : "translate3d(0, 8px, 0) scale(0.99)";
    const animation = animateView(() => flushSync(update), {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
    })
      .old(
        {
          opacity: [1, 0],
          transform: ["translate3d(0, 0, 0) scale(1)", "translate3d(0, -6px, 0) scale(0.99)"],
        },
        { duration: 0.18, ease: [0.55, 0.06, 0.68, 0.19] },
      )
      .new(
        {
          opacity: [0, 1],
          transform: [incomingTransform, "translate3d(0, 0, 0) scale(1)"],
        },
        { delay: 0.05, duration: 0.34, ease: [0.16, 1, 0.3, 1] },
      );
    void Promise.resolve(animation).catch(() => undefined);
  } catch {
    update();
  }
}

/** Keep complete ordinary practice matches while bounding local-session storage. */
export const FAB_PRACTICE_TELEMETRY_LIMIT = 2_000;

export function appendFabPracticeTelemetry<T>(current: readonly T[], entry: T): readonly T[] {
  return [...current.slice(-(FAB_PRACTICE_TELEMETRY_LIMIT - 1)), entry];
}

type FabActionIntent = "play" | "activate" | "defend";

const FAB_ACTION_INTENT_LABELS: Record<FabActionIntent, string> = {
  play: "Play a card",
  activate: "Activate an ability",
  defend: "Choose a defender",
};

type FabActionFlow =
  | { readonly kind: "intents" }
  | { readonly kind: "cards"; readonly intent: FabActionIntent }
  | { readonly kind: "commands"; readonly intent: FabActionIntent; readonly cardKey: string };

function createSeededRandom(seed: string): () => number {
  let rng = seedFromString(seed);
  return () => {
    const result = nextRandom(rng);
    rng = result.state;
    return result.value;
  };
}

function projectSession(
  runtime: FabMatchRuntime,
  viewerId: string,
  presentationTransform?: (state: FabPresentationState) => FabPresentationState,
  resolver: FabCardArtResolver = EMPTY_FAB_CARD_ART,
  bindings?: Readonly<Record<string, string>>,
): FabPresentationState {
  const state = presentRuntime(runtime, viewerId, resolver, bindings);
  return presentationTransform?.(state) ?? state;
}

function practiceDecisionSnapshot(wait: FabWaitState): FabPracticeDecisionSnapshot | null {
  if (wait.kind !== "decision") return null;
  return {
    decisionId: wait.decision.decisionId,
    actorId: wait.decision.actorId,
    kind: wait.decision.kind,
    label: wait.decision.label,
  };
}

/**
 * Automated practice commands opt into a wall-clock execution context. The
 * engine's clock-free default stamps move logs with the stateID counter,
 * which activity history then renders as 1970-epoch timestamps.
 */
function botExecutionContext(runtime: FabMatchRuntime): FabCommandExecutionContext {
  return {
    commandId: `practice:bot:${runtime.getStateID()}`,
    timestamp: Date.now(),
  };
}

function formatFabWindowLabel(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

export function shouldScheduleFabPracticeBot(input: {
  readonly botId: string;
  readonly decisionActorId?: string;
  readonly seatMustAct: boolean;
  readonly legalCommands: readonly FabLegalCommand[];
}): boolean {
  if (input.decisionActorId !== undefined && input.decisionActorId !== input.botId) return false;
  return input.seatMustAct || input.legalCommands.some((command) => command.move !== "concede");
}

function legalCommandTestId(command: FabLegalCommand, index: number): string {
  const instanceId =
    typeof command.payload.instanceId === "string"
      ? command.payload.instanceId
      : Array.isArray(command.payload.instanceIds)
        ? (command.payload.instanceIds as string[]).join("-")
        : typeof command.payload.target === "string"
          ? command.payload.target
          : "none";
  const short = instanceId.length > 24 ? instanceId.slice(0, 24) : instanceId;
  return `fab-legal-${command.move}-${index}-${short}`;
}

/** Card/target key used to collapse combinatorial legal commands in the action UI. */
export function commandCardKey(command: FabLegalCommand): string {
  if (typeof command.payload.instanceId === "string") return command.payload.instanceId;
  if (Array.isArray(command.payload.instanceIds)) return command.payload.instanceIds.join(":");
  if (typeof command.payload.target === "string") return command.payload.target;
  return command.move;
}

/** Short label for the card-pick step (strip pitch payment / → hero suffixes). */
export function commandCardLabel(command: FabLegalCommand): string {
  return command.label.replace(/ \(pitch .+\)$/, "").replace(/ → hero$/, "");
}

type FabActionCardChoice = {
  readonly cardKey: string;
  readonly command: FabLegalCommand;
  readonly label: string;
};

function pitchLabel(pitchValue: number): string {
  const color = pitchValue === 1 ? "red" : pitchValue === 2 ? "yellow" : "blue";
  return `${color} pitch ${pitchValue}`;
}

/**
 * Produce compact, player-recognizable labels for the card-choice step.
 *
 * A legal-command label intentionally omits printing data, but a hand can
 * contain the same named card in different pitch colors. Only add that detail
 * where its absence would leave two separate legal card choices indistinct.
 */
export function listFabActionCardChoices(
  commands: readonly FabLegalCommand[],
  presentation: Pick<FabPresentationState, "cards" | "cardDefinitions">,
): readonly FabActionCardChoice[] {
  const choices = Array.from(
    new Map(commands.map((command) => [commandCardKey(command), command])),
  ).map(([cardKey, command]) => ({ cardKey, command, baseLabel: commandCardLabel(command) }));
  const baseLabelCounts = new Map<string, number>();
  for (const choice of choices) {
    baseLabelCounts.set(choice.baseLabel, (baseLabelCounts.get(choice.baseLabel) ?? 0) + 1);
  }

  return choices.map(({ cardKey, command, baseLabel }) => {
    if (baseLabelCounts.get(baseLabel) === 1) return { cardKey, command, label: baseLabel };
    const instanceId =
      typeof command.payload.instanceId === "string" ? command.payload.instanceId : null;
    const card = instanceId ? presentation.cards[instanceId] : undefined;
    const definition = card ? presentation.cardDefinitions[card.cardId] : undefined;
    const detail =
      definition?.pitchValue != null
        ? pitchLabel(definition.pitchValue)
        : [
            definition?.cost != null ? `cost ${definition.cost}` : null,
            definition?.power != null ? `power ${definition.power}` : null,
            definition?.defense != null ? `defense ${definition.defense}` : null,
          ]
            .filter((value): value is string => value != null)
            .join(", ");
    return { cardKey, command, label: detail ? `${baseLabel} — ${detail}` : baseLabel };
  });
}

/**
 * When a card has exactly one legal command under the current intent, dispatch it
 * immediately so mobile players skip a redundant confirmation step (e.g. pitch,
 * or a single select-target option).
 */
export function shouldAutoDispatchCardCommands(
  commands: readonly FabLegalCommand[],
): FabLegalCommand | null {
  const command = commands[0];
  if (!command || commands.length !== 1) return null;

  // Pitching is a player choice. Do not skip the payment step just because the
  // current hand happens to offer a single legal pitch bundle.
  return command;
}

/**
 * Resolve a hand-card tap into one legal engine command.
 *
 * Prefers defend → announce play → activate → select. Resource payment is a
 * later engine-owned interaction, never a bundled hand-card command.
 */
export function resolveHandCardTap(
  legal: readonly FabLegalCommand[],
  cardId: string,
): FabLegalCommand | null {
  const forCard = legal.filter(
    (command) =>
      typeof command.payload.instanceId === "string" && command.payload.instanceId === cardId,
  );
  if (forCard.length === 0) return null;
  const priority = ["defend", "begin-play", "activate"] as const;
  for (const move of priority) {
    const match = forCard.find((command) => command.move === move);
    if (match) return match;
  }
  return forCard[0] ?? null;
}

function botStrategyIdForMode(mode: FabScenarioBotMode): string | null {
  if (mode === "off") return null;
  if (mode === "pass-only") return "pass-only";
  if (mode === "attack-only") return "attack-only";
  if (mode === "hero-profile") return "hero-profile";
  return DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID;
}

/**
 * Resolve a scenario id from production-style routes:
 * - `/tests/:fixtureId`
 * - `?fixture=` on practice / play routes
 */
export function resolveFabRouteFixtureId(
  routeFixtureId: string | undefined,
  search: string,
): string | null {
  if (routeFixtureId && routeFixtureId.length > 0) return routeFixtureId;
  const params = new URLSearchParams(search);
  const fromQuery = params.get("fixture");
  return fromQuery && fromQuery.length > 0 ? fromQuery : null;
}

/**
 * Real player-facing practice / local match page.
 *
 * Also mounted on `/tests/:fixtureId` so fixture review boots a **local engine
 * runtime** through the same tabletop chrome as practice (no server).
 */
export function FleshAndBloodPracticePage() {
  const params = useParams<{ fixtureId?: string }>();
  const location = useLocation();
  const searchParams = useSearchParams()[0];
  const fixtureKey = resolveFabRouteFixtureId(params.fixtureId, location.search);
  const scenario = fixtureKey ? getFabEngineScenario(fixtureKey) : undefined;
  const matchupFixture = getFabPracticeMatchupFixture(fixtureKey ?? undefined);

  // Query override: ?ai=off|pass-only|hero-profile|heuristic
  const aiQuery = searchParams.get("ai");
  const botModeOverride: FabScenarioBotMode | null =
    aiQuery === "off" ||
    aiQuery === "pass-only" ||
    aiQuery === "hero-profile" ||
    aiQuery === "heuristic"
      ? aiQuery
      : null;

  if (fixtureKey === "match-clocks") return <FabMatchClockFixture />;
  if (fixtureKey === "history-reading") return <FabHistoryFixture />;
  if (fixtureKey === "sideboarding-mock") return <FabSideboardingMockPage />;
  if (fixtureKey === "sideboarding-subscribers-mock") {
    return <FabSideboardingMockPage bothPlayersSubscribed />;
  }
  if (fixtureKey === "post-game-summary") {
    return (
      <DeferredPracticeContent>
        {(dependencies) => (
          <FabPostGameSummaryFixturePage
            viewerSeat={dependencies.resolvePracticeDeckSelection(
              "cc-guilherme-coutinho-rhinar",
              "post-game-summary:viewer",
            )}
            opponentSeat={dependencies.resolvePracticeDeckSelection(
              "cc-edinburgh-3rd-tuffnut",
              "post-game-summary:opponent",
            )}
          />
        )}
      </DeferredPracticeContent>
    );
  }

  if (matchupFixture) {
    return (
      <DeferredPracticeContent>
        {() => (
          <PracticeMatchupFixtureMatch
            fixture={matchupFixture}
            botMode={botModeOverride ?? "hero-profile"}
          />
        )}
      </DeferredPracticeContent>
    );
  }

  if (fixtureKey && !scenario) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center"
        data-testid="fab-fixture-not-found"
        style={{ background: "#0f0a0a", color: "#fef2f2" }}
      >
        <h1 className="text-2xl font-bold">Scenario not found</h1>
        <p className="text-sm opacity-70">No engine scenario matches “{fixtureKey}”.</p>
        <Link
          to={`${FAB_SIMULATOR_BASE}/tests`}
          className="text-sm font-semibold underline-offset-2 hover:underline"
          style={{ color: "#fecaca" }}
          data-testid="fab-fixture-back-to-index"
        >
          Back to fixture catalog
        </Link>
      </main>
    );
  }

  if (scenario) {
    return (
      <EngineScenarioMatch
        key={scenario.id}
        scenario={scenario}
        botMode={botModeOverride ?? scenario.botMode}
      />
    );
  }

  return <DeferredPracticeContent>{() => <InteractivePracticeFlow />}</DeferredPracticeContent>;
}

/**
 * Deliberately static review surface for iterating on the start-of-game UX.
 * The deck and private inventory shown here belong only to the current player;
 * the opponent hero is public under CR 4.1.2, while their deck remains hidden.
 */
export function FabSideboardingMockPage({
  bothPlayersSubscribed = false,
}: {
  readonly bothPlayersSubscribed?: boolean;
} = {}) {
  if (!loadedPracticeDependencies) {
    return (
      <DeferredPracticeContent>
        {() => <FabSideboardingMockPage bothPlayersSubscribed={bothPlayersSubscribed} />}
      </DeferredPracticeContent>
    );
  }
  const searchParams = useSearchParams()[0];
  const playerTier = mockSubscriptionTier(searchParams.get("playerTier"), "tier4");
  const opponentTier = mockSubscriptionTier(
    searchParams.get("opponentTier"),
    bothPlayersSubscribed ? "tier4" : "free",
  );
  const player = useMemo(
    () =>
      practiceDependencies().resolvePracticeDeckSelection(
        "cc-las-vegas-3rd-dorinthea",
        "sideboarding-mock",
      ),
    [],
  );
  const opponentSelector = searchParams.get("opponentHero");
  const opponentDeckId = useMemo(
    () => resolveMockOpponentDeckId(opponentSelector, player.cardPool.heroId),
    [opponentSelector, player.cardPool.heroId],
  );
  const opponent = useMemo(
    () => practiceDependencies().resolvePracticeDeckSelection(opponentDeckId, "sideboarding-mock"),
    [opponentDeckId],
  );
  const opponentHero = opponent.cardPool.cardDefinitions[opponent.cardPool.heroId];

  return (
    <div
      data-testid={
        bothPlayersSubscribed ? "fab-sideboarding-subscribers-mock" : "fab-sideboarding-mock"
      }
    >
      <FabPregameSideboard
        pool={player.cardPool}
        player={{
          label: "Wazar",
          mmr: 1842,
          subscriptionTier: playerTier,
          profileHref: "https://tcg.online/profile/wazar",
          heroName: fabPregameDefinitionName(
            player.cardPool.cardDefinitions[player.cardPool.heroId],
            player.cardPool.heroId,
          ),
        }}
        opponent={{
          label: "StormRider",
          mmr: 1907,
          subscriptionTier: opponentTier,
          profileHref: "https://tcg.online/profile/stormrider",
          heroName: opponentHero?.name ?? "Rhinar, Reckless Rampage",
        }}
        deadline={Date.now() + 3 * 60 * 1000}
        onLeave={() => undefined}
        onConfirm={() => undefined}
      />
    </div>
  );
}

const MOCK_SUBSCRIPTION_TIERS = ["free", "tier1", "tier2", "tier3", "tier4"] as const;
type MockSubscriptionTier = (typeof MOCK_SUBSCRIPTION_TIERS)[number];

function mockSubscriptionTier(
  value: string | null,
  fallback: MockSubscriptionTier,
): MockSubscriptionTier {
  return MOCK_SUBSCRIPTION_TIERS.find((tier) => tier === value?.toLowerCase()) ?? fallback;
}

function normalizeMockHeroSelector(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function resolveMockOpponentDeckId(selector: string | null, playerHeroId: string): string {
  const configured = selector?.trim();
  if (configured && configured.toLowerCase() !== "random") {
    const exactDeck = practiceDependencies().getFabPracticeDeckOption(configured);
    if (exactDeck?.formatGroup === "classic-constructed") return exactDeck.id;

    const normalizedSelector = normalizeMockHeroSelector(configured);
    const matchingDeck = practiceDependencies().FAB_PRACTICE_DECK_OPTIONS.find((option) => {
      if (option.formatGroup !== "classic-constructed") return false;
      const seat = practiceDependencies().resolvePracticeDeckSelection(
        option.id,
        "sideboarding-hero-selector",
      );
      const heroName = fabPregameDefinitionName(
        seat.cardPool.cardDefinitions[seat.cardPool.heroId],
        "",
      );
      const normalizedHero = normalizeMockHeroSelector(heroName);
      return (
        normalizedHero === normalizedSelector ||
        normalizedHero.startsWith(`${normalizedSelector}-`) ||
        normalizeMockHeroSelector(option.id).includes(normalizedSelector)
      );
    });
    if (matchingDeck) return matchingDeck.id;
  }

  const decksForOtherHeroes = practiceDependencies().FAB_PRACTICE_DECK_OPTIONS.filter((option) => {
    if (option.formatGroup !== "classic-constructed") return false;
    const seat = practiceDependencies().resolvePracticeDeckSelection(
      option.id,
      "sideboarding-player-selector",
    );
    return seat.cardPool.heroId !== playerHeroId;
  });
  const randomDeck = decksForOtherHeroes[Math.floor(Math.random() * decksForOtherHeroes.length)];
  return randomDeck?.id ?? practiceDependencies().pickRandomClassicConstructedDeckId(Math.random);
}

function InteractivePracticeFlow() {
  const searchParams = useSearchParams()[0];
  const importedDeck = useMemo(
    () => practiceDependencies().resolveFabPracticeDeckPayload(searchParams),
    [searchParams],
  );
  // The server cannot read browser-owned sessionStorage. Start in a stable
  // restoring state on both server and client, then resolve the active match
  // after hydration so a dev-server reload never flashes setup as a reset.
  const [restoring, setRestoring] = useState(true);
  const [phase, setPhase] = useState<PracticePhase>({ kind: "setup" });
  const [restoreError, setRestoreError] = useState<string | null>(null);
  // Saved automation defaults seed the human seat of every NEW practice match;
  // the sideboard confirm stays disabled until they hydrate so a saved
  // "hold" can never lose the race with match start.
  const fabAutomationSettings = useFabAutomationSettings();
  useEffect(() => {
    if (!importedDeck) {
      const restored = restoreFabPracticeSession(
        practiceDependencies().createFabLocalPracticeMatch,
      );
      if (restored.kind === "restored") {
        setPhase({
          kind: "match",
          config: restored.config,
          match: restored.match,
          history: restored.history,
        });
      } else if (restored.kind === "error") {
        setRestoreError(restored.message);
      } else {
        const config = restoreFabPracticePreparation();
        if (config) {
          try {
            const player = practiceDependencies().resolvePracticeDeckSelection(
              config.playerDeckId,
              config.seed,
            );
            setPhase({ kind: "sideboard", config, player });
          } catch {
            persistFabPracticePreparation(null);
          }
        }
      }
    }
    setRestoring(false);
  }, [importedDeck]);
  const returnToSetup = useCallback(() => {
    persistFabPracticePreparation(null);
    clearFabPracticeSession();
    setRestoreError(null);
    setPhase({ kind: "setup" });
  }, []);

  if (restoring) {
    return (
      <main
        className="flex min-h-screen items-center justify-center p-8 text-center"
        data-testid="fab-practice-restoring"
      >
        Restoring practice match…
      </main>
    );
  }

  if (importedDeck) {
    if (!importedDeck.ok) {
      return (
        <main
          className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center"
          data-testid="fab-practice-deck-error"
        >
          <h1 className="text-2xl font-bold">Practice deck unavailable</h1>
          <p className="text-sm opacity-70">{importedDeck.message}</p>
          <ul className="text-left text-xs opacity-60">
            {importedDeck.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </main>
      );
    }
    return <ImportedPracticeFlow imported={importedDeck} />;
  }

  if (phase.kind === "setup") {
    return (
      <>
        {restoreError ? (
          <section role="alert" className="fab-practice-setup-recovery">
            <strong>Saved match unavailable</strong>
            <p>{restoreError}</p>
            <button
              type="button"
              onClick={() => {
                clearFabPracticeSession();
                setRestoreError(null);
              }}
            >
              Start a new match
            </button>
          </section>
        ) : null}
        <PracticeSetupForm
          onStart={(config) => {
            const player = practiceDependencies().resolvePracticeDeckSelection(
              config.playerDeckId,
              config.seed,
            );
            persistFabPracticePreparation(config);
            transitionFabPracticeState("setup-to-sideboard", () => {
              setPhase({ kind: "sideboard", config, player });
            });
          }}
        />
      </>
    );
  }

  if (phase.kind === "sideboard") {
    const opponent = practiceBotParticipant(phase.config.botDeckId, `${phase.config.seed}:p2`);
    return (
      <FabPracticePreparation
        storageKey={`fab-turn-order:${phase.config.seed}:${phase.config.playerDeckId}:${phase.config.botDeckId}`}
        pool={phase.player.cardPool}
        player={{
          label: "You",
          heroName: fabPregameDefinitionName(
            phase.player.cardPool.cardDefinitions[phase.player.cardPool.heroId],
            phase.player.cardPool.heroId,
          ),
        }}
        opponent={opponent}
        locked={!fabAutomationSettings.ready}
        onLeave={returnToSetup}
        onConfirm={(selection, firstPlayerId) => {
          const player = {
            ...phase.player,
            player: practiceDependencies().materializeFabPracticeSeat(
              phase.player,
              selection,
              phase.config.seed,
            ),
          };
          const match = practiceDependencies().createFabLocalPracticeMatchFromPlayerSeat(player, {
            player2DeckId: phase.config.botDeckId,
            seed: phase.config.seed,
            player1Id: HUMAN_DEFAULT,
            player2Id: BOT_DEFAULT,
            firstPlayerId,
            automation: fabAutomationSeedForSeat(fabAutomationSettings, HUMAN_DEFAULT),
          });
          persistFabPracticeSession(match, phase.config);
          persistFabPracticePreparation(null);
          transitionFabPracticeState("sideboard-to-match", () => {
            setPhase({
              kind: "match",
              config: phase.config,
              match,
              history: EMPTY_FAB_PRACTICE_HISTORY,
            });
          });
        }}
      />
    );
  }

  return (
    <LocalEngineMatch
      key={`${phase.config.seed}:${phase.config.playerDeckId}:${phase.config.botDeckId}:${phase.config.botStrategyId}`}
      match={phase.match}
      humanId={HUMAN_DEFAULT}
      botId={BOT_DEFAULT}
      botStrategyId={phase.config.botStrategyId}
      sessionKey={`fab-practice:${phase.config.seed}`}
      statusLabel={null}
      practiceConfig={phase.config}
      initialHistory={phase.history}
      onExit={returnToSetup}
    />
  );
}

function ImportedPracticeFlow({
  imported,
}: {
  readonly imported: Extract<
    NonNullable<ReturnType<PracticeDependencies["resolveFabPracticeDeckPayload"]>>,
    { ok: true }
  >;
}) {
  const [match, setMatch] = useState<FabPracticeMatch | null>(null);
  const fabAutomationSettings = useFabAutomationSettings();
  const opponent = useMemo(
    () =>
      imported.opponent
        ? {
            label: imported.opponent.label,
            heroName: fabPregameDefinitionName(
              imported.opponent.cardPool.cardDefinitions[imported.opponent.cardPool.heroId],
              imported.opponent.cardPool.heroId,
            ),
          }
        : practiceBotParticipant(DEFAULT_BOT_DECK_ID, `${imported.seed}:p2`),
    [imported],
  );
  if (match) {
    return (
      <LocalEngineMatch
        match={match}
        humanId={HUMAN_DEFAULT}
        botId={BOT_DEFAULT}
        botStrategyId={imported.botStrategyId}
        humanDeckLabel={imported.player.label}
        botDeckLabel={
          imported.opponent?.label ??
          practiceDependencies().getFabPracticeDeckOption(DEFAULT_BOT_DECK_ID)?.label
        }
        sessionKey={imported.seed}
        statusLabel={null}
      />
    );
  }
  return (
    <FabPracticePreparation
      storageKey={`fab-turn-order:${imported.seed}`}
      pool={imported.player.cardPool}
      player={{
        label: "You",
        heroName: fabPregameDefinitionName(
          imported.player.cardPool.cardDefinitions[imported.player.cardPool.heroId],
          imported.player.cardPool.heroId,
        ),
      }}
      opponent={opponent}
      relaxDeckSize
      locked={!fabAutomationSettings.ready}
      onLeave={() => window.history.back()}
      onConfirm={(selection, firstPlayerId) => {
        const player = {
          ...imported.player,
          player: practiceDependencies().materializeFabPracticeSeat(
            imported.player,
            selection,
            imported.seed,
          ),
        };
        setMatch(
          practiceDependencies().createFabLocalPracticeMatchFromPlayerSeat(player, {
            player1Id: HUMAN_DEFAULT,
            player2Id: BOT_DEFAULT,
            firstPlayerId,
            seed: imported.seed,
            opponent: imported.opponent,
            automation: fabAutomationSeedForSeat(fabAutomationSettings, HUMAN_DEFAULT),
          }),
        );
      }}
    />
  );
}

/**
 * Boots an engine scenario and runs it through the **same** interactive match
 * shell as practice vs bot (legal commands, tabletop, optional local bot).
 */
function EngineScenarioMatch({
  scenario,
  botMode,
}: {
  readonly scenario: FabEngineScenario;
  readonly botMode: FabScenarioBotMode;
}) {
  const navigate = useNavigate();
  const [bootError, setBootError] = useState<string | null>(null);
  const [match, setMatch] = useState<FabPracticeMatch | null>(null);

  useEffect(() => {
    try {
      setMatch(scenario.boot());
      setBootError(null);
    } catch (error) {
      setMatch(null);
      setBootError(error instanceof Error ? error.message : "Failed to boot scenario.");
    }
  }, [scenario]);

  if (bootError) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center"
        data-testid="fab-scenario-boot-error"
        style={{ background: "#0f0a0a", color: "#fef2f2" }}
      >
        <h1 className="text-2xl font-bold">Scenario failed to boot</h1>
        <p className="text-sm opacity-70 max-w-md">{bootError}</p>
        <Link to={`${FAB_SIMULATOR_BASE}/tests`} style={{ color: "#fecaca" }}>
          Back to catalog
        </Link>
      </main>
    );
  }

  if (!match) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        data-testid="fab-scenario-loading"
        style={{ background: "#0f0a0a", color: "#fef2f2" }}
      >
        Loading local engine…
      </main>
    );
  }

  const botStrategyId = botStrategyIdForMode(botMode);
  const humanId = scenario.viewerId;
  const botId = humanId === "player-1" ? "player-2" : "player-1";
  const scenarioMoveLogs = match.engine.moveLogs();
  const initialHistory: StoredFabPracticeHistory = {
    telemetry: match.engine.playerNarratives().map((playerLog, index) => ({
      id: index + 1,
      source: playerLog.actorId === botId ? "bot" : "player",
      actorId: playerLog.actorId,
      controllerId: humanId,
      interactionActorId: playerLog.actorId,
      commandLabel: playerLog.moveType,
      move: playerLog.moveType,
      result: "accepted",
      recordedAt: playerLog.timestamp,
      turnNumber: playerLog.turnNumber,
      stateId: index + 1,
      playerLog,
      moveLogs: scenarioMoveLogs.filter((log) => log.commandId === playerLog.commandId),
      decisionBefore: null,
      pendingDecision: null,
      completedDecision: null,
    })),
    chatMessages: [],
  };

  return (
    <LocalEngineMatch
      key={`${scenario.id}:${match.seed}:${botMode}`}
      match={match}
      humanId={humanId}
      botId={botId}
      botStrategyId={botStrategyId}
      sessionKey={`fab-scenario:${scenario.id}`}
      fixtureId={scenario.id}
      initialHistory={initialHistory}
      presentationTransform={scenario.presentationTransform}
      statusLabel={`Scenario · ${scenario.label}`}
      sidebarExtra={
        <div className="flex flex-col gap-2 text-xs">
          <p className="opacity-60" data-testid="fab-fixture-description">
            {scenario.description}
          </p>
          <p className="opacity-50">
            Local engine · no server · bot: {botMode}
            {botMode === "off" ? " (frozen opponent)" : ""}
          </p>
          <label className="flex flex-col gap-1">
            <span className="opacity-70">Switch scenario</span>
            <select
              className="rounded-md border bg-black/30 px-2 py-2"
              style={{ borderColor: "var(--board-border, #3a2020)" }}
              value={scenario.id}
              data-testid="fab-fixture-switcher"
              onChange={(event) => {
                void navigate(`${FAB_SIMULATOR_BASE}/tests/${event.currentTarget.value}`);
              }}
            >
              {FAB_ENGINE_SCENARIOS.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
          <a
            href={`${FAB_SIMULATOR_BASE}/tests`}
            className="opacity-70 underline-offset-2 hover:underline"
            data-testid="fab-fixture-back-to-index"
          >
            Fixture catalog
          </a>
          <a
            href={`${FAB_SIMULATOR_BASE}/play/practice`}
            className="opacity-70 underline-offset-2 hover:underline"
            data-testid="fab-fixture-to-practice"
          >
            Practice vs bot
          </a>
        </div>
      }
    />
  );
}

function PracticeMatchupFixtureMatch({
  fixture,
  botMode,
}: {
  readonly fixture: FabPracticeMatchupCatalogFixture;
  readonly botMode: FabScenarioBotMode;
}) {
  const practiceConfig = useMemo(
    () => ({
      playerDeckId: fixture.playerDeckId,
      botDeckId: fixture.botDeckId,
      botStrategyId: botStrategyIdForMode(botMode),
      seed: fixture.seed,
    }),
    [botMode, fixture],
  );
  const practiceSessionStorageKey = `fab-practice:fixture:${fixture.id}:v1`;
  const [session, setSession] = useState<{
    readonly match: FabPracticeMatch;
    readonly history: StoredFabPracticeHistory;
  } | null>(null);
  useEffect(() => {
    const createMatch = () =>
      practiceDependencies().createFabPracticeMatchup({
        player1DeckId: fixture.playerDeckId,
        player2DeckId: fixture.botDeckId,
        seed: fixture.seed,
        firstPlayerId: HUMAN_DEFAULT,
      });
    const restored = restoreFabPracticeSession(
      (input) =>
        practiceDependencies().createFabPracticeMatchup({
          player1DeckId: input.player1DeckId,
          player2DeckId: input.player2DeckId,
          seed: input.seed,
          firstPlayerId: input.firstPlayerId,
        }),
      practiceSessionStorageKey,
    );
    if (
      restored.kind === "restored" &&
      restored.config.playerDeckId === practiceConfig.playerDeckId &&
      restored.config.botDeckId === practiceConfig.botDeckId &&
      restored.config.seed === practiceConfig.seed
    ) {
      setSession({ match: restored.match, history: restored.history });
      return;
    }
    if (restored.kind !== "none") clearFabPracticeSession(practiceSessionStorageKey);
    setSession({ match: createMatch(), history: EMPTY_FAB_PRACTICE_HISTORY });
  }, [fixture, practiceConfig, practiceSessionStorageKey]);

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 text-center">
        Restoring practice matchup…
      </main>
    );
  }

  return (
    <LocalEngineMatch
      key={`${fixture.id}:${session.match.seed}`}
      match={session.match}
      humanId={HUMAN_DEFAULT}
      botId={BOT_DEFAULT}
      botStrategyId={botStrategyIdForMode(botMode)}
      sessionKey={`fab-practice-matchup:${fixture.id}`}
      fixtureId={fixture.id}
      statusLabel={`Practice matchup · ${fixture.label.replace("Practice matchup · ", "")}`}
      practiceConfig={practiceConfig}
      practiceSessionStorageKey={practiceSessionStorageKey}
      initialHistory={session.history}
      sidebarExtra={
        <div className="flex flex-col gap-2 text-xs">
          <p className="opacity-60" data-testid="fab-fixture-description">
            {fixture.description}
          </p>
          <p className="opacity-50">Seed: {fixture.seed}</p>
          <a
            href={`${FAB_SIMULATOR_BASE}/tests`}
            className="opacity-70 underline-offset-2 hover:underline"
          >
            Fixture catalog
          </a>
        </div>
      }
    />
  );
}

function PracticeDeckSelect({
  id,
  label,
  testId,
  value,
  onChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly testId: string;
  readonly value: string;
  readonly onChange: (deckId: string) => void;
}) {
  const groups = useMemo(() => practiceDependencies().listFabPracticeDeckOptionGroups(), []);
  const selected = practiceDependencies().getFabPracticeDeckOption(value);

  return (
    <label className="flex min-w-0 flex-col gap-1 text-sm" htmlFor={id}>
      <span className="font-medium opacity-80">{label}</span>
      <select
        id={id}
        className="fab-practice-deck-select w-full min-w-0 rounded-md border bg-black/30 px-3 py-2"
        style={{ borderColor: "var(--board-border, #3a2020)" }}
        data-testid={testId}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {groups.map((group) => (
          <optgroup key={group.group} label={group.label} data-format-group={group.group}>
            {group.options.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {selected ? (
        <span className="text-xs opacity-55" data-testid={`${testId}-meta`}>
          <strong className="font-semibold opacity-80">
            {practiceDependencies().FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL[selected.formatGroup]}
          </strong>
          {" · "}
          {selected.description}
        </span>
      ) : null}
    </label>
  );
}

function PracticeSetupForm({
  onStart,
}: {
  readonly onStart: (config: PracticeSessionConfig) => void;
}) {
  const [initialMatchup] = useState(() =>
    practiceDependencies().pickRandomClassicConstructedMatchup(),
  );
  const [playerDeckId, setPlayerDeckId] = useState(initialMatchup.playerDeckId);
  const [botDeckId, setBotDeckId] = useState(initialMatchup.botDeckId);
  const [botStrategyId, setBotStrategyId] = useState(DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID);
  const [seed, setSeed] = useState("");
  const [showDebugStrategies, setShowDebugStrategies] = useState(false);
  const playerDeckRef = useRef(playerDeckId);
  const botDeckRef = useRef(botDeckId);
  const seedRef = useRef(seed);

  const choosePlayerDeck = (deckId: string) => {
    playerDeckRef.current = deckId;
    setPlayerDeckId(deckId);
  };

  const chooseBotDeck = (deckId: string) => {
    botDeckRef.current = deckId;
    setBotDeckId(deckId);
  };

  const enterSeed = (value: string) => {
    seedRef.current = value;
    setSeed(value);
  };

  const strategyOptions = useMemo(
    () =>
      FAB_AUTOMATED_ACTION_STRATEGIES.filter(
        (strategy) => showDebugStrategies || !strategy.testOnly,
      ),
    [showDebugStrategies],
  );

  const setDebugStrategiesVisible = (visible: boolean) => {
    setShowDebugStrategies(visible);
    if (!visible) {
      const current = FAB_AUTOMATED_ACTION_STRATEGIES.find((s) => s.id === botStrategyId);
      if (current?.testOnly) {
        setBotStrategyId(DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID);
      }
    }
  };

  const strategyDescription = useMemo(
    () => getSafeFabAutomatedActionStrategyOption(botStrategyId).description,
    [botStrategyId],
  );

  const start = () => {
    onStart({
      playerDeckId: playerDeckRef.current,
      botDeckId: botDeckRef.current,
      botStrategyId,
      seed: seedRef.current.trim() || `fab-practice-${Date.now().toString(36)}`,
    });
  };

  return (
    <main
      className="flex min-h-screen items-center bg-[var(--board-layout-bg,#0f0a0a)] px-5 py-6 text-[var(--board-text,#fef2f2)] sm:p-8"
      data-testid="fab-practice-setup"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-[minmax(14rem,0.62fr)_minmax(0,1fr)] md:items-center md:gap-8">
        <header className="max-w-md text-center md:text-left">
          <h1 className="text-3xl font-bold" style={{ color: "var(--game-accent, #8a1c1c)" }}>
            Practice vs bot
          </h1>
          <p className="mt-3 text-sm leading-relaxed opacity-70">
            Local engine-backed match (no server). Pick a practice starter or a tournament sample —
            decks are grouped by format: Classic Constructed, Living Legend, and Silver Age.
          </p>
          <nav
            className="mt-5 flex items-center justify-center gap-4 text-sm opacity-70 md:justify-start"
            aria-label="Practice navigation"
          >
            <a
              href={`${FAB_SIMULATOR_BASE}/`}
              className="underline-offset-2 hover:underline"
              data-testid="fab-practice-back"
            >
              Back to simulator hub
            </a>
            <a
              href={`${FAB_SIMULATOR_BASE}/tests`}
              className="underline-offset-2 hover:underline"
              data-testid="fab-practice-fixtures"
            >
              Fixture catalog
            </a>
          </nav>
        </header>

        <section
          className="grid w-full gap-4 rounded-xl border p-5"
          style={{ borderColor: "var(--board-border, #3a2020)", background: "rgba(26,18,18,0.85)" }}
          aria-label="Practice match setup"
        >
          <PracticeDeckSelect
            id="fab-practice-your-deck"
            label="Your deck"
            testId="fab-practice-your-deck"
            value={playerDeckId}
            onChange={choosePlayerDeck}
          />

          <PracticeDeckSelect
            id="fab-practice-bot-deck"
            label="Bot deck"
            testId="fab-practice-bot-deck"
            value={botDeckId}
            onChange={chooseBotDeck}
          />

          <label className="flex min-w-0 flex-col gap-1 text-sm">
            <span className="font-medium opacity-80">Bot strategy</span>
            <select
              className="fab-practice-deck-select w-full min-w-0 rounded-md border bg-black/30 px-3 py-2"
              style={{ borderColor: "var(--board-border, #3a2020)" }}
              data-testid="fab-practice-bot-strategy"
              value={botStrategyId}
              onChange={(event) => setBotStrategyId(event.currentTarget.value)}
            >
              {strategyOptions.map((strategy) => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs opacity-70">
            <input
              type="checkbox"
              data-testid="fab-practice-show-debug-strategies"
              checked={showDebugStrategies}
              onChange={(event) => setDebugStrategiesVisible(event.currentTarget.checked)}
            />
            Show debug strategies (first-legal / random / pass-only)
          </label>

          <label className="flex min-w-0 flex-col gap-1 text-sm">
            <span className="font-medium opacity-80">Seed (optional)</span>
            <input
              className="w-full min-w-0 rounded-md border bg-black/30 px-3 py-2"
              style={{ borderColor: "var(--board-border, #3a2020)" }}
              data-testid="fab-practice-seed"
              value={seed}
              placeholder="Shuffles decks + bot RNG when set"
              onChange={(event) => enterSeed(event.currentTarget.value)}
            />
          </label>

          <p className="text-xs opacity-60" data-testid="fab-practice-strategy-desc">
            {strategyDescription}
          </p>

          <p
            className="text-xs leading-relaxed opacity-70"
            data-testid="fab-practice-rules-light-disclosure"
          >
            {RULES_LIGHT_PRACTICE_DISCLOSURE}
          </p>

          <button
            type="button"
            className="rounded-lg px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
            style={{ background: "var(--game-accent, #8a1c1c)" }}
            data-testid="fab-practice-start"
            onClick={start}
          >
            Start practice match
          </button>
        </section>
      </div>
    </main>
  );
}

interface LocalEngineMatchProps {
  readonly match: FabPracticeMatch;
  readonly humanId: string;
  readonly botId: string;
  readonly botStrategyId: string | null;
  readonly humanDeckLabel?: string;
  readonly botDeckLabel?: string;
  readonly sessionKey: string;
  readonly fixtureId?: string;
  readonly presentationTransform?: (state: FabPresentationState) => FabPresentationState;
  readonly statusLabel: string | null;
  readonly sidebarExtra?: ReactNode;
  readonly practiceConfig?: PracticeSessionConfig;
  readonly practiceSessionStorageKey?: string;
  readonly initialHistory?: StoredFabPracticeHistory;
  readonly onExit?: () => void;
}

/**
 * Load the bounded presentation program before projection performs synchronous
 * name/art lookups. Gameplay definitions remain immutable and already seated.
 */
export function LocalEngineMatch(props: LocalEngineMatchProps) {
  const inherited = useFabPresentationRegistry();
  const locale = useFabCardLocale();
  const bundle = inherited.getBundle();
  return (
    <FabPresentationCatalogProvider
      key={props.sessionKey}
      locale={locale}
      initial={
        bundle
          ? {
              kind: "full",
              bundle,
              supplements: inherited.getRecords(),
              bindings: inherited.getSnapshot().bindings,
            }
          : undefined
      }
    >
      <PreparedLocalEngineMatch {...props} />
    </FabPresentationCatalogProvider>
  );
}
function PreparedLocalEngineMatch(props: LocalEngineMatchProps) {
  const definitions = useMemo(
    () =>
      fixturePresentationDefinitions(Object.values(props.match.runtime.getState().cardDefinitions)),
    [props.match],
  );
  useFabCardPresentation(definitions, props.sessionKey);
  return <ReadyLocalEngineMatch {...props} />;
}

/** Shared interactive local-engine match shell used by practice and scenarios. */
function ReadyLocalEngineMatch({
  match,
  humanId,
  botId,
  botStrategyId,
  humanDeckLabel,
  botDeckLabel,
  sessionKey,
  fixtureId,
  presentationTransform,
  statusLabel,
  sidebarExtra,
  practiceConfig,
  practiceSessionStorageKey,
  initialHistory = EMPTY_FAB_PRACTICE_HISTORY,
  onExit,
}: LocalEngineMatchProps) {
  const { subscriptionTier } = useSimulatorAuth();
  const locale = useFabCardLocale();
  const registry = useFabPresentationRegistry();
  const registrySnapshot = useSyncExternalStore(
    registry.subscribe,
    registry.getSnapshot,
    registry.getSnapshot,
  );
  const resolver = registrySnapshot.resolver;
  const bindings = registrySnapshot.bindings.printingIdByInstanceId;
  const { resolveFabCardArt } = resolver;
  const [runtime, setRuntime] = useState<FabMatchRuntime>(match.runtime);
  const debugHistory = useMemo(
    () =>
      new LocalSimulatorDebugHistoryRecorder(
        {
          slug: "flesh-and-blood",
          gameId: sessionKey,
          matchId: sessionKey,
          seed: match.seed,
          environment: "development",
          ...(import.meta.env.VITE_GIT_SHA ? { releaseSha: import.meta.env.VITE_GIT_SHA } : {}),
        },
        match.runtime.snapshot(),
      ),
    [match.runtime, match.seed, sessionKey],
  );
  useRegisterSimulatorDebugExportSource(debugHistory);
  const randomRef = useRef(createSeededRandom(`${match.seed}:bot`));
  const [activeBotStrategyId, setActiveBotStrategyId] = useState<string | null>(botStrategyId);
  const [botPacing, setBotPacing] = useState<SimulatorBotPacing>("auto");
  const [botSpeed, setBotSpeed] = useState<SimulatorBotSpeed>("balanced");
  const includeTestStrategies = fixtureId !== undefined;
  const runtimeStrategyOptions = useMemo(
    () =>
      FAB_AUTOMATED_ACTION_STRATEGIES.filter(
        (option) => includeTestStrategies || !option.testOnly || option.id === activeBotStrategyId,
      ),
    [activeBotStrategyId, includeTestStrategies],
  );
  const strategyOption = useMemo(
    () =>
      activeBotStrategyId ? getSafeFabAutomatedActionStrategyOption(activeBotStrategyId) : null,
    [activeBotStrategyId],
  );
  const strategy = strategyOption?.strategy ?? null;
  const [controlledPlayerId, setControlledPlayerId] = useState(humanId);
  const [historyHighlightedEntityIds, setHistoryHighlightedEntityIds] = useState<readonly string[]>(
    [],
  );
  const [telemetry, setTelemetry] = useState<readonly FabPracticeTelemetryEntry[]>(() =>
    initialHistory.telemetry.map((entry) => ({
      ...entry,
      getRawState: () => "Raw state is unavailable for restored command history.",
      getRawInteraction: () => "Raw interaction is unavailable for restored command history.",
    })),
  );
  const telemetryRef = useRef(telemetry);
  const telemetryIdRef = useRef(Math.max(0, ...telemetry.map((entry) => entry.id)));
  const [chatMessages, setChatMessages] = useState<readonly FabPracticeChatMessage[]>(
    initialHistory.chatMessages,
  );
  const chatMessagesRef = useRef(chatMessages);
  const chatIdRef = useRef(Math.max(0, ...chatMessages.map((message) => message.id)));
  const [undoCheckpoint, setUndoCheckpoint] = useState<FabPracticeUndoPoint | null>(null);

  const [presentation, setPresentation] = useState<FabPresentationState>(() =>
    projectSession(runtime, humanId, presentationTransform, resolver, bindings),
  );
  const availableHistoryEntityIds = useMemo(
    () =>
      Object.values(presentation.cards)
        .filter(
          (card) =>
            card.zone !== "deck" && (card.face === "up" || card.ownerId === controlledPlayerId),
        )
        .map((card) => card.id),
    [controlledPlayerId, presentation.cards],
  );
  const historyCardDefinitions = useMemo(() => {
    const visibleCanonicalIds = new Set<string>();
    for (const telemetryEntry of telemetry) {
      if (telemetryEntry.playerLog) {
        for (const message of visibleFabPlayerLogMessages(
          telemetryEntry.playerLog,
          controlledPlayerId,
        )) {
          for (const reference of message.cardRefs ?? []) {
            if (reference.canonicalId) visibleCanonicalIds.add(reference.canonicalId);
          }
        }
        continue;
      }
      for (const moveLog of telemetryEntry.moveLogs) {
        const messages = [
          ...moveLog.public,
          ...(moveLog.privateByPlayerId?.[controlledPlayerId] ?? []),
        ];
        for (const message of messages) {
          for (const reference of Object.values(message.objectRefs ?? {})) {
            if (reference?.canonicalId) visibleCanonicalIds.add(reference.canonicalId);
          }
        }
      }
    }
    const definitions = { ...presentation.cardDefinitions };
    const authoritativeDefinitions = runtime.getState().cardDefinitions;
    for (const canonicalId of visibleCanonicalIds) {
      const definition = authoritativeDefinitions[canonicalId];
      if (definition) definitions[canonicalId] = engineDefToPresentation(definition, resolver);
    }
    return definitions;
  }, [controlledPlayerId, presentation.cardDefinitions, runtime, telemetry, resolver]);
  useEffect(() => {
    const available = new Set(availableHistoryEntityIds);
    setHistoryHighlightedEntityIds((current) => current.filter((id) => available.has(id)));
  }, [availableHistoryEntityIds]);
  const analyticsStartedAtRef = useRef(initialHistory.analytics?.startedAt ?? Date.now());
  const analyticsInitialTurnPlayerIdRef = useRef(
    initialHistory.analytics?.initialTurnPlayerId ?? presentation.activePlayerId ?? humanId,
  );
  const analyticsPlayersRef = useRef<readonly FabAnalyticsPlayerSeedV2[]>(
    initialHistory.analytics?.players ??
      presentation.players.map((playerId, index) => {
        const state = runtime.getState();
        const hero = Object.values(presentation.cards).find(
          (card) => card.ownerId === playerId && card.zone === "hero",
        );
        const handIds = state.containers.zonesByPlayerId[playerId]?.hand ?? [];
        return {
          playerId,
          seat: index === 0 ? 1 : 2,
          heroName: hero
            ? (presentation.cardDefinitions[hero.cardId]?.name ?? "Unknown hero")
            : "Unknown hero",
          heroCanonicalId: hero?.cardId ?? null,
          initialLife: presentation.life[playerId] ?? 0,
          openingHand: handIds.flatMap((instanceId) => {
            const object = state.objects[instanceId];
            if (!object) return [];
            return [
              {
                canonicalId: object.canonicalId,
                instanceId,
                name:
                  state.cardDefinitions[object.canonicalId]?.base.names.join(" // ") ??
                  "Unknown card",
                ownerId: object.ownerId,
                controllerId: playerId,
              },
            ];
          }),
        };
      }),
  );
  const analyticsTransitionReceiptsRef = useRef<readonly FabAnalyticsTransitionReceiptV2[]>(
    initialHistory.analytics?.transitionReceipts ?? [],
  );
  const analyticsCompleteRef = useRef(
    initialHistory.analytics !== undefined ||
      (initialHistory.telemetry.length === 0 && runtime.getStateID() === 0) ||
      fixtureId !== undefined,
  );
  const [engineVersion, setEngineVersion] = useState(() => runtime.getStateID());
  const [animationTransition, setAnimationTransition] = useState<FabAnimationTransition | null>(
    null,
  );
  const [deckRevealRecalls, setDeckRevealRecalls] = useState<
    Readonly<Record<string, FabDeckRevealRecall | undefined>>
  >({});
  const [handRevealRecalls, setHandRevealRecalls] = useState<
    Readonly<Record<string, readonly FabHandRevealRecall[] | undefined>>
  >({});
  const animationCommandIdRef = useRef(0);
  const [pending, setPending] = useState(false);
  const botStepInFlightRef = useRef(false);
  const [botError, setBotError] = useState<string | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [reversalNotice, setReversalNotice] = useState<string | null>(null);
  const [transitionNotice, setTransitionNotice] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const runtimePresentationDefinitions = useMemo(
    () => definitionsForFabMatchPresentation(runtime.getState()),
    [engineVersion, runtime],
  );
  const runtimePresentationLoad = useFabCardPresentation(
    runtimePresentationDefinitions,
    engineVersion,
  );
  const [actionFlow, setActionFlow] = useState<FabActionFlow>({ kind: "intents" });
  const [activityTab, setActivityTab] = useState<SimulatorActivityTab>("combined");
  const sendChat = useCallback(
    (message: string) => {
      const next = [
        ...chatMessagesRef.current,
        {
          id: ++chatIdRef.current,
          recordedAt: Date.now(),
          turn: presentation.turnNumber,
          actorId: humanId,
          message,
        },
      ];
      chatMessagesRef.current = next;
      setChatMessages(next);
    },
    [humanId, presentation.turnNumber],
  );
  useEffect(() => {
    setPresentation(
      projectSession(runtime, controlledPlayerId, presentationTransform, resolver, bindings),
    );
  }, [resolver, runtime, controlledPlayerId, presentationTransform, bindings]);
  const refresh = useCallback(() => {
    setPresentation(
      projectSession(runtime, controlledPlayerId, presentationTransform, resolver, bindings),
    );
    setEngineVersion(runtime.getStateID());
  }, [controlledPlayerId, presentationTransform, runtime, resolver, bindings]);

  const enqueueEngineAnimation = useCallback(
    (input: {
      readonly commandId: string;
      readonly previousLocations: FabZoneLocations;
      readonly events: Parameters<typeof projectFabAnalyticsFactsV2>[0];
      readonly version: number;
    }) => {
      const nextPresentation = projectSession(
        runtime,
        controlledPlayerId,
        presentationTransform,
        resolver,
        bindings,
      );
      const runtimeState = runtime.getState();
      const revealPresentationByInstanceId = Object.fromEntries(
        Object.entries(runtimeState.objects).map(([instanceId, object]) => {
          const definition = runtimeState.cardDefinitions[object.canonicalId];
          const name = fabPregameDefinitionName(definition, "Revealed card");
          const types = definition ? fabPregameDefinitionTypes(definition) : [];
          return [
            instanceId,
            {
              title: name,
              subtitle: types.join(" ") || "Flesh and Blood",
              // Public deck-edge reveals use the game-owned board treatment.
              // Do not couple the reveal UI to an optional printing asset.
              imageUrl: resolveFabCardArt({
                canonicalId: object.canonicalId,
                name,
                locale,
                printingId: bindings[instanceId],
              }).boardImageUrl,
            },
          ];
        }),
      );
      setDeckRevealRecalls((current) =>
        nextFabDeckRevealRecalls({
          current,
          decks: Object.fromEntries(
            Object.entries(runtimeState.containers.zonesByPlayerId).map(([playerId, zones]) => [
              playerId,
              zones.deck,
            ]),
          ),
          turnNumber: runtimeState.turnNumber,
          presentationByInstanceId: revealPresentationByInstanceId,
          events: input.events,
        }),
      );
      setHandRevealRecalls((current) =>
        nextFabHandRevealRecalls({
          current,
          hands: Object.fromEntries(
            Object.entries(runtimeState.containers.zonesByPlayerId).map(([playerId, zones]) => [
              playerId,
              zones.hand,
            ]),
          ),
          turnNumber: runtimeState.turnNumber,
          presentationByInstanceId: revealPresentationByInstanceId,
          events: input.events,
        }),
      );
      const locationHints = fabHiddenZoneTransfers(
        input.previousLocations,
        captureFabZoneLocations(runtime.getState()),
        input.commandId,
        fabLatestAnnouncementTransition(
          {
            activePlayerId: presentation.activePlayerId,
            turnNumber: presentation.turnNumber,
            combatStep: presentation.combat?.step ?? null,
          },
          {
            activePlayerId: nextPresentation.activePlayerId,
            turnNumber: nextPresentation.turnNumber,
            combatStep: nextPresentation.combat?.step ?? null,
          },
        ),
      );
      const plan = fabBoardTransfers(
        presentation,
        nextPresentation,
        input.commandId,
        controlledPlayerId,
        locationHints,
      );
      setPresentation(nextPresentation);
      setEngineVersion(input.version);
      setAnimationTransition({
        version: input.version,
        correlationId: input.commandId,
        plan: locationHints,
        mode: "enqueue",
      });
      return plan !== null && plan.steps.length > 0 && !testHarnessDisablesSimulatorMotion();
    },
    [controlledPlayerId, presentationTransform, runtime, locale, resolver, bindings, presentation],
  );

  const recordAnalyticsBatch = useCallback(
    (input: {
      readonly commandId: string;
      readonly stateVersion: number;
      readonly timestamp: number;
      readonly events: Parameters<typeof projectFabAnalyticsFactsV2>[0];
    }) => {
      if (!analyticsCompleteRef.current) return;
      analyticsTransitionReceiptsRef.current = [
        ...analyticsTransitionReceiptsRef.current,
        {
          schemaVersion: 2,
          commandId: input.commandId,
          stateVersion: input.stateVersion,
          timestamp: input.timestamp,
          facts: projectFabAnalyticsFactsV2(input.events),
        },
      ];
    },
    [],
  );

  const persistCheckpoint = useCallback(
    (validatedSnapshot?: FabMatchSnapshotV21) =>
      practiceConfig
        ? persistFabPracticeSession(
            { ...match, runtime },
            practiceConfig,
            practiceSessionStorageKey,
            {
              telemetry: telemetryRef.current,
              chatMessages: chatMessagesRef.current,
              ...(analyticsCompleteRef.current
                ? {
                    analytics: {
                      startedAt: analyticsStartedAtRef.current,
                      initialTurnPlayerId: analyticsInitialTurnPlayerIdRef.current,
                      players: analyticsPlayersRef.current,
                      transitionReceipts: analyticsTransitionReceiptsRef.current,
                    },
                  }
                : {}),
            },
            validatedSnapshot,
          )
        : false,
    [match, practiceConfig, practiceSessionStorageKey, runtime],
  );
  const persistCheckpointRef = useRef(persistCheckpoint);
  persistCheckpointRef.current = persistCheckpoint;
  const deferredWorkQueue = useMemo(
    () =>
      createFabPracticeDeferredWorkQueue<FabMatchSnapshotV21>({
        run: (correlationId, stage, work) =>
          runFabPracticePostCommandWork({ commandId: correlationId, stage, work }),
        startTransition,
        persist: (snapshot) => persistCheckpointRef.current(snapshot),
      }),
    [sessionKey],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  const runtimePresentationLoadKind = runtimePresentationLoad.kind;
  const runtimePresentationLoadError =
    runtimePresentationLoad.kind === "error" ? runtimePresentationLoad.message : null;
  useEffect(() => {
    if (runtimePresentationLoadKind === "ready") refresh();
    if (runtimePresentationLoadError) setRuntimeError(runtimePresentationLoadError);
  }, [refresh, runtimePresentationLoadError, runtimePresentationLoadKind]);

  const buildTelemetryEntry = useCallback(
    ({
      source,
      actorId,
      command,
      playerLog,
      moveLogs,
      decisionBefore,
    }: {
      readonly source: "player" | "bot";
      readonly actorId: string;
      readonly command: FabLegalCommand;
      readonly playerLog: FabPlayerLog | null;
      readonly moveLogs: readonly FabMoveLog[];
      readonly decisionBefore: FabPracticeDecisionSnapshot | null;
    }): FabPracticeTelemetryEntry => {
      const pendingDecision = practiceDecisionSnapshot(runtime.waitState());
      const interactionActorId = pendingDecision?.actorId ?? actorId;
      const debugState = runtime.getState();
      return {
        id: ++telemetryIdRef.current,
        source,
        actorId,
        controllerId: controlledPlayerId,
        interactionActorId,
        commandLabel: command.label,
        move: command.move,
        result: "accepted",
        recordedAt: Date.now(),
        turnNumber: runtime.getState().turnNumber,
        stateId: runtime.getStateID(),
        ...(playerLog ? { playerLog } : {}),
        moveLogs,
        decisionBefore,
        pendingDecision,
        completedDecision:
          decisionBefore && pendingDecision?.decisionId !== decisionBefore.decisionId
            ? decisionBefore
            : null,
        getRawState: () => safeStringify(debugState),
        getRawInteraction: () =>
          safeStringify(
            projectFabInteraction(new FabMatchRuntime(debugState), interactionActorId).view,
          ),
      };
    },
    [controlledPlayerId, runtime],
  );

  const commitTelemetry = useCallback((entry: FabPracticeTelemetryEntry) => {
    const next = appendFabPracticeTelemetry(telemetryRef.current, entry);
    telemetryRef.current = next;
    setTelemetry(next);
  }, []);

  const settleDeferredCommandWork = useCallback(
    ({ correlationId }: Pick<SimulatorTransitionSettledEvent, "correlationId">) => {
      deferredWorkQueue.settle(correlationId);
    },
    [deferredWorkQueue],
  );

  const deferCommandWork = useCallback(
    (work: FabPracticeDeferredCommandWork<FabMatchSnapshotV21>, willAnimate: boolean) => {
      deferredWorkQueue.defer(work, willAnimate);
    },
    [deferredWorkQueue],
  );

  useEffect(() => {
    const flushForPageHide = () => deferredWorkQueue.flushPageHide();
    window.addEventListener("pagehide", flushForPageHide);
    return () => window.removeEventListener("pagehide", flushForPageHide);
  }, [deferredWorkQueue]);

  const dispatchCommand = useCallback(
    (actorId: string, command: FabLegalCommand) => {
      let acceptedCommandId: string | null = null;
      const reportContext = () => ({
        actorId,
        commandLabel: command.label,
        commandMove: command.move,
        stateID: runtime.getStateID(),
        turnNumber: runtime.getState().turnNumber,
      });
      try {
        const previousLocations = captureFabZoneLocations(runtime.getState());
        const snapshotBeforeCommand = runtime.snapshot();
        const decisionBefore = practiceDecisionSnapshot(runtime.waitState());
        const decoded = decodeFabCommand(command.move, command.payload);
        if (!decoded) {
          const error = "The selected action is no longer a valid Flesh and Blood command.";
          reportFabPracticeCommandFailure({
            ...reportContext(),
            error,
            errorCode: "invalid_command",
          });
          setRuntimeError(error);
          return false;
        }
        const commandId = `practice:${runtime.getStateID() + 1}:${++animationCommandIdRef.current}`;
        reportFabPracticeCommandSubmitted({ ...reportContext(), commandId });
        const result = runtime.applyCommand(actorId, decoded, {
          commandId,
          timestamp: Date.now(),
        });
        if (!result.success) {
          reportFabPracticeCommandFailure({
            ...reportContext(),
            error: result.error,
            errorCode: result.errorCode,
          });
          if (result.errorCode === "invalid_transition") {
            console.error("[fab-practice] rejected atomic FAB transition", result.diagnostic);
            setTransitionNotice(result.error);
            setRuntimeError(null);
            refresh();
          } else {
            setRuntimeError(result.error);
          }
          return false;
        }
        const executionCommandId = result.execution.commandId;
        acceptedCommandId = executionCommandId;
        debugHistory.record({
          stateAfter: result.snapshot,
          stateVersion: result.stateID,
          turnNumber: runtime.getState().turnNumber,
          actorId,
          moveId: command.move,
          commandId: executionCommandId,
          input: decoded,
          processedCommand: result.execution,
          timestamp: result.execution.timestamp,
          domainEvents: result.committedEvents,
        });
        setRuntimeError(null);
        setTransitionNotice(null);
        if (result.outcome.kind === "rules-action-reversed") {
          reportFabPracticeRulesReversal({
            ...reportContext(),
            action: result.outcome.action,
            reasonCode: result.outcome.reason.code,
            reasonMessage: result.outcome.reason.message,
          });
          setReversalNotice(result.outcome.reason.message);
          runFabPracticePostCommandWork({
            commandId: executionCommandId,
            stage: "presentation",
            work: refresh,
          });
          deferredWorkQueue.coalescePersistence(result.snapshot);
          return true;
        }
        setReversalNotice(null);
        setUndoCheckpoint(
          nextFabPracticeUndoPoint({
            moveKind: classifyFabPracticeUndoMove({
              move: decoded.move,
              answersPendingDecision: decisionBefore !== null,
            }),
            barrier: result.undoBarrier,
            current: undoCheckpoint,
            next: {
              snapshot: snapshotBeforeCommand,
              telemetryLength: telemetryRef.current.length,
              analyticsLength: analyticsTransitionReceiptsRef.current.length,
            },
          }),
        );
        let willAnimate = false;
        runFabPracticePostCommandWork({
          commandId: executionCommandId,
          stage: "animation",
          work: () => {
            willAnimate = enqueueEngineAnimation({
              previousLocations,
              commandId: executionCommandId,
              events: result.committedEvents,
              version: result.stateID,
            });
          },
        });
        const telemetryEntry = buildTelemetryEntry({
          source: actorId === botId && controlledPlayerId !== botId ? "bot" : "player",
          actorId,
          command,
          playerLog: result.playerLog,
          moveLogs: result.moveLogs,
          decisionBefore,
        });
        deferCommandWork(
          {
            correlationId: executionCommandId,
            snapshot: result.snapshot,
            commitAnalytics: () =>
              recordAnalyticsBatch({
                commandId: executionCommandId,
                stateVersion: result.stateID,
                timestamp: result.execution.timestamp,
                events: result.committedEvents,
              }),
            commitTelemetry: () => commitTelemetry(telemetryEntry),
          },
          willAnimate,
        );
        return true;
      } catch (error) {
        if (acceptedCommandId) {
          runFabPracticePostCommandWork({
            commandId: acceptedCommandId,
            stage: "presentation",
            work: refresh,
          });
          return true;
        }
        reportFabPracticeDispatchException(reportContext(), error);
        const refusal = error as { rejectedSnapshot?: unknown } | null;
        if (refusal && typeof refusal === "object" && "rejectedSnapshot" in refusal) {
          console.error(
            "[fab-practice] rejected snapshot DTO for offline post-mortem",
            refusal.rejectedSnapshot,
          );
        }
        setRuntimeError(error instanceof Error ? error.message : "The match could not continue.");
        refresh();
        return false;
      }
    },
    [
      botId,
      buildTelemetryEntry,
      commitTelemetry,
      controlledPlayerId,
      deferredWorkQueue,
      deferCommandWork,
      debugHistory,
      enqueueEngineAnimation,
      recordAnalyticsBatch,
      refresh,
      runtime,
      undoCheckpoint,
    ],
  );

  const undo = useCallback(() => {
    if (!undoCheckpoint) return;
    const state = runtime.getState();
    const context = createFabMatchContext(state.cardDefinitions, state.publicCardIdentities);
    const restoredRuntime = new FabMatchRuntime(
      restoreFabMatchSnapshot(undoCheckpoint.snapshot, context),
    );
    setUndoCheckpoint(null);
    setRuntime(restoredRuntime);
    setDeckRevealRecalls({});
    setHandRevealRecalls({});
    setBotError(null);
    setRuntimeError(null);
    setReversalNotice(null);
    setTransitionNotice(null);
    setAnimationTransition({
      version: restoredRuntime.getStateID(),
      correlationId: `practice:undo:${++animationCommandIdRef.current}`,
      plan: null,
      mode: "sync",
    });
    const nextTelemetry = telemetryRef.current.slice(0, undoCheckpoint.telemetryLength);
    telemetryRef.current = nextTelemetry;
    setTelemetry(nextTelemetry);
    analyticsTransitionReceiptsRef.current = analyticsTransitionReceiptsRef.current.slice(
      0,
      undoCheckpoint.analyticsLength,
    );
    persistCheckpoint(undoCheckpoint.snapshot);
  }, [persistCheckpoint, runtime, undoCheckpoint]);

  const botAutomationReady = useMemo(() => {
    if (!strategy || controlledPlayerId === botId || runtime.hasGameEnded() || botError) {
      return false;
    }
    const legalCommands = botEligibleFabCommands(
      listLegalCommands(runtime, botId, { includeConcede: true }),
    );
    // Some rules boundaries (most notably the defender declaration in CR 7.3)
    // deliberately close the priority window while still giving one player a
    // legal command. Drive automation from the same public legal-command view
    // as the UI instead of treating priority ownership as turn ownership.
    return shouldScheduleFabPracticeBot({
      botId,
      decisionActorId: runtime.getState().decision?.actorId,
      seatMustAct: seatMustAct(runtime, botId),
      legalCommands,
    });
  }, [botError, botId, controlledPlayerId, engineVersion, runtime, strategy]);

  const runBotStep = useCallback(() => {
    if (
      botStepInFlightRef.current ||
      !strategy ||
      controlledPlayerId === botId ||
      runtime.hasGameEnded() ||
      botError
    ) {
      return false;
    }
    const legal = botEligibleFabCommands(
      listLegalCommands(runtime, botId, { includeConcede: true }),
    );
    if (
      !shouldScheduleFabPracticeBot({
        botId,
        decisionActorId: runtime.getState().decision?.actorId,
        seatMustAct: seatMustAct(runtime, botId),
        legalCommands: legal,
      })
    ) {
      return false;
    }

    const previousLocations = captureFabZoneLocations(runtime.getState());
    botStepInFlightRef.current = true;
    setPending(true);
    let presentationUpdated = false;
    try {
      const decisionBefore = practiceDecisionSnapshot(runtime.waitState());
      const choice = chooseAutomatedAction(runtime, botId, strategy, {
        random: randomRef.current,
      });
      if (!choice) {
        if (seatMustAct(runtime, botId)) {
          const execution = botExecutionContext(runtime);
          const submitted = submitAutomatedAction(
            runtime,
            botId,
            {
              move: "concede",
              payload: {},
              label: "Concede",
            },
            legal,
            execution,
          );
          if (!submitted.advanced) {
            setBotError(submitted.error ?? "Bot could not play, pass, or concede.");
          } else {
            if (fabPracticeUndoBlockedByBarrier(submitted.undoBarrier)) setUndoCheckpoint(null);
            const snapshot = submitted.snapshot ?? runtime.snapshot();
            const commandId = `practice:bot:${runtime.getStateID()}:${++animationCommandIdRef.current}`;
            debugHistory.record({
              stateAfter: snapshot,
              stateVersion: runtime.getStateID(),
              turnNumber: runtime.getState().turnNumber,
              actorId: botId,
              moveId: submitted.command.move,
              commandId: execution.commandId,
              input: submitted.command.payload,
              processedCommand: submitted.command,
              timestamp: execution.timestamp,
              domainEvents: submitted.committedEvents,
            });
            let willAnimate = false;
            runFabPracticePostCommandWork({
              commandId,
              stage: "animation",
              work: () => {
                willAnimate = enqueueEngineAnimation({
                  previousLocations,
                  commandId,
                  events: submitted.committedEvents,
                  version: runtime.getStateID(),
                });
                presentationUpdated = true;
              },
            });
            const telemetryEntry = buildTelemetryEntry({
              source: "bot",
              actorId: botId,
              command: submitted.command,
              playerLog: submitted.playerLog,
              moveLogs: submitted.moveLogs,
              decisionBefore,
            });
            deferCommandWork(
              {
                correlationId: commandId,
                snapshot,
                commitAnalytics: () =>
                  recordAnalyticsBatch({
                    commandId: execution.commandId,
                    stateVersion: runtime.getStateID(),
                    timestamp: execution.timestamp,
                    events: submitted.committedEvents,
                  }),
                commitTelemetry: () => commitTelemetry(telemetryEntry),
              },
              willAnimate,
            );
          }
        }
        return false;
      }

      const execution = botExecutionContext(runtime);
      const submitted = submitAutomatedAction(runtime, botId, choice, legal, execution);
      if (!submitted.advanced) {
        setBotError(submitted.error ?? `Bot stalled on ${choice.move}.`);
      } else {
        if (fabPracticeUndoBlockedByBarrier(submitted.undoBarrier)) setUndoCheckpoint(null);
        const snapshot = submitted.snapshot ?? runtime.snapshot();
        const commandId = `practice:bot:${runtime.getStateID()}:${++animationCommandIdRef.current}`;
        debugHistory.record({
          stateAfter: snapshot,
          stateVersion: runtime.getStateID(),
          turnNumber: runtime.getState().turnNumber,
          actorId: botId,
          moveId: submitted.command.move,
          commandId: execution.commandId,
          input: submitted.command.payload,
          processedCommand: submitted.command,
          timestamp: execution.timestamp,
          domainEvents: submitted.committedEvents,
        });
        let willAnimate = false;
        runFabPracticePostCommandWork({
          commandId,
          stage: "animation",
          work: () => {
            willAnimate = enqueueEngineAnimation({
              previousLocations,
              commandId,
              events: submitted.committedEvents,
              version: runtime.getStateID(),
            });
            presentationUpdated = true;
          },
        });
        const telemetryEntry = buildTelemetryEntry({
          source: "bot",
          actorId: botId,
          command: submitted.command,
          playerLog: submitted.playerLog,
          moveLogs: submitted.moveLogs,
          decisionBefore,
        });
        deferCommandWork(
          {
            correlationId: commandId,
            snapshot,
            commitAnalytics: () =>
              recordAnalyticsBatch({
                commandId: execution.commandId,
                stateVersion: runtime.getStateID(),
                timestamp: execution.timestamp,
                events: submitted.committedEvents,
              }),
            commitTelemetry: () => commitTelemetry(telemetryEntry),
          },
          willAnimate,
        );
      }
      return submitted.advanced;
    } finally {
      if (!presentationUpdated) {
        runFabPracticePostCommandWork({
          commandId: `practice:bot:refresh:${runtime.getStateID()}`,
          stage: "presentation",
          work: refresh,
        });
      }
      setPending(false);
      botStepInFlightRef.current = false;
    }
  }, [
    botError,
    botId,
    buildTelemetryEntry,
    commitTelemetry,
    controlledPlayerId,
    deferCommandWork,
    debugHistory,
    enqueueEngineAnimation,
    recordAnalyticsBatch,
    refresh,
    runtime,
    strategy,
  ]);

  // Local bot loop (no server). Step pacing uses the same one-command
  // executor through the quick control and expanded configuration panel.
  useEffect(() => {
    if (botPacing !== "auto" || !botAutomationReady) return;

    setPending(true);
    const timer = window.setTimeout(() => {
      setPending(false);
      runBotStep();
    }, SIMULATOR_BOT_SPEED_MS[botSpeed]);

    return () => {
      window.clearTimeout(timer);
      setPending(false);
    };
  }, [botAutomationReady, botPacing, botSpeed, engineVersion, runBotStep]);

  const humanLegal = useMemo(() => {
    if (runtime.hasGameEnded()) return [] as FabLegalCommand[];
    return listLegalCommands(runtime, controlledPlayerId, { includeConcede: true });
  }, [controlledPlayerId, engineVersion, runtime]);
  const interactionView = useMemo(
    () => projectFabInteraction(runtime, controlledPlayerId).view,
    [controlledPlayerId, engineVersion, runtime],
  );
  const submitInteraction = useCallback(
    (submission: InteractionSubmission) => {
      if (runtime.hasGameEnded()) return;
      const command = commandForFabSubmission(runtime, controlledPlayerId, submission);
      if (command) dispatchCommand(controlledPlayerId, command);
    },
    [controlledPlayerId, dispatchCommand, runtime],
  );

  const passPriority = useCallback(() => {
    const pass = humanLegal.find((command) => command.move === "pass");
    if (pass) dispatchCommand(controlledPlayerId, pass);
  }, [controlledPlayerId, dispatchCommand, humanLegal]);

  const endTurn = useCallback(() => {
    const base = humanLegal.find((entry) => entry.move === "end-turn");
    // Never invent an end-turn when legality does not offer one (pending/priority races).
    if (!base) {
      return;
    }
    dispatchCommand(controlledPlayerId, base);
  }, [controlledPlayerId, dispatchCommand, humanLegal]);

  const concede = useCallback(() => {
    const command = humanLegal.find((entry) => entry.move === "concede");
    if (command) dispatchCommand(controlledPlayerId, command);
  }, [controlledPlayerId, dispatchCommand, humanLegal]);

  const humanCanAct =
    !pending &&
    !botError &&
    !runtimeError &&
    !runtime.hasGameEnded() &&
    humanLegal.some((command) => command.move !== "concede");
  const wait = runtime.waitState();
  const currentDecision = wait.kind === "decision" ? wait.decision : undefined;
  const interactionActorId =
    currentDecision?.actorId ??
    (wait.kind === "defense-declaration" ? wait.defenderId : runtime.getPriorityPlayerId());

  const canEndTurn = humanCanAct && humanLegal.some((command) => command.move === "end-turn");
  const takeoverActive = controlledPlayerId === botId;
  const canStepBot = botPacing === "step" && botAutomationReady && !pending;
  const botPanelStatus: AiControlPanelProps["status"] = runtime.hasGameEnded()
    ? "done"
    : botError
      ? "error"
      : takeoverActive
        ? "you-control"
        : pending
          ? "thinking"
          : botPacing === "step" && botAutomationReady
            ? "paused"
            : "waiting";
  const toggleBotTakeover = () => setControlledPlayerId(takeoverActive ? humanId : botId);
  const pendingDecision = practiceDecisionSnapshot(wait);
  // The debug panel must remain observational while a rules procedure is in
  // flight. Persistence snapshots deliberately reject transient states, so
  // serializing one during render can crash an otherwise playable match.
  const getRawState = useCallback(() => safeStringify(runtime.getState()), [runtime]);
  const getRawInteraction = useCallback(
    () => safeStringify(projectFabInteraction(runtime, controlledPlayerId).view),
    [controlledPlayerId, runtime],
  );

  const intentCommands = (intent: FabActionIntent) =>
    humanLegal.filter((command) => {
      if (intent === "play") return command.move === "begin-play";
      return command.move === intent;
    });
  const actionIntents = (["play", "activate", "defend"] as const).filter(
    (intent) => intentCommands(intent).length > 0,
  );

  const runtimeState = runtime.getState();
  const currentWindow = presentation.combat?.open
    ? `${formatFabWindowLabel(presentation.combat.step)} step`
    : `${formatFabWindowLabel(runtimeState.phase)} phase`;
  const priorityContext =
    presentation.priorityPlayerId === controlledPlayerId
      ? "your priority"
      : presentation.priorityPlayerId
        ? "opponent priority"
        : "priority closed";
  const sessionLabel =
    statusLabel ??
    (fixtureId ? "Local fixture" : practiceConfig ? "Local practice" : "Imported practice");
  const nowState: FabPracticeNowState =
    botError || runtimeError
      ? {
          title: "Practice opponent stalled",
          detail: `${runtimeError ?? botError} ${
            takeoverActive ? "Return to your seat or " : ""
          }exit to setup to recover.`,
          context: `Turn ${presentation.turnNumber} · ${currentWindow} · ${priorityContext}`,
          sessionLabel,
          controlLabel: takeoverActive ? "Controlling opponent · bot paused" : "Your seat",
          tone: "error",
        }
      : runtime.hasGameEnded()
        ? {
            title: "Game complete",
            detail: `Winner: ${runtime.getGameEndResult()?.winnerId ?? "Draw"}.`,
            context: `Turn ${presentation.turnNumber} · match ended`,
            sessionLabel,
            controlLabel: takeoverActive ? "Controlling opponent · bot paused" : "Your seat",
            tone: "complete",
          }
        : pending
          ? {
              title: "Practice bot choosing",
              detail: "Automation is resolving the opponent seat's next legal command.",
              context: `Turn ${presentation.turnNumber} · ${currentWindow} · ${priorityContext}`,
              sessionLabel,
              controlLabel: "Your seat · bot automated",
              tone: "thinking",
            }
          : currentDecision?.actorId === controlledPlayerId
            ? {
                title: "Decision ready on board",
                detail: "Use the board prompt to make and confirm your choice.",
                context: `Turn ${presentation.turnNumber} · ${currentWindow} · your decision`,
                sessionLabel,
                controlLabel: takeoverActive
                  ? "Controlling opponent · bot paused"
                  : strategy
                    ? "Your seat · bot automated"
                    : "Your seat · bot off",
                tone: "ready",
              }
            : humanCanAct
              ? {
                  title: actionIntents.includes("defend") ? "Choose defenders" : "Your priority",
                  detail: actionIntents.length
                    ? "Choose a legal action below, or pass priority from the action dock."
                    : "Use the action dock to pass priority or end the turn when legal.",
                  context: `Turn ${presentation.turnNumber} · ${currentWindow} · ${priorityContext}`,
                  sessionLabel,
                  controlLabel: takeoverActive
                    ? "Controlling opponent · bot paused"
                    : strategy
                      ? "Your seat · bot automated"
                      : "Your seat · bot off",
                  tone: "ready",
                }
              : takeoverActive
                ? {
                    title: "Other seat has priority",
                    detail:
                      "Return to your seat to act. The practice bot stays paused while you control its seat.",
                    context: `Turn ${presentation.turnNumber} · ${currentWindow} · ${priorityContext}`,
                    sessionLabel,
                    controlLabel: "Controlling opponent · bot paused",
                    tone: "waiting",
                  }
                : {
                    title: strategy ? "Waiting for practice bot" : "Opponent automation is off",
                    detail: strategy
                      ? "The opponent seat acts automatically when it receives priority or a decision."
                      : "Take control of the opponent seat to continue the match manually.",
                    context: `Turn ${presentation.turnNumber} · ${currentWindow} · ${priorityContext}`,
                    sessionLabel,
                    controlLabel: strategy ? "Your seat · bot automated" : "Your seat · bot off",
                    tone: "waiting",
                  };

  useEffect(() => {
    setActionFlow({ kind: "intents" });
  }, [engineVersion]);

  const selectedIntentCommands =
    actionFlow.kind === "cards" || actionFlow.kind === "commands"
      ? intentCommands(actionFlow.intent)
      : [];
  const soleActionIntent = actionIntents.length === 1 ? actionIntents[0] : undefined;
  const selectedCardCommands =
    actionFlow.kind === "commands"
      ? selectedIntentCommands.filter((command) => commandCardKey(command) === actionFlow.cardKey)
      : [];
  const actionCardChoices =
    actionFlow.kind === "cards"
      ? listFabActionCardChoices(selectedIntentCommands, presentation)
      : [];

  const actionControls = (
    <div className="fab-actions" data-testid="fab-match-actions">
      {botError ? (
        <p className="text-xs text-red-300" role="alert" data-testid="fab-bot-error">
          {botError}
        </p>
      ) : null}
      <div className="flex flex-col gap-1" data-testid="fab-legal-moves">
        {humanCanAct && !currentDecision && actionFlow.kind === "intents" ? (
          <>
            {actionIntents.length > 0 ? (
              <button
                type="button"
                className="fab-practice-primary-action"
                data-testid="fab-action-choose-card"
                onClick={() =>
                  setActionFlow({
                    kind: "cards",
                    intent: actionIntents[0],
                  })
                }
              >
                {soleActionIntent ? FAB_ACTION_INTENT_LABELS[soleActionIntent] : "Choose an action"}
              </button>
            ) : null}
            {humanLegal.some((command) => command.move === "end-turn") ? (
              <button
                type="button"
                className={actionIntents.length === 0 ? "fab-practice-primary-action" : undefined}
                data-testid="fab-action-end-turn"
                onClick={endTurn}
              >
                End turn
              </button>
            ) : null}
          </>
        ) : null}
        {humanCanAct && !currentDecision && actionFlow.kind === "cards" ? (
          <>
            {actionIntents.length > 1 ? (
              <div className="flex flex-col gap-1" data-testid="fab-action-intents">
                {actionIntents.map((intent) => (
                  <button
                    key={intent}
                    type="button"
                    data-testid={`fab-action-intent-${intent}`}
                    onClick={() => setActionFlow({ kind: "cards", intent })}
                  >
                    {FAB_ACTION_INTENT_LABELS[intent]}
                  </button>
                ))}
              </div>
            ) : null}
            <div className="flex flex-col gap-1" data-testid="fab-action-cards">
              {actionCardChoices.map(({ cardKey, label }) => (
                <button
                  key={cardKey}
                  type="button"
                  data-testid={`fab-action-card-${cardKey}`}
                  onClick={() => {
                    const forCard = selectedIntentCommands.filter(
                      (entry) => commandCardKey(entry) === cardKey,
                    );
                    const auto = shouldAutoDispatchCardCommands(forCard);
                    if (auto) {
                      dispatchCommand(controlledPlayerId, auto);
                      return;
                    }
                    setActionFlow({ kind: "commands", intent: actionFlow.intent, cardKey });
                  }}
                >
                  <FabSymbolText text={label} />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setActionFlow({ kind: "intents" })}>
              Back
            </button>
          </>
        ) : null}
        {humanCanAct && !currentDecision && actionFlow.kind === "commands" ? (
          <>
            <p className="text-xs opacity-70">Choose a legal action</p>
            {selectedCardCommands.map((command, index) => (
              <button
                key={legalCommandTestId(command, index)}
                type="button"
                data-testid={legalCommandTestId(command, index)}
                data-move={command.move}
                onClick={() => dispatchCommand(controlledPlayerId, command)}
              >
                <FabSymbolText text={command.label} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActionFlow({ kind: "cards", intent: actionFlow.intent })}
            >
              Back to cards
            </button>
          </>
        ) : null}
      </div>
      {onExit ? (
        <button type="button" data-testid="fab-practice-exit" onClick={onExit}>
          Exit to setup
        </button>
      ) : null}
    </div>
  );

  const configuredPlayerDeck = practiceConfig
    ? practiceDependencies().getFabPracticeDeckOption(practiceConfig.playerDeckId)
    : undefined;
  const configuredBotDeck = practiceConfig
    ? practiceDependencies().getFabPracticeDeckOption(practiceConfig.botDeckId)
    : undefined;
  const resolvedHumanDeckLabel = humanDeckLabel ?? configuredPlayerDeck?.label;
  const resolvedBotDeckLabel = botDeckLabel ?? configuredBotDeck?.label;

  const matchActivity = createFabPracticeSidebarActivity({
    actions: actionControls,
    telemetry,
    humanPlayerId: humanId,
    controlledPlayerId,
    botPlayerId: botId,
    turnNumber: presentation.turnNumber,
    firstTurnPlayerId: presentation.firstTurnPlayerId,
    pendingDecision,
    now: nowState,
    disclosure: RULES_LIGHT_PRACTICE_DISCLOSURE,
    session: {
      mode: sessionLabel,
      playerDeck: resolvedHumanDeckLabel,
      botDeck: resolvedBotDeckLabel,
      botStrategy: strategyOption?.label ?? "Off",
      seed: practiceConfig?.seed ?? match.seed,
    },
    activeTab: activityTab,
    onActiveTabChange: setActivityTab,
    chatMessages,
    chatActorId: humanId,
    onSendChat: sendChat,
    labExtra: sidebarExtra,
    debugRevision: engineVersion,
    getRawState,
    getRawInteraction,
    cardDefinitions: historyCardDefinitions,
    cards: presentation.cards,
    highlightedEntityIds: historyHighlightedEntityIds,
    availableEntityIds: availableHistoryEntityIds,
    onHighlightEntity: setHistoryHighlightedEntityIds,
  });

  const automation = {
    label: "Practice opponent controls",
    panelLabel: "Bot strategy and pacing controls",
    summary: (
      <span className="fab-practice-automation-summary">
        <span>{takeoverActive ? "Seat control" : "Bot playback"}</span>
        <strong>
          {takeoverActive
            ? "You control bot"
            : !strategy
              ? "Bot off"
              : botPacing === "step"
                ? "Paused · step"
                : pending
                  ? "Choosing…"
                  : "Auto-running"}
        </strong>
      </span>
    ),
    control: (
      <SimulatorBotQuickControls
        pacing={botPacing}
        takeoverActive={takeoverActive}
        canStep={canStepBot}
        disabled={runtime.hasGameEnded()}
        testIdPrefix="fab-practice-quick"
        onToggleTakeover={toggleBotTakeover}
        onChangePacing={setBotPacing}
        onStep={runBotStep}
      />
    ),
    details: (
      <div className="fab-practice-bot-controls">
        <AiControlPanel
          mode={botPacing}
          speed={botSpeed}
          status={botPanelStatus}
          side="opponent"
          strategies={runtimeStrategyOptions}
          selectedStrategyId={activeBotStrategyId}
          isTakeover={takeoverActive}
          canStep={canStepBot}
          onChangeMode={setBotPacing}
          onChangeSpeed={setBotSpeed}
          onChangeStrategy={(strategyId) => {
            setActiveBotStrategyId(strategyId);
            setBotError(null);
          }}
          onStep={runBotStep}
          onTakeControl={toggleBotTakeover}
          onReleaseControl={toggleBotTakeover}
          compact
          embedded
          hideDecisionLog
        />
      </div>
    ),
  } as const;

  const promptKind = currentDecision?.continuation.kind ?? null;
  const result = presentation.result;
  const authoritativeGameAnalytics =
    result && analyticsCompleteRef.current && analyticsTransitionReceiptsRef.current.length > 0
      ? buildFabGameAnalyticsV2({
          gameId: sessionKey,
          players: analyticsPlayersRef.current,
          initialTurnPlayerId: analyticsInitialTurnPlayerIdRef.current,
          startedAt: analyticsStartedAtRef.current,
          completedAt:
            analyticsTransitionReceiptsRef.current.at(-1)?.timestamp ??
            analyticsStartedAtRef.current,
          result:
            result.kind === "draw"
              ? { winnerId: null, loserId: null, reason: result.reason }
              : {
                  winnerId: result.winnerId,
                  loserId: result.loserId,
                  reason: result.reason,
                },
          transitionReceipts: analyticsTransitionReceiptsRef.current,
        })
      : null;
  const participantLabel = (playerId: string) =>
    playerId === humanId ? "You" : playerId === botId ? "Practice bot" : playerId;
  const summaryFormatLabel = practiceConfig
    ? (() => {
        const deck = practiceDependencies().getFabPracticeDeckOption(practiceConfig.playerDeckId);
        return deck
          ? practiceDependencies().FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL[deck.formatGroup]
          : "Local practice";
      })()
    : fixtureId
      ? "Engine scenario"
      : humanDeckLabel
        ? "Imported practice"
        : "Local practice";
  const postGameSummary = result
    ? createFabPostGameSummary({
        presentation,
        viewerId: humanId,
        participantLabel,
        participantSubscriptionTier: (playerId) =>
          playerId === humanId ? (subscriptionTier ?? undefined) : "Practice",
        sessionFormatLabel: summaryFormatLabel,
        session: projectFabPostGameSessionAnalytics({
          telemetry,
          presentation,
          viewerId: humanId,
        }),
        ...(authoritativeGameAnalytics
          ? {
              backend: {
                ...fabPostGameBackendDataFromAnalytics(
                  authoritativeGameAnalytics,
                  presentation,
                  humanId,
                ),
                match: fabMatchSummaryFromAnalytics([authoritativeGameAnalytics], humanId, botId),
              },
            }
          : {}),
      })
    : null;
  const startNewGame = () => {
    clearFabPracticeSession(practiceSessionStorageKey);
    if (onExit) {
      onExit();
      return;
    }
    window.location.assign(`${FAB_SIMULATOR_BASE}/play/practice`);
  };

  return (
    <div
      data-testid="fab-practice-page"
      data-simulator-route-ready="true"
      data-play-surface="true"
      data-engine="local"
      data-fixture={fixtureId}
      data-prompt-kind={promptKind ?? undefined}
      data-decision-actor={currentDecision?.actorId ?? undefined}
      data-interaction-actor={interactionActorId ?? undefined}
      data-active-player={presentation.activePlayerId ?? undefined}
      data-phase={presentation.phase}
      data-turn-number={presentation.turnNumber}
      data-combat-step={
        presentation.combat?.open ? (presentation.combat.step ?? undefined) : undefined
      }
      data-priority-player={runtime.getPriorityPlayerId() ?? undefined}
      data-practice-player-deck={practiceConfig?.playerDeckId}
      data-practice-bot-deck={practiceConfig?.botDeckId}
      data-practice-seed={practiceConfig?.seed}
      data-controlled-player={controlledPlayerId}
      data-public-hand-reveals={Object.values(handRevealRecalls).reduce(
        (total, reveals) => total + (reveals?.length ?? 0),
        0,
      )}
      className="h-screen"
    >
      <span className="sr-only" data-testid="simulator-route-ready">
        Simulator ready
      </span>
      <FleshAndBloodTabletop
        sessionKey={sessionKey}
        state={presentation}
        animationVersion={engineVersion}
        animationTransition={animationTransition}
        onTransitionSettled={settleDeferredCommandWork}
        deckReveals={Object.fromEntries(
          Object.entries(deckRevealRecalls).map(([playerId, recall]) => [
            playerId,
            projectFabDeckReveal(recall),
          ]),
        )}
        handReveals={Object.fromEntries(
          Object.entries(handRevealRecalls).map(([playerId, recalls]) => [
            playerId,
            projectFabHandRevealCards(recalls),
          ]),
        )}
        viewerId={controlledPlayerId}
        historyHighlightedEntityIds={historyHighlightedEntityIds}
        pending={pending}
        conflict={botError}
        activity={matchActivity}
        activityOwnsStatus
        localPractice={{
          humanPlayerId: humanId,
          botPlayerId: botId,
          humanDeckLabel: resolvedHumanDeckLabel,
          botDeckLabel: resolvedBotDeckLabel,
          botStrategyLabel: strategyOption?.label,
        }}
        participantPresentation={{
          [humanId]: {
            displayName: "You",
            actions: (
              <SimulatorSelfParticipantActions
                matchMenuItems={(close) => (
                  <FabPriorityAutomationParticipantMenuItems onComplete={close} />
                )}
                gameConfiguration={{
                  label: "Game configuration",
                  settings: <FabPriorityAutomationSettingsPanel />,
                  title: "Change practice configuration?",
                  description:
                    "This ends the current practice session and returns to hero, deck, and bot configuration.",
                  confirmLabel: "Return to setup",
                  onSelect: startNewGame,
                }}
                support={{
                  source: "flesh-and-blood-practice-participant-menu",
                  gameSlug: "flesh-and-blood",
                  gameId: match.seed,
                  turn: presentation.turnNumber,
                }}
              />
            ),
          },
          [botId]: {
            displayName: "Practice bot",
            actions: (
              <SimulatorOpponentParticipantActions
                participant={{ kind: "bot", displayName: "Practice bot" }}
                takeoverActive={takeoverActive}
                onToggleTakeover={() => setControlledPlayerId(takeoverActive ? humanId : botId)}
              />
            ),
          },
        }}
        automation={automation}
        onPassPriority={passPriority}
        onConcede={concede}
        onOpenGameSummary={postGameSummary && !summaryOpen ? () => setSummaryOpen(true) : undefined}
        onUndo={undo}
        canUndo={undoCheckpoint !== null}
        onOpenMatchHistory={() => setActivityTab("combined")}
        onOpenLegalActions={() => {
          setActionFlow({ kind: "intents" });
          setActivityTab("log");
        }}
        onEndTurn={endTurn}
        canEndTurn={canEndTurn}
        legalCommands={humanLegal}
        onLegalCommand={(command) => {
          if (humanCanAct) dispatchCommand(controlledPlayerId, command);
        }}
        interactionView={interactionView}
        onSubmitInteraction={submitInteraction}
      />
      {postGameSummary && summaryOpen ? (
        <FabPostGameSummary
          summary={postGameSummary}
          onInspectBoard={() => setSummaryOpen(false)}
          onMainMenu={() => window.location.assign(`${FAB_SIMULATOR_BASE}/`)}
          onPlayAgain={startNewGame}
        />
      ) : null}
      {reversalNotice ? (
        <section
          className="fab-practice-reversal-notice"
          role="status"
          aria-live="polite"
          data-testid="fab-practice-reversal-notice"
        >
          <span>
            <strong>Action reversed</strong>
            <span>{reversalNotice} Nothing was spent.</span>
          </span>
          <button
            type="button"
            aria-label="Dismiss action reversed notice"
            onClick={() => setReversalNotice(null)}
          >
            Dismiss
          </button>
        </section>
      ) : null}
      {transitionNotice ? (
        <section
          className="fab-practice-reversal-notice"
          role="status"
          aria-live="polite"
          data-testid="fab-practice-transition-notice"
        >
          <span>
            <strong>Action not applied</strong>
            <span>{transitionNotice}</span>
          </span>
          <button
            type="button"
            aria-label="Dismiss action not applied notice"
            onClick={() => setTransitionNotice(null)}
          >
            Dismiss
          </button>
        </section>
      ) : null}
      {!result && (runtimeError || botError) ? (
        <section className="fab-practice-recovery" role="alert" data-testid="fab-practice-error">
          <strong>Practice match paused</strong>
          <p>{runtimeError ?? botError}</p>
          <div>
            <button
              type="button"
              data-testid="fab-practice-retry"
              onClick={() => {
                setRuntimeError(null);
                setBotError(null);
                refresh();
              }}
            >
              Retry
            </button>
            <button type="button" onClick={startNewGame}>
              New Game
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function testHarnessDisablesSimulatorMotion(): boolean {
  return Boolean(
    (globalThis as typeof globalThis & { __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean })
      .__TCG_TEST_DISABLE_SIMULATOR_MOTION__,
  );
}
