import { fabBoardTransfers } from "./transfers";
import { FabActionNotice } from "./FabActionNotice";
import settingsClasses from "../../simulator/participant-actions/SimulatorParticipantActions.module.css";
import { useFabCardArt, useFabPresentationRegistry } from "./FabPresentationCatalog";
import { fabInteractionControl } from "@tcg/flesh-and-blood-server-adapter";
import {
  AnimationInteractionBoundary,
  AnimationAnchor,
  AnimatedZoneSlot,
  CardContextMenuController,
  CardImage,
  createSimulatorAnimationScope,
  HandZone,
  InteractionResolutionPrompt,
  interactionCommitMode,
  optionalDecisionInteraction,
  resolveInteractionText,
  SimulatorViewportShell,
  useActiveLayout,
  useCardInteractionController,
  useAnimationNode,
  simulatorBoardCenterAnimationRef,
  type CardInteractionAction,
  type CardInteractionStateResolver,
  type SimulatorMatchAutomation,
  type SimulatorMatchActivity,
  type SimulatorEntityVisualProps,
  type SimulatorTransitionSettledEvent,
  type TargetFilterDuplicateFilter,
  type TargetFilterModalClassNames,
  TargetFilterModal,
} from "@tcg/simulator-ui";
import {
  buildInteractionSubmission,
  type AnimationPlanV2,
  type EngineInteractionView,
  type EntityPartitionInput,
  type InteractionSubmission,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import {
  BookOpenText,
  CornerDownLeft,
  Link2Off,
  Menu,
  RotateCcw,
  Shield,
  ShieldAlert,
  SkipForward,
  Smartphone,
  Space,
  Swords,
} from "lucide-react";
import { Kbd } from "@mantine/core";
import { SupporterPlayerName } from "../../components/SupporterPlayerName";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type {
  SimulatorCardAction,
  SimulatorDeckReveal,
  SimulatorDeckRevealCard,
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorMatchHistoryRow,
  SimulatorTable,
  SimulatorZone,
} from "@tcg/simulator-contract";
import type { FabLegalCommand } from "@tcg/flesh-and-blood-engine/simulator";
import {
  FAB_AUTOMATION_PREFERENCE_LABELS,
  FAB_PRIORITY_MODES,
  fabOpponentTriggerYieldActionIdentity,
  fabOptionalTriggerAutomationTargetMode,
} from "@tcg/flesh-and-blood-server-adapter";

import { useSimulatorAudio } from "../../simulator/audio";
import { useSimulatorSettings } from "../../simulator/settings/SimulatorSettingsProvider";
import {
  combatCardNumeric,
  projectCombatChainCard,
  projectCombatChainView,
} from "./combatChainView";
import { CombatChain, FabSidebarResolutionStack, ResolutionStack } from "./CombatChain";
import { CompactResolutionStack } from "./CompactResolutionStack";
import { FabMobileStackPopover } from "./FabMobileStackPopover";
import { FabMobileChoicePreview } from "./FabMobileChoicePreview";

import { useFabCardLocale } from "./FabPresentationCatalog";
import { useFabCardPresentation } from "./useFabCardPresentation";
import type { FabPresentationDefinition } from "./cardArt";
import {
  projectFabAttackTargetCardActions,
  projectFabCardActions,
  sourceCardIds,
} from "./cardInteractions";
import { FabBoardCardFace, FabBoardHighlightProvider } from "./FabBoardCardFace";
import {
  FabActiveEffectsInspector,
  FabActiveEffectsRail,
  type FabEffectSourceArt,
} from "./FabActiveEffects";
import { groupFabBoardEffects } from "./activeEffects";
import {
  FabCardPreviewProvider,
  FabCardPreviewSurface,
  useFabCardPreview,
  useFabPreviewTarget,
} from "./FabCardPreview";
import { FAB_CARD_CONTEXT_VISUAL_IDENTITY } from "./FabCardContextVisualIdentity";
import {
  FleshAndBloodMobilePanel,
  FleshAndBloodSidebar,
  type FleshAndBloodSidebarProps,
} from "./FleshAndBloodSidebar";
import { FabOfficialIcon } from "./FabIconography";
import { FabValueDeltaVisual } from "./FabValueDeltaVisual";
import { FabMobileBoard, type FabInspectableZone } from "./FabMobileBoard";
import { FabPitchStackOrderingPanel } from "./FabPitchStackOrderingPanel";
import { FabPrioritySignal } from "./FabPrioritySignal";
import { FabSymbolText } from "./FabSymbolText";
import { FabTriggerOrderingPanel } from "./FabTriggerOrderingPanel";
import { FabCardArtLadderImage } from "./useFabCardArtFallback";
import { FabInstantYieldAutomationProvider } from "./FabInstantYieldAutomation";
import type { FabOpponentTriggerYieldAction } from "./FabOpponentTriggerYield";
import {
  FabOptionalTriggerAutomationProvider,
  type FabOptionalTriggerAutomationMode,
} from "./FabOptionalTriggerAutomation";
import {
  FabBoardContextMenu,
  FabPriorityAutomationControl,
  FabPriorityAutomationParticipantMenu,
  FabPriorityAutomationQuickControl,
  FabPriorityAutomationSettings,
  type FabSavedOpponentTriggerYield,
  type FabScopeContext,
} from "./FabPriorityAutomation";
import {
  fabArmHoldAction,
  fabArmScopedAutoPassAction,
  fabDisarmScopedAutoPassAction,
  fabSetAutoOrderTriggersAction,
  fabSetAutoSelectSingletonTargetsAction,
  fabPassInteractionAction,
  fabPriorityModeAction,
  FabScopedAutoPassTargets,
  holdsPassOnlyWindows,
  isFabPassOnlyInteractionView,
  type FabScopedAutoPassTarget,
} from "./priority-automation";
import { useFabAutomationSettings } from "./fab-automation-settings";
import { FAB_COUNTDOWN_SPEED_MS } from "@tcg/game-page-contract";
import { useFabPriorityCountdown } from "./use-priority-countdown";
import { PlayerBoard } from "./PlayerBoard";
import {
  type FabCardDefinition,
  type FabPresentationAction,
  type FabPresentationCard,
  type FabPresentationState,
  type FabPresentationZone,
  type FabPriorityAutomationMode,
} from "./state";
import { deriveFabCombatPriorityPresentation } from "./priority-presentation";
import { deriveFabPriorityPrompt } from "./priority-prompt";
import {
  entityFor,
  entityForFabPresentationCard,
  entityForFabViewer,
  hiddenCardPresentationForFabLayout,
  metadataForFabPresentationCard,
  type FabCardMetadata,
} from "./projection";
import "./flesh-and-blood.css";
import "./flesh-and-blood-board-layout.css";

function testHarnessDisablesMotion(): boolean {
  return Boolean(
    (globalThis as typeof globalThis & { __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean })
      .__TCG_TEST_DISABLE_SIMULATOR_MOTION__,
  );
}

function defenseSelectionKey(instanceIds: readonly string[]): string {
  return [...new Set(instanceIds)].sort().join("|");
}

function isNonAttackActionCard(definition: FabCardDefinition | undefined): boolean {
  if (!definition) return false;
  const typeLine = `${definition.cardType} ${definition.typeLine ?? ""}`;
  return /\baction\b/iu.test(typeLine) && !/\battack\b/iu.test(typeLine);
}

const FAB_MOBILE_BREAKPOINT = 767;
const FAB_PHONE_LANDSCAPE_QUERY =
  "(orientation: landscape) and (max-width: 920px) and (max-height: 520px)";

interface FabPriorityAutomationSettingsValue {
  readonly mode: FabPriorityAutomationMode | null | undefined;
  readonly holdArmed: boolean | null | undefined;
  readonly holdsPriority: boolean;
  readonly autoOrderTriggers: boolean;
  readonly autoSelectSingletonTargets: boolean;
  readonly disabledReason?: string;
  readonly scopedAutoPass: FabScopedAutoPassTarget | null;
  readonly scopeContext: FabScopeContext;
  readonly onSelectMode?: (mode: FabPriorityAutomationMode) => void;
  readonly onArmHold?: () => void;
  readonly onSetAutoOrderTriggers?: (enabled: boolean) => void;
  readonly onSetAutoSelectSingletonTargets?: (enabled: boolean) => void;
  readonly onArmScope?: (scope: FabScopedAutoPassTarget) => void;
  readonly onDisarmScope?: () => void;
  readonly savedOpponentTriggerYields: readonly FabSavedOpponentTriggerYield[];
  readonly onRemoveOpponentTriggerYield: (canonicalId: string) => void;
}

const FabPriorityAutomationSettingsContext =
  createContext<FabPriorityAutomationSettingsValue | null>(null);

// SETTINGS PARITY: keep in sync with the platform web app's GameSettingsFields.svelte (FAB branch).
export function FabPriorityAutomationSettingsPanel() {
  const value = useContext(FabPriorityAutomationSettingsContext);
  const saved = useFabAutomationSettings();
  const { nameForFabCardIdentity } = useFabCardArt();
  const lists = [
    {
      label: "Always decline optional triggers",
      ids: saved.declinedCanonicalIds,
      remove: (id: string) => saved.setCardOptionalMode(id, "ask"),
    },
    {
      label: "Always use optional triggers",
      ids: saved.acceptedCanonicalIds,
      remove: (id: string) => saved.setCardOptionalMode(id, "ask"),
    },
    {
      label: "Keep follow-up windows for these cards",
      ids: saved.playAndSkipHoldCardIds,
      remove: (id: string) => saved.setPlayAndSkipHoldCard(id, false),
    },
  ];
  return (
    <>
      {value ? <FabPriorityAutomationSettings {...value} /> : null}
      <label className={settingsClasses.field}>
        <span>Priority countdown speed</span>
        <select
          aria-label="Priority countdown speed"
          value={saved.countdownSpeed}
          onChange={(event) => {
            const speed = event.currentTarget.value;
            if (speed === "fast" || speed === "normal" || speed === "slow")
              saved.setCountdownSpeed(speed);
          }}
        >
          <option value="fast">Fast (3s)</option>
          <option value="normal">Normal (7s)</option>
          <option value="slow">Slow (12s)</option>
        </select>
      </label>
      {lists.map((list) => (
        <section className={settingsClasses.field} key={list.label}>
          <h3>{list.label}</h3>
          {list.ids.size === 0 ? (
            <p>No saved cards.</p>
          ) : (
            [...list.ids].map((id) => (
              <div className={settingsClasses.settingsAction} key={id}>
                <span>{nameForFabCardIdentity(id, undefined) ?? id}</span>{" "}
                <button
                  type="button"
                  aria-label={`Remove ${nameForFabCardIdentity(id, undefined) ?? id}`}
                  onClick={() => list.remove(id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </section>
      ))}
    </>
  );
}

export function FabPriorityAutomationParticipantMenuItems({
  onComplete,
}: {
  readonly onComplete?: () => void;
}) {
  const value = useContext(FabPriorityAutomationSettingsContext);
  return value ? <FabPriorityAutomationParticipantMenu {...value} onComplete={onComplete} /> : null;
}
// The holding-modes pass-only window countdown duration follows the'
// account-level speed setting (fast 3s / normal 7s / slow 12s); normal is'
// the default.
const FAB_PRIORITY_COUNTDOWN_FALLBACK_MS = 7000;

// Optional single-card prompts (for example the end-of-turn Arsenal load)
// resolve with one click on the card; declining stays on "Choose none".
const FAB_INTERACTION_COMMIT_POLICY = { immediateOptionalSingletons: true } as const;

const FAB_ZONE_MODAL_CLASS_NAMES = {
  backdrop: "fab-zone-inspector-backdrop",
  sheet: "fab-zone-inspector-sheet",
  header: "fab-zone-inspector-header",
  subtitle: "fab-zone-inspector-count",
  body: "fab-zone-inspector-body",
  footer: "fab-zone-inspector-footer",
  closeButton: "fab-zone-inspector-close",
  duplicateToggle: "fab-zone-inspector-group-toggle",
} satisfies TargetFilterModalClassNames;

const FAB_DECK_SEARCH_DUPLICATE_FILTER = {
  label: "Hide duplicates",
  keyFor: (entity) => {
    const canonicalId = entity.dataAttributes?.["data-fab-canonical-id"];
    return typeof canonicalId === "string" ? canonicalId : undefined;
  },
} satisfies TargetFilterDuplicateFilter;

function FabPortraitOrientationOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(FAB_PHONE_LANDSCAPE_QUERY);
    const updateVisibility = () => setVisible(query.matches);
    updateVisibility();
    query.addEventListener("change", updateVisibility);
    return () => query.removeEventListener("change", updateVisibility);
  }, []);

  if (!visible || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fab-portrait-orientation-overlay"
      data-testid="fab-portrait-orientation-overlay"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="fab-portrait-orientation-title"
      aria-describedby="fab-portrait-orientation-description"
    >
      <div className="fab-portrait-orientation-card">
        <div className="fab-portrait-orientation-icon" aria-hidden="true">
          <Smartphone size={44} strokeWidth={1.45} />
          <RotateCcw size={24} strokeWidth={1.8} />
        </div>
        <h2 id="fab-portrait-orientation-title">Rotate to portrait</h2>
        <p id="fab-portrait-orientation-description">
          Flesh and Blood is designed for portrait play on phones. Turn your device upright to
          continue the match.
        </p>
      </div>
    </div>,
    document.body,
  );
}

function FabCardNameReference({ entity }: { readonly entity: SimulatorEntity }) {
  const previewTarget = useFabPreviewTarget(entity, { pinOnClick: true });

  return (
    <button type="button" className="fab-card-name-reference" {...previewTarget.previewProps}>
      <FabCardNameLabel entity={entity} />
    </button>
  );
}

function FabCardNameLabel({ entity }: { readonly entity: SimulatorEntity }) {
  const pitchValue = entity.stats.find((stat) => stat.label === "Pitch")?.value ?? "none";
  return (
    <span className="fab-card-name-reference-label" data-fab-pitch={pitchValue}>
      {entity.title}
    </span>
  );
}

function effectInstructionWithoutSource(instruction: string, sourceTitle: string): string {
  const index = instruction.indexOf(sourceTitle);
  if (index === -1) return instruction;
  const before = instruction
    .slice(0, index)
    .trim()
    .replace(/\b(?:by|for|from|of|on|with)\s*$/i, "")
    .trim();
  const after = instruction.slice(index + sourceTitle.length).trim();
  const separator = before && after && !/^[,.;:!?)]/.test(after) ? " " : "";
  return `${before}${separator}${after}`.trim();
}

/** Keeps the source card as the first-line identity and inspection affordance. */
function FabEffectTitleReference({ entity }: { readonly entity: SimulatorEntity }) {
  return (
    <span className="fab-effect-title-with-source">
      <FabCardNameReference entity={entity} />
    </span>
  );
}

export type FabMobileRailActionModel =
  | { readonly kind: "status"; readonly label: string; readonly tone: "waiting" | "resolving" }
  | { readonly kind: "history"; readonly label: string }
  | { readonly kind: "choice"; readonly label: string }
  | {
      readonly kind: "actions";
      readonly label: string;
      readonly showPass: boolean;
      readonly showEndTurn: boolean;
    }
  | { readonly kind: "end-turn"; readonly showPass: boolean }
  | { readonly kind: "pass"; readonly label: string };

export function deriveFabMobileRailAction({
  sidebarOpen,
  readOnly,
  terminal,
  controlsDisabled,
  hasOwnedDecision,
  hasDirectOwnedDecision = false,
  hasPriority,
  hasTurn,
  legalCommands,
  hasCardActions,
  canOpenActions,
  canPass,
  canEndTurn,
  hasMatchHistory,
  combatResolution = false,
}: {
  readonly sidebarOpen: boolean;
  readonly readOnly: boolean;
  readonly terminal: boolean;
  readonly controlsDisabled: boolean;
  readonly hasOwnedDecision: boolean;
  readonly hasDirectOwnedDecision?: boolean;
  readonly hasPriority: boolean;
  readonly hasTurn: boolean;
  readonly legalCommands: readonly FabLegalCommand[];
  readonly hasCardActions: boolean;
  readonly canOpenActions: boolean;
  readonly canPass: boolean;
  readonly canEndTurn: boolean;
  readonly hasMatchHistory: boolean;
  /** Resolution actions stay board-native: legal attacks are tapped in place. */
  readonly combatResolution?: boolean;
}): FabMobileRailActionModel {
  if (sidebarOpen) return { kind: "status", label: "Match menu open", tone: "waiting" };
  if (terminal)
    return { kind: "history", label: hasMatchHistory ? "Match history" : "Match details" };
  if (readOnly) return { kind: "history", label: "Fixture details" };
  if (controlsDisabled) return { kind: "status", label: "Resolving", tone: "resolving" };
  if (hasDirectOwnedDecision)
    return { kind: "status", label: "Choose an outcome above", tone: "waiting" };
  if (hasOwnedDecision) return { kind: "choice", label: "Resolve choice" };

  const legalMoves = new Set(legalCommands.map((command) => command.move));
  if (!hasPriority) {
    return hasTurn && canEndTurn
      ? { kind: "end-turn", showPass: false }
      : { kind: "status", label: "Waiting", tone: "waiting" };
  }

  if (combatResolution) {
    return canPass
      ? { kind: "pass", label: "Close combat chain" }
      : { kind: "status", label: "Waiting", tone: "waiting" };
  }

  const hasDefend = legalMoves.has("defend");
  const hasPlay = legalMoves.has("begin-play");
  const hasActivation = legalMoves.has("activate");
  if (hasDefend) return { kind: "pass", label: "Declare defense" };
  if (canOpenActions && (hasCardActions || hasPlay || hasActivation)) {
    const label = hasDefend
      ? "Defend"
      : hasPlay && hasActivation
        ? "Play / activate"
        : hasActivation
          ? "Activate"
          : "Play a card";
    return { kind: "actions", label, showPass: canPass, showEndTurn: canEndTurn };
  }
  if (canEndTurn) return { kind: "end-turn", showPass: canPass };
  if (canPass) return { kind: "pass", label: "Pass priority" };
  return { kind: "status", label: "Waiting", tone: "waiting" };
}

function FabMobileRailActions({
  model,
  passLabel = "Pass",
  onOpenHistory,
  onOpenActions,
  onPassPriority,
  onEndTurn,
}: {
  readonly model: FabMobileRailActionModel;
  readonly passLabel?: string;
  readonly onOpenHistory: () => void;
  readonly onOpenActions: () => void;
  readonly onPassPriority: () => void;
  readonly onEndTurn: () => void;
}) {
  const passButton = (
    <button
      type="button"
      className="fab-mobile-context-pass"
      data-testid="fab-chain-pass-priority"
      data-mobile-action="pass"
      onClick={onPassPriority}
      aria-label={passLabel === "Close chain" ? "Close combat chain" : passLabel}
    >
      <CornerDownLeft aria-hidden="true" size={15} strokeWidth={1.8} />
      {passLabel}
    </button>
  );

  switch (model.kind) {
    case "status":
      return (
        <div className="fab-mobile-context-status" data-tone={model.tone} role="status">
          {model.label}
        </div>
      );
    case "history":
      return (
        <button
          type="button"
          className="fab-mobile-context-primary"
          data-action="history"
          onClick={onOpenHistory}
        >
          <BookOpenText aria-hidden="true" size={17} strokeWidth={1.8} />
          {model.label}
        </button>
      );
    case "choice":
      return (
        <button
          type="button"
          className="fab-mobile-context-primary"
          data-action="choice"
          data-testid="fab-mobile-resolve-choice"
          onClick={onOpenActions}
        >
          Resolve choice
        </button>
      );
    case "actions":
      return (
        <div
          className="fab-mobile-context-actions"
          data-has-end-turn={model.showEndTurn ? "true" : undefined}
          data-testid="fab-mobile-context-actions"
        >
          {model.showPass ? passButton : null}
          <button
            type="button"
            className="fab-mobile-context-primary"
            data-action="actions"
            data-testid="fab-chain-play-activate"
            onClick={onOpenActions}
          >
            <Swords aria-hidden="true" size={16} strokeWidth={1.8} />
            {model.label}
          </button>
          {model.showEndTurn ? (
            <button
              type="button"
              className="fab-mobile-context-primary"
              data-action="end-turn"
              data-testid="fab-mobile-end-turn"
              onClick={onEndTurn}
            >
              <SkipForward aria-hidden="true" size={16} strokeWidth={1.8} />
              End turn
            </button>
          ) : null}
        </div>
      );
    case "end-turn":
      return (
        <div className="fab-mobile-context-actions" data-testid="fab-mobile-context-actions">
          {model.showPass ? passButton : null}
          <button
            type="button"
            className="fab-mobile-context-primary"
            data-action="end-turn"
            data-testid="fab-mobile-end-turn"
            onClick={onEndTurn}
          >
            <Swords aria-hidden="true" size={16} strokeWidth={1.8} />
            End turn
          </button>
        </div>
      );
    case "pass":
      return <div className="fab-mobile-context-actions">{passButton}</div>;
  }
}

export function MobileAssetPills({
  playerId,
  resourcePoints,
  chiPoints,
  actionPoints,
  owner,
}: {
  playerId: string;
  resourcePoints: number;
  chiPoints: number;
  actionPoints: number;
  owner: "Opponent" | "Your";
}) {
  const resourceRef = useAnimationNode(
    { kind: "anchor", id: `fab:${playerId}:resource` },
    { presence: "present" },
  );
  const chiRef = useAnimationNode(
    { kind: "anchor", id: `fab:${playerId}:chi` },
    { presence: "present" },
  );
  const actionRef = useAnimationNode(
    { kind: "anchor", id: `fab:${playerId}:action` },
    { presence: "present" },
  );
  if (resourcePoints <= 0 && chiPoints <= 0 && actionPoints <= 0) return null;

  return (
    <div className="fab-mobile-asset-pills" role="group" aria-label={`${owner} assets`}>
      {resourcePoints > 0 ? (
        <span
          ref={resourceRef}
          className="fab-mobile-asset-pill"
          data-asset="resources"
          aria-label={`${resourcePoints} resources`}
        >
          <FabOfficialIcon id="resource" size={13} />
          <strong>{resourcePoints}</strong>
        </span>
      ) : null}
      {chiPoints > 0 ? (
        <span
          ref={chiRef}
          className="fab-mobile-asset-pill"
          data-asset="chi"
          aria-label={`${chiPoints} chi`}
        >
          <FabOfficialIcon id="chi" size={13} />
          <strong>{chiPoints}</strong>
        </span>
      ) : null}
      {actionPoints > 0 ? (
        <span
          ref={actionRef}
          className="fab-mobile-asset-pill"
          data-asset="action-points"
          aria-label={`${actionPoints} action points`}
        >
          <Swords aria-hidden="true" size={12} strokeWidth={1.8} />
          <strong>{actionPoints}</strong>
        </span>
      ) : null}
    </div>
  );
}

function FabTabletopCardFace({
  entity,
  density,
  className,
  presentation,
}: SimulatorEntityVisualProps) {
  const transfer = presentation === "transfer";
  const preview = presentation === undefined || presentation === "default";
  return (
    <div
      className={className}
      data-fab-card-surface="tabletop"
      data-fab-card-presentation={presentation ?? "default"}
    >
      <FabBoardCardFace
        entity={entity}
        density={density}
        frameBadges={transfer ? "hide" : "show"}
        preview={preview}
      />
    </div>
  );
}

export interface FleshAndBloodTabletopProps {
  sessionKey?: string;
  state: FabPresentationState;
  /** Authoritative version associated with `state`, when the engine owns sequencing. */
  animationVersion?: number;
  /** Authoritative engine transition paired with this presentation snapshot. */
  animationTransition?: FabAnimationTransition | null;
  viewerId: string;
  readOnly?: boolean;
  /** Read-only live spectators are not replays. */
  readOnlyLabel?: string;
  pending?: boolean;
  conflict?: string | null;
  cardMetadata?: Map<string, FabCardMetadata>;
  sidebarExtra?: ReactNode;
  replayControls?: ReactNode;
  matchActions?: ReactNode;
  /** Trusted return destination used in place of gameplay controls for spectators. */
  spectatorReturnHref?: string;
  matchNotice?: ReactNode;
  /** Optional fully composed activity tabs for local/dev match surfaces. */
  activity?: SimulatorMatchActivity;
  /** Optional label for the page-owned primary activity surface. */
  activityLogLabel?: string;
  /** The page-owned activity renders its own current-state hierarchy. */
  activityOwnsStatus?: boolean;
  /** Shared event-log feed rendered by the default activity log tab. */
  eventLog?: readonly SimulatorEventLogEntry[];
  /** Flat player-facing match history; eventLog is retained for DEV diagnostics. */
  matchHistory?: readonly SimulatorMatchHistoryRow[];
  /** History-owned, viewer-safe entity identities highlighted on the current board. */
  historyHighlightedEntityIds?: readonly string[];
  /** Factual identities and session metadata for local practice seats. */
  localPractice?: FabLocalPracticeParticipants;
  /** Page-owned identity and action affordances keyed by engine player id. */
  participantPresentation?: Readonly<Record<string, FabParticipantPresentation>>;
  /** Local-only bot playback and seat-takeover surface. */
  automation?: SimulatorMatchAutomation;
  onAction?: (action: FabPresentationAction) => void;
  /** Force portrait mobile composition (tests / story fixtures). */
  forceMobileLayout?: boolean;
  /** Retract active chain for public board targeting. */
  publicTargeting?: boolean;
  /** Engine-owned action that passes priority when the viewer has it. */
  onPassPriority?: () => void;
  /** Local-practice checkpoint reversal; unavailable for live matches. */
  onUndo?: () => void;
  canUndo?: boolean;
  /** Engine-owned concession, kept with universal match controls. */
  onConcede?: () => void;
  /** Disable the dock-owned guard when the page already owns confirmation. */
  confirmConcede?: boolean;
  /** Replaces terminal match controls with one action that reopens the summary. */
  onOpenGameSummary?: () => void;
  /** Opens the game-owned legal-action flow from the mobile priority rail. */
  onOpenLegalActions?: () => void;
  /** Opens the primary match-history surface from the mobile opponent rail. */
  onOpenMatchHistory?: () => void;
  /**
   * Engine-owned end-turn when practice/local matches own the runtime.
   * Mobile rail prefers this over presentation-only `end_turn` actions.
   */
  onEndTurn?: () => void;
  /**
   * When set with `onEndTurn`, disables the mobile End turn control unless the
   * engine currently exposes a legal end-turn command (avoids silent no-ops).
   */
  canEndTurn?: boolean;
  /** Current viewer-scoped engine-validated command candidates. */
  legalCommands?: readonly FabLegalCommand[];
  /** Dispatches the exact engine command chosen by the shared card controller. */
  onLegalCommand?: (command: FabLegalCommand) => void;
  /** Pre-normalized viewer-scoped actions, used by server-authoritative live matches. */
  cardActions?: readonly CardInteractionAction[];
  onCardAction?: (actionId: string) => void;
  /** Shared typed interaction prompt for staged payment and private ordering. */
  interactionView?: EngineInteractionView | null;
  onSubmitInteraction?: (submission: InteractionSubmission) => void;
  /** UI-only public deck-edge recall, derived from public reveal events. */
  deckReveals?: Readonly<Record<string, SimulatorDeckReveal | undefined>>;
  /** UI-only public hand recall, derived from public reveal events. */
  handReveals?: Readonly<Record<string, readonly SimulatorDeckRevealCard[] | undefined>>;
  /** Motion-owned lifecycle used by practice mode to schedule non-visual work. */
  onTransitionSettled?: (event: SimulatorTransitionSettledEvent) => void;
}

export interface FabAnimationTransition {
  readonly version: number;
  readonly correlationId: string;
  readonly plan: AnimationPlanV2 | null;
  readonly mode: "enqueue" | "sync";
}

export interface FabLocalPracticeParticipants {
  readonly mode?: "bot" | "self";
  readonly humanPlayerId: string;
  readonly botPlayerId: string;
  readonly humanDeckLabel?: string;
  readonly botDeckLabel?: string;
  readonly botStrategyLabel?: string;
}

export interface FabParticipantPresentation {
  readonly clock?: ReactNode;
  readonly displayName?: string;
  readonly subscriptionTier?: string;
  readonly rankedMmr?: number;
  readonly connection?: ReactNode;
  readonly actions?: ReactNode;
}

type FabQuickPrimaryActionKind = "pass" | "declare-defense" | "confirm-no-defense" | "close-chain";

function FabQuickPrimaryActionIcon({ kind }: { readonly kind: FabQuickPrimaryActionKind }) {
  switch (kind) {
    case "pass":
      return <CornerDownLeft aria-hidden="true" size={14} />;
    case "declare-defense":
      return <Shield aria-hidden="true" size={15} />;
    case "confirm-no-defense":
      return <ShieldAlert aria-hidden="true" size={15} />;
    case "close-chain":
      return <Link2Off aria-hidden="true" size={15} />;
    default: {
      const unhandledKind: never = kind;
      return unhandledKind;
    }
  }
}

function FabDesktopQuickControls({
  onPassPriority,
  canPassPriority = false,
  passLabel = "Pass",
  showPass = true,
  onUndo,
  canUndo = false,
  disabled,
  priorityToggle,
  priorityCountdownActive = false,
  // The utility slot hosts the priority control whenever the viewer holds
  // priority (mode radios + one-shot arm), not only while a countdown runs —
  // in-match mode changes must stay reachable on every own window. Defaults
  // to the countdown-only visibility for callers that do not pass it.
  priorityControlVisible = priorityCountdownActive,
  primaryActionKind = "pass",
}: {
  readonly onPassPriority?: () => void;
  readonly canPassPriority?: boolean;
  readonly passLabel?: string;
  readonly showPass?: boolean;
  readonly onUndo?: () => void;
  readonly canUndo?: boolean;
  readonly disabled: boolean;
  readonly priorityToggle?: ReactNode;
  readonly priorityCountdownActive?: boolean;
  readonly priorityControlVisible?: boolean;
  readonly primaryActionKind?: FabQuickPrimaryActionKind;
}) {
  const primaryActionLabel =
    primaryActionKind === "declare-defense"
      ? "Declare defense"
      : primaryActionKind === "confirm-no-defense"
        ? "Are you sure?"
        : primaryActionKind === "close-chain"
          ? "Close combat chain"
          : passLabel;
  const undoDisabled = priorityCountdownActive || disabled || !onUndo || !canUndo;
  const undoDisabledReason = priorityCountdownActive
    ? "Undo is unavailable while automatic priority pass is counting down."
    : disabled
      ? "Undo is temporarily unavailable."
      : !onUndo
        ? "Undo is available only in practice matches."
        : !canUndo
          ? "There is no action available to undo."
          : undefined;
  const passDisabled = disabled || !onPassPriority || !canPassPriority;
  const passDisabledReason = disabled
    ? `${primaryActionLabel} is temporarily unavailable.`
    : !onPassPriority
      ? `${primaryActionLabel} is unavailable in this match.`
      : !canPassPriority
        ? passLabel === "Pass"
          ? "Pass is unavailable because you do not have priority."
          : `${primaryActionLabel} is unavailable until the current selection is legal.`
        : undefined;

  return (
    <section
      className="fab-desktop-quick-controls"
      aria-label="Quick controls"
      data-countdown-active={priorityCountdownActive ? "true" : undefined}
    >
      <div className="fab-quick-slot fab-quick-slot-utility" data-quick-slot="utility">
        {priorityControlVisible && priorityToggle ? (
          priorityToggle
        ) : (
          <button
            type="button"
            disabled={undoDisabled}
            onClick={onUndo}
            title={undoDisabledReason}
            aria-label={undoDisabledReason ? `Undo unavailable. ${undoDisabledReason}` : "Undo"}
            data-testid="fab-quick-undo"
          >
            <RotateCcw aria-hidden="true" size={15} /> Undo
          </button>
        )}
      </div>
      <div className="fab-quick-slot fab-quick-slot-primary" data-quick-slot="primary">
        {showPass ? (
          <button
            type="button"
            className="fab-quick-pass fab-quick-step-action"
            disabled={passDisabled}
            onClick={onPassPriority}
            title={passDisabledReason}
            aria-label={
              passDisabledReason
                ? `${primaryActionLabel} unavailable. ${passDisabledReason}`
                : primaryActionLabel
            }
            data-testid="fab-quick-pass"
            data-primary-action-kind={primaryActionKind}
          >
            <FabQuickPrimaryActionIcon kind={primaryActionKind} />
            <span>{passLabel}</span>
            {passLabel === "Pass" ? (
              <Kbd aria-label="Space bar">
                <Space size={14} aria-hidden="true" />
              </Kbd>
            ) : null}
          </button>
        ) : null}
      </div>
    </section>
  );
}

interface FabZoneInspectionSelection {
  ownerId: string;
  zone: FabInspectableZone;
}

const FAB_INSPECTABLE_ZONE_META: Record<
  FabInspectableZone,
  { label: string; role: SimulatorZone["role"] }
> = {
  pitch: { label: "Pitch", role: "resource" },
  graveyard: { label: "Graveyard", role: "discard" },
  banished: { label: "Banished", role: "discard" },
  arsenal: { label: "Arsenal", role: "custom" },
  head: { label: "Head", role: "support" },
  chest: { label: "Chest", role: "support" },
  arms: { label: "Arms", role: "support" },
  legs: { label: "Legs", role: "support" },
};

const FAB_FOCUSED_CHOICE_ZONE_META = {
  deck: { label: "Deck", role: "deck" },
  pitch: FAB_INSPECTABLE_ZONE_META.pitch,
  graveyard: FAB_INSPECTABLE_ZONE_META.graveyard,
  banished: FAB_INSPECTABLE_ZONE_META.banished,
  arsenal: FAB_INSPECTABLE_ZONE_META.arsenal,
} as const satisfies Record<string, { label: string; role: SimulatorZone["role"] }>;

type FabFocusedChoiceZone = keyof typeof FAB_FOCUSED_CHOICE_ZONE_META;

function isFabFocusedChoiceZone(value: string | undefined): value is FabFocusedChoiceZone {
  return value !== undefined && value in FAB_FOCUSED_CHOICE_ZONE_META;
}

/** Viewer-owned cards in a pile zone that currently have an enabled action. */
function viewerAvailablePileEntityIds(
  actions: readonly CardInteractionAction[],
  cards: Readonly<Record<string, FabPresentationCard>>,
  viewerId: string,
  zone: "graveyard" | "banished",
): ReadonlySet<string> {
  return new Set(
    actions.flatMap((action) =>
      action.disabledReason
        ? []
        : action.sourceEntityIds.filter((entityId) => {
            const card = cards[entityId];
            return card?.ownerId === viewerId && card.zone === zone;
          }),
    ),
  );
}

function FabZoneInspector({
  selection,
  state,
  viewerId,
  cardMetadata,
  availableBanishedEntityIds,
  availableGraveyardEntityIds,
  interactionStateFor,
  onCardSelect,
  onClose,
}: {
  selection: FabZoneInspectionSelection | null;
  state: FabPresentationState;
  viewerId: string;
  cardMetadata: Map<string, FabCardMetadata>;
  availableBanishedEntityIds: ReadonlySet<string>;
  availableGraveyardEntityIds: ReadonlySet<string>;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
  onClose: () => void;
}) {
  const { pin: showCardPreview, hide: hideCardPreview } = useFabCardPreview();
  const previousZoneCountRef = useRef<{ zoneId: string; count: number }>({
    zoneId: "fab:closed",
    count: 0,
  });
  const meta = selection ? FAB_INSPECTABLE_ZONE_META[selection.zone] : null;
  const zoneId = selection ? `${selection.ownerId}:${selection.zone}` : "fab:closed";
  const title = selection
    ? `${selection.ownerId === viewerId ? "Your" : "Opponent"} ${meta?.label ?? "Zone"}`
    : "Zone";
  const cards = selection
    ? Object.values(state.cards).filter(
        (card) => card.ownerId === selection.ownerId && card.zone === selection.zone,
      )
    : [];
  const availablePileEntityIds =
    selection?.zone === "banished"
      ? availableBanishedEntityIds
      : selection?.zone === "graveyard"
        ? availableGraveyardEntityIds
        : undefined;
  const entities: SimulatorEntity[] = cards
    .map((card) => {
      const metadata = cardMetadata.get(card.id);
      const definition = state.cardDefinitions[card.cardId];
      const pitch = metadata?.pitchValue ?? definition?.pitchValue;
      const publicGroupKey =
        card.face === "up"
          ? `${definition?.slug ?? metadata?.canonicalId ?? card.cardId}:${pitch ?? "none"}`
          : undefined;
      const entity = entityForFabViewer(card, metadata, viewerId, {
        frame: "tactical",
      });
      return {
        ...entity,
        dataAttributes: {
          ...entity.dataAttributes,
          "data-zone-id": zoneId,
          ...(publicGroupKey ? { "data-fab-zone-group-key": publicGroupKey } : {}),
        },
      };
    })
    .sort(
      (left, right) =>
        Number(availablePileEntityIds?.has(right.id) ?? false) -
        Number(availablePileEntityIds?.has(left.id) ?? false),
    );
  const availableCount =
    selection && availablePileEntityIds && selection.ownerId === viewerId
      ? entities.filter((entity) => availablePileEntityIds.has(entity.id)).length
      : 0;
  useEffect(() => {
    const previous = previousZoneCountRef.current;
    previousZoneCountRef.current = { zoneId, count: cards.length };
    if (selection && previous.zoneId === zoneId && previous.count > 0 && cards.length === 0) {
      hideCardPreview();
      onClose();
    }
  }, [cards.length, hideCardPreview, onClose, selection, zoneId]);
  const table: SimulatorTable = {
    status: {
      activeSeatId: state.activePlayerId ?? state.players[0] ?? "player",
      phase: state.combat?.step ?? "action",
      turn: state.turnNumber,
      stateVersion: 0,
    },
    seats: [],
    zones: selection
      ? [
          {
            id: zoneId,
            label: meta!.label,
            role: meta!.role,
            ownerId: selection.ownerId,
            visibility: selection.zone === "arsenal" ? "owner" : "public",
            entityIds: cards.map((card) => card.id),
            count: cards.length,
            hint: selection.zone,
            layoutHint: "grid",
          },
        ]
      : [],
  };

  return (
    <TargetFilterModal
      opened={selection !== null}
      presentation="nonmodal"
      title={title}
      description={
        availableCount > 0
          ? `${availableCount} ${availableCount === 1 ? "card is" : "cards are"} available now. Choose a highlighted card to act.`
          : undefined
      }
      filter={{
        kind: "entity",
        ownerId: selection?.ownerId,
        zoneId,
        // Private objects in public zones remain visible game objects. Keep
        // their identity-safe card backs in the inspector; only an opponent's
        // private arsenal stays omitted from this public-zone treatment.
        includeHidden: selection?.zone !== "arsenal",
      }}
      table={table}
      entities={entities}
      interactionStateFor={interactionStateFor}
      onSelect={(entity) => {
        if (interactionStateFor?.(entity).kind !== "idle" && onCardSelect) {
          onCardSelect(entity);
          return;
        }
        showCardPreview(entity);
      }}
      onClose={() => {
        hideCardPreview();
        onClose();
      }}
      cardInspection={{
        kind: "external",
        onInspect: (entity) => showCardPreview(entity),
      }}
      duplicateFilter={{
        label: "Group same cards",
        keyFor: (entity) => {
          const key = entity.dataAttributes?.["data-fab-zone-group-key"];
          return typeof key === "string" ? key : undefined;
        },
      }}
      emptyLabel={
        selection?.zone === "arsenal" && selection.ownerId !== viewerId
          ? "No revealed cards in Arsenal"
          : "No cards in this zone"
      }
      classNames={FAB_ZONE_MODAL_CLASS_NAMES}
    />
  );
}

const FabAnimation = createSimulatorAnimationScope<FabPresentationState>();

function buildPlayerState(
  state: FabPresentationState,
  playerId: string,
): {
  playerId: string;
  heroCardId: string | null;
  life: number;
  resourcePoints: number;
  chiPoints: number;
  actionPoints: number;
  soulCount: number;
  attackActivationsByInstanceId: NonNullable<FabPresentationState["attackActivationsByInstanceId"]>;
  heroSignals: FabPresentationState["heroSignals"][string];
  zones: Record<string, string[]>;
  faceDownIds: readonly string[];
  cardsById: Readonly<Record<string, FabPresentationCard>>;
} {
  const zones: Record<string, string[]> = {};
  const zoneKinds: FabPresentationZone[] = [
    "deck",
    "hand",
    "graveyard",
    "banished",
    "arsenal",
    "pitch",
    "hero",
    "head",
    "chest",
    "arms",
    "legs",
    "weapon",
    "permanent",
  ];
  for (const kind of zoneKinds) {
    zones[kind] = Object.values(state.cards)
      .filter((c) => c.ownerId === playerId && c.zone === kind)
      .map((c) => c.id);
  }
  const heroCardId = zones.hero?.[0] ?? null;
  return {
    playerId,
    heroCardId,
    life: state.life[playerId] ?? 20,
    resourcePoints: state.resourcePoints?.[playerId] ?? 0,
    chiPoints: state.chiPoints?.[playerId] ?? 0,
    actionPoints: state.actionPoints?.[playerId] ?? 0,
    soulCount: state.soulCounts?.[playerId] ?? 0,
    attackActivationsByInstanceId: state.attackActivationsByInstanceId ?? {},
    heroSignals: state.heroSignals[playerId] ?? [],
    zones,
    cardsById: state.cards,
    faceDownIds: Object.values(state.cards)
      .filter((card) => card.ownerId === playerId && card.face === "down")
      .map((card) => card.id),
  };
}

function FabTabletopHand({
  player,
  viewerId,
  side,
  cardMetadata,
  interactionStateFor,
  onCardSelect,
  revealedCards = [],
}: {
  player: ReturnType<typeof buildPlayerState>;
  viewerId: string;
  side: "top" | "bottom";
  cardMetadata?: Map<string, FabCardMetadata>;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
  revealedCards?: readonly SimulatorDeckRevealCard[];
}) {
  const art = useFabCardArt();
  const isSelf = player.playerId === viewerId;
  const handIds = player.zones.hand ?? [];
  const publicReveals = isSelf
    ? []
    : revealedCards.filter((card): card is SimulatorDeckRevealCard & { entityId: string } =>
        Boolean(card.entityId),
      );
  const visibleHandIds = isSelf
    ? handIds
    : [
        ...handIds.slice(0, Math.max(0, handIds.length - publicReveals.length)),
        ...publicReveals.map((card) => card.entityId),
      ];
  const revealedById = new Map(publicReveals.map((card) => [card.entityId, card]));
  const handOverlap = Math.min(0.58, Math.max(0, (visibleHandIds.length - 4) * 0.07));
  const entities = visibleHandIds.map((id) => {
    const publicReveal = revealedById.get(id);
    const metadata = publicReveal
      ? (cardMetadata?.get(id) ?? {
          name: publicReveal.title ?? "Revealed card",
          type: publicReveal.subtitle ?? "Flesh and Blood",
          imageUrl: publicReveal.imageUrl,
        })
      : isSelf
        ? cardMetadata?.get(id)
        : undefined;
    const card = player.cardsById[id];
    return publicReveal
      ? entityFor(id, metadata, player.playerId, true, { frame: "tactical", art })
      : card
        ? entityForFabViewer(card, metadata, viewerId, { frame: "tactical", art })
        : entityFor(id, undefined, player.playerId, false, {
            frame: "tactical",
            hiddenBackLayout: "square",
          });
  });

  return (
    <div
      className="fab-hand fab-tabletop-hand fab-layout-hand"
      data-zone="hand"
      data-side={side}
      data-hand-count={visibleHandIds.length}
      data-testid={`fab-hand-${side}`}
      aria-label={`${isSelf ? "Your" : "Opponent"} hand, ${handIds.length} cards`}
      style={{ "--fab-hand-overlap": handOverlap } as CSSProperties}
    >
      <HandZone
        zone={{
          id: `${player.playerId}:hand`,
          label: "Hand",
          role: "hand",
          ownerId: player.playerId,
          visibility: "owner",
          entityIds: visibleHandIds,
          count: handIds.length,
          hint: "hand",
          layoutHint: "fan",
        }}
        entities={entities}
        interactionStateFor={isSelf ? interactionStateFor : undefined}
        fanStyle="shallow"
        density="compact"
        orientation="landscape"
        onSelect={isSelf ? onCardSelect : undefined}
      />
    </div>
  );
}

function FabHandRevealRecall({
  ownerId,
  cards,
  cardMetadata,
}: {
  ownerId: string;
  cards?: readonly SimulatorDeckRevealCard[];
  cardMetadata?: Map<string, FabCardMetadata>;
}) {
  const art = useFabCardArt();
  const revealedCards = (cards ?? []).filter(
    (card): card is SimulatorDeckRevealCard & { entityId: string } => Boolean(card.entityId),
  );
  if (revealedCards.length === 0) return null;

  return (
    <aside
      className="fab-hand-reveal-recall"
      data-testid="fab-hand-reveal-recall"
      aria-label={`Revealed in opponent hand: ${revealedCards
        .map((card) => card.title ?? "Revealed card")
        .join(", ")}`}
    >
      <span className="fab-hand-reveal-recall__label">Revealed in hand</span>
      <div className="fab-hand-reveal-recall__cards">
        {revealedCards.map((card) => {
          const metadata = {
            ...(cardMetadata?.get(card.entityId) ?? {
              name: card.title ?? "Revealed card",
              type: card.subtitle ?? "Flesh and Blood",
              imageUrl: card.imageUrl,
            }),
            ...(card.definitionId ? { canonicalId: card.definitionId } : {}),
          };
          const entity = entityFor(card.entityId, metadata, ownerId, true, {
            art,
            frame: "tactical",
          });
          return (
            <div
              key={card.entityId}
              className="fab-hand-reveal-recall__card"
              data-revealed-entity-id={card.entityId}
            >
              <FabPreviewRecallFace entity={entity} />
              <span>{card.title ?? metadata.name}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/** Revealed-recall cards inspect through the game-wide hover preview. */
function FabPreviewRecallFace({ entity }: { entity: SimulatorEntity }) {
  const { previewProps } = useFabPreviewTarget(entity, { pinOnClick: true });
  return (
    <span {...previewProps}>
      <FabBoardCardFace entity={entity} density="mini" />
    </span>
  );
}

export function FleshAndBloodTabletop({
  sessionKey,
  state,
  animationVersion,
  viewerId,
  cardMetadata,
  forceMobileLayout,
  publicTargeting,
  historyHighlightedEntityIds = [],
  ...props
}: FleshAndBloodTabletopProps) {
  const art = useFabCardArt();
  const { cancelScheduledCues, scheduleAnimationSteps } = useSimulatorAudio();
  const animationSessionKey = `${
    sessionKey ?? `flesh-and-blood:${state.players.join(":")}`
  }:${viewerId}`;
  return (
    <FabCardPreviewProvider>
      <FabBoardHighlightProvider entityIds={historyHighlightedEntityIds}>
        <FabAnimation.Root
          sessionKey={animationSessionKey}
          initialState={state}
          initialVersion={animationVersion ?? 0}
          projection={{
            getEntity: (projectedState, entityId, face) => {
              const card = projectedState.cards[entityId];
              if (!card) {
                const hiddenOwnerToken = /^fab-hidden:([^:]+):/.exec(entityId)?.[1];
                const hiddenOwner = hiddenOwnerToken
                  ? decodeURIComponent(hiddenOwnerToken)
                  : undefined;
                return hiddenOwner
                  ? {
                      id: entityId,
                      title: "Hidden card",
                      subtitle: "Private",
                      kind: "card",
                      ownerId: hiddenOwner,
                      face: "hidden",
                      ...hiddenCardPresentationForFabLayout(undefined),
                      states: [],
                      stats: [],
                      traits: [],
                    }
                  : null;
              }
              const def = projectedState.cardDefinitions[card.cardId];
              const reveal = face === "public" || (card.face === "up" && card.zone !== "deck");
              return entityForFabPresentationCard(
                card,
                metadataForFabPresentationCard(card, def, cardMetadata?.get(entityId)),
                { kind: "explicit", reveal },
                { frame: "tactical", art },
              );
            },
            getZone: (projectedState, ref) => {
              const [ownerId, zone] = ref.id.split(":") as [string, string];
              if (!zone) return null;
              const presentationZone =
                zone === "weapon1" || zone === "weapon2" ? "weapon" : (zone as FabPresentationZone);
              const matching = Object.values(projectedState.cards).filter(
                (c) => c.ownerId === ownerId && c.zone === presentationZone,
              );
              const cards =
                zone === "weapon1"
                  ? matching.slice(0, 1)
                  : zone === "weapon2"
                    ? matching.slice(1, 2)
                    : matching;
              return {
                id: ref.id,
                label: zone[0]!.toUpperCase() + zone.slice(1),
                role:
                  zone === "hand"
                    ? "hand"
                    : zone === "deck"
                      ? "deck"
                      : zone === "hero"
                        ? "leader"
                        : zone === "pitch"
                          ? "resource"
                          : zone === "combat-chain"
                            ? "battlefield"
                            : "discard",
                ownerId,
                visibility:
                  zone === "hand" || zone === "arsenal"
                    ? "owner"
                    : zone === "deck"
                      ? "secret"
                      : "public",
                entityIds: cards.map((c) => c.id),
                hint: zone,
                layoutHint:
                  zone === "hand"
                    ? "fan"
                    : zone === "deck"
                      ? "stack"
                      : zone === "permanent"
                        ? "row"
                        : "stack",
              };
            },
          }}
          entityRenderer={FabTabletopCardFace}
          valueDeltaRenderer={FabValueDeltaVisual}
          viewerSeatId={viewerId}
          animationSpeed="normal"
          transferFaceChange="flip"
          layoutDurationMs={200}
          reducedMotionTransferDurationMs={140}
          onScheduleAudio={scheduleAnimationSteps}
          onCancelAudio={cancelScheduledCues}
          onTransitionSettled={props.onTransitionSettled}
        >
          <FabAnimationBridge
            key={animationSessionKey}
            state={state}
            animationVersion={animationVersion}
            viewerId={viewerId}
            cardMetadata={cardMetadata}
            forceMobileLayout={forceMobileLayout}
            publicTargeting={publicTargeting}
            {...props}
          />
        </FabAnimation.Root>
      </FabBoardHighlightProvider>
    </FabCardPreviewProvider>
  );
}

function FabAnimationBridge({
  state,
  animationVersion,
  animationTransition,
  viewerId,
  cardMetadata,
  onAction,
  ...props
}: FleshAndBloodTabletopProps) {
  const snapshot = FabAnimation.useState();
  const { enqueue, refreshFromProjection, replaceFromSync } = FabAnimation.useActions();
  const versionRef = useRef(0);
  const previousStateRef = useRef(state);
  const lastTransitionKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const transitionKey = animationTransition
      ? `${animationTransition.mode}:${animationTransition.version}:${animationTransition.correlationId}`
      : null;
    const hasNewTransition =
      transitionKey !== null && transitionKey !== lastTransitionKeyRef.current;
    if (previousStateRef.current === state && !hasNewTransition) return;
    if (transitionKey) lastTransitionKeyRef.current = transitionKey;
    const fromState = previousStateRef.current;
    previousStateRef.current = state;
    if (animationTransition) {
      versionRef.current = animationTransition.version;
      if (!hasNewTransition) {
        refreshFromProjection({ state, version: animationTransition.version });
        return;
      }
      if (animationTransition.mode === "sync") {
        replaceFromSync({ state, version: animationTransition.version });
      } else {
        const projectedPlan = fabBoardTransfers(
          fromState,
          state,
          animationTransition.correlationId,
          viewerId,
          animationTransition.plan,
        );
        const motionDisabled = testHarnessDisablesMotion();
        const accepted = enqueue({
          correlationId: animationTransition.correlationId,
          source: "authoritative",
          state,
          version: animationTransition.version,
          plan: motionDisabled ? null : projectedPlan,
        });
        if (accepted && (motionDisabled || projectedPlan === null)) {
          props.onTransitionSettled?.({
            transitionId: `flesh-and-blood:immediate:${animationTransition.correlationId}:${animationTransition.version}`,
            correlationId: animationTransition.correlationId,
            outcome: "skipped",
          });
        }
      }
      return;
    }
    if (animationVersion !== undefined) {
      versionRef.current = animationVersion;
      if (!refreshFromProjection({ state, version: animationVersion })) {
        replaceFromSync({ state, version: animationVersion });
      }
      return;
    }
    enqueue({
      correlationId: `flesh-and-blood:snap:${++versionRef.current}`,
      source: "authoritative",
      state,
      version: versionRef.current,
      plan: fabBoardTransfers(
        fromState,
        state,
        `flesh-and-blood:snap:${versionRef.current}`,
        viewerId,
      ),
    });
  }, [
    animationTransition,
    animationVersion,
    enqueue,
    refreshFromProjection,
    replaceFromSync,
    state,
  ]);

  return (
    <FleshAndBloodTabletopContent
      state={snapshot.presentationState ?? state}
      authoritativeOptionalTriggerAutomation={state.optionalTriggerAutomation}
      authoritativePriorityAutomation={state.priorityAutomation ?? null}
      authoritativePriorityHoldArmed={state.priorityHoldArmed ?? null}
      viewerId={viewerId}
      cardMetadata={cardMetadata}
      {...props}
      onAction={onAction}
    />
  );
}

function FleshAndBloodTabletopContent({
  state,
  authoritativeOptionalTriggerAutomation,
  authoritativePriorityAutomation,
  authoritativePriorityHoldArmed,
  viewerId,
  readOnly = false,
  readOnlyLabel = "Replay · read only",
  pending = false,
  conflict,
  cardMetadata,
  sidebarExtra,
  replayControls,
  matchActions,
  spectatorReturnHref,
  matchNotice,
  activity,
  activityLogLabel,
  activityOwnsStatus,
  eventLog,
  matchHistory,
  localPractice,
  participantPresentation,
  automation,
  onAction,
  forceMobileLayout = false,
  publicTargeting = false,
  onPassPriority: onLocalPassPriority,
  onUndo,
  canUndo,
  onConcede,
  confirmConcede,
  onOpenGameSummary,
  onOpenMatchHistory,
  onOpenLegalActions,
  onEndTurn: onLocalEndTurn,
  canEndTurn,
  legalCommands,
  onLegalCommand,
  cardActions,
  onCardAction,
  interactionView,
  onSubmitInteraction,
  deckReveals,
  handReveals,
}: FleshAndBloodTabletopProps & {
  readonly authoritativeOptionalTriggerAutomation?: Readonly<
    Record<string, FabOptionalTriggerAutomationMode>
  >;
  readonly authoritativePriorityAutomation?: FabPriorityAutomationMode | null;
  readonly authoritativePriorityHoldArmed?: boolean | null;
}) {
  // Practice passes recall props derived from its local event stream; live and
  // replay have no such stream, so fall back to the turn-scoped reveals the
  // engine projected onto the presentation state.
  const effectiveDeckReveals = deckReveals ?? state.deckRevealsByOwnerId;
  const effectiveHandReveals = handReveals ?? state.handRevealsByOwnerId;
  // Hosted matches expose protocol interactions, not local engine commands.
  const serverPassAction =
    interactionView?.actorId === viewerId && interactionView.status === "ready"
      ? fabPassInteractionAction(interactionView)
      : null;
  const submitServerPass = useCallback(() => {
    if (!interactionView || !serverPassAction || !onSubmitInteraction) return;
    onSubmitInteraction(
      buildInteractionSubmission({ view: interactionView, action: serverPassAction, values: {} }),
    );
  }, [interactionView, serverPassAction, onSubmitInteraction]);
  const onPassPriority =
    onLocalPassPriority ?? (onSubmitInteraction && serverPassAction ? submitServerPass : undefined);
  const serverEndTurnAction =
    interactionView?.actorId === viewerId
      ? interactionView.actions.find(
          (action) => action.enabled && fabInteractionControl(action)?.kind === "end-turn",
        )
      : undefined;
  const submitServerEndTurn = useCallback(() => {
    if (!interactionView || !serverEndTurnAction || !onSubmitInteraction) return;
    onSubmitInteraction(
      buildInteractionSubmission({
        view: interactionView,
        action: serverEndTurnAction,
        values: {},
      }),
    );
  }, [interactionView, serverEndTurnAction, onSubmitInteraction]);
  const onEndTurn =
    onLocalEndTurn ??
    (onSubmitInteraction && serverEndTurnAction ? submitServerEndTurn : undefined);
  const animationStatus = FabAnimation.useStatus();
  const {
    setHover: setCardHover,
    clearHover: clearCardHover,
    pin: pinCardPreview,
    hide: hideCardPreview,
  } = useFabCardPreview();
  const [unavailableActionNotice, setUnavailableActionNotice] = useState<string | null>(null);
  const [armedAttackTargetActionId, setArmedAttackTargetActionId] = useState<string | null>(null);
  const [closeAndPlayIntent, setCloseAndPlayIntent] = useState<{
    readonly entityId: string;
    readonly cardName: string;
    readonly turnNumber: number;
  } | null>(null);
  const { settings, setCardInteractionMode } = useSimulatorSettings();
  // Account-default write-back for the sticky in-match automation toggles.
  // The engine move stays authoritative; these writes are best-effort.
  const fabAutomationSettings = useFabAutomationSettings();
  const responsiveLayout = useActiveLayout(FAB_MOBILE_BREAKPOINT, {
    shortViewportBreakpoint: 520,
    coarsePointerShortViewport: true,
  });
  const activeLayout = forceMobileLayout ? "mobile" : responsiveLayout;
  const isMobile = activeLayout === "mobile";
  const closeDesktopCardPreviewAfterAction = useCallback(() => {
    if (isMobile) return;
    hideCardPreview();
  }, [hideCardPreview, isMobile]);
  const opponentId = state.players.find((id) => id !== viewerId) ?? state.players[1]!;
  const opponentLifeAnimationRef = useAnimationNode(
    { kind: "player", id: opponentId },
    { presence: "present" },
  );
  const selfLifeAnimationRef = useAnimationNode(
    { kind: "player", id: viewerId },
    { presence: "present" },
  );
  const opponentLifeValueAnimationRef = useAnimationNode(
    { kind: "anchor", id: `fab:${opponentId}:life` },
    { presence: "present" },
  );
  const selfLifeValueAnimationRef = useAnimationNode(
    { kind: "anchor", id: `fab:${viewerId}:life` },
    { presence: "present" },
  );
  const opponentLifeRef = useCallback(
    (node: HTMLElement | null) => {
      opponentLifeAnimationRef(node);
      opponentLifeValueAnimationRef(node);
    },
    [opponentLifeAnimationRef, opponentLifeValueAnimationRef],
  );
  const selfLifeRef = useCallback(
    (node: HTMLElement | null) => {
      selfLifeAnimationRef(node);
      selfLifeValueAnimationRef(node);
    },
    [selfLifeAnimationRef, selfLifeValueAnimationRef],
  );
  const controlsDisabled = readOnly || pending || animationStatus.isAnimating;
  const status = readOnly ? readOnlyLabel : pending ? "Saving…" : (conflict ?? "Synced");
  const [zoneInspection, setZoneInspection] = useState<FabZoneInspectionSelection | null>(null);
  const [combatOverlayPlacement, setCombatOverlayPlacement] = useState<"center" | "top" | "bottom">(
    "center",
  );
  const [combatOverlayMinimized, setCombatOverlayMinimized] = useState(false);
  const [effectsInspectorAnchor, setEffectsInspectorAnchor] = useState<HTMLElement | null>(null);
  const [boardContextMenu, setBoardContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [interactionValues, setInteractionValues] = useState<
    Record<string, InteractionSubmissionValue>
  >({});

  useEffect(() => {
    setEffectsInspectorAnchor(null);
  }, [activeLayout]);

  useEffect(() => {
    setInteractionValues({});
  }, [interactionView?.stateVersion, interactionView?.resolution?.currentEffect.id]);

  const resolvedMetadata = useMemo(() => {
    const byInstance = new Map(cardMetadata);
    for (const card of Object.values(state.cards)) {
      const existing = byInstance.get(card.id);
      const def = state.cardDefinitions[card.cardId];
      byInstance.set(card.id, metadataForFabPresentationCard(card, def, existing));
    }
    return byInstance;
  }, [cardMetadata, state.cardDefinitions, state.cards]);
  const locale = useFabCardLocale();
  const art = useFabCardArt();
  const { resolveFabCardArt, nameForFabCardIdentity } = art;
  const presentationRegistry = useFabPresentationRegistry();
  const interactionCandidateMetadataByDefinitionId = useMemo(() => {
    const byDefinitionId = new Map<string, FabCardMetadata>();
    for (const [canonicalId, definition] of Object.entries(state.cardDefinitions)) {
      const name = definition.presentationName ?? definition.name;
      byDefinitionId.set(canonicalId, {
        canonicalId: definition.presentationCanonicalId ?? canonicalId,
        name,
        type: definition.cardType,
        typeLine: definition.typeLine,
        printedText: definition.printedText,
        imageUrl: resolveFabCardArt({
          locale,
          canonicalId: definition.presentationCanonicalId ?? canonicalId,
          name,
        }).boardImageUrl,
        pitchValue: definition.pitchValue,
        cost: definition.cost,
        power: definition.power,
        defense: definition.defense,
        isBloodDebt: definition.isBloodDebt,
      });
    }
    return byDefinitionId;
  }, [state.cardDefinitions, locale]);

  const combatView = useMemo(() => projectCombatChainView(state), [state]);
  const defenseAction =
    interactionView?.actorId === viewerId && onSubmitInteraction
      ? interactionView.actions.find(
          (action) => action.enabled && fabInteractionControl(action)?.kind === "defend",
        )
      : undefined;
  const defenseInput = defenseAction?.inputs.find(
    (input) => input.kind === "entity-selection" && input.role === "defender",
  );
  const defenseSelections = useMemo(
    () =>
      (legalCommands ?? [])
        .filter((command) => command.move === "defend")
        .map((command) => ({
          instanceIds: sourceCardIds(command),
          submit: () => onLegalCommand?.(command),
        })),
    [legalCommands, onLegalCommand],
  );
  const defenseCommandBySelection = useMemo(
    () =>
      new Map(
        defenseSelections.map((selection) => [
          defenseSelectionKey(selection.instanceIds),
          selection,
        ]),
      ),
    [defenseSelections],
  );
  const defenseCandidateIds = useMemo(
    () =>
      new Set(
        defenseInput?.kind === "entity-selection"
          ? defenseInput.candidates
              .filter((candidate) => candidate.enabled)
              .map((candidate) => candidate.entity.instanceId)
          : defenseSelections.flatMap((selection) => selection.instanceIds),
      ),
    [defenseSelections, defenseInput],
  );
  const canStageDefenseSelection = useCallback(
    (instanceIds: readonly string[]) =>
      defenseInput?.kind === "entity-selection"
        ? instanceIds.length <= defenseInput.max &&
          instanceIds.every((id) => defenseCandidateIds.has(id))
        : defenseSelections.some((selection) =>
            instanceIds.every((instanceId) => selection.instanceIds.includes(instanceId)),
          ),
    [defenseSelections, defenseInput, defenseCandidateIds],
  );
  const defenseStagingActive =
    combatView.step === "defend" &&
    (defenseAction != null ||
      defenseSelections.length > 0 ||
      (combatView.defendingPlayerId === viewerId &&
        state.priorityPlayerId == null &&
        serverPassAction != null));
  const [stagedDefenseIds, setStagedDefenseIds] = useState<readonly string[]>([]);
  const [confirmingNoDefense, setConfirmingNoDefense] = useState(false);
  const defenderHasAvailableCards = defenseCandidateIds.size > 0;
  const defenseScopeKey = defenseStagingActive
    ? `${state.priorityPlayerId}:${interactionView?.stateVersion ?? "local"}:${defenseAction?.id ?? "local"}:${[
        ...defenseCandidateIds,
      ]
        .map((id) => id)
        .sort()
        .join(",")}`
    : "";
  useEffect(() => {
    setStagedDefenseIds([]);
  }, [defenseScopeKey]);
  useEffect(() => {
    setConfirmingNoDefense(false);
  }, [defenseScopeKey, defenderHasAvailableCards, stagedDefenseIds.length]);
  const defenseDeclarationLabel = confirmingNoDefense
    ? "Are you sure?"
    : defenseCandidateIds.size === 0
      ? "Declare no defense"
      : "Declare defense";
  const defenseStatusLabel =
    defenseCandidateIds.size === 0 ? "No defenders available" : "Choose defenders";
  const defenseDeclarationActorPlayerId =
    state.combat?.step === "defend" && state.combat.defenseDeclarationPending
      ? state.combat.activeLink?.defendingPlayerId
      : undefined;
  // One presentation actor drives every "who must act" signal. A resolving
  // layer and a pending defense declaration have no rules priority (CR 1.11.5,
  // 7.3.2-7.3.3), so their decision owner supersedes rules priority. The
  // defense owner must come from public combat state rather than viewer-local
  // legality, otherwise only the defender sees the interaction signal.
  const interactionActorPlayerId =
    interactionView?.resolution?.actingPlayerId ??
    defenseDeclarationActorPlayerId ??
    state.priorityPlayerId;
  const combatPriorityPresentation = deriveFabCombatPriorityPresentation(state.priorityWindow);
  const closingCombatChain = combatPriorityPresentation.kind === "close-chain";
  const persistentPassLabel = defenseStagingActive
    ? defenseDeclarationLabel
    : combatPriorityPresentation.kind === "pass"
      ? combatPriorityPresentation.buttonLabel
      : closingCombatChain
        ? combatPriorityPresentation.buttonLabel
        : "Pass";
  const desktopPassLabel =
    combatPriorityPresentation.kind === "waiting"
      ? persistentPassLabel
      : combatPriorityPresentation.compactButtonLabel;
  const combatChainPriorityLabel = defenseStagingActive
    ? defenseDeclarationLabel
    : combatView.step === "resolution" && combatPriorityPresentation.kind !== "waiting"
      ? combatPriorityPresentation.buttonLabel
      : undefined;
  const stagedDefenseCommand = defenseCommandBySelection.get(defenseSelectionKey(stagedDefenseIds));
  const canDeclareDefense =
    stagedDefenseIds.length === 0 ||
    (defenseAction
      ? canStageDefenseSelection(stagedDefenseIds)
      : stagedDefenseCommand !== undefined);
  const stagedCombatView = useMemo(() => {
    if (!defenseStagingActive || stagedDefenseIds.length === 0) return combatView;
    const stagedDefenders = stagedDefenseIds.flatMap((id) => {
      const card = state.cards[id];
      if (!card) return [];
      const definition = state.cardDefinitions[card.cardId];
      return [projectCombatChainCard(card, definition, "defend", resolvedMetadata.get(id))];
    });
    const totalDefense = stagedDefenders.reduce(
      (sum, card) => sum + (combatCardNumeric(card, "defense") ?? 0),
      0,
    );
    return {
      ...combatView,
      // Selection previews totals; cards move only when the declaration commits.
      defenders: combatView.defenders,
      totalDefense,
      projectedDamage: combatView.attacker
        ? Math.max(0, combatView.attackPower - totalDefense)
        : combatView.projectedDamage,
      summary: `${combatView.attacker?.entity.title ?? "Attack"} ${combatView.attackPower} vs Σ ${totalDefense} defense · pending declaration`,
    };
  }, [
    combatView,
    defenseStagingActive,
    resolvedMetadata,
    stagedDefenseIds,
    state.cardDefinitions,
    state.cards,
  ]);
  const combatAnnouncement = useMemo(() => {
    if (combatView.mode === "closed") return "Combat chain closed";
    if (combatView.mode === "between-links") return combatView.summary;
    return `${combatView.summary}${combatView.stepLabel ? ` · ${combatView.stepLabel} step` : ""}`;
  }, [combatView.mode, combatView.summary, combatView.stepLabel]);
  const mobileAnnouncement = useMemo(() => {
    const turn = state.activePlayerId === viewerId ? "Your turn" : "Opponent turn";
    const priority = defenseDeclarationActorPlayerId
      ? defenseDeclarationActorPlayerId === viewerId
        ? defenseStatusLabel
        : "Opponent choosing defenders"
      : state.priorityPlayerId == null
        ? "Priority closed"
        : state.priorityPlayerId === viewerId
          ? "Your priority"
          : "Opponent priority";
    return `${combatAnnouncement} · ${turn} · ${priority}`;
  }, [
    combatAnnouncement,
    defenseDeclarationActorPlayerId,
    defenseStatusLabel,
    state.activePlayerId,
    state.priorityPlayerId,
    viewerId,
  ]);
  const cardActionProjection = useMemo(
    () =>
      projectFabCardActions((legalCommands ?? []).filter((command) => command.move !== "defend")),
    [legalCommands],
  );
  const localAttackTargetProjection = useMemo(
    () => projectFabAttackTargetCardActions(cardActionProjection),
    [cardActionProjection],
  );
  const optionalTriggerAutomationModes =
    authoritativeOptionalTriggerAutomation ?? state.optionalTriggerAutomation ?? {};
  const optionalTriggerAutomationCommands = useMemo(
    () =>
      new Map<string, FabLegalCommand>(
        (legalCommands ?? [])
          .filter(
            (command) =>
              command.move === "set-optional-trigger-automation" &&
              typeof command.payload.instanceId === "string",
          )
          .flatMap((command) => {
            const mode = command.payload.mode;
            return mode === "ask" || mode === "auto-accept" || mode === "auto-decline"
              ? [[`${command.payload.instanceId as string}:${mode}`, command] as const]
              : [];
          }),
      ),
    [legalCommands],
  );
  const optionalTriggerAutomationActions = useMemo(
    () =>
      new Map<string, NonNullable<typeof interactionView>["actions"][number]>(
        (interactionView?.actions ?? [])
          .filter(
            (action) =>
              action.intent === "custom" &&
              action.inputs.length === 0 &&
              action.source?.kind === "card" &&
              fabOptionalTriggerAutomationTargetMode(action) !== null,
          )
          .flatMap((action) => {
            const mode = fabOptionalTriggerAutomationTargetMode(action);
            return mode ? [[`${action.source!.instanceId}:${mode}`, action] as const] : [];
          }),
      ),
    [interactionView?.actions],
  );
  const setOptionalTriggerAutomation = useCallback(
    (
      instanceId: string,
      mode: FabOptionalTriggerAutomationMode,
      // The context onToggle passes the card name third; accepting it keeps
      // canonicalId aligned with the 4th argument instead of capturing the name.
      _cardName: string,
      canonicalId?: string,
    ) => {
      const key = `${instanceId}:${mode}`;
      const command = optionalTriggerAutomationCommands.get(key);
      if (command && onLegalCommand) {
        onLegalCommand(command);
      } else {
        const action = optionalTriggerAutomationActions.get(key);
        if (action && interactionView && onSubmitInteraction) {
          onSubmitInteraction(
            buildInteractionSubmission({ view: interactionView, action, values: {} }),
          );
        }
      }
      // Sticky account write-back: persisting the saved default is
      // fire-and-forget and never blocks the engine move above.
      if (canonicalId) {
        fabAutomationSettings.setCardOptionalMode(canonicalId, mode);
      }
    },
    [
      fabAutomationSettings,
      interactionView,
      onLegalCommand,
      onSubmitInteraction,
      optionalTriggerAutomationActions,
      optionalTriggerAutomationCommands,
    ],
  );
  const optionalTriggerConfigurationAvailable =
    optionalTriggerAutomationCommands.size > 0 || optionalTriggerAutomationActions.size > 0;
  // Per-seat priority automation, mirroring the optional-trigger pattern: the
  // authoritative projection wins over the (animation-lagged) presentation
  // snapshot so mid-match toggles apply immediately. The engine lists one
  // set-automation-preferences entry per other mode (payload.priorityMode) plus the
  // one-shot arm while eligible, so lookups are per-mode, never first-find.
  const priorityAutomationMode =
    authoritativePriorityAutomation ?? state.priorityAutomation ?? null;
  const priorityHoldArmed = authoritativePriorityHoldArmed ?? state.priorityHoldArmed ?? null;
  const priorityAutomationCommands = useMemo(() => {
    const commands = new Map<FabPriorityAutomationMode, FabLegalCommand>();
    for (const command of legalCommands ?? []) {
      if (command.move !== "set-automation-preferences") continue;
      const mode = command.payload.priorityMode;
      if (mode === "auto-pass" || mode === "always-hold" || mode === "play-and-skip") {
        commands.set(mode, command);
      }
    }
    return commands;
  }, [legalCommands]);
  const autoOrderTriggersCommand = (enabled: boolean) =>
    (legalCommands ?? []).find(
      (command) =>
        command.move === "set-automation-preferences" &&
        command.payload.autoOrderTriggers === enabled,
    );
  const autoSelectSingletonTargetsCommand = (enabled: boolean) =>
    (legalCommands ?? []).find(
      (command) =>
        command.move === "set-automation-preferences" &&
        command.payload.autoSelectSingletonTargets === enabled,
    );
  const armPriorityHoldCommand = (legalCommands ?? []).find(
    (command) => command.move === "arm-priority-hold",
  );
  const setPriorityAutomation = useCallback(
    (mode: FabPriorityAutomationMode) => {
      const command = priorityAutomationCommands.get(mode);
      if (command && onLegalCommand) {
        onLegalCommand({
          move: "set-automation-preferences",
          payload: { priorityMode: mode },
          label: command.label,
        });
      } else {
        const action = fabPriorityModeAction(interactionView, mode);
        if (action && interactionView && onSubmitInteraction) {
          onSubmitInteraction(
            buildInteractionSubmission({
              view: interactionView,
              action,
              values: {},
            }),
          );
        } else {
          return;
        }
      }
      // Sticky account write-back: persisting the saved default is
      // fire-and-forget and never blocks the engine move above.
      fabAutomationSettings.setPriorityMode(mode);
      if (mode === "auto-pass") {
        fabAutomationSettings.setAutoOrderTriggers(true);
      } else if (mode === "always-hold") {
        fabAutomationSettings.setAutoOrderTriggers(false);
      }
    },
    [
      fabAutomationSettings,
      interactionView,
      onLegalCommand,
      onSubmitInteraction,
      priorityAutomationCommands,
    ],
  );
  const priorityAutomationActionAvailable = FAB_PRIORITY_MODES.some(
    (mode) => fabPriorityModeAction(interactionView, mode) != null,
  );
  const setAutoOrderTriggers = useCallback(
    (enabled: boolean) => {
      const command = autoOrderTriggersCommand(enabled);
      const action = fabSetAutoOrderTriggersAction(interactionView, enabled);
      if (command && onLegalCommand) {
        onLegalCommand({
          move: "set-automation-preferences",
          payload: { autoOrderTriggers: enabled },
          label: command.label,
        });
      } else if (action && interactionView && onSubmitInteraction) {
        onSubmitInteraction(
          buildInteractionSubmission({
            view: interactionView,
            action,
            values: {},
          }),
        );
      } else {
        return;
      }
      fabAutomationSettings.setAutoOrderTriggers(enabled);
    },
    [fabAutomationSettings, interactionView, onLegalCommand, onSubmitInteraction, legalCommands],
  );
  const autoOrderTriggersConfigurationAvailable =
    autoOrderTriggersCommand(true) != null ||
    fabSetAutoOrderTriggersAction(interactionView, true) != null;
  const setAutoSelectSingletonTargets = useCallback(
    (enabled: boolean) => {
      const command = autoSelectSingletonTargetsCommand(enabled);
      const action = fabSetAutoSelectSingletonTargetsAction(interactionView, enabled);
      if (command && onLegalCommand) {
        onLegalCommand({
          move: "set-automation-preferences",
          payload: { autoSelectSingletonTargets: enabled },
          label: command.label,
        });
      } else if (action && interactionView && onSubmitInteraction) {
        onSubmitInteraction(
          buildInteractionSubmission({
            view: interactionView,
            action,
            values: {},
          }),
        );
      } else {
        return;
      }
      fabAutomationSettings.setAutoSelectSingletonTargets(enabled);
    },
    [fabAutomationSettings, interactionView, onLegalCommand, onSubmitInteraction, legalCommands],
  );
  const autoSelectSingletonTargetsConfigurationAvailable =
    autoSelectSingletonTargetsCommand(true) != null ||
    fabSetAutoSelectSingletonTargetsAction(interactionView, true) != null;
  // The one-shot "play and hold" arm: holder-only, match-scoped — never
  // written back to account settings.
  const armPriorityHold = useCallback(() => {
    if (armPriorityHoldCommand && onLegalCommand) {
      onLegalCommand({
        move: "arm-priority-hold",
        payload: {},
        label: armPriorityHoldCommand.label,
      });
    } else {
      const action = fabArmHoldAction(interactionView);
      if (action && interactionView && onSubmitInteraction) {
        onSubmitInteraction(
          buildInteractionSubmission({ view: interactionView, action, values: {} }),
        );
      }
    }
  }, [armPriorityHoldCommand, interactionView, onLegalCommand, onSubmitInteraction]);
  // One-shot scoped auto-pass arms: match-scoped like the hold arm — never
  // written back to account settings. Disarm is submittable while the seat's
  // windows are engine-drained, so it never depends on holding priority.
  const scopedAutoPass = state.scopedAutoPass ?? null;
  const armScopeCommand = (scope: FabScopedAutoPassTarget) =>
    (legalCommands ?? []).find(
      (command) =>
        command.move === "set-automation-preferences" &&
        command.payload.armScopedAutoPass === scope,
    );
  const disarmScopeCommand = (legalCommands ?? []).find(
    (command) =>
      command.move === "set-automation-preferences" &&
      command.payload.disarmScopedAutoPass === true,
  );
  const armScopedAutoPass = useCallback(
    (scope: FabScopedAutoPassTarget) => {
      const command = armScopeCommand(scope);
      if (command && onLegalCommand) {
        onLegalCommand({
          move: "set-automation-preferences",
          payload: { armScopedAutoPass: scope },
          label: command.label,
        });
        return;
      }
      const action = fabArmScopedAutoPassAction(interactionView, scope);
      if (action && interactionView && onSubmitInteraction) {
        onSubmitInteraction(
          buildInteractionSubmission({ view: interactionView, action, values: {} }),
        );
      }
    },
    [interactionView, onLegalCommand, onSubmitInteraction, legalCommands],
  );
  const disarmScopedAutoPass = useCallback(() => {
    if (disarmScopeCommand && onLegalCommand) {
      onLegalCommand({
        move: "set-automation-preferences",
        payload: { disarmScopedAutoPass: true },
        label: disarmScopeCommand.label,
      });
      return;
    }
    const action = fabDisarmScopedAutoPassAction(interactionView);
    if (action && interactionView && onSubmitInteraction) {
      onSubmitInteraction(
        buildInteractionSubmission({ view: interactionView, action, values: {} }),
      );
    }
  }, [disarmScopeCommand, interactionView, onLegalCommand, onSubmitInteraction]);
  const scopeActionsAvailable =
    FabScopedAutoPassTargets.some((scope) => armScopeCommand(scope) != null) ||
    FabScopedAutoPassTargets.some(
      (scope) => fabArmScopedAutoPassAction(interactionView, scope) != null,
    ) ||
    disarmScopeCommand != null ||
    fabDisarmScopedAutoPassAction(interactionView) != null;
  const scopeContext: FabScopeContext = {
    combatOpen: state.combat != null,
    opponentsTurn: state.activePlayerId != null && state.activePlayerId !== viewerId,
  };
  const armScopeIfAllowed =
    !readOnly &&
    (onLegalCommand != null || (interactionView != null && onSubmitInteraction != null))
      ? armScopedAutoPass
      : undefined;
  const disarmScopeIfAllowed =
    !readOnly &&
    scopeActionsAvailable &&
    (onLegalCommand != null || (interactionView != null && onSubmitInteraction != null))
      ? disarmScopedAutoPass
      : undefined;
  const priorityAutomationConfigurationAvailable =
    priorityAutomationCommands.size > 0 ||
    priorityAutomationActionAvailable ||
    autoOrderTriggersConfigurationAvailable ||
    autoSelectSingletonTargetsConfigurationAvailable;
  const armHoldAvailable =
    armPriorityHoldCommand != null || fabArmHoldAction(interactionView) != null;
  const priorityAutomationDisabledReason = interactionView?.resolution
    ? "Complete the current rules decision before changing this setting."
    : readOnly
      ? "This setting is unavailable in read-only views."
      : !priorityAutomationConfigurationAvailable
        ? "Wait for your priority window to change this setting."
        : undefined;
  const setPriorityAutomationIfAllowed =
    !readOnly &&
    priorityAutomationConfigurationAvailable &&
    (onLegalCommand != null || (interactionView != null && onSubmitInteraction != null))
      ? setPriorityAutomation
      : undefined;
  const armPriorityHoldIfAllowed =
    !readOnly &&
    armHoldAvailable &&
    (onLegalCommand != null || (interactionView != null && onSubmitInteraction != null))
      ? armPriorityHold
      : undefined;
  const normalizedCardActions = cardActions ?? localAttackTargetProjection.actions;
  const hostedAttackTargetActions = useMemo(
    () =>
      new Map(
        (interactionView?.actions ?? []).flatMap((action) => {
          const input = action.inputs[0];
          return action.source?.kind === "card" &&
            input?.kind === "entity-selection" &&
            input.role === "target" &&
            input.min === 1 &&
            input.max === 1 &&
            input.candidates.filter((candidate) => candidate.enabled).length > 1
            ? [[action.id, action] as const]
            : [];
        }),
      ),
    [interactionView],
  );
  const armAttackTargetSelection = useCallback(
    (actionId: string) => {
      if (
        !localAttackTargetProjection.draftByActionId.has(actionId) &&
        !hostedAttackTargetActions.has(actionId)
      ) {
        return false;
      }
      setUnavailableActionNotice(null);
      hideCardPreview();
      setArmedAttackTargetActionId(actionId);
      return true;
    },
    [hideCardPreview, hostedAttackTargetActions, localAttackTargetProjection.draftByActionId],
  );
  const closeAndPlayActions = useMemo<readonly CardInteractionAction[]>(() => {
    if (
      !closingCombatChain ||
      readOnly ||
      pending ||
      state.terminal ||
      state.activePlayerId !== viewerId ||
      !onPassPriority
    ) {
      return [];
    }
    const sourcesWithPublishedActions = new Set(
      normalizedCardActions.flatMap((action) => action.sourceEntityIds),
    );
    return Object.values(state.cards).flatMap((card) => {
      if (
        card.ownerId !== viewerId ||
        card.face !== "up" ||
        (card.zone !== "hand" && card.zone !== "arsenal") ||
        sourcesWithPublishedActions.has(card.id) ||
        !isNonAttackActionCard(state.cardDefinitions[card.cardId])
      ) {
        return [];
      }
      const name = state.cardDefinitions[card.cardId]?.name ?? "this card";
      return [
        {
          id: `fab:close-chain-and-play:${card.id}`,
          sourceEntityIds: [card.id],
          label: `Close chain and play ${name}`,
        },
      ];
    });
  }, [
    closingCombatChain,
    normalizedCardActions,
    onPassPriority,
    pending,
    readOnly,
    state.activePlayerId,
    state.cardDefinitions,
    state.cards,
    state.terminal,
    viewerId,
  ]);
  const closeAndPlayEntityByActionId = useMemo(
    () =>
      new Map(
        closeAndPlayActions.flatMap((action) =>
          action.sourceEntityIds.map((entityId) => [action.id, entityId] as const),
        ),
      ),
    [closeAndPlayActions],
  );
  const interactiveCardActions = useMemo(
    () => [...normalizedCardActions, ...closeAndPlayActions],
    [closeAndPlayActions, normalizedCardActions],
  );
  const availableBanishedEntityIds = useMemo(
    () => viewerAvailablePileEntityIds(interactiveCardActions, state.cards, viewerId, "banished"),
    [interactiveCardActions, state.cards, viewerId],
  );
  const availableGraveyardEntityIds = useMemo(
    () => viewerAvailablePileEntityIds(interactiveCardActions, state.cards, viewerId, "graveyard"),
    [interactiveCardActions, state.cards, viewerId],
  );
  const executePublishedCardAction = useCallback(
    (actionId: string) => {
      if (onCardAction) {
        onCardAction(actionId);
        return true;
      }
      const command = cardActionProjection.commandByActionId.get(actionId);
      if (!command || !onLegalCommand) return false;
      onLegalCommand(command);
      return true;
    },
    [cardActionProjection.commandByActionId, onCardAction, onLegalCommand],
  );
  const requestCloseAndPlay = useCallback(
    (entityId: string) => {
      const card = state.cards[entityId];
      const definition = card ? state.cardDefinitions[card.cardId] : undefined;
      if (!card || !definition || !onPassPriority) return;
      setUnavailableActionNotice(null);
      setCloseAndPlayIntent({
        entityId,
        cardName: definition.name,
        turnNumber: state.turnNumber,
      });
      onPassPriority();
    },
    [onPassPriority, state.cardDefinitions, state.cards, state.turnNumber],
  );
  useEffect(() => {
    if (!closeAndPlayIntent) return;
    const card = state.cards[closeAndPlayIntent.entityId];
    if (
      state.turnNumber !== closeAndPlayIntent.turnNumber ||
      !card ||
      card.ownerId !== viewerId ||
      (card.zone !== "hand" && card.zone !== "arsenal")
    ) {
      setCloseAndPlayIntent(null);
      return;
    }
    // Closing a chain may create rules layers or decisions. Preserve the
    // player's intent until those finish instead of racing a second command.
    if (state.combat?.open || pending || interactionView?.resolution) return;
    const publishedActions = normalizedCardActions.filter(
      (action) =>
        action.sourceEntityIds.includes(closeAndPlayIntent.entityId) && !action.disabledReason,
    );
    if (publishedActions.length === 1) {
      setCloseAndPlayIntent(null);
      if (executePublishedCardAction(publishedActions[0]!.id)) return;
    }
    if (publishedActions.length > 1) {
      setCloseAndPlayIntent(null);
      setUnavailableActionNotice(
        `${closeAndPlayIntent.cardName}: the combat chain is closed. Choose how you want to play this card.`,
      );
      return;
    }
    if (state.priorityPlayerId !== viewerId) return;
    setCloseAndPlayIntent(null);
    setUnavailableActionNotice(
      `${closeAndPlayIntent.cardName}: the combat chain was closed, but this card still cannot be played. Check its costs and play requirements.`,
    );
  }, [
    closeAndPlayIntent,
    executePublishedCardAction,
    interactionView?.resolution,
    normalizedCardActions,
    pending,
    state.cards,
    state.combat?.open,
    state.priorityPlayerId,
    state.turnNumber,
    viewerId,
  ]);
  const instantYieldContext = useMemo(() => {
    const actions: SimulatorCardAction[] = [];
    const commands = new Map<string, FabLegalCommand>();
    const interactionActions = new Map<
      string,
      NonNullable<typeof interactionView>["actions"][number]
    >();
    const seenSources = new Set<string>();
    const controls: Record<
      string,
      { readonly actionId: string; readonly enabled: boolean; readonly disabledReason?: string }
    > = {};
    const disabledReason =
      priorityAutomationMode === "always-hold"
        ? "Unavailable while Hold every priority window is active."
        : undefined;
    const addAction = (
      sourceEntityId: string,
      label: string,
      enabled: boolean,
      target:
        | { readonly kind: "command"; readonly command: FabLegalCommand }
        | {
            readonly kind: "interaction";
            readonly action: NonNullable<typeof interactionView>["actions"][number];
          },
    ) => {
      if (seenSources.has(sourceEntityId)) return;
      seenSources.add(sourceEntityId);
      const id = `fab:instant-yield:${sourceEntityId}`;
      actions.push({
        id,
        sourceEntityId,
        label,
        detail: "Pass priority when this card's Instant uses are the only remaining actions.",
        order: normalizedCardActions.length + actions.length,
        activation: "execute",
        availability: disabledReason
          ? { kind: "disabled", reason: disabledReason, reasonCode: "always_hold" }
          : { kind: "enabled" },
      });
      controls[sourceEntityId] = { actionId: id, enabled, disabledReason };
      if (target.kind === "command") commands.set(id, target.command);
      else interactionActions.set(id, target.action);
    };

    for (const command of legalCommands ?? []) {
      if (
        command.move !== "set-automation-preferences" ||
        !command.sourceInstanceId ||
        (command.payload.addInstantYieldCardId === undefined &&
          command.payload.removeInstantYieldCardId === undefined)
      ) {
        continue;
      }
      addAction(
        command.sourceInstanceId,
        command.label,
        command.payload.removeInstantYieldCardId !== undefined,
        { kind: "command", command },
      );
    }
    for (const action of interactionView?.actions ?? []) {
      if (
        action.intent !== "custom" ||
        action.inputs.length !== 0 ||
        action.source?.kind !== "card"
      )
        continue;
      const label = resolveInteractionText(action.text);
      if (
        label !== FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldAdd &&
        label !== FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldRemove
      ) {
        continue;
      }
      addAction(
        action.source.instanceId,
        label,
        label === FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldRemove,
        { kind: "interaction", action },
      );
    }
    return { actions, commands, interactionActions, controls };
  }, [interactionView, legalCommands, normalizedCardActions.length, priorityAutomationMode]);
  const executeInstantYieldAction = useCallback(
    (actionId: string) => {
      const command = instantYieldContext.commands.get(actionId);
      const interactionAction = instantYieldContext.interactionActions.get(actionId);
      if (command) {
        onLegalCommand?.(command);
      } else if (interactionAction && interactionView && onSubmitInteraction) {
        onSubmitInteraction(
          buildInteractionSubmission({
            view: interactionView,
            action: interactionAction,
            values: {},
          }),
        );
      }
    },
    [
      instantYieldContext.commands,
      instantYieldContext.interactionActions,
      interactionView,
      onLegalCommand,
      onSubmitInteraction,
    ],
  );
  const opponentTriggerYieldCommand = (legalCommands ?? []).find(
    (command) =>
      command.move === "set-automation-preferences" &&
      command.sourceInstanceId != null &&
      typeof command.payload.addOpponentTriggerYieldCardId === "string",
  );
  const opponentTriggerYieldInteractionAction = (interactionView?.actions ?? []).find(
    (action) =>
      action.intent === "custom" &&
      action.inputs.length === 0 &&
      action.source?.kind === "card" &&
      resolveInteractionText(action.text) === FAB_AUTOMATION_PREFERENCE_LABELS.opponentYieldAdd,
  );
  const topResolutionEntry =
    combatView.stack.find((entry) => entry.order === 1) ?? combatView.stack[0];
  const opponentTriggerYieldAction = useMemo<FabOpponentTriggerYieldAction | undefined>(() => {
    const sourceInstanceId =
      opponentTriggerYieldCommand?.sourceInstanceId ??
      opponentTriggerYieldInteractionAction?.source?.instanceId;
    if (
      !sourceInstanceId ||
      !topResolutionEntry ||
      (topResolutionEntry.sourceInstanceId ?? topResolutionEntry.entity.id) !== sourceInstanceId ||
      topResolutionEntry.entity.ownerId === viewerId
    )
      return undefined;
    const canonicalId =
      (opponentTriggerYieldCommand?.payload.addOpponentTriggerYieldCardId as string | undefined) ??
      (topResolutionEntry.entity.dataAttributes?.["data-fab-canonical-id"] as string | undefined);
    return {
      sourceInstanceId,
      cardName: topResolutionEntry.entity.title,
      onConfirm: () => {
        if (opponentTriggerYieldCommand && onLegalCommand) {
          onLegalCommand(opponentTriggerYieldCommand);
        } else if (
          opponentTriggerYieldInteractionAction &&
          interactionView &&
          onSubmitInteraction
        ) {
          onSubmitInteraction(
            buildInteractionSubmission({
              view: interactionView,
              action: opponentTriggerYieldInteractionAction,
              values: {},
            }),
          );
        } else {
          return;
        }
        if (canonicalId) fabAutomationSettings.setOpponentTriggerYieldCard(canonicalId, true);
      },
    };
  }, [
    fabAutomationSettings,
    interactionView,
    onLegalCommand,
    onSubmitInteraction,
    opponentTriggerYieldCommand,
    opponentTriggerYieldInteractionAction,
    topResolutionEntry,
    viewerId,
  ]);
  const opponentTriggerYieldRemovalCommands = useMemo(() => {
    const commands = new Map<string, FabLegalCommand>();
    for (const command of legalCommands ?? []) {
      if (command.move !== "set-automation-preferences") continue;
      const canonicalId = command.payload.removeOpponentTriggerYieldCardId;
      if (typeof canonicalId === "string") commands.set(canonicalId, command);
    }
    return commands;
  }, [legalCommands]);
  const opponentTriggerYieldRemovalActions = useMemo(() => {
    const actions = new Map<string, NonNullable<typeof interactionView>["actions"][number]>();
    for (const action of interactionView?.actions ?? []) {
      const identity = fabOpponentTriggerYieldActionIdentity(action);
      if (identity?.operation === "remove") actions.set(identity.canonicalId, action);
    }
    return actions;
  }, [interactionView]);
  useEffect(() => {
    if (fabAutomationSettings.opponentTriggerYieldCardIds.size === 0) return;
    // Saved preferences can reference cards outside this match's presentation bundle.
    void presentationRegistry.ensure(
      [...fabAutomationSettings.opponentTriggerYieldCardIds].map((canonicalId) => ({
        canonicalId,
      })),
    );
  }, [fabAutomationSettings.opponentTriggerYieldCardIds, presentationRegistry]);

  const savedOpponentTriggerYields = useMemo<readonly FabSavedOpponentTriggerYield[]>(
    () =>
      [...fabAutomationSettings.opponentTriggerYieldCardIds].map((canonicalId) => ({
        canonicalId,
        cardName: nameForFabCardIdentity(canonicalId, undefined) ?? canonicalId,
        currentMatchRemovalAvailable:
          opponentTriggerYieldRemovalCommands.has(canonicalId) ||
          opponentTriggerYieldRemovalActions.has(canonicalId),
      })),
    [
      fabAutomationSettings.opponentTriggerYieldCardIds,
      nameForFabCardIdentity,
      opponentTriggerYieldRemovalActions,
      opponentTriggerYieldRemovalCommands,
    ],
  );
  const removeOpponentTriggerYield = useCallback(
    (canonicalId: string) => {
      const command = opponentTriggerYieldRemovalCommands.get(canonicalId);
      const action = opponentTriggerYieldRemovalActions.get(canonicalId);
      if (command && onLegalCommand) {
        onLegalCommand(command);
      } else if (action && interactionView && onSubmitInteraction) {
        onSubmitInteraction(
          buildInteractionSubmission({ view: interactionView, action, values: {} }),
        );
      }
      // The persisted default is always removable. If this match has no legal
      // priority window yet, its authoritative preference remains until then.
      fabAutomationSettings.setOpponentTriggerYieldCard(canonicalId, false);
    },
    [
      fabAutomationSettings,
      interactionView,
      onLegalCommand,
      onSubmitInteraction,
      opponentTriggerYieldRemovalActions,
      opponentTriggerYieldRemovalCommands,
    ],
  );
  const primaryCardContextActions = useMemo<readonly SimulatorCardAction[]>(
    () =>
      interactiveCardActions.flatMap((action, actionIndex) =>
        action.sourceEntityIds.map((sourceEntityId) => ({
          id: action.id,
          sourceEntityId,
          label: action.label,
          detail: closeAndPlayEntityByActionId.has(action.id)
            ? "Closes the combat chain, then plays this action when it becomes legal."
            : undefined,
          order: actionIndex,
          activation: "execute" as const,
          availability: action.disabledReason
            ? ({ kind: "disabled", reason: action.disabledReason } as const)
            : ({ kind: "enabled" } as const),
        })),
      ),
    [closeAndPlayEntityByActionId, interactiveCardActions],
  );
  const cardContextActions = useMemo<readonly SimulatorCardAction[]>(
    () => [...primaryCardContextActions, ...instantYieldContext.actions],
    [instantYieldContext.actions, primaryCardContextActions],
  );
  const primaryCardContextActionsByEntity = useMemo(() => {
    const byEntity = new Map<string, SimulatorCardAction[]>();
    for (const action of primaryCardContextActions) {
      const current = byEntity.get(action.sourceEntityId) ?? [];
      current.push(action);
      byEntity.set(action.sourceEntityId, current);
    }
    return byEntity;
  }, [primaryCardContextActions]);
  const cardContextActionsByEntity = useMemo(() => {
    const byEntity = new Map<string, SimulatorCardAction[]>();
    for (const action of cardContextActions) {
      const current = byEntity.get(action.sourceEntityId) ?? [];
      current.push(action);
      byEntity.set(action.sourceEntityId, current);
    }
    return byEntity;
  }, [cardContextActions]);
  const cardContextEntities = useMemo(
    () =>
      Object.values(state.cards).map((card) =>
        entityForFabViewer(card, resolvedMetadata.get(card.id), viewerId),
      ),
    [resolvedMetadata, state.cards, viewerId],
  );
  const contextStateVersionRef = useRef({ state, version: 0 });
  if (contextStateVersionRef.current.state !== state) {
    contextStateVersionRef.current = {
      state,
      version: contextStateVersionRef.current.version + 1,
    };
  }
  const unavailableCardReason = (entityId: string): string => {
    const disabledAction = normalizedCardActions.find(
      (action) => action.sourceEntityIds.includes(entityId) && action.disabledReason,
    );
    if (disabledAction?.disabledReason) return disabledAction.disabledReason;
    if (pending) return "Wait for your previous action to be confirmed, then try again.";
    if (state.priorityPlayerId !== viewerId)
      return "You don't have priority. Wait for your opponent to pass priority before acting.";
    const card = state.cards[entityId];
    if (closingCombatChain && card && isNonAttackActionCard(state.cardDefinitions[card.cardId])) {
      return "This is a non-attack action. Close the combat chain before playing it. Actions played as instants can be played while the chain is open.";
    }
    return "No action is available for this card right now. Check its play requirements and the current combat step. If it should be playable, report a bug from the match menu.";
  };
  const closeBanishedInspectorForAction = useCallback(
    (actionId: string) => {
      if (zoneInspection?.ownerId !== viewerId || zoneInspection.zone !== "banished") return;
      const action = interactiveCardActions.find((candidate) => candidate.id === actionId);
      if (!action?.sourceEntityIds.some((entityId) => state.cards[entityId]?.zone === "banished")) {
        return;
      }
      hideCardPreview();
      setZoneInspection(null);
    },
    [hideCardPreview, interactiveCardActions, state.cards, viewerId, zoneInspection],
  );
  const cardInteractions = useCardInteractionController({
    actions: interactiveCardActions,
    autoExecuteSingle: true,
    onExecute: (actionId) => {
      closeBanishedInspectorForAction(actionId);
      if (armAttackTargetSelection(actionId)) return;
      setUnavailableActionNotice(null);
      const closeAndPlayEntityId = closeAndPlayEntityByActionId.get(actionId);
      if (closeAndPlayEntityId) {
        requestCloseAndPlay(closeAndPlayEntityId);
        return;
      }
      executePublishedCardAction(actionId);
    },
    onInspect: (entity) => {
      if (readOnly || state.terminal || entity.ownerId !== viewerId) return;
      setUnavailableActionNotice(`${entity.title}: ${unavailableCardReason(entity.id)}`);
    },
  });
  const armedLocalAttackTargetDraft = armedAttackTargetActionId
    ? localAttackTargetProjection.draftByActionId.get(armedAttackTargetActionId)
    : undefined;
  const armedHostedAttackTargetAction = armedAttackTargetActionId
    ? hostedAttackTargetActions.get(armedAttackTargetActionId)
    : undefined;
  const armedLocalAttackTargetAction = useMemo(() => {
    if (!armedLocalAttackTargetDraft) return undefined;
    const sourceEntityId = armedLocalAttackTargetDraft.action.sourceEntityIds[0];
    if (!sourceEntityId) return undefined;
    const card = state.cards[sourceEntityId];
    const cardName = card ? state.cardDefinitions[card.cardId]?.name : undefined;
    return {
      id: armedLocalAttackTargetDraft.action.id,
      requestId: `fab:local-attack-target:${state.turnNumber}`,
      intent: "play-card" as const,
      text: { key: `Choose an attack target for: ${cardName ?? "this attack"}` },
      enabled: true,
      source: { kind: "card" as const, instanceId: sourceEntityId },
      inputs: [
        {
          id: "attackTarget",
          kind: "entity-selection" as const,
          role: "target" as const,
          text: { key: "Select a highlighted attack target on the board." },
          entityKinds: ["card" as const, "player" as const],
          min: 1,
          max: 1,
          ordered: false,
          candidates: [...armedLocalAttackTargetDraft.commandByTargetId.keys()].map((targetId) => ({
            entity: {
              kind: state.players.includes(targetId) ? ("player" as const) : ("card" as const),
              instanceId: targetId,
            },
            enabled: true,
          })),
        },
      ],
    };
  }, [
    armedLocalAttackTargetDraft,
    state.cardDefinitions,
    state.cards,
    state.players,
    state.turnNumber,
  ]);
  const armedAttackTargetAction = armedHostedAttackTargetAction ?? armedLocalAttackTargetAction;
  const armedAttackTargetInput =
    armedAttackTargetAction?.inputs[0]?.kind === "entity-selection"
      ? armedAttackTargetAction.inputs[0]
      : undefined;
  const armedAttackTargetView = useMemo<EngineInteractionView | undefined>(() => {
    if (!armedAttackTargetAction) return undefined;
    if (armedHostedAttackTargetAction && interactionView) return interactionView;
    return {
      protocolVersion: 2,
      gameSlug: "flesh-and-blood",
      actorId: viewerId,
      stateVersion: state.turnNumber,
      status: "choosing",
      actions: [armedAttackTargetAction],
    };
  }, [
    armedAttackTargetAction,
    armedHostedAttackTargetAction,
    interactionView,
    state.turnNumber,
    viewerId,
  ]);
  useEffect(() => {
    if (!armedAttackTargetActionId) return;
    if (armedAttackTargetAction) return;
    setArmedAttackTargetActionId(null);
  }, [armedAttackTargetAction, armedAttackTargetActionId]);
  const resolutionAction =
    interactionView?.resolution && interactionView.actorId === viewerId
      ? interactionView.actions.find((action) => action.enabled && action.intent !== "undo")
      : undefined;
  const resolutionOptionalDecision = resolutionAction
    ? optionalDecisionInteraction(resolutionAction.inputs)
    : undefined;
  const resolutionInput = resolutionOptionalDecision?.dependent ?? resolutionAction?.inputs[0];
  const directResolutionChoice =
    resolutionInput?.kind === "option-selection" && resolutionInput.presentation?.kind === "direct";
  const resolutionCandidatePresentationDefinitions = useMemo(() => {
    if (
      resolutionInput?.kind !== "entity-selection" &&
      resolutionInput?.kind !== "entity-partition" &&
      resolutionInput?.kind !== "ordering"
    ) {
      return [];
    }
    const definitions = new Map<string, FabPresentationDefinition>();
    for (const candidate of resolutionInput.candidates) {
      const definitionId = candidate.entity.definitionId;
      if (!definitionId) continue;
      const definition = state.cardDefinitions[definitionId];
      const canonicalId = definition?.presentationCanonicalId ?? definitionId;
      const name = resolveInteractionText(candidate.text ?? { key: definitionId });
      definitions.set(canonicalId, {
        canonicalId,
        name: definition?.presentationName ?? definition?.name ?? name,
        slug: definition?.slug,
      });
    }
    return [...definitions.values()];
  }, [resolutionInput, state.cardDefinitions]);
  useFabCardPresentation(
    resolutionCandidatePresentationDefinitions,
    `${interactionView?.stateVersion ?? "idle"}:${interactionView?.resolution?.currentEffect.id ?? "none"}`,
  );
  const previewOrderedCandidate = useCallback(
    (input: EntityPartitionInput, entityId: string) => {
      const candidate = input.candidates.find(
        (possibleCandidate) => possibleCandidate.entity.instanceId === entityId,
      );
      const candidateName = resolveInteractionText(candidate?.text ?? { key: entityId });
      const candidateDefinitionId = candidate?.entity.definitionId;
      const metadata =
        resolvedMetadata.get(entityId) ??
        (candidateDefinitionId
          ? (interactionCandidateMetadataByDefinitionId.get(candidateDefinitionId) ?? {
              canonicalId: candidateDefinitionId,
              name: candidateName,
              type: "card",
              imageUrl: resolveFabCardArt({
                locale,
                canonicalId: candidateDefinitionId,
                name: candidateName,
              }).printedImageUrl,
            })
          : undefined);
      if (!metadata) return;
      const card = state.cards[entityId];
      setCardHover(
        card
          ? entityForFabPresentationCard(card, metadata, {
              kind: "explicit",
              reveal: true,
            })
          : entityFor(
              entityId,
              metadata,
              interactionView?.resolution?.actingPlayerId ?? viewerId,
              true,
            ),
      );
    },
    [
      interactionCandidateMetadataByDefinitionId,
      interactionView?.resolution?.actingPlayerId,
      locale,
      resolveFabCardArt,
      resolvedMetadata,
      setCardHover,
      state.cards,
      viewerId,
    ],
  );
  const resolutionTitle = interactionView?.resolution
    ? resolveInteractionText(interactionView.resolution.currentEffect.text)
    : undefined;
  const simultaneousTriggerOrderingInput =
    resolutionInput?.kind === "ordering" &&
    resolutionInput.entityKind === "effect" &&
    resolutionTitle?.startsWith("Order your simultaneous triggered abilities")
      ? resolutionInput
      : undefined;
  const simultaneousTriggerFirstPlayerActive =
    resolutionInput?.kind === "option-selection" &&
    resolutionTitle?.startsWith("Choose the first player to add simultaneous triggers");
  const pitchStackOrderingInput =
    resolutionInput?.kind === "ordering" &&
    resolutionInput.entityKind === "card" &&
    resolutionInput.candidates.length > 1 &&
    resolutionInput.candidates.every(
      (candidate) => state.cards[candidate.entity.instanceId]?.zone === "pitch",
    )
      ? resolutionInput
      : undefined;
  const boardOrderingActive = Boolean(simultaneousTriggerOrderingInput || pitchStackOrderingInput);
  const spatialArsenalChoice =
    resolutionInput?.kind === "entity-selection" &&
    resolutionInput.candidates.length > 0 &&
    resolutionInput.candidates.every(
      (candidate) =>
        candidate.entity.ownerId === viewerId &&
        candidate.entity.zoneId?.split(":").at(-1) === "arsenal" &&
        state.cards[candidate.entity.instanceId]?.zone === "arsenal",
    );
  const focusedChoiceInput =
    resolutionInput?.kind === "entity-selection" &&
    !spatialArsenalChoice &&
    resolutionInput.role === "target" &&
    resolutionInput.candidates.length > 0 &&
    resolutionInput.candidates.every(
      (candidate) =>
        candidate.entity.zoneId === resolutionInput.candidates[0]?.entity.zoneId &&
        isFabFocusedChoiceZone(candidate.entity.zoneId?.split(":").at(-1)),
    )
      ? resolutionInput
      : undefined;
  const focusedChoiceZoneId =
    focusedChoiceInput?.candidates[0]?.entity.zoneId ?? `${viewerId}:deck`;
  const focusedChoiceZoneValue = focusedChoiceZoneId.split(":").at(-1);
  const focusedChoiceZone: FabFocusedChoiceZone = isFabFocusedChoiceZone(focusedChoiceZoneValue)
    ? focusedChoiceZoneValue
    : "deck";
  const focusedChoiceOwnerId = focusedChoiceInput?.candidates[0]?.entity.ownerId ?? viewerId;
  const focusedChoiceEntities = useMemo(() => {
    if (!focusedChoiceInput) return [];
    return focusedChoiceInput.candidates.flatMap((candidate) => {
      const instanceId = candidate.entity.instanceId;
      const definitionId = candidate.entity.definitionId;
      const definition = definitionId ? state.cardDefinitions[definitionId] : undefined;
      const name = resolveInteractionText(candidate.text ?? { key: instanceId });
      const metadata: FabCardMetadata = {
        canonicalId: definition?.presentationCanonicalId ?? definitionId,
        name,
        type: definition?.cardType ?? "card",
        typeLine: definition?.typeLine,
        printedText: definition?.printedText,
        imageUrl:
          definition?.imageUrl ??
          resolveFabCardArt({ canonicalId: definitionId, name, locale }).printedImageUrl,
        pitchValue: definition?.pitchValue,
        cost: definition?.cost,
        power: definition?.power,
        defense: definition?.defense,
        isBloodDebt: definition?.isBloodDebt,
      };
      const card = state.cards[instanceId];
      const entity = card
        ? entityForFabPresentationCard(
            card,
            metadata,
            { kind: "explicit", reveal: true },
            { frame: "tactical", art },
          )
        : entityFor(instanceId, metadata, candidate.entity.ownerId ?? viewerId, true, {
            frame: "tactical",
            art,
          });
      return [
        {
          ...entity,
          dataAttributes: {
            ...entity.dataAttributes,
            "data-zone-id": candidate.entity.zoneId ?? focusedChoiceZoneId,
          },
        },
      ];
    });
  }, [
    focusedChoiceInput,
    focusedChoiceZoneId,
    state.cardDefinitions,
    state.cards,
    viewerId,
    locale,
    art,
  ]);
  const focusedChoiceTable = useMemo<SimulatorTable>(
    () => ({
      status: {
        activeSeatId: state.activePlayerId ?? viewerId,
        phase: state.phase,
        turn: state.turnNumber,
        stateVersion: interactionView?.stateVersion ?? 0,
      },
      seats: [],
      zones: focusedChoiceInput
        ? [
            {
              id: focusedChoiceZoneId,
              label: FAB_FOCUSED_CHOICE_ZONE_META[focusedChoiceZone].label,
              role: FAB_FOCUSED_CHOICE_ZONE_META[focusedChoiceZone].role,
              ownerId: focusedChoiceOwnerId,
              visibility:
                focusedChoiceZone === "deck" || focusedChoiceZone === "arsenal"
                  ? "owner"
                  : "public",
              entityIds: focusedChoiceEntities.map((entity) => entity.id),
              count: focusedChoiceEntities.length,
              hint: focusedChoiceZone,
              layoutHint: "grid",
            },
          ]
        : [],
    }),
    [
      focusedChoiceEntities,
      focusedChoiceInput,
      focusedChoiceOwnerId,
      focusedChoiceZone,
      focusedChoiceZoneId,
      interactionView?.stateVersion,
      state.activePlayerId,
      state.phase,
      state.turnNumber,
      viewerId,
    ],
  );
  const submitSimultaneousTriggerOrder = useCallback(
    (engineOrder: readonly string[]) => {
      if (
        !interactionView ||
        !resolutionAction ||
        !simultaneousTriggerOrderingInput ||
        !onSubmitInteraction
      ) {
        return;
      }
      onSubmitInteraction(
        buildInteractionSubmission({
          view: interactionView,
          action: resolutionAction,
          values: { [simultaneousTriggerOrderingInput.id]: [...engineOrder] },
        }),
      );
    },
    [interactionView, onSubmitInteraction, resolutionAction, simultaneousTriggerOrderingInput],
  );
  const submitPitchStackDrawOrder = useCallback(
    (drawOrder: readonly string[]) => {
      if (
        !interactionView ||
        !resolutionAction ||
        !pitchStackOrderingInput ||
        !onSubmitInteraction
      ) {
        return;
      }
      // The engine stores deck-bottom order deepest first. The board presents
      // the inverse: the first pitched card the player will eventually draw.
      onSubmitInteraction(
        buildInteractionSubmission({
          view: interactionView,
          action: resolutionAction,
          values: { [pitchStackOrderingInput.id]: [...drawOrder].reverse() },
        }),
      );
    },
    [interactionView, onSubmitInteraction, pitchStackOrderingInput, resolutionAction],
  );
  const identityForCard = useCallback(
    (instanceId: string, _label: string) => ({
      canonicalId: state.cards[instanceId]?.cardId,
      printingId: state.cards[instanceId]?.printingId,
    }),
    [state.cards],
  );
  const pitchStackPitchValueForCard = useCallback(
    (instanceId: string) => resolvedMetadata.get(instanceId)?.pitchValue,
    [resolvedMetadata],
  );
  const spatialSelectionInput =
    armedAttackTargetInput ??
    (resolutionInput?.kind === "entity-selection" ? resolutionInput : undefined);
  const spatialCandidateIdByEntityId = useMemo(() => {
    const candidates = new Map<string, string>();
    if (!spatialSelectionInput) return candidates;
    for (const candidate of spatialSelectionInput.candidates) {
      const candidateId = candidate.entity.instanceId;
      // Hero-target decisions are expressed in the rules engine as seat ids;
      // the tabletop's clickable representation is the hero card in that
      // seat. Keep the engine id as the submitted value while projecting the
      // legal state onto the visible card.
      const boardEntityId =
        Object.values(state.cards).find(
          (card) => card.ownerId === candidateId && card.zone === "hero",
        )?.id ?? candidateId;
      candidates.set(boardEntityId, candidateId);
    }
    return candidates;
  }, [spatialSelectionInput, state.cards]);
  const spatialCandidateIds = useMemo(
    () => new Set(spatialCandidateIdByEntityId.keys()),
    [spatialCandidateIdByEntityId],
  );
  const selectedSpatialCandidateIds = useMemo(() => {
    if (!spatialSelectionInput) return new Set<string>();
    const value = interactionValues[spatialSelectionInput.id];
    const selectedCandidateIds = new Set(Array.isArray(value) ? value : []);
    return new Set(
      [...spatialCandidateIdByEntityId].flatMap(([entityId, candidateId]) =>
        selectedCandidateIds.has(candidateId) ? [entityId] : [],
      ),
    );
  }, [interactionValues, spatialCandidateIdByEntityId, spatialSelectionInput]);
  const visibleHandIds = useMemo(
    () =>
      new Set(
        Object.values(state.cards)
          .filter((card) => card.ownerId === viewerId && card.zone === "hand")
          .map((card) => card.id),
      ),
    [state.cards, viewerId],
  );
  const visibleArsenalIds = useMemo(
    () =>
      new Set(
        Object.values(state.cards)
          .filter((card) => card.ownerId === viewerId && card.zone === "arsenal")
          .map((card) => card.id),
      ),
    [state.cards, viewerId],
  );
  const visibleCombatChainIds = useMemo(
    () =>
      new Set([
        ...(stagedCombatView.attacker ? [stagedCombatView.attacker.entity.id] : []),
        ...stagedCombatView.defenders.map((card) => card.entity.id),
        ...stagedCombatView.reactions.map((card) => card.entity.id),
      ]),
    [stagedCombatView.attacker, stagedCombatView.defenders, stagedCombatView.reactions],
  );
  const visibleInteractionEntityIds = useMemo(
    () =>
      new Set([
        ...visibleHandIds,
        ...visibleArsenalIds,
        ...visibleCombatChainIds,
        ...(armedAttackTargetInput ? spatialCandidateIds : []),
        // The shared prompt receives engine ids, while the tabletop projects a
        // hero target onto its visible hero card. Mark those seat ids as
        // spatial so the prompt directs the player to the highlighted hero
        // instead of opening a card drawer that cannot render a player.
        ...[...spatialCandidateIdByEntityId].flatMap(([entityId, candidateId]) =>
          entityId === candidateId ? [] : [candidateId],
        ),
      ]),
    [
      armedAttackTargetInput,
      spatialCandidateIdByEntityId,
      spatialCandidateIds,
      visibleArsenalIds,
      visibleCombatChainIds,
      visibleHandIds,
    ],
  );
  const hasActionableHandCandidates = useMemo(
    () => [...spatialCandidateIds].some((entityId) => visibleHandIds.has(entityId)),
    [spatialCandidateIds, visibleHandIds],
  );
  const promptActive = interactionView?.resolution !== undefined || armedAttackTargetAction != null;
  const interactionStateFor = useCallback<CardInteractionStateResolver>(
    (entity) => {
      if (defenseStagingActive && defenseCandidateIds.has(entity.id)) {
        return stagedDefenseIds.includes(entity.id)
          ? { kind: "selected", actionCount: 1 }
          : { kind: "actionable", actionCount: 1 };
      }
      if (!promptActive) return cardInteractions.stateFor(entity);
      if (spatialCandidateIds.has(entity.id)) {
        if (selectedSpatialCandidateIds.has(entity.id)) {
          return { kind: "selected", actionCount: 1 };
        }
        return { kind: "actionable", actionCount: 1 };
      }
      return { kind: "idle" };
    },
    [
      cardInteractions,
      defenseCandidateIds,
      defenseStagingActive,
      promptActive,
      selectedSpatialCandidateIds,
      spatialCandidateIds,
      stagedDefenseIds,
    ],
  );
  const onCardSelect = useCallback(
    (entity: SimulatorEntity) => {
      if (defenseStagingActive && defenseCandidateIds.has(entity.id)) {
        setStagedDefenseIds((current) => {
          const next = current.includes(entity.id)
            ? current.filter((id) => id !== entity.id)
            : [...current, entity.id];
          return next.length === 0 || canStageDefenseSelection(next) ? next : current;
        });
        return;
      }
      if (!promptActive) {
        cardInteractions.activate(entity);
        return;
      }
      if (armedAttackTargetAction && armedAttackTargetInput) {
        const targetId = spatialCandidateIdByEntityId.get(entity.id);
        if (!targetId) return;
        setArmedAttackTargetActionId(null);
        hideCardPreview();
        const localCommand = armedLocalAttackTargetDraft?.commandByTargetId.get(targetId);
        if (localCommand) {
          onLegalCommand?.(localCommand);
          return;
        }
        if (armedHostedAttackTargetAction && armedAttackTargetView && onSubmitInteraction) {
          onSubmitInteraction(
            buildInteractionSubmission({
              view: armedAttackTargetView,
              action: armedHostedAttackTargetAction,
              values: { [armedAttackTargetInput.id]: [targetId] },
            }),
          );
        }
        return;
      }
      if (
        !interactionView ||
        !resolutionAction ||
        resolutionInput?.kind !== "entity-selection" ||
        !spatialCandidateIds.has(entity.id)
      ) {
        return;
      }
      hideCardPreview();
      if (interactionCommitMode(resolutionInput, FAB_INTERACTION_COMMIT_POLICY) === "confirm") {
        const currentValue = interactionValues[resolutionInput.id];
        const candidateId = spatialCandidateIdByEntityId.get(entity.id) ?? entity.id;
        const currentSelection = Array.isArray(currentValue) ? currentValue : [];
        const nextSelection = currentSelection.includes(candidateId)
          ? currentSelection.filter((instanceId) => instanceId !== candidateId)
          : [...currentSelection.slice(0, Math.max(0, resolutionInput.max - 1)), candidateId];
        setInteractionValues((current) => ({
          ...current,
          [resolutionInput.id]: nextSelection,
        }));
        return;
      }
      onSubmitInteraction?.(
        buildInteractionSubmission({
          view: interactionView,
          action: resolutionAction,
          values: {
            ...(resolutionOptionalDecision
              ? { [resolutionOptionalDecision.decision.id]: true }
              : {}),
            [resolutionInput.id]: [spatialCandidateIdByEntityId.get(entity.id) ?? entity.id],
          },
        }),
      );
    },
    [
      cardInteractions,
      armedAttackTargetAction,
      armedAttackTargetInput,
      armedAttackTargetView,
      armedHostedAttackTargetAction,
      armedLocalAttackTargetDraft,
      defenseCandidateIds,
      defenseStagingActive,
      canStageDefenseSelection,
      hideCardPreview,
      interactionView,
      interactionValues,
      onSubmitInteraction,
      onLegalCommand,
      promptActive,
      resolutionAction,
      resolutionInput,
      resolutionOptionalDecision,
      spatialCandidateIds,
      spatialCandidateIdByEntityId,
    ],
  );

  const declareDefense = useCallback(() => {
    if (stagedDefenseIds.length === 0 && defenderHasAvailableCards && !confirmingNoDefense) {
      setConfirmingNoDefense(true);
      return;
    }
    setConfirmingNoDefense(false);
    if (defenseAction && defenseInput && interactionView && onSubmitInteraction) {
      onSubmitInteraction(
        buildInteractionSubmission({
          view: interactionView,
          action: defenseAction,
          values: { [defenseInput.id]: [...stagedDefenseIds] },
        }),
      );
      return;
    }
    if (stagedDefenseCommand) {
      stagedDefenseCommand.submit();
      return;
    }
    if (stagedDefenseIds.length > 0) return;
    // Passing with no cards is the legal declaration of no defenders. The engine
    // remains authoritative for the subsequent priority transition.
    onPassPriority?.();
  }, [
    confirmingNoDefense,
    defenderHasAvailableCards,
    defenseAction,
    defenseInput,
    interactionView,
    onSubmitInteraction,
    onLegalCommand,
    onPassPriority,
    stagedDefenseCommand,
    stagedDefenseIds,
  ]);
  const retractStagedDefender = useCallback((instanceId: string) => {
    setStagedDefenseIds((current) => current.filter((id) => id !== instanceId));
  }, []);

  const onDesktopHandCardSelect = useCallback(
    (entity: SimulatorEntity) => {
      onCardSelect(entity);
      closeDesktopCardPreviewAfterAction();
    },
    [closeDesktopCardPreviewAfterAction, onCardSelect],
  );

  const clearCardInteraction = cardInteractions.clear;
  useEffect(() => {
    if (!promptActive) return;
    clearCardInteraction();
    hideCardPreview();
  }, [clearCardInteraction, hideCardPreview, promptActive]);

  const dispatch = (action: FabPresentationAction) => {
    if (controlsDisabled) return;
    onAction?.(action);
  };

  const pageOwnedActions = activity ?? matchActions ?? replayControls ?? null;
  const useDefaultDock =
    pageOwnedActions == null && onAction != null && !readOnly && !state.terminal;

  const opponentPlayer = buildPlayerState(state, opponentId);
  const selfPlayer = buildPlayerState(state, viewerId);
  const presentedSelfPlayer = selfPlayer;
  const boardEffects = useMemo(
    () => groupFabBoardEffects(state, viewerId, opponentId),
    [opponentId, state.activeEffects, viewerId],
  );
  const effectSourceArt = useMemo(() => {
    const effectArt = new Map<string, FabEffectSourceArt>();
    for (const effect of state.activeEffects) {
      const sourceCard = effect.sourceEntityId ? state.cards[effect.sourceEntityId] : undefined;
      if (sourceCard) {
        const sourceIsPrivate =
          (sourceCard.zone === "hand" ||
            sourceCard.zone === "deck" ||
            sourceCard.zone === "arsenal") &&
          sourceCard.ownerId !== viewerId;
        if (sourceIsPrivate || sourceCard.face === "down") continue;
      }
      const metadata = sourceCard ? resolvedMetadata.get(sourceCard.id) : undefined;
      const resolved = resolveFabCardArt({
        locale,
        canonicalId: metadata?.canonicalId ?? effect.sourceCanonicalId,
        printingId: sourceCard?.printingId,
        name: metadata?.name ?? effect.sourceLabel,
      });
      const src = resolved.boardImageUrl ?? resolved.printedImageUrl;
      if (src) {
        const previewMetadata = metadata ?? {
          canonicalId: effect.sourceCanonicalId,
          name: effect.sourceLabel,
          type: "Token",
        };
        effectArt.set(effect.id, {
          src,
          variant: "no-text",
          previewEntity: sourceCard
            ? entityForFabViewer(sourceCard, metadata, viewerId, { frame: "tactical", art })
            : entityFor(
                `active-effect-source:${effect.id}`,
                previewMetadata,
                effect.controllerId,
                true,
              ),
        });
      }
    }
    return effectArt;
  }, [resolvedMetadata, state.activeEffects, state.cards, viewerId, locale]);
  const openEffectsInspector = useCallback((anchor: HTMLElement) => {
    setEffectsInspectorAnchor(anchor);
  }, []);

  const defenderLabel = combatView.attacker
    ? combatView.attacker.entity.ownerId === viewerId
      ? "Opponent"
      : "You"
    : combatView.defendingPlayerId
      ? combatView.defendingPlayerId === viewerId
        ? "You"
        : "Opponent"
      : undefined;
  const priorityLabel =
    state.priorityPlayerId == null
      ? null
      : state.priorityPlayerId === viewerId
        ? "You"
        : "Opponent";
  const interactionActorOwner =
    interactionActorPlayerId == null
      ? "none"
      : interactionActorPlayerId === viewerId
        ? "self"
        : "opponent";
  const scopedLegalCommands = legalCommands ?? [];
  const hasScopedLegality = legalCommands != null;
  const canUseMobilePass = Boolean(
    onPassPriority &&
    (state.priorityPlayerId === viewerId || defenseStagingActive) &&
    (!onLocalPassPriority && onSubmitInteraction
      ? serverPassAction != null
      : !hasScopedLegality || scopedLegalCommands.some((command) => command.move === "pass")),
  );
  const passCommand = scopedLegalCommands.find((command) => command.move === "pass");
  const stackPassAction = interactionView?.actions.find(
    (action) =>
      action.enabled &&
      action.intent === "pass" &&
      action.inputs.length === 0 &&
      (!onLocalPassPriority && onSubmitInteraction
        ? action.id === serverPassAction?.id
        : passCommand != null && resolveInteractionText(action.text) === passCommand.label),
  );
  const stackPriorityPromptActive = Boolean(
    combatView.stack.length > 0 &&
    canUseMobilePass &&
    !interactionView?.resolution &&
    stackPassAction &&
    onSubmitInteraction,
  );
  const combatResolutionPromptActive = Boolean(
    closingCombatChain &&
    combatView.stack.length === 0 &&
    canUseMobilePass &&
    !interactionView?.resolution &&
    stackPassAction &&
    onSubmitInteraction,
  );
  const priorityPrompt = deriveFabPriorityPrompt(
    state,
    viewerId,
    combatView.stack[0]?.entity,
    isFabPassOnlyInteractionView(interactionView),
  );
  const priorityPromptActive = Boolean(
    priorityPrompt &&
    canUseMobilePass &&
    !defenseStagingActive &&
    !interactionView?.resolution &&
    stackPassAction &&
    onSubmitInteraction &&
    !readOnly,
  );
  const defensePromptAction = defenseAction ?? serverPassAction;
  const defensePromptActive = Boolean(
    defenseStagingActive && defensePromptAction && !interactionView?.resolution && !readOnly,
  );
  // CR 7.6.3a: only the turn-player may continue combat with another attack
  // during the Resolution Step. The defender may have priority here, but must
  // not be offered an attack-selection action.
  const viewerMayChooseNextAttack = state.activePlayerId === viewerId;
  const submitStackPass = useCallback(() => {
    if (!interactionView || !stackPassAction || !onSubmitInteraction) return;
    onSubmitInteraction(
      buildInteractionSubmission({
        view: interactionView,
        action: stackPassAction,
        values: {},
      }),
    );
  }, [interactionView, onSubmitInteraction, stackPassAction]);
  // ── The holding-modes priority countdown gate ──
  // The stop-point doctrine (defense declaration, terminal Action-Phase
  // window, the attacker's chain close at Resolution) is computed once by
  // the engine and projected as `state.priorityManualOnly`; the countdown
  // never arms on a manual-only window. Pass-only-ness still folds the
  // interaction view's own action list (the engine's projected legal
  // commands): every substantive action must be an enabled, input-less
  // pass/concede — settings toggles project as sourceless `custom` actions
  // and are skipped, exactly like the engine's player-only filter. Both
  // holding modes gate here: always-hold on every window, play-and-skip on
  // response windows (its own follow-up windows are engine-skipped before a
  // view ever reaches the client); auto-pass windows are engine-drained and
  // never count down.
  const priorityCountdownWindowEligible =
    holdsPassOnlyWindows(priorityAutomationMode) &&
    !readOnly &&
    !state.terminal &&
    state.priorityPlayerId === viewerId &&
    !controlsDisabled &&
    !state.priorityManualOnly &&
    isFabPassOnlyInteractionView(interactionView);
  const priorityCountdownPassAction = priorityCountdownWindowEligible
    ? fabPassInteractionAction(interactionView)
    : null;
  const priorityCountdownWindowKey =
    priorityCountdownPassAction && interactionView
      ? `${viewerId}:${interactionView.stateVersion}:${priorityCountdownPassAction.requestId}`
      : null;
  // Expiry re-validation reads the *current* render's state through the
  // hook's refs; nothing captured at arm time is trusted at expiry.
  const priorityCountdownStillEligible = useCallback(() => {
    if (!interactionView) return false;
    return (
      holdsPassOnlyWindows(priorityAutomationMode) &&
      !readOnly &&
      !state.terminal &&
      state.priorityPlayerId === viewerId &&
      !controlsDisabled &&
      !state.priorityManualOnly &&
      fabPassInteractionAction(interactionView) != null &&
      isFabPassOnlyInteractionView(interactionView)
    );
  }, [
    combatView.open,
    combatView.stack.length,
    controlsDisabled,
    interactionView,
    priorityAutomationMode,
    readOnly,
    state.priorityManualOnly,
    state.priorityPlayerId,
    state.terminal,
    viewerId,
  ]);
  const submitPriorityCountdownPass = useCallback(() => {
    if (interactionView && onSubmitInteraction) {
      const action = fabPassInteractionAction(interactionView);
      if (action) {
        onSubmitInteraction(
          buildInteractionSubmission({ view: interactionView, action, values: {} }),
        );
        return;
      }
    }
    onPassPriority?.();
  }, [interactionView, onPassPriority, onSubmitInteraction]);
  const priorityCountdownDurationMs =
    FAB_COUNTDOWN_SPEED_MS[fabAutomationSettings.countdownSpeed] ??
    FAB_PRIORITY_COUNTDOWN_FALLBACK_MS;
  const priorityCountdown = useFabPriorityCountdown({
    armed: priorityCountdownWindowEligible && priorityCountdownPassAction != null,
    windowKey: priorityCountdownWindowKey,
    durationMs: priorityCountdownDurationMs,
    isStillEligible: priorityCountdownStillEligible,
    onSubmitPass: submitPriorityCountdownPass,
  });
  // An attack-layer opens combat before it resolves (CR 7.0.2a). During that
  // Layer Step, the combat chain is the canonical context for the pending
  // attack; showing it again as a generic resolution stack makes the player
  // appear to be in two unrelated states at once. Responses above the attack
  // stay on the resolution stack because they remain the next layer to resolve.
  const attackLayerInCombat = combatView.pendingAttack !== null;
  const presentedResolutionStack =
    attackLayerInCombat && combatView.stack.length === 1 ? [] : combatView.stack;
  useEffect(() => {
    if (stagedCombatView.mode === "closed") setCombatOverlayMinimized(false);
  }, [stagedCombatView.mode]);
  const canUseMobileEndTurn = Boolean(
    state.activePlayerId === viewerId &&
    (onEndTurn
      ? canEndTurn !== false &&
        (!onLocalEndTurn && onSubmitInteraction
          ? serverEndTurnAction != null
          : !hasScopedLegality ||
            scopedLegalCommands.some((command) => command.move === "end-turn"))
      : useDefaultDock),
  );
  const opponentHeroDefinition = opponentPlayer.heroCardId
    ? state.cardDefinitions[state.cards[opponentPlayer.heroCardId]?.cardId ?? ""]
    : undefined;
  const selfHeroDefinition = selfPlayer.heroCardId
    ? state.cardDefinitions[state.cards[selfPlayer.heroCardId]?.cardId ?? ""]
    : undefined;
  const localPracticeIdentityFor = (playerId: string, heroName: string | undefined) => {
    if (!localPractice) return undefined;
    if (playerId === localPractice.humanPlayerId) {
      return {
        kind: "human" as const,
        heroName,
        deckLabel: localPractice.humanDeckLabel,
        controlLabel:
          localPractice.mode === "self"
            ? playerId === viewerId
              ? "Player 1 · controlled by you"
              : "Player 1 · waiting"
            : playerId === viewerId
              ? "Controlled by you · local"
              : "Your seat · waiting",
      };
    }
    if (playerId === localPractice.botPlayerId) {
      return {
        kind: localPractice.mode === "self" ? ("human" as const) : ("bot" as const),
        heroName,
        deckLabel: localPractice.botDeckLabel,
        controlLabel:
          localPractice.mode === "self"
            ? playerId === viewerId
              ? "Player 2 · controlled by you"
              : "Player 2 · waiting"
            : playerId === viewerId
              ? "Controlled by you · bot paused"
              : localPractice.botStrategyLabel
                ? `Automated · ${localPractice.botStrategyLabel}`
                : "Automation off",
      };
    }
    return undefined;
  };
  const selfLocalIdentity = localPracticeIdentityFor(viewerId, selfHeroDefinition?.name);
  const opponentLocalIdentity = localPracticeIdentityFor(opponentId, opponentHeroDefinition?.name);
  const interactionTextFor = (text: string) => {
    const participantName = participantPresentation?.[text]?.displayName;
    if (participantName) return participantName;
    if (localPractice?.humanPlayerId === text)
      return localPractice.mode === "self" ? "Player 1" : "You";
    if (localPractice?.botPlayerId === text)
      return localPractice.mode === "self" ? "Player 2" : "Practice bot";
    return text;
  };
  const referencedEffectSource = useMemo(() => {
    const interactionSource = interactionView?.resolution?.currentEffect.source;
    const sourceId = interactionSource?.instanceId;
    const stackEntryId = stackPriorityPromptActive ? combatView.stack[0]?.entity.id : undefined;
    const cardId = sourceId ?? stackEntryId;
    if (!cardId) return undefined;
    const card = state.cards[cardId];
    const definitionId = interactionSource?.definitionId ?? card?.cardId;
    const metadata =
      (card ? resolvedMetadata.get(card.id) : undefined) ??
      (definitionId ? interactionCandidateMetadataByDefinitionId.get(definitionId) : undefined);
    if (!metadata) return undefined;
    return {
      entity: card
        ? entityForFabPresentationCard(card, metadata, { kind: "explicit", reveal: true })
        : entityFor(cardId, metadata, interactionSource?.ownerId ?? viewerId, true),
      printedText: metadata.printedText?.replace(/\r?\n{2,}/g, "\n"),
    };
  }, [
    combatView.stack,
    interactionCandidateMetadataByDefinitionId,
    interactionView?.resolution?.currentEffect.source,
    resolvedMetadata,
    stackPriorityPromptActive,
    state.cards,
    viewerId,
  ]);
  const referencedEffectEntity = referencedEffectSource?.entity;
  // The chooser names the card whose effect is asking so players can hover it
  // for a preview and read its text without leaving the decision.
  const focusedChoiceLocation = focusedChoiceInput
    ? focusedChoiceZone === "deck"
      ? focusedChoiceOwnerId === viewerId
        ? "your deck"
        : "the opposing deck"
      : `${focusedChoiceOwnerId === viewerId ? "your" : "the opposing"} ${FAB_FOCUSED_CHOICE_ZONE_META[focusedChoiceZone].label.toLowerCase()}`
    : undefined;
  const focusedChoiceFallbackTitle =
    focusedChoiceZone === "deck"
      ? "Search your deck"
      : `Choose from ${
          focusedChoiceOwnerId === viewerId ? "your" : "the opposing"
        } ${FAB_FOCUSED_CHOICE_ZONE_META[focusedChoiceZone].label.toLowerCase()}`;
  const focusedChoiceModal = focusedChoiceInput
    ? {
        title: referencedEffectEntity?.title ?? focusedChoiceFallbackTitle,
        description:
          focusedChoiceLocation && referencedEffectEntity
            ? focusedChoiceInput.max === 1
              ? `Choose the card this effect requires from ${focusedChoiceLocation}.`
              : `Choose up to ${focusedChoiceInput.max} cards for this effect from ${focusedChoiceLocation}.`
            : focusedChoiceInput.max === 1
              ? "Choose the card required by this effect."
              : `Choose up to ${focusedChoiceInput.max} cards for this effect.`,
        filter: {
          kind: "entity" as const,
          entityKind: "card" as const,
          ownerId: focusedChoiceOwnerId,
          zoneId: focusedChoiceZoneId,
          includeHidden: true,
        },
        table: focusedChoiceTable,
        entities: focusedChoiceEntities,
        emptyLabel: "No cards can be chosen from this zone",
        autoOpen: true,
        duplicateFilter:
          focusedChoiceZone === "deck" ? FAB_DECK_SEARCH_DUPLICATE_FILTER : undefined,
        renderPreview: (entity: SimulatorEntity) =>
          isMobile ? (
            <FabMobileChoicePreview
              key={entity.id}
              entity={entity}
              candidates={focusedChoiceEntities}
            />
          ) : (
            <FabCardPreviewSurface entity={entity} />
          ),
        renderTitle: referencedEffectEntity
          ? () => <FabEffectTitleReference entity={referencedEffectEntity} />
          : undefined,
        toolbarNote: referencedEffectSource?.printedText ? (
          <p
            className="min-w-0 flex-1 self-center overflow-y-auto whitespace-pre-line text-xs leading-snug text-[var(--board-muted,rgba(216,229,247,0.78))]"
            data-testid="fab-choice-source-text"
          >
            <FabSymbolText text={referencedEffectSource.printedText} />
          </p>
        ) : undefined,
        classNames: FAB_ZONE_MODAL_CLASS_NAMES,
      }
    : undefined;
  const optionalPaymentPromptActive = Boolean(
    interactionView?.actions.some(
      (action) =>
        action.inputs.some((input) => input.kind === "boolean") &&
        action.inputs.some((input) => input.kind === "entity-selection" && input.role === "cost"),
    ),
  );
  const cycleCombatOverlayPlacement = () => {
    setCombatOverlayPlacement((current) =>
      current === "center" ? "top" : current === "top" ? "bottom" : "center",
    );
  };
  const detailedStackVisible = presentedResolutionStack.length >= 4;
  const stackContext = detailedStackVisible ? (
    <FabSidebarResolutionStack stack={presentedResolutionStack} viewerId={viewerId} />
  ) : null;
  const matchContext =
    stackContext || matchNotice ? (
      <>
        {matchNotice}
        {stackContext}
      </>
    ) : undefined;

  const sidebarProps = {
    state,
    viewerId,
    opponentId,
    self: {
      playerId: viewerId,
      life: selfPlayer.life,
      resourcePoints: selfPlayer.resourcePoints,
      actionPoints: selfPlayer.actionPoints,
      intellect: state.intellect?.[viewerId],
      localPractice: selfLocalIdentity,
      displayName: participantPresentation?.[viewerId]?.displayName,
      subscriptionTier: participantPresentation?.[viewerId]?.subscriptionTier,
      rankedMmr: participantPresentation?.[viewerId]?.rankedMmr,
      heroName: selfHeroDefinition?.name,
      clock: participantPresentation?.[viewerId]?.clock,
      connection: participantPresentation?.[viewerId]?.connection,
      actions: participantPresentation?.[viewerId]?.actions ? (
        <div className="fab-priority-participant-actions">
          <FabPriorityAutomationQuickControl
            mode={priorityAutomationMode}
            holdArmed={priorityHoldArmed}
            autoOrderTriggers={fabAutomationSettings.autoOrderTriggers}
            autoSelectSingletonTargets={fabAutomationSettings.autoSelectSingletonTargets}
            disabledReason={priorityAutomationDisabledReason}
            scopedAutoPass={scopedAutoPass}
            scopeContext={scopeContext}
            onArmScope={armScopeIfAllowed}
            onDisarmScope={disarmScopeIfAllowed}
            onSelectMode={setPriorityAutomationIfAllowed}
            onArmHold={armPriorityHoldIfAllowed}
            onSetAutoOrderTriggers={setAutoOrderTriggers}
            onSetAutoSelectSingletonTargets={setAutoSelectSingletonTargets}
          />
          {participantPresentation?.[viewerId]?.actions}
        </div>
      ) : undefined,
    },
    opponent: {
      playerId: opponentId,
      life: opponentPlayer.life,
      resourcePoints: opponentPlayer.resourcePoints,
      actionPoints: opponentPlayer.actionPoints,
      intellect: state.intellect?.[opponentId],
      localPractice: opponentLocalIdentity,
      displayName: participantPresentation?.[opponentId]?.displayName,
      subscriptionTier: participantPresentation?.[opponentId]?.subscriptionTier,
      rankedMmr: participantPresentation?.[opponentId]?.rankedMmr,
      heroName: opponentHeroDefinition?.name,
      clock: participantPresentation?.[opponentId]?.clock,
      connection: participantPresentation?.[opponentId]?.connection,
      actions: participantPresentation?.[opponentId]?.actions,
    },
    status,
    sidebarExtra,
    matchActions,
    spectatorReturnHref,
    activity,
    activityLogLabel,
    activityOwnsStatus,
    eventLog,
    matchHistory,
    replayControls,
    automation,
    matchContext,
    onConcede:
      onConcede ??
      (useDefaultDock
        ? () => dispatch({ type: "end_game", winnerId: opponentId, reason: "concession" })
        : undefined),
    confirmConcede,
    onOpenGameSummary,
    onUndo,
    canUndo,
    canPassPriority: combatResolutionPromptActive
      ? false
      : defenseStagingActive
        ? canDeclareDefense
        : canUseMobilePass,
    showPassPriority: !combatResolutionPromptActive,
    passPriorityLabel: persistentPassLabel,
    actionsDisabled: controlsDisabled,
  } satisfies FleshAndBloodSidebarProps;

  const persistentPassAction = combatResolutionPromptActive
    ? undefined
    : defenseStagingActive
      ? declareDefense
      : onPassPriority;
  const canUsePersistentPassAction = combatResolutionPromptActive
    ? false
    : defenseStagingActive
      ? canDeclareDefense
      : canUseMobilePass;
  useEffect(() => {
    if (
      !persistentPassAction ||
      !canUsePersistentPassAction ||
      controlsDisabled ||
      state.terminal
    ) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))
      ) {
        return;
      }
      event.preventDefault();
      persistentPassAction();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canUsePersistentPassAction, controlsDisabled, persistentPassAction, state.terminal]);
  useEffect(() => {
    if (!priorityCountdown.armed && !scopedAutoPass) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Escape" || event.repeat || event.defaultPrevented) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))
      ) {
        return;
      }
      event.preventDefault();
      if (priorityCountdown.armed) {
        priorityCountdown.cancel();
        return;
      }
      disarmScopedAutoPass();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [priorityCountdown.armed, priorityCountdown.cancel, scopedAutoPass, disarmScopedAutoPass]);
  const sidebar = <FleshAndBloodSidebar {...sidebarProps} onPassPriority={persistentPassAction} />;
  const mobilePanel = (
    <FleshAndBloodMobilePanel {...sidebarProps} onPassPriority={persistentPassAction} />
  );

  // The trigger-ordering panel answers "Order your simultaneous triggered
  // abilities"; both viewports render it (desktop previously had no answer
  // surface at all, leaving the decision permanently blocking).
  const triggerOrderingPanel = simultaneousTriggerOrderingInput ? (
    <FabTriggerOrderingPanel
      input={simultaneousTriggerOrderingInput}
      disabled={controlsDisabled}
      identityForCard={identityForCard}
      onConfirm={submitSimultaneousTriggerOrder}
      onEnableAutoOrder={
        !controlsDisabled && autoOrderTriggersConfigurationAvailable
          ? () => setAutoOrderTriggers(true)
          : undefined
      }
    />
  ) : null;

  const board = isMobile ? (
    <FabMobileBoard
      opponent={opponentPlayer}
      self={presentedSelfPlayer}
      viewerId={viewerId}
      combatView={stagedCombatView}
      cardMetadata={resolvedMetadata}
      isOpponentTurn={state.activePlayerId === opponentId}
      isSelfTurn={state.activePlayerId === viewerId}
      isOpponentPriority={state.priorityPlayerId === opponentId}
      isSelfPriority={state.priorityPlayerId === viewerId}
      interactionAgencyOwner={interactionActorOwner}
      publicTargeting={publicTargeting}
      banishedAvailableCount={availableBanishedEntityIds.size}
      graveyardAvailableCount={availableGraveyardEntityIds.size}
      defenderLabel={defenderLabel}
      priorityLabel={priorityLabel}
      actionsDisabled={controlsDisabled}
      onPassPriority={
        defenseStagingActive ? declareDefense : priorityPromptActive ? undefined : onPassPriority
      }
      priorityActionLabel={combatChainPriorityLabel}
      showDefensePrompt={defenseStagingActive && defenseCandidateIds.size > 0}
      onRetractDefender={retractStagedDefender}
      onPlayActivate={onOpenLegalActions}
      onOpenZone={setZoneInspection}
      legalCommands={legalCommands}
      onOpenLegalActions={onOpenLegalActions}
      interactionStateFor={interactionStateFor}
      onCardSelect={controlsDisabled ? undefined : onCardSelect}
      announcement={mobileAnnouncement}
      effects={boardEffects}
      onOpenEffects={openEffectsInspector}
      stackControl={
        <FabMobileStackPopover
          stack={presentedResolutionStack}
          viewerId={viewerId}
          opponentYieldAction={opponentTriggerYieldAction}
        />
      }
      resolutionOverlay={
        <>
          {triggerOrderingPanel}
          {pitchStackOrderingInput ? (
            <FabPitchStackOrderingPanel
              input={pitchStackOrderingInput}
              disabled={controlsDisabled}
              identityForCard={identityForCard}
              pitchValueForCard={pitchStackPitchValueForCard}
              onComplete={submitPitchStackDrawOrder}
            />
          ) : null}
        </>
      }
    />
  ) : (
    <div
      className="fab-board"
      data-testid="fab-board"
      data-layout="desktop"
      data-card-crop="art-square"
      data-defense-staging={defenseStagingActive ? "true" : undefined}
      data-turn-owner={state.activePlayerId === viewerId ? "self" : "opponent"}
      data-priority-owner={
        state.priorityPlayerId == null
          ? "none"
          : state.priorityPlayerId === viewerId
            ? "self"
            : "opponent"
      }
      data-agency-owner={interactionActorOwner}
    >
      <AnimationAnchor
        animationRef={simulatorBoardCenterAnimationRef}
        className="fab-animation-board-center"
      />
      {[opponentId, viewerId].map((playerId) => (
        <AnimatedZoneSlot
          key={`stack-anchor:${playerId}`}
          animationRef={{ kind: "zone", id: `${playerId}:stack`, ownerId: playerId }}
          className="fab-animation-stack-anchor"
        >
          <span aria-hidden />
        </AnimatedZoneSlot>
      ))}
      <FabTabletopHand
        player={opponentPlayer}
        viewerId={viewerId}
        side="top"
        cardMetadata={resolvedMetadata}
        revealedCards={effectiveHandReveals?.[opponentId]}
      />
      <FabActiveEffectsRail
        effects={boardEffects}
        effectSourceArt={effectSourceArt}
        onOpen={openEffectsInspector}
      />
      <PlayerBoard
        player={opponentPlayer}
        viewerId={viewerId}
        side="top"
        isTurn={state.activePlayerId === opponentId}
        hasInteractionAgency={interactionActorPlayerId === opponentId}
        isPriority={state.priorityPlayerId === opponentId}
        cardMetadata={resolvedMetadata}
        interactionStateFor={interactionStateFor}
        onCardSelect={controlsDisabled ? undefined : onCardSelect}
        onOpenZone={(zone) => setZoneInspection({ ownerId: opponentId, zone })}
        allEffects={state.activeEffects}
        deckReveal={effectiveDeckReveals?.[opponentId]}
      />
      <div className="fab-board-overlay-layer" data-testid="fab-board-overlay-layer">
        <div
          className="fab-desktop-combat-workspace"
          data-active={
            stagedCombatView.mode !== "closed" || presentedResolutionStack.length > 0
              ? "true"
              : undefined
          }
          data-placement={boardOrderingActive ? "center" : combatOverlayPlacement}
          data-minimized={combatOverlayMinimized ? "true" : "false"}
          data-testid="fab-desktop-combat-workspace"
        >
          <CombatChain
            view={stagedCombatView}
            density="desktop"
            defenderLabel={defenderLabel}
            priorityLabel={priorityLabel}
            desktopPlacement={boardOrderingActive ? "center" : combatOverlayPlacement}
            onCycleDesktopPlacement={boardOrderingActive ? undefined : cycleCombatOverlayPlacement}
            desktopMinimized={combatOverlayMinimized}
            onDesktopMinimizedChange={setCombatOverlayMinimized}
            onPassPriority={
              defenseStagingActive
                ? declareDefense
                : priorityPromptActive
                  ? undefined
                  : attackLayerInCombat
                    ? stackPriorityPromptActive
                      ? submitStackPass
                      : onPassPriority
                    : stackPriorityPromptActive
                      ? undefined
                      : onPassPriority
            }
            priorityActionLabel={combatChainPriorityLabel}
            scopedAutoPass={scopedAutoPass}
            onToggleScopePass={
              scopedAutoPass === "combat"
                ? disarmScopeIfAllowed
                : armScopeIfAllowed
                  ? () => armScopeIfAllowed("combat")
                  : undefined
            }
            showDefensePrompt={defenseStagingActive && defenseCandidateIds.size > 0}
            onRetractDefender={retractStagedDefender}
            onPlayActivate={onOpenLegalActions}
            actionsDisabled={controlsDisabled || (defenseStagingActive && !canDeclareDefense)}
            showPriorityActions={!priorityPromptActive}
            interactionStateFor={interactionStateFor}
            onCardSelect={controlsDisabled ? undefined : onCardSelect}
          />
          {!detailedStackVisible ? (
            <CompactResolutionStack
              stack={presentedResolutionStack}
              viewerId={viewerId}
              interactionMode="desktop"
              placement={boardOrderingActive ? "center" : combatOverlayPlacement}
              onCyclePlacement={boardOrderingActive ? undefined : cycleCombatOverlayPlacement}
              opponentYieldAction={opponentTriggerYieldAction}
              minimized={combatOverlayMinimized}
            />
          ) : null}
          {detailedStackVisible ? (
            <ResolutionStack
              stack={presentedResolutionStack}
              viewerId={viewerId}
              combatMode={combatView.mode}
              opponentYieldAction={opponentTriggerYieldAction}
              minimized={combatOverlayMinimized}
              onMinimizedChange={setCombatOverlayMinimized}
            />
          ) : null}
        </div>
        {triggerOrderingPanel}
        {pitchStackOrderingInput ? (
          <FabPitchStackOrderingPanel
            input={pitchStackOrderingInput}
            disabled={controlsDisabled}
            identityForCard={identityForCard}
            pitchValueForCard={pitchStackPitchValueForCard}
            onComplete={submitPitchStackDrawOrder}
          />
        ) : null}
      </div>
      <PlayerBoard
        player={presentedSelfPlayer}
        viewerId={viewerId}
        banishedAvailableCount={availableBanishedEntityIds.size}
        graveyardAvailableCount={availableGraveyardEntityIds.size}
        side="bottom"
        isTurn={state.activePlayerId === viewerId}
        hasInteractionAgency={interactionActorPlayerId === viewerId}
        isPriority={state.priorityPlayerId === viewerId}
        cardMetadata={resolvedMetadata}
        interactionStateFor={interactionStateFor}
        onCardSelect={controlsDisabled ? undefined : onCardSelect}
        onOpenZone={(zone) => setZoneInspection({ ownerId: viewerId, zone })}
        allEffects={state.activeEffects}
        deckReveal={effectiveDeckReveals?.[viewerId]}
      />
      <div className="fab-desktop-hand-area" data-testid="fab-desktop-hand-area">
        <FabTabletopHand
          player={presentedSelfPlayer}
          viewerId={viewerId}
          side="bottom"
          cardMetadata={resolvedMetadata}
          revealedCards={effectiveHandReveals?.[viewerId]}
          interactionStateFor={interactionStateFor}
          onCardSelect={controlsDisabled ? undefined : onDesktopHandCardSelect}
        />
        {spectatorReturnHref ? null : (
          <FabDesktopQuickControls
            onPassPriority={persistentPassAction}
            canPassPriority={
              defenseStagingActive
                ? canDeclareDefense
                : canUseMobilePass && !combatResolutionPromptActive
            }
            showPass={!priorityPromptActive}
            passLabel={desktopPassLabel}
            onUndo={onUndo}
            canUndo={canUndo}
            disabled={controlsDisabled || state.terminal}
            priorityCountdownActive={priorityCountdown.armed}
            priorityControlVisible={priorityCountdown.armed || scopedAutoPass != null}
            primaryActionKind={
              defenseStagingActive
                ? confirmingNoDefense
                  ? "confirm-no-defense"
                  : "declare-defense"
                : closingCombatChain
                  ? "close-chain"
                  : "pass"
            }
            priorityToggle={
              <FabPriorityAutomationControl
                mode={priorityAutomationMode}
                scopedAutoPass={scopedAutoPass}
                onDisarmScope={disarmScopeIfAllowed}
                countdown={
                  priorityCountdown.armed && priorityCountdownWindowKey
                    ? {
                        windowKey: priorityCountdownWindowKey,
                        durationMs: priorityCountdownDurationMs,
                        onCancel: priorityCountdown.cancel,
                      }
                    : undefined
                }
              />
            }
          />
        )}
      </div>
    </div>
  );

  const tabletopContent = (
    <div
      className="fab-dnd-host"
      onContextMenu={(event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (
          target.closest(
            "button, a, input, select, textarea, [data-sim-entity-id], [role='menu'], [role='menuitem'], [role='dialog']",
          )
        ) {
          return;
        }
        event.preventDefault();
        setBoardContextMenu({ x: event.clientX, y: event.clientY });
      }}
    >
      {board}
      {onOpenGameSummary ? (
        <button
          type="button"
          className="fab-board-summary-restore"
          data-testid="fab-board-summary-restore"
          onClick={onOpenGameSummary}
        >
          <BookOpenText aria-hidden="true" size={18} />
          View game summary
        </button>
      ) : null}
      <FabHandRevealRecall
        ownerId={opponentId}
        cards={effectiveHandReveals?.[opponentId]}
        cardMetadata={resolvedMetadata}
      />
      {armedAttackTargetView ||
      (interactionView &&
        (interactionView.resolution || priorityPromptActive || defensePromptActive)) ? (
        <InteractionResolutionPrompt
          mobileDraggable
          view={armedAttackTargetView ?? interactionView!}
          viewerId={viewerId}
          values={
            defensePromptActive && defenseInput
              ? { [defenseInput.id]: [...stagedDefenseIds] }
              : interactionValues
          }
          visibleEntityIds={visibleInteractionEntityIds}
          immediateOptionalSingletons={!defensePromptActive}
          instructionOnly={Boolean(
            defensePromptActive || simultaneousTriggerOrderingInput || pitchStackOrderingInput,
          )}
          decisionControls={
            defensePromptActive ? (
              <button
                type="button"
                className="fab-chain-pass-btn"
                disabled={controlsDisabled || !canDeclareDefense}
                onClick={declareDefense}
              >
                {confirmingNoDefense
                  ? "Confirm no defense"
                  : stagedDefenseIds.length === 0
                    ? "Declare no defense"
                    : "Declare defense"}
              </button>
            ) : undefined
          }
          preferredPlacement="bottom"
          reserveBottomTargetArea={defensePromptActive || hasActionableHandCandidates}
          actionId={
            armedAttackTargetAction
              ? armedAttackTargetAction.id
              : defensePromptActive
                ? defensePromptAction?.id
                : priorityPromptActive
                  ? stackPassAction?.id
                  : undefined
          }
          actionPresentation={
            armedAttackTargetAction
              ? {
                  body: "Select a highlighted attack target on the board.",
                  inlineTitle: true,
                }
              : defensePromptActive
                ? {
                    title: confirmingNoDefense ? "Declare no defense?" : "Choose your defenders",
                    body: confirmingNoDefense
                      ? "No cards are selected. Confirm to continue without declaring defenders."
                      : !defenderHasAvailableCards
                        ? "You have no available defenders. Declare no defense to continue."
                        : stagedDefenseIds.length === 0
                          ? "Select highlighted cards from your hand or equipment, or declare no defense."
                          : `${stagedDefenseIds.length} ${stagedDefenseIds.length === 1 ? "defender selected" : "defenders selected"}. Select more cards, remove a selection, or declare defense.`,
                  }
                : pitchStackOrderingInput
                  ? {
                      body: "First picked draws first. The last card is placed automatically.",
                    }
                  : priorityPromptActive
                    ? priorityPrompt
                    : referencedEffectSource?.printedText
                      ? optionalPaymentPromptActive
                        ? {
                            body: referencedEffectSource.printedText,
                            inlineTitle: true,
                          }
                        : { details: referencedEffectSource.printedText }
                      : undefined
          }
          auxiliaryAction={
            combatResolutionPromptActive &&
            viewerMayChooseNextAttack &&
            !controlsDisabled &&
            onOpenLegalActions
              ? {
                  label: "Choose next attack",
                  title: "Open legal actions without closing the combat chain.",
                  onSelect: onOpenLegalActions,
                }
              : simultaneousTriggerFirstPlayerActive &&
                  !controlsDisabled &&
                  autoOrderTriggersConfigurationAvailable
                ? {
                    label: "Auto-order",
                    title:
                      "Automatically choose the listed first player and use the listed order for simultaneous triggers. This resolves this choice now; turn it off in Game settings.",
                    onSelect: () => setAutoOrderTriggers(true),
                  }
                : resolutionInput?.kind === "entity-selection" &&
                    resolutionInput.min > 0 &&
                    resolutionInput.min === resolutionInput.max &&
                    resolutionInput.candidates.length === resolutionInput.min &&
                    !controlsDisabled &&
                    autoSelectSingletonTargetsConfigurationAvailable
                  ? {
                      label: "Auto-select",
                      title:
                        "Automatically choose the only legal target. This resolves this choice now; turn it off in Game settings.",
                      onSelect: () => setAutoSelectSingletonTargets(true),
                    }
                  : undefined
          }
          renderEffectTitle={(title) =>
            pitchStackOrderingInput ? (
              "Order pitched cards"
            ) : referencedEffectEntity && !priorityPromptActive ? (
              <FabEffectTitleReference entity={referencedEffectEntity} />
            ) : (
              <FabSymbolText text={title} />
            )
          }
          renderInstruction={(instruction) => {
            const text = interactionTextFor(instruction);
            return (
              <FabSymbolText
                text={
                  referencedEffectEntity && !priorityPromptActive
                    ? effectInstructionWithoutSource(text, referencedEffectEntity.title)
                    : text
                }
              />
            );
          }}
          renderText={(text) => <FabSymbolText text={interactionTextFor(text)} />}
          choiceModal={focusedChoiceModal}
          onChange={(inputId, value) =>
            setInteractionValues((current) => ({ ...current, [inputId]: value }))
          }
          onClear={() => setInteractionValues({})}
          onSubmit={onSubmitInteraction}
          onCancel={armedAttackTargetAction ? () => setArmedAttackTargetActionId(null) : undefined}
          onOrderedCandidatePreview={previewOrderedCandidate}
          onOrderedCandidatePreviewEnd={hideCardPreview}
          renderCandidate={(input, entityId) => {
            if (
              input.kind !== "entity-selection" &&
              input.kind !== "entity-partition" &&
              input.kind !== "ordering"
            ) {
              return undefined;
            }
            const rendersCards =
              input.kind === "entity-selection"
                ? input.entityKinds.includes("card")
                : input.entityKind === "card";
            if (!rendersCards) {
              return undefined;
            }
            const card = state.cards[entityId];
            const candidate = input.candidates.find(
              (possibleCandidate) => possibleCandidate.entity.instanceId === entityId,
            );
            const candidateName = resolveInteractionText(candidate?.text ?? { key: entityId });
            const candidateDefinitionId = candidate?.entity.definitionId;
            const metadata =
              resolvedMetadata.get(entityId) ??
              (candidateDefinitionId
                ? (interactionCandidateMetadataByDefinitionId.get(candidateDefinitionId) ?? {
                    canonicalId: candidateDefinitionId,
                    name: candidateName,
                    type: "card",
                    imageUrl: resolveFabCardArt({
                      locale,
                      canonicalId: candidateDefinitionId,
                      name: candidateName,
                    }).printedImageUrl,
                  })
                : undefined);
            if (!metadata) return undefined;
            if (
              input.kind === "entity-partition" &&
              input.routes.length === 1 &&
              input.routes[0]?.orderDirection !== undefined
            ) {
              const art = resolveFabCardArt({
                locale,
                canonicalId: candidateDefinitionId ?? metadata.canonicalId,
                name: candidateName,
              });
              const candidates = [art.boardImageUrl].filter((url): url is string => Boolean(url));
              const [src, defaultSrc, ...fallbackSrcs] = [...new Set(candidates)];
              return (
                <FabCardArtLadderImage
                  src={src}
                  defaultSrc={defaultSrc}
                  fallbackSrcs={fallbackSrcs}
                  variant="no-text"
                  fallback={<span>{candidateName.slice(0, 2)}</span>}
                />
              );
            }
            return (
              <FabBoardCardFace
                entity={
                  card
                    ? entityForFabPresentationCard(card, metadata, {
                        kind: "explicit",
                        reveal: true,
                      })
                    : entityFor(
                        entityId,
                        metadata,
                        interactionView?.resolution?.actingPlayerId ?? viewerId,
                        true,
                      )
                }
                density="compact"
                fill
              />
            );
          }}
        />
      ) : null}
      <FabZoneInspector
        selection={zoneInspection}
        state={state}
        viewerId={viewerId}
        cardMetadata={resolvedMetadata}
        availableBanishedEntityIds={availableBanishedEntityIds}
        availableGraveyardEntityIds={availableGraveyardEntityIds}
        interactionStateFor={interactionStateFor}
        onCardSelect={controlsDisabled ? undefined : onCardSelect}
        onClose={() => setZoneInspection(null)}
      />
      <FabActiveEffectsInspector
        open={effectsInspectorAnchor !== null}
        mobile={isMobile}
        anchorElement={effectsInspectorAnchor}
        effects={boardEffects}
        effectSourceArt={effectSourceArt}
        onOpenChange={(open) => {
          if (!open) {
            const anchor = effectsInspectorAnchor;
            setEffectsInspectorAnchor(null);
            globalThis.setTimeout(() => anchor?.focus({ preventScroll: true }), 0);
          }
        }}
      />
      {boardContextMenu ? (
        <FabBoardContextMenu
          x={boardContextMenu.x}
          y={boardContextMenu.y}
          mode={priorityAutomationMode}
          holdArmed={priorityHoldArmed}
          autoOrderTriggers={fabAutomationSettings.autoOrderTriggers}
          autoSelectSingletonTargets={fabAutomationSettings.autoSelectSingletonTargets}
          disabledReason={priorityAutomationDisabledReason}
          onSelectMode={setPriorityAutomationIfAllowed}
          onArmHold={armPriorityHoldIfAllowed}
          onSetAutoOrderTriggers={setAutoOrderTriggers}
          onSetAutoSelectSingletonTargets={setAutoSelectSingletonTargets}
          onClose={() => setBoardContextMenu(null)}
        />
      ) : null}
    </div>
  );
  const tabletopWithCardContext = (
    <CardContextMenuController
      entities={cardContextEntities}
      actionsForEntity={(entityId) => {
        const actions = cardContextActionsByEntity.get(entityId) ?? [];
        const card = state.cards[entityId];
        if (actions.length > 0 || readOnly || state.terminal || card?.ownerId !== viewerId)
          return actions;
        return [
          {
            id: `unavailable:${entityId}`,
            sourceEntityId: entityId,
            label: "Action unavailable",
            order: 0,
            activation: "execute",
            availability: { kind: "disabled", reason: unavailableCardReason(entityId) },
          },
        ];
      }}
      autoActivationActionsForEntity={(entityId) =>
        primaryCardContextActionsByEntity.get(entityId) ?? []
      }
      mode={settings.cardInteractionMode}
      stateVersion={contextStateVersionRef.current.version}
      promptActive={promptActive || defenseStagingActive}
      autoActivateSingleEnabledAction
      visualIdentity={FAB_CARD_CONTEXT_VISUAL_IDENTITY}
      onModeChange={setCardInteractionMode}
      onAction={(action) => {
        closeBanishedInspectorForAction(action.id);
        if (armAttackTargetSelection(action.id)) {
          closeDesktopCardPreviewAfterAction();
          return;
        }
        setUnavailableActionNotice(null);
        const closeAndPlayEntityId = closeAndPlayEntityByActionId.get(action.id);
        if (closeAndPlayEntityId) {
          requestCloseAndPlay(closeAndPlayEntityId);
        } else if (
          instantYieldContext.commands.has(action.id) ||
          instantYieldContext.interactionActions.has(action.id)
        ) {
          executeInstantYieldAction(action.id);
        } else {
          executePublishedCardAction(action.id);
        }
        closeDesktopCardPreviewAfterAction();
      }}
      onPreviewEntity={(entity, mode) => {
        if (mode === "pinned") pinCardPreview(entity);
        else setCardHover(entity);
      }}
      onPreviewEnd={(hoverEntityId) => {
        if (hoverEntityId === undefined) hideCardPreview();
        else clearCardHover(hoverEntityId);
      }}
    >
      {tabletopContent}
    </CardContextMenuController>
  );
  const tabletop = (
    <FabInstantYieldAutomationProvider
      states={instantYieldContext.controls}
      onToggle={
        !readOnly &&
        (onLegalCommand != null || (interactionView != null && onSubmitInteraction != null))
          ? (instanceId) => {
              const control = instantYieldContext.controls[instanceId];
              if (control && !control.disabledReason) executeInstantYieldAction(control.actionId);
            }
          : undefined
      }
    >
      {tabletopWithCardContext}
    </FabInstantYieldAutomationProvider>
  );

  const priorityOwner =
    state.priorityPlayerId == null
      ? "closed"
      : state.priorityPlayerId === viewerId
        ? "self"
        : "opponent";
  const opponentRailStatus =
    defenseDeclarationActorPlayerId === opponentId
      ? opponentLocalIdentity?.kind === "human"
        ? "Your seat · choosing defenders"
        : "Opponent choosing defenders"
      : state.priorityPlayerId === opponentId
        ? opponentLocalIdentity?.kind === "human"
          ? "Your seat · priority"
          : "Opponent priority"
        : state.activePlayerId === opponentId
          ? opponentLocalIdentity?.kind === "human"
            ? "Your seat · turn"
            : "Opponent turn"
          : opponentLocalIdentity?.kind === "human"
            ? "Your original seat"
            : "Opponent seat";

  return (
    <FabPriorityAutomationSettingsContext.Provider
      value={{
        mode: priorityAutomationMode,
        holdArmed: priorityHoldArmed,
        holdsPriority: state.priorityPlayerId === viewerId,
        autoOrderTriggers: fabAutomationSettings.autoOrderTriggers,
        autoSelectSingletonTargets: fabAutomationSettings.autoSelectSingletonTargets,
        disabledReason: priorityAutomationDisabledReason,
        onSelectMode: setPriorityAutomationIfAllowed,
        onArmHold: armPriorityHoldIfAllowed,
        onSetAutoOrderTriggers: setAutoOrderTriggers,
        onSetAutoSelectSingletonTargets: setAutoSelectSingletonTargets,
        savedOpponentTriggerYields,
        onRemoveOpponentTriggerYield: removeOpponentTriggerYield,
        scopedAutoPass,
        scopeContext,
        onArmScope: armScopeIfAllowed,
        onDisarmScope: disarmScopeIfAllowed,
      }}
    >
      <FabOptionalTriggerAutomationProvider
        modes={optionalTriggerAutomationModes}
        disabledReason={
          interactionView?.resolution && !optionalTriggerConfigurationAvailable
            ? "Complete the current rules decision before changing this setting."
            : readOnly
              ? "This setting is unavailable in read-only views."
              : !optionalTriggerConfigurationAvailable
                ? "Available only on your turn while you have priority."
                : undefined
        }
        onToggle={
          !readOnly &&
          optionalTriggerConfigurationAvailable &&
          (onLegalCommand != null || (interactionView != null && onSubmitInteraction != null))
            ? setOptionalTriggerAutomation
            : undefined
        }
      >
        {unavailableActionNotice ? (
          <FabActionNotice
            title="Action unavailable"
            message={unavailableActionNotice}
            onDismiss={() => setUnavailableActionNotice(null)}
          />
        ) : null}
        <AnimationInteractionBoundary active={animationStatus.isAnimating}>
          <SimulatorViewportShell
            className="fab-tabletop"
            data-testid="fab-tabletop"
            data-fab-layout={isMobile ? "mobile" : "desktop"}
            mobileBreakpoint={FAB_MOBILE_BREAKPOINT}
            shortViewportBreakpoint={520}
            layoutOverride={activeLayout}
            tabletop={tabletop}
            sidebar={sidebar}
            mobilePanel={mobilePanel}
            mobilePanelLabel="Flesh and Blood match center"
            mobileTopRail={({ openSidebar, sidebarOpen }) => (
              <div
                className="fab-mobile-top-rail"
                data-testid="fab-mobile-top-rail"
                data-turn={state.activePlayerId === opponentId ? "true" : undefined}
                data-agency={interactionActorPlayerId === opponentId ? "true" : undefined}
                data-priority={state.priorityPlayerId === opponentId ? "true" : undefined}
              >
                <FabPrioritySignal
                  active={interactionActorPlayerId === opponentId}
                  side="bottom"
                  color="var(--fab-priority-opponent)"
                />
                <div className="fab-mobile-opponent-summary" data-testid="fab-opponent-rail">
                  <div className="fab-mobile-avatar" aria-hidden="true">
                    {opponentHeroDefinition?.imageUrl ? (
                      <CardImage src={opponentHeroDefinition.imageUrl} alt="" />
                    ) : (
                      <Shield size={22} strokeWidth={1.6} />
                    )}
                  </div>
                  <div className="fab-mobile-player-copy">
                    <small>{opponentRailStatus}</small>
                    {participantPresentation?.[opponentId]?.clock}
                    <strong>
                      {opponentLocalIdentity ? (
                        `${localPractice?.mode === "self" ? "Player 2" : opponentLocalIdentity.kind === "human" ? "You" : "Practice bot"}${
                          opponentLocalIdentity.heroName
                            ? ` · ${opponentLocalIdentity.heroName}`
                            : ""
                        }`
                      ) : (
                        <SupporterPlayerName
                          name={participantPresentation?.[opponentId]?.displayName ?? opponentId}
                          tier={participantPresentation?.[opponentId]?.subscriptionTier}
                        />
                      )}
                    </strong>
                  </div>
                  <div
                    ref={opponentLifeRef}
                    className="fab-mobile-life"
                    data-testid="fab-opponent-life"
                    aria-label={`Life ${opponentPlayer.life}`}
                  >
                    <FabOfficialIcon id="life" size={14} className="fab-mobile-life-icon" />
                    <strong>{opponentPlayer.life}</strong>
                  </div>
                  <MobileAssetPills
                    playerId={opponentId}
                    resourcePoints={0}
                    chiPoints={0}
                    actionPoints={opponentPlayer.actionPoints}
                    owner="Opponent"
                  />
                </div>
                <button
                  type="button"
                  className="fab-mobile-icon-button"
                  onClick={() => {
                    onOpenMatchHistory?.();
                    openSidebar();
                  }}
                  aria-label={onOpenMatchHistory ? "Open match history" : "Open match panel"}
                  aria-haspopup="dialog"
                  aria-expanded={sidebarOpen}
                >
                  <BookOpenText size={19} strokeWidth={1.8} />
                </button>
              </div>
            )}
            mobileBottomRail={({ openSidebar, sidebarOpen }) =>
              (() => {
                const railAction = deriveFabMobileRailAction({
                  sidebarOpen,
                  readOnly,
                  terminal: state.terminal,
                  controlsDisabled,
                  hasOwnedDecision: resolutionAction != null,
                  hasDirectOwnedDecision: directResolutionChoice,
                  hasPriority: state.priorityPlayerId === viewerId || defenseStagingActive,
                  hasTurn: state.activePlayerId === viewerId,
                  legalCommands: scopedLegalCommands,
                  hasCardActions: normalizedCardActions.length > 0,
                  canOpenActions: onOpenLegalActions != null,
                  canPass:
                    (defenseStagingActive ? canDeclareDefense : canUseMobilePass) &&
                    !stackPriorityPromptActive,
                  canEndTurn: canUseMobileEndTurn,
                  hasMatchHistory: onOpenMatchHistory != null,
                  combatResolution: closingCombatChain,
                });
                const openHistory = () => {
                  onOpenMatchHistory?.();
                  openSidebar();
                };
                const openActions = () => {
                  onOpenLegalActions?.();
                  openSidebar();
                };
                const endTurn = () => {
                  if (onEndTurn) {
                    onEndTurn();
                    return;
                  }
                  dispatch({ type: "end_turn" });
                };

                return (
                  <div
                    className="fab-mobile-bottom-rail"
                    data-testid="fab-mobile-bottom-rail"
                    data-match-activity-open={sidebarOpen ? "true" : undefined}
                    data-turn={state.activePlayerId === viewerId ? "true" : undefined}
                    data-agency={interactionActorPlayerId === viewerId ? "true" : undefined}
                    data-priority-owner={priorityOwner}
                    data-controlled-seat={selfLocalIdentity?.kind ?? "remote"}
                  >
                    <FabPrioritySignal
                      active={interactionActorPlayerId === viewerId}
                      side="top"
                      color="var(--fab-priority-self)"
                    />
                    <button
                      type="button"
                      className="fab-mobile-icon-button"
                      onClick={openSidebar}
                      aria-label="Open match menu"
                      aria-haspopup="dialog"
                      aria-expanded={sidebarOpen}
                    >
                      <Menu size={20} strokeWidth={1.9} />
                    </button>
                    <div className="fab-mobile-self-assets">
                      {participantPresentation?.[viewerId]?.clock}
                      <div
                        ref={selfLifeRef}
                        className="fab-mobile-life"
                        aria-label={`Life ${selfPlayer.life}`}
                      >
                        <FabOfficialIcon id="life" size={14} className="fab-mobile-life-icon" />
                        <strong>{selfPlayer.life}</strong>
                      </div>
                      <MobileAssetPills
                        playerId={viewerId}
                        resourcePoints={selfPlayer.resourcePoints}
                        chiPoints={state.chiPoints?.[viewerId] ?? 0}
                        actionPoints={selfPlayer.actionPoints}
                        owner="Your"
                      />
                    </div>
                    {priorityCountdown.armed || scopedAutoPass ? (
                      <FabPriorityAutomationControl
                        mode={priorityAutomationMode}
                        scopedAutoPass={scopedAutoPass}
                        onDisarmScope={disarmScopeIfAllowed}
                        countdown={
                          priorityCountdown.armed && priorityCountdownWindowKey
                            ? {
                                windowKey: priorityCountdownWindowKey,
                                durationMs: priorityCountdownDurationMs,
                                onCancel: priorityCountdown.cancel,
                              }
                            : undefined
                        }
                      />
                    ) : null}
                    <FabMobileRailActions
                      model={railAction}
                      passLabel={
                        defenseStagingActive
                          ? defenseDeclarationLabel
                          : combatPriorityPresentation.kind === "waiting"
                            ? "Pass"
                            : combatPriorityPresentation.compactButtonLabel
                      }
                      onOpenHistory={openHistory}
                      onOpenActions={openActions}
                      onPassPriority={
                        defenseStagingActive ? declareDefense : () => onPassPriority?.()
                      }
                      onEndTurn={endTurn}
                    />
                  </div>
                );
              })()
            }
          >
            <FabPortraitOrientationOverlay />
          </SimulatorViewportShell>
        </AnimationInteractionBoundary>
      </FabOptionalTriggerAutomationProvider>
    </FabPriorityAutomationSettingsContext.Provider>
  );
}
