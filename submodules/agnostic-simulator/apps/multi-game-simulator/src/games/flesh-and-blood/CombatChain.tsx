import { Select } from "@mantine/core";
import {
  AnimatedEntityCollection,
  AnimatedEntitySlot,
  CardInteractionFrame,
  cardInteractionDescription,
  simulatorBoardCenterAnimationRef,
  useAnimationNode,
  type CardInteractionStateResolver,
} from "@tcg/simulator-ui";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  CircleDot,
  CircleHelp,
  Flame,
  Link2,
  Link2Off,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import type {
  FabCombatChainCardView,
  FabCombatChainView,
  FabCombatPresentationMode,
  FabCombatResolvedLinkView,
  FabCombatStackEntryView,
} from "./combatChainView";
import { combatCardNumeric } from "./combatChainView";
import { FabBoardCardFace } from "./FabBoardCardFace";
import { useFabPreviewTarget } from "./FabCardPreview";
import { FabHostedCards } from "./FabHostedCards";
import { FabKeywordRow, FabOfficialIcon, FabPitchGem, FabStatBadge } from "./FabIconography";
import { resolveFabKeyword } from "./fabIcons";
import { numericStatForFabEntity } from "./projection";
import {
  FabOpponentTriggerYieldControl,
  type FabOpponentTriggerYieldAction,
} from "./FabOpponentTriggerYield";
import "./desktop-combat-chain.css";

interface CombatChainProps {
  view: FabCombatChainView;
  /** Optional defending-seat label for ownership clarity (e.g. You / Opponent). */
  defenderLabel?: string;
  /** Compact rail only (used when public targeting needs board objects). */
  retractDetail?: boolean;
  /** Layout density for mobile shared-arena layering. */
  density?: "desktop" | "mobile";
  /** Board inspection controls share the mobile link selector rail. */
  mobileBoardTools?: ReactNode;
  /** Selected link index in history (1-based); defaults to active. */
  selectedLinkIndex?: number | null;
  onSelectLink?: (index: number) => void;
  onPassPriority?: () => void;
  /** Game-native label for the priority control (for example, Declare defense). */
  priorityActionLabel?: string;
  /** Viewer's one-shot scoped auto-pass arm; combat arms surface on the chain. */
  scopedAutoPass?: "combat" | "opponent-turn" | null;
  /** Arm or disarm the "auto-pass this combat" scope from the chain overlay. */
  onToggleScopePass?: () => void;
  /** Defenders staged in the client before the declaration reaches the engine. */
  provisionalDefenderIds?: readonly string[];
  /** Shows the explicit empty declaration slot while the viewer is choosing defenders. */
  showDefensePrompt?: boolean;
  /** Returns a provisional defender to its originating zone. */
  onRetractDefender?: (instanceId: string) => void;
  onPlayActivate?: () => void;
  actionsDisabled?: boolean;
  priorityLabel?: string | null;
  /** Mobile action controls can be rendered in the persistent viewport rail. */
  showPriorityActions?: boolean;
  desktopPlacement?: DesktopCombatPlacement;
  onCycleDesktopPlacement?: () => void;
  /** Optional shared desktop state for paired combat-chain and stack surfaces. */
  desktopMinimized?: boolean;
  onDesktopMinimizedChange?: (minimized: boolean) => void;
  /** Resolves the shared selectable/selected state for cards rendered on the chain. */
  interactionStateFor?: CardInteractionStateResolver;
  /** Selects a targetable card through the shared interaction submission path. */
  onCardSelect?: (entity: SimulatorEntity) => void;
}

type DesktopCombatPlacement = "center" | "top" | "bottom";

function primaryStat(
  card: FabCombatChainCardView,
): { label: "power" | "defense"; value: number } | null {
  const power = combatCardNumeric(card, "power");
  const defense = combatCardNumeric(card, "defense");
  switch (card.role) {
    case "attack":
    case "attack-reaction":
      return power != null && power > 0 ? { label: "power", value: power } : null;
    case "defend":
    case "defense-reaction":
      return defense != null ? { label: "defense", value: defense } : null;
    default:
      if (power != null && power > 0) return { label: "power", value: power };
      if (defense != null && defense > 0) {
        return { label: "defense", value: defense };
      }
      return null;
  }
}

/** Compatibility-named accessor: the combat surface never reconstructs a live card entity. */
function entityForChainCard(card: FabCombatChainCardView): SimulatorEntity {
  return card.entity;
}

function ChainCardFace({
  card,
  square = false,
  contribution,
  showContribution = true,
  keywords = [],
  paintOrder,
  onActivate,
  interactionStateFor,
  onCardSelect,
}: {
  card: FabCombatChainCardView;
  square?: boolean;
  contribution?: { stat: "power" | "defense"; value: number; label: string };
  /** Overlapped cards defer aggregate combat values to the header equation. */
  showContribution?: boolean;
  keywords?: readonly string[];
  /** Earlier defenders paint above later defenders while their cards overlap. */
  paintOrder?: number;
  onActivate?: () => void;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
}) {
  const entity = card.entity;
  const tapped = chainCardIsTapped(entity);
  const previewTarget = useFabPreviewTarget(entity);
  const interactionState = interactionStateFor?.(entity);
  const interactionDescription =
    interactionState && interactionState.kind !== "idle"
      ? cardInteractionDescription(interactionState)
      : null;
  const targetable = interactionDescription !== null;
  const selectTarget = targetable && onCardSelect ? () => onCardSelect(entity) : undefined;
  const activateCard = onActivate ?? selectTarget;
  const primary = primaryStat(card);
  const defaultStat = primary
    ? {
        stat: primary.label === "power" ? ("power" as const) : ("defense" as const),
        value: primary.value,
        label: primary.label === "power" ? "power" : "defense",
      }
    : null;
  const stat = showContribution ? (contribution ?? defaultStat) : null;
  const visibleKeywords = [...new Set(keywords)].filter(
    (keyword) => resolveFabKeyword(keyword).combatRelevant,
  );
  const keywordLabel = visibleKeywords.length > 0 ? `, ${visibleKeywords.join(", ")}` : "";
  const hostedLabel =
    card.hostedCards.length > 0
      ? `, with ${card.hostedCards.map((hostedCard) => hostedCard.title).join(", ")} under it`
      : "";
  const label = `${roleLabel(card.role)}: ${entity.title}${stat ? `, ${stat.value} ${stat.label}` : ""}${keywordLabel}${hostedLabel}${tapped ? ", tapped" : ""}`;
  const accessibleLabel = targetable ? `${label}, ${interactionDescription}` : label;
  const content = (
    <>
      <FabBoardCardFace
        entity={uprightChainEntity(entity)}
        density="compact"
        fill
        frameBadges="hide"
        preview={false}
      />
      {visibleKeywords.length > 0 ? (
        <FabKeywordRow keywords={visibleKeywords} compact className="fab-chain-card-keywords" />
      ) : null}
      {tapped ? <ChainTappedBadge /> : null}
      <span className="fab-chain-card-name">{entity.title}</span>
      {stat ? (
        <span
          className="fab-chain-card-contribution"
          data-stat={stat.stat}
          title={`${stat.value} ${stat.label}`}
        >
          <FabStatBadge
            stat={stat.stat}
            value={stat.value}
            label={stat.label}
            size="sm"
            showLabel={false}
          />
        </span>
      ) : null}
    </>
  );

  return (
    <AnimatedEntitySlot
      entity={entity}
      zoneRef={{
        kind: "zone",
        id: `${entity.ownerId}:combat-chain`,
        ownerId: entity.ownerId,
      }}
      density="compact"
      style={paintOrder == null ? undefined : { zIndex: paintOrder }}
    >
      <div
        className="fab-chain-card-shell"
        data-hosted-count={card.hostedCards.length || undefined}
      >
        {activateCard ? (
          <button
            type="button"
            className={`fab-chain-card${square ? " fab-square-tile" : ""}`}
            data-chain-role={card.role}
            data-chain-card-id={entity.id}
            data-provisional-defender={onActivate ? "true" : undefined}
            data-testid={`fab-chain-card-${entity.id}`}
            aria-label={onActivate ? `Return ${entity.title} to hand` : accessibleLabel}
            aria-pressed={interactionState?.kind === "selected" ? true : undefined}
            onClick={activateCard}
            {...previewTarget.previewProps}
          >
            <CardInteractionFrame state={interactionState}>{content}</CardInteractionFrame>
          </button>
        ) : (
          <div
            className={`fab-chain-card${square ? " fab-square-tile" : ""}`}
            data-chain-role={card.role}
            data-chain-card-id={entity.id}
            data-testid={`fab-chain-card-${card.role === "attack" ? "attack" : entity.id}`}
            aria-label={accessibleLabel}
            tabIndex={0}
            {...previewTarget.previewProps}
          >
            <CardInteractionFrame state={interactionState}>{content}</CardInteractionFrame>
          </div>
        )}
        <FabHostedCards hostName={entity.title} cards={card.hostedCards} />
      </div>
    </AnimatedEntitySlot>
  );
}

/** Chain cards never inherit the board's tap rotation; they flag the state with a badge. */
function chainCardIsTapped(entity: SimulatorEntity): boolean {
  return entity.dataAttributes?.["data-fab-tapped"] === "true";
}

/** Copies the entity without the tapped marker so the card face renders upright. */
function uprightChainEntity(entity: SimulatorEntity): SimulatorEntity {
  if (!chainCardIsTapped(entity)) return entity;
  return {
    ...entity,
    dataAttributes: Object.fromEntries(
      Object.entries(entity.dataAttributes ?? {}).filter(([key]) => key !== "data-fab-tapped"),
    ),
  };
}

function ChainTappedBadge() {
  return (
    <span className="fab-chain-card-tapped" data-testid="fab-chain-card-tapped" title="Tapped">
      <FabOfficialIcon id="tap" size={10} className="fab-chain-card-tapped-icon" />
      <span>Tapped</span>
    </span>
  );
}

function roleLabel(role: FabCombatChainCardView["role"]): string {
  switch (role) {
    case "attack":
      return "Attack";
    case "defend":
      return "Block";
    case "attack-reaction":
      return "Atk reaction";
    case "defense-reaction":
      return "Def reaction";
    default:
      return "Chain";
  }
}

function StepProgress({ view }: { view: FabCombatChainView }) {
  if (view.mode === "closed") return null;
  return (
    <ol
      className="fab-chain-step-progress"
      data-testid="fab-chain-step-progress"
      aria-label="Combat step progress"
    >
      {view.stepProgress.map((item) => (
        <li
          key={item.step}
          className="fab-chain-step-progress-item"
          data-step={item.step}
          data-status={item.status}
          data-tooltip={`${item.label}: ${combatStepDescription(item.step)}`}
          aria-current={item.status === "current" ? "step" : undefined}
          aria-label={`${item.label}. ${combatStepDescription(item.step)} ${item.status === "current" ? "Current step." : item.status === "done" ? "Completed." : "Upcoming."}`}
          tabIndex={0}
        >
          <StepIcon step={item.step} />
          <span className="fab-chain-step-progress-label">{item.label}</span>
        </li>
      ))}
    </ol>
  );
}

function combatStepDescription(step: FabCombatChainView["stepProgress"][number]["step"]): string {
  switch (step) {
    case "layer":
      return "Resolve pending cards and abilities on the combat chain.";
    case "attack":
      return "Establish the attack and its target.";
    case "defend":
      return "The defending hero may commit cards to defend.";
    case "reaction":
      return "Players may play attack and defense reactions.";
    case "damage":
      return "Compare power and defense, then deal combat damage.";
    case "resolution":
      return "Resolve the attack and finish this chain link.";
    case "close":
      return "Close the combat chain and finish combat.";
  }
}

function MobileStepProgress({ view }: { view: FabCombatChainView }) {
  const [inspectedStep, setInspectedStep] = useState<string | null>(null);
  const current = view.stepProgress.find((item) => item.status === "current") ?? null;
  const inspected = view.stepProgress.find((item) => item.step === inspectedStep) ?? null;

  useEffect(() => {
    setInspectedStep(null);
  }, [view.step]);

  if (!current) return null;

  return (
    <div className="fab-chain-mobile-step-compact" data-testid="fab-chain-step-progress">
      <span className="fab-chain-mobile-current-step" aria-current="step">
        <StepIcon step={current.step} />
        <span>{current.label}</span>
      </span>
      <ol className="fab-chain-mobile-step-markers" aria-label="Combat step progress">
        {view.stepProgress.map((item) => (
          <li key={item.step} data-status={item.status}>
            <button
              type="button"
              className="fab-chain-mobile-step-marker"
              aria-label={`${item.label}: ${item.status}`}
              aria-pressed={inspected?.step === item.step}
              onClick={() => setInspectedStep(item.step)}
            >
              <StepIcon step={item.step} />
            </button>
          </li>
        ))}
      </ol>
      {inspected && inspected.step !== current.step ? (
        <span className="fab-chain-mobile-step-tooltip" role="status">
          {inspected.label} · {inspected.status}
        </span>
      ) : null}
    </div>
  );
}

function StepIcon({ step }: { step: FabCombatChainView["stepProgress"][number]["step"] }) {
  const Icon =
    step === "layer"
      ? CircleDot
      : step === "attack"
        ? Swords
        : step === "defend"
          ? Shield
          : step === "reaction"
            ? Zap
            : step === "damage"
              ? Flame
              : Sparkles;
  return (
    <span className="fab-chain-step-progress-marker" aria-hidden="true">
      <Icon size={11} strokeWidth={2} />
    </span>
  );
}

function LinkHistory({
  links,
  pendingAttack,
  selectedIndex,
  onSelectLink,
  orientation = "horizontal",
}: {
  links: readonly FabCombatResolvedLinkView[];
  pendingAttack?: FabCombatChainCardView | null;
  selectedIndex: number | null;
  onSelectLink?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const previousItemCountRef = useRef(0);
  const pendingIndex = pendingAttack ? Math.max(0, ...links.map((link) => link.index)) + 1 : null;
  const itemCount = links.length + (pendingAttack ? 1 : 0);
  const tabIndices = [
    ...links.map((link) => link.index),
    ...(pendingIndex === null ? [] : [pendingIndex]),
  ];
  const selectedTabIndex =
    selectedIndex ??
    links.find((link) => link.active)?.index ??
    pendingIndex ??
    tabIndices[tabIndices.length - 1] ??
    null;
  useEffect(() => {
    const previousItemCount = previousItemCountRef.current;
    previousItemCountRef.current = itemCount;
    if (itemCount <= previousItemCount) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [itemCount]);

  const onTablistKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    const focusedTab = (event.target as HTMLElement).closest<HTMLButtonElement>(
      '.fab-chain-link-tab[role="tab"]',
    );
    if (!focusedTab) return;

    event.preventDefault();
    const focusedIndex = Number(focusedTab.dataset.linkIndex);
    const currentPosition = Math.max(0, tabIndices.indexOf(focusedIndex));
    let nextPosition: number;
    if (event.key === "Home") nextPosition = 0;
    else if (event.key === "End") nextPosition = tabIndices.length - 1;
    else {
      const delta = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
      nextPosition = (currentPosition + delta + tabIndices.length) % tabIndices.length;
    }
    const nextIndex = tabIndices[nextPosition];
    if (nextIndex === undefined) return;
    onSelectLink?.(nextIndex);
    tablistRef.current
      ?.querySelector<HTMLButtonElement>(`#fab-chain-link-tab-${nextIndex}`)
      ?.focus();
  };

  if (itemCount === 0) return null;
  return (
    <div
      ref={tablistRef}
      className="fab-chain-link-history"
      data-testid="fab-chain-link-history"
      role="tablist"
      aria-label="Chain link history"
      aria-orientation={orientation}
      onKeyDown={onTablistKeyDown}
    >
      <div
        ref={scrollerRef}
        className="fab-chain-link-history-scroller"
        data-testid="fab-chain-link-history-scroller"
      >
        {links.map((link) => {
          const selected = selectedIndex === link.index || (selectedIndex == null && link.active);
          const showOutcome = link.damageResolved;
          const OutcomeIcon = showOutcome ? (link.blocked ? Shield : Swords) : CircleDot;
          return (
            <button
              key={`${link.index}-${link.attackInstanceId}`}
              type="button"
              id={`fab-chain-link-tab-${link.index}`}
              role="tab"
              aria-selected={selected}
              aria-controls="fab-chain-link-panel"
              tabIndex={selected ? 0 : -1}
              className="fab-chain-link-tab"
              data-testid={`fab-chain-link-tab-${link.index}`}
              data-link-index={link.index}
              data-active={link.active ? "true" : undefined}
              data-selected={selected ? "true" : undefined}
              onClick={() => onSelectLink?.(link.index)}
              title={link.summary}
              aria-label={`Chain link ${link.index}: ${link.summary}`}
            >
              {link.attacker ? (
                <span className="fab-chain-link-avatar" aria-hidden="true">
                  <FabBoardCardFace
                    entity={uprightChainEntity(link.attacker.entity)}
                    density="mini"
                    fill
                    frameBadges="hide"
                    preview={false}
                  />
                </span>
              ) : null}
              <span className="fab-chain-link-tab-index">L{link.index}</span>
              <span className="fab-chain-link-tab-name">{link.attackName}</span>
              <span
                className="fab-chain-link-tab-outcome"
                data-blocked={link.blocked ? "true" : undefined}
                data-active={link.active && !showOutcome ? "true" : undefined}
                data-outcome={showOutcome ? (link.blocked ? "blocked" : "damage") : "active"}
              >
                <OutcomeIcon size={11} strokeWidth={2.2} aria-hidden="true" />
                {showOutcome ? <strong>{link.damage}</strong> : null}
                <span className="visually-hidden">
                  {showOutcome ? link.outcomeLabel : "Active"}
                </span>
              </span>
            </button>
          );
        })}
        {pendingAttack && pendingIndex ? (
          <button
            type="button"
            id={`fab-chain-link-tab-${pendingIndex}`}
            role="tab"
            aria-selected={selectedTabIndex === pendingIndex}
            aria-controls="fab-chain-link-panel"
            tabIndex={selectedTabIndex === pendingIndex ? 0 : -1}
            className="fab-chain-link-tab"
            data-testid={`fab-chain-link-tab-${pendingIndex}`}
            data-link-index={pendingIndex}
            data-pending="true"
            data-selected={selectedTabIndex === pendingIndex ? "true" : undefined}
            onClick={() => onSelectLink?.(pendingIndex)}
            title={`Pending chain link ${pendingIndex}: ${pendingAttack.entity.title} awaiting resolution`}
            aria-label={`Pending chain link ${pendingIndex}: ${pendingAttack.entity.title} awaiting resolution in Layer Step`}
          >
            <span className="fab-chain-link-avatar" aria-hidden="true">
              <FabBoardCardFace
                entity={uprightChainEntity(pendingAttack.entity)}
                density="mini"
                fill
                frameBadges="hide"
                preview={false}
              />
            </span>
            <span className="fab-chain-link-tab-index">L{pendingIndex}</span>
            <span className="fab-chain-link-tab-name">{pendingAttack.entity.title}</span>
            <span className="fab-chain-link-tab-outcome" data-active="true" data-outcome="pending">
              <CircleDot size={11} strokeWidth={2.2} aria-hidden="true" />
              <span className="visually-hidden">Pending</span>
            </span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

function stackIcon(cardType: string) {
  const normalized = cardType.toLocaleLowerCase();
  if (normalized.includes("attack-reaction")) return Swords;
  if (normalized.includes("defense-reaction")) return Shield;
  if (normalized.includes("instant")) return Zap;
  if (normalized.includes("ability")) return RotateCcw;
  return Sparkles;
}

function StackLayerButton({
  entry,
  ownerLabel,
  opponentYieldAction,
}: {
  readonly entry: FabCombatStackEntryView;
  readonly ownerLabel: string;
  readonly opponentYieldAction?: FabOpponentTriggerYieldAction;
}) {
  const entity = entry.entity;
  const previewTarget = useFabPreviewTarget(entity);
  const Icon = stackIcon(entity.subtitle);
  return (
    <div className="fab-chain-stack-card-wrap">
      <button
        type="button"
        className="fab-chain-stack-btn"
        data-testid={`fab-chain-stack-entry-${entry.order}`}
        aria-label={`Stack layer ${entry.order}, resolves ${entry.order === 1 ? "next" : `after layer ${entry.order - 1}`}: ${entity.title}, owned by ${ownerLabel}`}
        title={`${entity.title} · ${ownerLabel}`}
        {...previewTarget.previewProps}
      >
        <span className="fab-chain-stack-art" aria-hidden="true">
          <FabBoardCardFace
            entity={uprightChainEntity(entity)}
            density="mini"
            fill
            frameBadges="hide"
            preview={false}
          />
          <span className="fab-chain-stack-order">{entry.order}</span>
          <span className="fab-chain-stack-role" title={entity.subtitle}>
            <Icon size={12} strokeWidth={2} />
          </span>
          <span className="fab-chain-stack-resolution">
            {entry.order === 1 ? "Resolves next" : `Then ${entry.order}`}
          </span>
        </span>
        <span className="fab-chain-stack-copy" aria-hidden="true">
          <span className="fab-chain-stack-owner">{ownerLabel}</span>
        </span>
      </button>
      {entry.order === 1 &&
      opponentYieldAction?.sourceInstanceId === (entry.sourceInstanceId ?? entity.id) ? (
        <FabOpponentTriggerYieldControl action={opponentYieldAction} />
      ) : null}
    </div>
  );
}

function StackRail({
  stack,
  compact = false,
  viewerId,
  ownerLabels,
  minimized = false,
  placement = "center",
  onToggleMinimized,
  onTogglePlacement,
  opponentYieldAction,
}: {
  stack: readonly FabCombatStackEntryView[];
  /** Mobile uses a compact, ordered footer lane for only genuinely pending effects. */
  compact?: boolean;
  viewerId?: string;
  /** Spectator-facing seat names keyed by the layer owner's player id. */
  ownerLabels?: Readonly<Record<string, string>>;
  minimized?: boolean;
  placement?: "center" | "top";
  onToggleMinimized?: () => void;
  onTogglePlacement?: () => void;
  opponentYieldAction?: FabOpponentTriggerYieldAction;
}) {
  const entries = stack;
  if (compact && entries.length === 0) return null;

  return (
    <div
      className={`fab-chain-stack${compact ? " fab-chain-stack--attached" : " fab-chain-stack--priority"}`}
      data-testid="fab-chain-stack"
      aria-label={`Stack, ${entries.length} pending ${entries.length === 1 ? "effect" : "effects"}; highest layer resolves next`}
      data-stack-count={entries.length}
    >
      {compact ? (
        <span className="fab-chain-stack-compact-label">Stack · top next</span>
      ) : (
        <div className="fab-chain-stack-heading">
          <span className="fab-chain-stack-heading-title">
            <Zap size={13} strokeWidth={2.4} aria-hidden="true" />
            Stack
            <span
              className="fab-chain-stack-help"
              data-tooltip="The top layer resolves first."
              aria-label="The top layer resolves first."
              role="img"
              tabIndex={0}
            >
              <CircleHelp size={13} strokeWidth={2} aria-hidden="true" />
            </span>
          </span>
          <span className="fab-chain-stack-heading-meta">
            <span className="fab-chain-stack-heading-count">
              1 / {entries.length} {entries.length === 1 ? "layer" : "layers"}
            </span>
            {onTogglePlacement ? (
              <button
                type="button"
                className="fab-chain-stack-control"
                aria-label={placement === "center" ? "Move stack to top" : "Move stack to center"}
                onClick={onTogglePlacement}
              >
                {placement === "center" ? (
                  <ArrowUp size={15} aria-hidden="true" />
                ) : (
                  <ArrowDown size={15} aria-hidden="true" />
                )}
              </button>
            ) : null}
            {onToggleMinimized ? (
              <button
                type="button"
                className="fab-chain-stack-control"
                aria-label={minimized ? "Expand stack" : "Minimize stack"}
                aria-expanded={!minimized}
                onClick={onToggleMinimized}
              >
                {minimized ? (
                  <Plus size={15} aria-hidden="true" />
                ) : (
                  <Minus size={15} aria-hidden="true" />
                )}
              </button>
            ) : null}
          </span>
        </div>
      )}
      {minimized ? null : entries.length === 0 ? (
        <span className="fab-chain-empty">No pending effects</span>
      ) : (
        <ol className="fab-chain-stack-scroller">
          {entries.map((entry) => {
            const entity = entry.entity;
            const ownerLabel =
              viewerId == null
                ? (ownerLabels?.[entity.ownerId] ?? entity.ownerId)
                : entity.ownerId === viewerId
                  ? "You"
                  : "Opponent";
            return (
              <li
                key={entity.id}
                className="fab-chain-stack-entry fab-square-tile"
                data-resolves-next={entry.order === 1 ? "true" : undefined}
                data-stack-position={entry.order === 1 ? "top" : "below"}
              >
                <AnimatedEntitySlot
                  entity={entity}
                  zoneRef={{
                    kind: "zone",
                    id: `${entity.ownerId}:stack`,
                    ownerId: entity.ownerId,
                  }}
                  density="compact"
                  className="fab-chain-stack-entity"
                >
                  <StackLayerButton
                    entry={entry}
                    ownerLabel={ownerLabel}
                    opponentYieldAction={opponentYieldAction}
                  />
                </AnimatedEntitySlot>
              </li>
            );
          })}
        </ol>
      )}
      {compact && entries.length > 1 ? (
        <span className="fab-chain-stack-count" aria-hidden="true">
          {entries.length}
        </span>
      ) : null}
    </div>
  );
}

/** Compact-by-default stack context for the match sidebar. */
export function FabSidebarResolutionStack({
  stack,
  viewerId,
}: {
  readonly stack: readonly FabCombatStackEntryView[];
  readonly viewerId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const top = stack.find((entry) => entry.order === 1) ?? stack[0];

  useEffect(() => setExpanded(false), [top?.entity.id]);

  if (!top) return null;
  const topOwner = top.entity.ownerId === viewerId ? "You" : "Opponent";

  return (
    <section
      className="fab-sidebar-resolution-stack"
      data-expanded={expanded ? "true" : "false"}
      data-testid="fab-sidebar-resolution-stack"
      aria-label={`Resolution stack, ${stack.length} ${stack.length === 1 ? "layer" : "layers"}`}
    >
      <div className="fab-sidebar-stack-heading">
        <span>
          <Zap size={13} strokeWidth={2.4} aria-hidden="true" /> Resolution stack
        </span>
        <span>
          {stack.length} {stack.length === 1 ? "layer" : "layers"}
        </span>
      </div>
      <button
        type="button"
        className="fab-sidebar-stack-summary"
        aria-label={`Resolution stack: ${top.entity.title}, played by ${topOwner}, resolves next (1 of ${stack.length})`}
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        <span className="fab-sidebar-stack-thumbnail" aria-hidden="true">
          <FabBoardCardFace
            entity={uprightChainEntity(top.entity)}
            density="mini"
            fill
            frameBadges="hide"
            preview={false}
          />
          <span className="fab-sidebar-stack-thumbnail-owner">{topOwner}</span>
        </span>
        <span className="fab-sidebar-stack-summary-copy">
          <span className="fab-sidebar-stack-progress">Resolves next · 1 of {stack.length}</span>
          <strong>{top.entity.title}</strong>
        </span>
        <ChevronDown className="fab-sidebar-stack-chevron" size={19} aria-hidden="true" />
      </button>
      {expanded ? (
        <ol className="fab-sidebar-stack-layers">
          {stack.map((entry) => {
            const owner = entry.entity.ownerId === viewerId ? "You" : "Opponent";
            return (
              <li key={entry.entity.id} data-resolves-next={entry.order === 1 ? "true" : undefined}>
                <button type="button">
                  <span className="fab-sidebar-stack-layer-image" aria-hidden="true">
                    <FabBoardCardFace
                      entity={uprightChainEntity(entry.entity)}
                      density="mini"
                      fill
                      frameBadges="hide"
                      preview={false}
                    />
                    <span className="fab-sidebar-stack-layer-owner">{owner}</span>
                  </span>
                  <span className="fab-sidebar-stack-layer-order">{entry.order}</span>
                  <span className="fab-sidebar-stack-layer-copy">
                    <strong>{entry.entity.title}</strong>
                  </span>
                  {entry.order === 1 ? <small>Resolves next</small> : null}
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}

/**
 * Global pending-effect surface. The rules stack is independent of combat and
 * may remain populated while no combat chain is open.
 */
export function ResolutionStack({
  stack = [],
  viewerId,
  ownerLabels,
  combatMode = "closed",
  opponentYieldAction,
  minimized: controlledMinimized,
  onMinimizedChange,
}: {
  stack?: readonly FabCombatStackEntryView[];
  viewerId?: string;
  ownerLabels?: Readonly<Record<string, string>>;
  combatMode?: FabCombatPresentationMode;
  opponentYieldAction?: FabOpponentTriggerYieldAction;
  minimized?: boolean;
  onMinimizedChange?: (minimized: boolean) => void;
}) {
  const [uncontrolledMinimized, setUncontrolledMinimized] = useState(false);
  const minimized = controlledMinimized ?? uncontrolledMinimized;
  const [placement, setPlacement] = useState<"center" | "top">("center");

  if (stack.length === 0) return null;
  return (
    <section
      className="fab-resolution-stack"
      data-testid="fab-resolution-stack"
      data-combat-mode={combatMode}
      data-stack-count={stack.length}
      data-minimized={minimized ? "true" : "false"}
      data-placement={placement}
      aria-label={`Resolution stack, ${stack.length} pending ${stack.length === 1 ? "effect" : "effects"}`}
    >
      <StackRail
        stack={stack}
        viewerId={viewerId}
        ownerLabels={ownerLabels}
        opponentYieldAction={opponentYieldAction}
        minimized={minimized}
        placement={placement}
        onToggleMinimized={() => {
          const nextMinimized = !minimized;
          setUncontrolledMinimized(nextMinimized);
          onMinimizedChange?.(nextMinimized);
        }}
        onTogglePlacement={
          combatMode === "closed"
            ? () => setPlacement((current) => (current === "center" ? "top" : "center"))
            : undefined
        }
      />
    </section>
  );
}

function DefensePrompt() {
  return (
    <div
      className="fab-chain-defense-slot fab-square-tile"
      data-testid="fab-chain-defense-slot"
      role="status"
    >
      <Shield size={24} strokeWidth={1.5} aria-hidden="true" />
      <strong>Add a defender</strong>
      <span>Select a card, or declare no defense</span>
    </div>
  );
}

function MobileChainCard({
  card,
  kind,
  value,
  keywords = [],
  interactionStateFor,
  onCardSelect,
}: {
  card: FabCombatChainCardView;
  kind: "attack" | "target" | "defend";
  value?: number | null;
  keywords?: readonly string[];
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
}) {
  const entity = entityForChainCard(card);
  const tapped = chainCardIsTapped(entity);
  const animationRef = useAnimationNode(
    { kind: "entity", id: entity.id },
    {
      entity,
      zoneId: kind === "target" ? undefined : `${entity.ownerId}:combat-chain`,
      density: "mini",
      presence: "present",
    },
  );
  const interactionState = interactionStateFor?.(entity);
  const interactionDescription =
    interactionState && interactionState.kind !== "idle"
      ? cardInteractionDescription(interactionState)
      : null;
  const targetable = interactionDescription !== null;
  const cardLabel = kind === "target" ? "Target" : roleLabel(card.role);
  const hostedLabel =
    card.hostedCards.length > 0
      ? `, with ${card.hostedCards.map((hostedCard) => hostedCard.title).join(", ")} under it`
      : "";
  const accessibleLabel = targetable
    ? `${cardLabel}: ${entity.title}${hostedLabel}${tapped ? ", tapped" : ""}, ${interactionDescription}`
    : `${cardLabel}: ${entity.title}${hostedLabel}${tapped ? ", tapped" : ""}`;
  const pitchValue = numericStatForFabEntity(entity, "pitch");
  const content = (
    <>
      <FabBoardCardFace
        entity={uprightChainEntity(entity)}
        density="mini"
        fill
        frameBadges="hide"
        preview={false}
      />
      {keywords.length > 0 ? (
        <FabKeywordRow keywords={keywords} compact className="fab-chain-card-keywords" />
      ) : null}
      {tapped ? <ChainTappedBadge /> : null}
      {pitchValue != null ? <FabPitchGem pitch={pitchValue} size={14} /> : null}
      {value != null ? (
        <span className="fab-mobile-chain-card-stat" data-kind={kind}>
          <FabOfficialIcon
            id={kind === "defend" ? "defense" : "power"}
            size={12}
            className="fab-mobile-chain-card-stat-icon"
          />
          <strong>{value}</strong>
        </span>
      ) : null}
    </>
  );
  const commonProps = {
    className: "fab-mobile-chain-card fab-square-tile",
    "data-kind": kind,
    "data-chain-role": card.role,
    "data-chain-card-id": entity.id,
    "data-testid": kind === "attack" ? "fab-chain-card-attack" : undefined,
    "aria-label": accessibleLabel,
    title: entity.title,
  } as const;
  const framedContent = (
    <CardInteractionFrame state={interactionState}>{content}</CardInteractionFrame>
  );
  return (
    <div
      ref={animationRef}
      className="fab-mobile-chain-card-shell"
      data-hosted-count={card.hostedCards.length || undefined}
    >
      {targetable && onCardSelect ? (
        <button
          type="button"
          {...commonProps}
          aria-pressed={interactionState?.kind === "selected" ? true : undefined}
          onClick={() => onCardSelect(entity)}
        >
          {framedContent}
        </button>
      ) : (
        <div {...commonProps}>{framedContent}</div>
      )}
      <FabHostedCards hostName={entity.title} cards={card.hostedCards} />
    </div>
  );
}

function MobileCombatTotals({
  view,
  resolvedLink,
}: {
  view: FabCombatChainView;
  resolvedLink?: FabCombatResolvedLinkView | null;
}) {
  const attackPower = useDelayedCombatValue(resolvedLink?.attackPower ?? view.attackPower);
  const totalDefense = useDelayedCombatValue(resolvedLink?.totalDefense ?? view.totalDefense);
  const label = `${attackPower} power, ${totalDefense} defense`;

  return (
    <span
      className="fab-chain-mobile-totals"
      data-testid="fab-chain-mobile-totals"
      aria-label={label}
    >
      <span className="fab-chain-mobile-tally">
        <span className="fab-chain-mobile-tally-attack">
          <FabOfficialIcon id="power" size={12} alt="" />
          <strong>{attackPower}</strong>
        </span>
        <span className="fab-chain-mobile-tally-block">
          <FabOfficialIcon id="defense" size={12} alt="" />
          <strong>{totalDefense}</strong>
        </span>
      </span>
    </span>
  );
}

function MobileCombatGallery({
  cards,
  provisionalDefenderIds,
  onRetractDefender,
  interactionStateFor,
  onCardSelect,
}: {
  cards: readonly FabCombatChainCardView[];
  provisionalDefenderIds?: ReadonlySet<string>;
  onRetractDefender?: (instanceId: string) => void;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
}) {
  if (cards.length === 0) return null;
  return (
    <div className="fab-chain-mobile-card-gallery">
      <span className="visually-hidden">Cards played in this combat link</span>
      {cards.map((card) => (
        <MobileCombatGalleryCard
          key={card.entity.id}
          card={card}
          provisionalDefenderIds={provisionalDefenderIds}
          onRetractDefender={onRetractDefender}
          interactionStateFor={interactionStateFor}
          onCardSelect={onCardSelect}
        />
      ))}
    </div>
  );
}

function MobileCombatGalleryCard({
  card,
  provisionalDefenderIds,
  onRetractDefender,
  interactionStateFor,
  onCardSelect,
}: {
  card: FabCombatChainCardView;
  provisionalDefenderIds?: ReadonlySet<string>;
  onRetractDefender?: (instanceId: string) => void;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
}) {
  const entity = entityForChainCard(card);
  const tapped = chainCardIsTapped(entity);
  const animationRef = useAnimationNode(
    { kind: "entity", id: entity.id },
    {
      entity,
      zoneId: `${entity.ownerId}:combat-chain`,
      density: "mini",
      presence: "present",
    },
  );
  const interactionState = interactionStateFor?.(entity);
  const interactionDescription =
    interactionState && interactionState.kind !== "idle"
      ? cardInteractionDescription(interactionState)
      : null;
  const targetable = interactionDescription !== null;
  const Icon = card.role === "defense-reaction" ? Shield : Swords;
  const stat = primaryStat(card);
  const content = (
    <CardInteractionFrame state={interactionState}>
      <FabBoardCardFace
        entity={uprightChainEntity(entity)}
        density="mini"
        fill
        frameBadges="hide"
        preview={false}
      />
      {tapped ? <ChainTappedBadge /> : null}
      {stat ? (
        <span className="fab-chain-gallery-contribution" data-stat={stat.label}>
          <FabOfficialIcon id={stat.label === "power" ? "power" : "defense"} size={10} alt="" />
          <strong>{stat.value}</strong>
        </span>
      ) : (
        <Icon size={10} strokeWidth={2.2} aria-hidden="true" />
      )}
    </CardInteractionFrame>
  );
  const selectTarget = targetable && onCardSelect ? () => onCardSelect(entity) : undefined;
  const interactionLabel = targetable ? `, ${interactionDescription}` : "";
  return selectTarget || (provisionalDefenderIds?.has(entity.id) && onRetractDefender) ? (
    <button
      ref={animationRef}
      type="button"
      key={entity.id}
      className="fab-chain-mobile-gallery-card fab-square-tile"
      data-role={card.role}
      data-chain-card-id={entity.id}
      data-provisional-defender={provisionalDefenderIds?.has(entity.id) ? "true" : undefined}
      title={selectTarget ? entity.title : `Return ${entity.title} to hand`}
      aria-label={
        selectTarget
          ? `${roleLabel(card.role)}: ${entity.title}${interactionLabel}`
          : `Return ${entity.title} to hand`
      }
      aria-pressed={interactionState?.kind === "selected" ? true : undefined}
      onClick={selectTarget ?? (() => onRetractDefender?.(entity.id))}
    >
      {content}
    </button>
  ) : (
    <span
      ref={animationRef}
      key={entity.id}
      className="fab-chain-mobile-gallery-card fab-square-tile"
      data-role={card.role}
      data-chain-card-id={entity.id}
      title={entity.title}
      aria-label={`${roleLabel(card.role)}: ${entity.title}${interactionLabel}`}
    >
      {content}
    </span>
  );
}

function MobileLinkInspectionBanner({ link }: { link: FabCombatResolvedLinkView }) {
  return (
    <span
      className="fab-chain-link-inspection-banner"
      data-testid="fab-chain-resolved-link-detail"
      data-link-index={link.index}
    >
      <RotateCcw size={11} strokeWidth={2} aria-hidden="true" />
      Viewing Link {link.index} · {link.outcomeLabel}
    </span>
  );
}

function EquationStrip({
  view,
  compact = false,
  clarified = false,
  announcementAnchor = false,
}: {
  view: FabCombatChainView;
  compact?: boolean;
  /** Desktop header copy favors explicit wording; mobile retains its established compact treatment. */
  clarified?: boolean;
  /** Lets transient combat-step feedback occupy this strip instead of obscuring the board. */
  announcementAnchor?: boolean;
}) {
  // These values communicate current legality during defense selection. They
  // must update in the same render as the staged/committed combat summary;
  // delaying them can leave a contradictory equation indefinitely while
  // authoritative updates keep restarting the delay.
  const attackPower = view.attackPower;
  const totalDefense = view.totalDefense;
  const projectedDamage = view.projectedDamage ?? Math.max(0, view.attackPower - view.totalDefense);
  const resolvedOutcome = view.damageResolved ? (view.didHit ? "Hit" : "Blocked") : null;
  const damage = projectedDamage;
  const displayedOutcome = resolvedOutcome ?? (damage > 0 ? "Hit" : "Blocked");
  const damageLabel = displayedOutcome === "Blocked" ? "Blocked" : clarified ? "damage" : "DMG";
  const damageAriaLabel = resolvedOutcome
    ? resolvedOutcome === "Blocked"
      ? "Blocked"
      : `${damage} damage dealt`
    : displayedOutcome === "Blocked"
      ? "Projected block"
      : `Projected hit for ${damage} damage`;

  return (
    <div
      className="fab-chain-equation"
      data-testid="fab-chain-equation"
      data-animation-phase-change-anchor={announcementAnchor ? "" : undefined}
      aria-hidden={false}
    >
      <span className="fab-eq-power" data-testid="fab-eq-power" aria-label={`${attackPower} power`}>
        <FabOfficialIcon id="power" size={compact ? 16 : 18} className="fab-eq-stat-icon" />
        <motion.strong
          key={attackPower}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          {attackPower}
        </motion.strong>
        <small className={compact ? "visually-hidden" : undefined}>power</small>
      </span>
      <span className="fab-eq-op">−</span>
      <span
        className="fab-eq-defense"
        data-testid="fab-eq-defense"
        aria-label={`${totalDefense} defense`}
      >
        <FabOfficialIcon id="defense" size={compact ? 16 : 18} className="fab-eq-stat-icon" />
        <motion.strong
          key={totalDefense}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          {totalDefense}
        </motion.strong>
        <small className={compact ? "visually-hidden" : undefined}>defense</small>
      </span>
      <span className="fab-eq-op">=</span>
      <span
        className="fab-eq-damage"
        data-testid="fab-eq-damage"
        data-outcome={displayedOutcome.toLocaleLowerCase()}
        data-projected={resolvedOutcome ? undefined : "true"}
        aria-label={damageAriaLabel}
      >
        {!compact || !clarified ? (
          displayedOutcome === "Hit" ? (
            <Swords size={compact ? 15 : 16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Shield size={compact ? 15 : 16} strokeWidth={2} aria-hidden="true" />
          )
        ) : null}
        <strong data-testid="fab-chain-projected-damage" data-damage={damage}>
          {displayedOutcome === "Blocked" ? "" : damage}
        </strong>
        <small className={compact ? "fab-eq-result-label" : undefined}>
          {compact ? damageLabel : displayedOutcome}
        </small>
      </span>
    </div>
  );
}

function useDelayedCombatValue(value: number): number {
  const reducedMotion = useReducedMotion() ?? false;
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    if (displayed === value) return;
    const timer = window.setTimeout(() => setDisplayed(value), reducedMotion ? 70 : 280);
    return () => window.clearTimeout(timer);
  }, [displayed, reducedMotion, value]);

  return displayed;
}

function PriorityActions({
  view,
  onPassPriority,
  priorityActionLabel,
  onPlayActivate,
  actionsDisabled,
  show = true,
  scopedAutoPass = null,
  onToggleScopePass,
}: {
  view: FabCombatChainView;
  onPassPriority?: () => void;
  priorityActionLabel?: string;
  onPlayActivate?: () => void;
  actionsDisabled?: boolean;
  show?: boolean;
  /** One-shot scoped auto-pass arm for the viewer; null when unarmed. */
  scopedAutoPass?: "combat" | "opponent-turn" | null;
  /** Arm (or disarm, when armed) the "auto-pass this combat" scope. */
  onToggleScopePass?: () => void;
}) {
  if (view.mode === "closed" || !show) return null;
  const isResolutionDecision = view.step === "resolution";
  const passLabel =
    priorityActionLabel ?? (isResolutionDecision ? "Close combat chain" : "Pass Priority");
  const playLabel = "Play / Activate";
  const scopeArmedHere = scopedAutoPass === "combat";
  return (
    <div
      className="fab-chain-priority-actions"
      data-testid="fab-chain-priority-actions"
      data-resolution-decision={isResolutionDecision ? "true" : undefined}
    >
      {view.actionHint ? (
        <p className="fab-chain-action-hint" data-testid="fab-chain-action-hint">
          {view.actionHint}
        </p>
      ) : null}
      <div className="fab-chain-priority-buttons">
        <button
          type="button"
          className="fab-chain-pass-btn"
          data-testid="fab-chain-pass-priority"
          disabled={actionsDisabled}
          onClick={onPassPriority}
          aria-label={passLabel}
        >
          {passLabel}
        </button>
        {!isResolutionDecision ? (
          <button
            type="button"
            className="fab-chain-play-btn"
            data-testid="fab-chain-play-activate"
            disabled={actionsDisabled}
            onClick={onPlayActivate}
            aria-label={playLabel}
          >
            {playLabel}
          </button>
        ) : null}
        {onToggleScopePass ? (
          <button
            type="button"
            className="fab-chain-pass-btn"
            data-testid={
              scopeArmedHere ? "fab-scoped-auto-pass-disarm" : "fab-scoped-auto-pass-arm-combat"
            }
            data-scope-armed={scopeArmedHere ? "true" : undefined}
            disabled={actionsDisabled}
            onClick={onToggleScopePass}
            aria-label={
              scopeArmedHere
                ? "Stop auto-passing this combat"
                : "Auto-pass this combat: skip your windows until the chain closes"
            }
            title={
              scopeArmedHere
                ? "Stop auto-passing this combat. Your windows are yours again."
                : "Auto-pass this combat: skip your windows until the chain closes. You are still asked to defend."
            }
          >
            {scopeArmedHere ? "Stop auto-passing" : "Auto-pass combat"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function CompactRail({
  view,
  state,
}: {
  view: FabCombatChainView;
  state: "closed" | "between-links" | "active-compact";
}) {
  const label =
    state === "closed"
      ? "Combat chain closed"
      : state === "between-links"
        ? view.summary
        : "Combat active — detail retracted";
  return (
    <div
      className="fab-chain-compact-rail"
      data-testid="fab-chain-compact-rail"
      data-rail-state={state}
    >
      {state === "closed" ? (
        <Link2Off size={16} strokeWidth={1.7} aria-hidden="true" />
      ) : (
        <Link2 size={16} strokeWidth={1.7} aria-hidden="true" />
      )}
      <span className="fab-chain-compact-label">{label}</span>
      {state === "between-links" && view.resolvedLinks.length > 0 ? (
        <ul className="fab-chain-compact-outcomes" data-testid="fab-chain-compact-outcomes">
          {view.resolvedLinks.map((link) => (
            <li key={link.index}>
              L{link.index}: {link.outcomeLabel}
            </li>
          ))}
        </ul>
      ) : null}
      {view.stepLabel ? (
        <span
          className="fab-chain-step-badge"
          data-testid="fab-chain-step"
          aria-label={`${view.stepLabel} step`}
          title={`${view.stepLabel} step`}
        >
          <span aria-hidden="true">{view.stepLabel}</span>
        </span>
      ) : state === "closed" ? (
        <span className="fab-chain-step-badge" data-testid="fab-chain-step">
          Closed
        </span>
      ) : null}
    </div>
  );
}

/**
 * Both viewport treatments describe the same public combat state. Keep the
 * stateful shell here, and let the child layout choose how much of that state
 * is visible at its available screen size.
 */
function ActiveCombatChainFrame({
  view,
  density,
  selectedHistoricalLink,
  minimized = false,
  placement = "center",
  onPassPriority,
  priorityActionLabel,
  scopedAutoPass,
  onToggleScopePass,
  onPlayActivate,
  actionsDisabled,
  showPriorityActions,
  boardCenterRef,
  children,
}: {
  view: FabCombatChainView;
  density: NonNullable<CombatChainProps["density"]>;
  selectedHistoricalLink: FabCombatResolvedLinkView | null;
  minimized?: boolean;
  placement?: DesktopCombatPlacement;
  onPassPriority?: () => void;
  priorityActionLabel?: string;
  scopedAutoPass?: "combat" | "opponent-turn" | null;
  onToggleScopePass?: () => void;
  onPlayActivate?: () => void;
  actionsDisabled: boolean;
  showPriorityActions: boolean;
  boardCenterRef?: (node: HTMLElement | null) => void;
  children: ReactNode;
}) {
  return (
    <motion.section
      className={`fab-combat-chain fab-combat-chain-active fab-combat-chain--${density}`}
      data-zone="combat-chain"
      data-testid="fab-combat-chain"
      data-chain-state="active"
      data-chain-mode={view.pendingAttack ? "layer" : "active-link"}
      data-chain-step={view.step ?? undefined}
      data-inspecting-history={selectedHistoricalLink ? "true" : undefined}
      data-has-pending-effects={view.stack.length > 0 ? "true" : undefined}
      data-animation-board-center={boardCenterRef ? "" : undefined}
      data-minimized={minimized ? "true" : undefined}
      data-placement={placement}
      data-density={density}
      aria-label={view.summary}
      ref={boardCenterRef}
      initial={{ opacity: 0.82, transform: "translate3d(0, 3px, 0)" }}
      animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
      {density !== "desktop" || (view.step !== "resolution" && !priorityActionLabel) ? (
        <PriorityActions
          view={view}
          onPassPriority={onPassPriority}
          priorityActionLabel={priorityActionLabel}
          scopedAutoPass={scopedAutoPass}
          onToggleScopePass={onToggleScopePass}
          onPlayActivate={onPlayActivate}
          actionsDisabled={actionsDisabled}
          show={showPriorityActions}
        />
      ) : null}
      <p className="fab-chain-summary visually-hidden" data-testid="fab-chain-summary">
        {view.summary}
      </p>
    </motion.section>
  );
}

export function CombatChain(props: CombatChainProps) {
  const presenceKey = props.view.mode === "closed" ? "closed" : "open";
  return (
    <AnimatedEntityCollection>
      <CombatChainContent key={presenceKey} {...props} />
    </AnimatedEntityCollection>
  );
}

function CombatChainContent({
  view,
  defenderLabel,
  retractDetail = false,
  density = "desktop",
  mobileBoardTools,
  selectedLinkIndex = null,
  onSelectLink,
  onPassPriority,
  priorityActionLabel,
  scopedAutoPass,
  onToggleScopePass,
  provisionalDefenderIds = [],
  showDefensePrompt = false,
  onRetractDefender,
  onPlayActivate,
  actionsDisabled = false,
  priorityLabel,
  showPriorityActions = true,
  desktopPlacement: controlledDesktopPlacement,
  onCycleDesktopPlacement,
  desktopMinimized: controlledDesktopMinimized,
  onDesktopMinimizedChange,
  interactionStateFor,
  onCardSelect,
}: CombatChainProps) {
  const [desktopSelectedLinkIndex, setDesktopSelectedLinkIndex] = useState<number | null>(null);
  const [uncontrolledDesktopMinimized, setUncontrolledDesktopMinimized] = useState(false);
  const desktopMinimized = controlledDesktopMinimized ?? uncontrolledDesktopMinimized;
  const [desktopPlacement, setDesktopPlacement] = useState<DesktopCombatPlacement>("center");
  const wasCombatClosed = useRef(view.mode === "closed");
  // The bridge is deliberately art-first on both viewport treatments. Printed
  // card text is not useful at this scale; the public combat information is
  // carried by the role lane, stat badge, and keyword icons instead.
  const square = density === "mobile" || density === "desktop";
  const layerAttack = view.pendingAttack;
  const layerAttackPower = layerAttack ? (combatCardNumeric(layerAttack, "power") ?? 0) : 0;
  const displayedView: FabCombatChainView = layerAttack
    ? {
        ...view,
        attacker: layerAttack,
        defenders: [],
        reactions: [],
        totalDefense: 0,
        attackPower: layerAttackPower,
        projectedDamage: layerAttackPower,
        // An unresolved attack layer has not produced an authoritative chain-link
        // keyword snapshot yet. Catalog keywords can describe conditional grants,
        // so showing them here would imply that those conditions already passed.
        keywords: [],
        damageResolved: false,
        didHit: false,
        attackingPlayerId: layerAttack.entity.ownerId,
        defendingPlayerId: null,
        defendingHeroId: null,
        defendingHero: null,
        summary: `${layerAttack.entity.title} unresolved in Layer Step`,
      }
    : view;
  const defenseAnimationAnchorId = `fab:${displayedView.defendingPlayerId ?? "none"}:defense`;
  const defenseAnimationRef = useAnimationNode(
    { kind: "anchor", id: defenseAnimationAnchorId },
    { presence: "present", density: "compact" },
  );
  const boardCenterAnimationRef = useAnimationNode(simulatorBoardCenterAnimationRef, {
    presence: "present",
    density: "compact",
  });
  const desktopBoardCenterRef = density === "desktop" ? boardCenterAnimationRef : undefined;
  useEffect(() => {
    setDesktopSelectedLinkIndex(null);
  }, [displayedView.attacker?.entity.id, displayedView.mode]);
  useEffect(() => {
    const combatIsOpen = view.mode !== "closed";
    if (wasCombatClosed.current && combatIsOpen) {
      setUncontrolledDesktopMinimized(false);
      onDesktopMinimizedChange?.(false);
      setDesktopPlacement("center");
    }
    wasCombatClosed.current = !combatIsOpen;
  }, [onDesktopMinimizedChange, view.mode]);

  // The board owns the global resolution stack. This remains an inert combat
  // placeholder so the desktop board's arena seam does not reflow when the
  // combat chain is closed.
  if (view.mode === "closed") {
    return (
      <section
        ref={desktopBoardCenterRef}
        className={`fab-combat-chain fab-combat-chain-empty fab-combat-chain--${density}`}
        data-zone="combat-chain"
        data-testid="fab-combat-chain"
        data-chain-state="empty"
        data-chain-mode="closed"
        data-density={density}
        data-animation-board-center={desktopBoardCenterRef ? "" : undefined}
        aria-hidden="true"
      />
    );
  }

  // Between links: permanents stay visible; compact continuation rail
  if (view.mode === "between-links" && !layerAttack) {
    if (density === "mobile") {
      return (
        <section
          ref={desktopBoardCenterRef}
          className="fab-combat-chain fab-combat-chain-between fab-combat-chain--mobile"
          data-zone="combat-chain"
          data-testid="fab-combat-chain"
          data-chain-state="between-links"
          data-chain-mode="between-links"
          data-density={density}
          data-animation-board-center={desktopBoardCenterRef ? "" : undefined}
          aria-label={view.summary}
        >
          <div className="fab-chain-between-links">
            <LinkHistory
              links={view.linkHistory}
              selectedIndex={selectedLinkIndex}
              onSelectLink={onSelectLink}
            />
            <div className="fab-chain-between-decision">
              <span>
                <strong>{view.stepLabel ?? "Resolution"}</strong>
                <small data-testid="fab-chain-action-hint">
                  {view.actionHint ?? "Continue or close the chain"}
                </small>
              </span>
              {onPassPriority ? (
                <button
                  type="button"
                  className="fab-chain-close-btn cursor-pointer"
                  data-testid="fab-chain-pass-priority"
                  disabled={actionsDisabled}
                  onClick={onPassPriority}
                  aria-label={priorityActionLabel ?? "Close combat chain"}
                >
                  {priorityActionLabel ?? "Close chain"}
                </button>
              ) : null}
            </div>
          </div>
          <p className="fab-chain-summary visually-hidden" data-testid="fab-chain-summary">
            {view.summary}
          </p>
        </section>
      );
    }
    return (
      <section
        ref={desktopBoardCenterRef}
        className={`fab-combat-chain fab-combat-chain-between fab-combat-chain--${density}`}
        data-zone="combat-chain"
        data-testid="fab-combat-chain"
        data-chain-state="between-links"
        data-chain-mode="between-links"
        data-density={density}
        data-animation-board-center={desktopBoardCenterRef ? "" : undefined}
        aria-label={view.summary}
      >
        <div className="fab-chain-header">
          <h2 className="fab-chain-title">Combat Chain</h2>
          {priorityLabel ? (
            <span className="fab-chain-priority" data-testid="fab-chain-priority">
              Priority: {priorityLabel}
            </span>
          ) : null}
        </div>
        <StepProgress view={view} />
        <LinkHistory
          links={view.linkHistory}
          selectedIndex={selectedLinkIndex}
          onSelectLink={onSelectLink}
        />
        <CompactRail view={view} state="between-links" />
        <PriorityActions
          view={view}
          onPassPriority={onPassPriority}
          scopedAutoPass={scopedAutoPass}
          onToggleScopePass={onToggleScopePass}
          onPlayActivate={onPlayActivate}
          actionsDisabled={actionsDisabled}
          show={showPriorityActions}
        />
        <p className="fab-chain-summary visually-hidden" data-testid="fab-chain-summary">
          {view.summary}
        </p>
      </section>
    );
  }

  // Active link — optionally retract to compact rail for public targeting
  if (retractDetail) {
    return (
      <section
        ref={desktopBoardCenterRef}
        className={`fab-combat-chain fab-combat-chain-active fab-combat-chain-retracted fab-combat-chain--${density}`}
        data-zone="combat-chain"
        data-testid="fab-combat-chain"
        data-chain-state="active"
        data-chain-mode="active-link"
        data-chain-retracted="true"
        data-density={density}
        data-animation-board-center={desktopBoardCenterRef ? "" : undefined}
        aria-label={view.summary}
      >
        <CompactRail view={view} state="active-compact" />
        <p className="fab-chain-summary visually-hidden" data-testid="fab-chain-summary">
          {view.summary}
        </p>
      </section>
    );
  }

  const effectiveSelectedLinkIndex =
    density === "desktop" ? desktopSelectedLinkIndex : selectedLinkIndex;
  const selectedHistoricalLink =
    effectiveSelectedLinkIndex == null
      ? null
      : (displayedView.linkHistory.find(
          (link) => link.index === effectiveSelectedLinkIndex && !link.active,
        ) ?? null);
  const historicalAttacker = selectedHistoricalLink?.attacker ?? null;
  const panelView: FabCombatChainView = selectedHistoricalLink
    ? {
        ...displayedView,
        attacker: historicalAttacker,
        attackTargets: selectedHistoricalLink.attackTargets,
        pendingAttack: null,
        defenders: selectedHistoricalLink.defenders,
        reactions: selectedHistoricalLink.reactions,
        totalDefense:
          selectedHistoricalLink.totalDefense ??
          selectedHistoricalLink.defenders.reduce(
            (total, defender) => total + (combatCardNumeric(defender, "defense") ?? 0),
            0,
          ),
        attackPower:
          selectedHistoricalLink.attackPower ??
          (historicalAttacker ? combatCardNumeric(historicalAttacker, "power") : 0) ??
          0,
        projectedDamage: selectedHistoricalLink.damage,
        keywords: [],
        damageResolved: true,
        didHit: selectedHistoricalLink.didHit,
        step: "resolution",
        stepLabel: "Resolution",
        stepProgress: displayedView.stepProgress.map((item) => ({ ...item, status: "done" })),
        summary: selectedHistoricalLink.summary,
        stack: [],
      }
    : displayedView;
  const pendingStackCardIds = new Set(panelView.stack.map((entry) => entry.entity.id));
  const resolvedReactions = panelView.reactions.filter(
    (card) => !pendingStackCardIds.has(card.entity.id),
  );
  const attackReactions = resolvedReactions.filter((card) => card.role === "attack-reaction");
  const defenseReactions = resolvedReactions.filter((card) => card.role === "defense-reaction");
  const resolvedDefenders = panelView.defenders.filter(
    (card) => !pendingStackCardIds.has(card.entity.id),
  );
  const defenderIds = new Set(resolvedDefenders.map((card) => card.entity.id));
  const displayedDefenders = [
    ...resolvedDefenders,
    ...defenseReactions.filter((card) => !defenderIds.has(card.entity.id)),
  ];
  const displayedDefenderIds = new Set(displayedDefenders.map((card) => card.entity.id));
  const standaloneReactions = resolvedReactions.filter(
    (card) => !displayedDefenderIds.has(card.entity.id),
  );
  const objectTargets = panelView.attackTargets.flatMap((target) =>
    target.kind === "object" && target.card ? [target.card] : [],
  );
  const provisionalDefenderIdSet = new Set(provisionalDefenderIds);
  // The live chain link is the rules authority for combat status. Printed/catalog
  // keywords may include conditional grants (for example Second Strike), so they
  // must not be merged into the resolved attack state.
  const attackerKeywords = panelView.keywords;
  const newestLinkIndex = Math.max(0, ...displayedView.linkHistory.map((link) => link.index));
  const pendingLinkIndex = layerAttack ? newestLinkIndex + 1 : null;
  const selectedPanelLinkIndex =
    effectiveSelectedLinkIndex !== null &&
    (effectiveSelectedLinkIndex === pendingLinkIndex ||
      displayedView.linkHistory.some((link) => link.index === effectiveSelectedLinkIndex))
      ? effectiveSelectedLinkIndex
      : (displayedView.linkHistory.find((link) => link.active)?.index ??
        pendingLinkIndex ??
        displayedView.linkHistory.at(-1)?.index ??
        null);
  const selectedPanelTabId = selectedPanelLinkIndex
    ? `fab-chain-link-tab-${selectedPanelLinkIndex}`
    : undefined;
  const cycleDesktopPlacement = () => {
    if (onCycleDesktopPlacement) {
      onCycleDesktopPlacement();
      return;
    }
    setDesktopPlacement((placement) =>
      placement === "center" ? "top" : placement === "top" ? "bottom" : "center",
    );
  };
  const activeDesktopPlacement = controlledDesktopPlacement ?? desktopPlacement;
  if (density === "mobile") {
    return (
      <ActiveCombatChainFrame
        boardCenterRef={desktopBoardCenterRef}
        view={panelView}
        density={density}
        selectedHistoricalLink={selectedHistoricalLink}
        onPassPriority={onPassPriority}
        priorityActionLabel={priorityActionLabel}
        onPlayActivate={onPlayActivate}
        actionsDisabled={actionsDisabled}
        showPriorityActions={showPriorityActions}
      >
        <div className="fab-chain-mobile-progress">
          {selectedHistoricalLink ? (
            <MobileLinkInspectionBanner link={selectedHistoricalLink} />
          ) : (
            <MobileStepProgress view={panelView} />
          )}
          <MobileCombatTotals view={panelView} resolvedLink={selectedHistoricalLink} />
        </div>
        <div
          className="fab-chain-mobile-focus"
          data-testid="fab-chain-link"
          data-inspecting-history={selectedHistoricalLink ? "true" : undefined}
        >
          <div className="fab-chain-mobile-source" data-testid="fab-chain-attacker">
            <span className="fab-chain-label visually-hidden">Attack source</span>
            <div className="fab-chain-mobile-primary-card">
              {panelView.attacker ? (
                <MobileChainCard
                  card={panelView.attacker}
                  kind="attack"
                  value={panelView.attackPower}
                  keywords={attackerKeywords}
                  interactionStateFor={selectedHistoricalLink ? undefined : interactionStateFor}
                  onCardSelect={selectedHistoricalLink ? undefined : onCardSelect}
                />
              ) : (
                <span className="fab-chain-empty">No attacker</span>
              )}
            </div>
            <MobileCombatGallery
              cards={attackReactions}
              interactionStateFor={selectedHistoricalLink ? undefined : interactionStateFor}
              onCardSelect={selectedHistoricalLink ? undefined : onCardSelect}
            />
          </div>
          <div
            className="fab-chain-mobile-defense"
            data-testid="fab-chain-defender"
            data-has-object-target={objectTargets.length > 0 ? "true" : undefined}
          >
            <span className="fab-chain-label visually-hidden">
              Defending cards · {displayedDefenders.length}
            </span>
            {objectTargets.length > 0 ? (
              <div className="fab-chain-mobile-defense-cards" data-testid="fab-chain-targets">
                <span className="fab-chain-label">Target</span>
                {objectTargets.map((target) => (
                  <MobileChainCard
                    key={target.entity.id}
                    card={target}
                    kind="target"
                    interactionStateFor={selectedHistoricalLink ? undefined : interactionStateFor}
                    onCardSelect={selectedHistoricalLink ? undefined : onCardSelect}
                  />
                ))}
              </div>
            ) : null}
            <div
              ref={selectedHistoricalLink ? undefined : defenseAnimationRef}
              className="fab-chain-mobile-blocks"
              data-testid="fab-chain-blocks"
              data-sim-anchor-id={defenseAnimationAnchorId}
            >
              {displayedDefenders.length === 0 ? (
                showDefensePrompt && !selectedHistoricalLink ? (
                  <DefensePrompt />
                ) : (
                  <span className="fab-chain-empty" data-testid="fab-chain-no-blocks">
                    No blocks
                  </span>
                )
              ) : null}
              <MobileCombatGallery
                cards={displayedDefenders}
                provisionalDefenderIds={
                  selectedHistoricalLink ? undefined : provisionalDefenderIdSet
                }
                onRetractDefender={selectedHistoricalLink ? undefined : onRetractDefender}
                interactionStateFor={selectedHistoricalLink ? undefined : interactionStateFor}
                onCardSelect={selectedHistoricalLink ? undefined : onCardSelect}
              />
            </div>
          </div>
        </div>
        <div className="fab-active-board-tools">
          <Select
            className="fab-mobile-link-select"
            classNames={{
              input: "fab-mobile-link-select-input",
              dropdown: "fab-mobile-link-dropdown",
              option: "fab-mobile-link-option",
            }}
            aria-label="Chain link"
            rightSection={<ChevronDown size={14} aria-hidden="true" />}
            allowDeselect={false}
            comboboxProps={{ withinPortal: true, zIndex: 110, position: "top-start" }}
            value={String(selectedPanelLinkIndex ?? "")}
            data={[
              ...displayedView.linkHistory.map((link) => ({
                value: String(link.index),
                label: `Link ${link.index} · ${link.attackName}${link.active ? "" : ` · ${link.outcomeLabel}`}`,
              })),
              ...(pendingLinkIndex !== null
                ? [
                    {
                      value: String(pendingLinkIndex),
                      label: `Link ${pendingLinkIndex} · ${layerAttack?.entity.title} · Pending`,
                    },
                  ]
                : []),
            ]}
            onChange={(value) => {
              if (value === null) return;
              const index = Number(value);
              if (
                index === pendingLinkIndex ||
                displayedView.linkHistory.some((link) => link.index === index)
              ) {
                onSelectLink?.(index);
              }
            }}
          />
          {mobileBoardTools}
        </div>
      </ActiveCombatChainFrame>
    );
  }

  return (
    <ActiveCombatChainFrame
      boardCenterRef={desktopBoardCenterRef}
      view={panelView}
      density={density}
      selectedHistoricalLink={selectedHistoricalLink}
      minimized={desktopMinimized}
      placement={activeDesktopPlacement}
      onPassPriority={onPassPriority}
      priorityActionLabel={priorityActionLabel}
      onPlayActivate={onPlayActivate}
      actionsDisabled={actionsDisabled}
      showPriorityActions={layerAttack ? false : showPriorityActions}
    >
      <div className="fab-chain-header">
        <div className="fab-chain-header-left">
          <h2 className="fab-chain-title">Combat Chain</h2>
          {selectedHistoricalLink ? (
            <span
              className="fab-chain-inspection-badge"
              data-testid="fab-chain-inspection-badge"
              aria-label={`Viewing resolved link ${selectedHistoricalLink.index}`}
            >
              <RotateCcw size={11} strokeWidth={2.2} aria-hidden="true" />
              <span>Resolved</span>
              <strong>L{selectedHistoricalLink.index}</strong>
            </span>
          ) : displayedView.stepLabel ? (
            <span
              className="fab-chain-step-badge"
              data-testid="fab-chain-step"
              aria-label={`${displayedView.stepLabel} step`}
              title={`${displayedView.stepLabel} step`}
            >
              {displayedView.step ? <StepIcon step={displayedView.step} /> : null}
              <span aria-hidden="true">{displayedView.stepLabel}</span>
            </span>
          ) : null}
        </div>
        {density === "desktop" ? (
          <EquationStrip view={panelView} compact clarified announcementAnchor />
        ) : null}
        <div className="fab-chain-header-meta">
          {density !== "desktop" ? <FabKeywordRow keywords={displayedView.keywords} /> : null}
          {density === "desktop" ? (
            <span className="fab-chain-header-controls">
              <button
                type="button"
                className="fab-chain-header-control"
                data-testid="fab-chain-toggle-minimized"
                aria-label={
                  desktopMinimized ? "Restore combat chain details" : "Minimize combat chain"
                }
                title={desktopMinimized ? "Restore combat chain" : "Minimize combat chain"}
                onClick={() => {
                  const nextMinimized = !desktopMinimized;
                  setUncontrolledDesktopMinimized(nextMinimized);
                  onDesktopMinimizedChange?.(nextMinimized);
                }}
              >
                {desktopMinimized ? (
                  <Plus size={13} aria-hidden="true" />
                ) : (
                  <Minus size={13} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                className="fab-chain-header-control"
                data-testid="fab-chain-cycle-placement"
                aria-label={`Move combat chain ${activeDesktopPlacement === "center" ? "to top" : activeDesktopPlacement === "top" ? "to bottom" : "to center"}`}
                title={`Move combat chain ${activeDesktopPlacement === "center" ? "to top" : activeDesktopPlacement === "top" ? "to bottom" : "to center"}`}
                onClick={cycleDesktopPlacement}
              >
                {activeDesktopPlacement === "top" ? (
                  <ArrowDown size={13} aria-hidden="true" />
                ) : activeDesktopPlacement === "bottom" ? (
                  <RotateCcw size={13} aria-hidden="true" />
                ) : (
                  <ArrowUp size={13} aria-hidden="true" />
                )}
              </button>
            </span>
          ) : null}
        </div>
      </div>

      <LinkHistory
        links={displayedView.linkHistory}
        pendingAttack={layerAttack}
        selectedIndex={effectiveSelectedLinkIndex}
        orientation="vertical"
        onSelectLink={(index) => {
          const selected = displayedView.linkHistory.find((link) => link.index === index);
          setDesktopSelectedLinkIndex(selected?.active ? null : index);
          onSelectLink?.(index);
        }}
      />

      <div
        id="fab-chain-link-panel"
        className="fab-chain-stage"
        role="tabpanel"
        aria-labelledby={selectedPanelTabId}
        data-testid={selectedHistoricalLink ? "fab-chain-resolved-link-detail" : undefined}
        data-link-index={selectedHistoricalLink?.index}
        data-inspecting-history={selectedHistoricalLink ? "true" : undefined}
      >
        <StepProgress view={panelView} />
        {/* Mobile keeps the equation in the body; desktop promotes it to the header. */}
        {density !== "desktop" ? <EquationStrip view={panelView} announcementAnchor /> : null}

        <div className="fab-chain-link" data-testid="fab-chain-link">
          <div className="fab-chain-column fab-chain-attacker" data-testid="fab-chain-attacker">
            <span className="fab-chain-label" aria-label="Attack source">
              <FabOfficialIcon id="power" size={13} className="fab-chain-lane-icon" alt="" />
              <span className="fab-chain-lane-label-text">Attack</span>
            </span>
            <div className="fab-chain-lane-content">
              {panelView.attacker ? (
                <ChainCardFace
                  card={panelView.attacker}
                  square={square}
                  contribution={{ stat: "power", value: panelView.attackPower, label: "power" }}
                  paintOrder={standaloneReactions.length + 1}
                  keywords={attackerKeywords}
                  interactionStateFor={selectedHistoricalLink ? undefined : interactionStateFor}
                  onCardSelect={selectedHistoricalLink ? undefined : onCardSelect}
                />
              ) : (
                <span className="fab-chain-empty">No attacker</span>
              )}
              {standaloneReactions.map((reaction, index) => (
                <ChainCardFace
                  key={reaction.entity.id}
                  card={reaction}
                  square={square}
                  paintOrder={standaloneReactions.length - index}
                  showContribution={false}
                  interactionStateFor={selectedHistoricalLink ? undefined : interactionStateFor}
                  onCardSelect={selectedHistoricalLink ? undefined : onCardSelect}
                />
              ))}
              {panelView.attacker ? (
                <div className="fab-chain-power-readout" data-testid="fab-chain-attack-power">
                  <FabStatBadge
                    stat="power"
                    value={panelView.attackPower}
                    label="Power"
                    size="lg"
                    showLabel
                  />
                </div>
              ) : null}
            </div>
          </div>

          {objectTargets.length > 0 ? (
            <div className="fab-chain-column fab-chain-targets" data-testid="fab-chain-targets">
              <span className="fab-chain-label">Target</span>
              <div className="fab-chain-lane-content">
                {objectTargets.map((target) => (
                  <ChainCardFace
                    key={target.entity.id}
                    card={target}
                    square={square}
                    interactionStateFor={selectedHistoricalLink ? undefined : interactionStateFor}
                    onCardSelect={selectedHistoricalLink ? undefined : onCardSelect}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="fab-chain-column fab-chain-defender" data-testid="fab-chain-defender">
            <span
              className="fab-chain-label"
              aria-label={`Defending hero${displayedDefenders.length > 0 ? `, ${displayedDefenders.length} blocks` : ""}`}
            >
              <FabOfficialIcon id="defense" size={13} className="fab-chain-lane-icon" alt="" />
              <span className="fab-chain-lane-label-text">Defend</span>
              {displayedDefenders.length > 0 ? (
                <span className="fab-chain-count">{displayedDefenders.length}</span>
              ) : null}
            </span>
            <div className="fab-chain-lane-content">
              {panelView.defendingHeroId ? (
                <div
                  className="fab-chain-defending-hero fab-square-tile"
                  data-testid="fab-chain-defending-hero"
                  data-hero-id={panelView.defendingHeroId}
                >
                  <span className="fab-chain-defending-hero-label">
                    {defenderLabel ?? panelView.defendingPlayerId ?? "Defender"}
                  </span>
                </div>
              ) : null}
              {displayedDefenders.length === 0 && showDefensePrompt && !selectedHistoricalLink ? (
                <DefensePrompt />
              ) : displayedDefenders.length === 0 ? (
                <span className="fab-chain-empty" data-testid="fab-chain-no-blocks">
                  No blocks
                </span>
              ) : (
                <div
                  ref={selectedHistoricalLink ? undefined : defenseAnimationRef}
                  className="fab-chain-block-stack"
                  data-testid="fab-chain-blocks"
                  data-sim-anchor-id={defenseAnimationAnchorId}
                >
                  {displayedDefenders.map((d, index) => (
                    <ChainCardFace
                      key={d.entity.id}
                      card={d}
                      square={square}
                      paintOrder={displayedDefenders.length - index}
                      onActivate={
                        !selectedHistoricalLink &&
                        provisionalDefenderIdSet.has(d.entity.id) &&
                        onRetractDefender
                          ? () => onRetractDefender(d.entity.id)
                          : undefined
                      }
                      interactionStateFor={selectedHistoricalLink ? undefined : interactionStateFor}
                      onCardSelect={selectedHistoricalLink ? undefined : onCardSelect}
                    />
                  ))}
                </div>
              )}
              <div className="fab-chain-defense-readout" data-testid="fab-chain-total-defense">
                <FabStatBadge
                  stat="defense"
                  value={panelView.totalDefense}
                  label="Σ Defense"
                  size="lg"
                  showLabel
                />
              </div>
            </div>
          </div>

          <div className="fab-chain-damage fab-chain-damage-desktop" data-testid="fab-chain-damage">
            {panelView.damageResolved ? (
              <>
                <span className="fab-damage-label">{panelView.didHit ? "Hit" : "Miss"}</span>
                <span className="fab-damage-value fab-damage-resolved">
                  {panelView.didHit ? "✓" : "—"}
                </span>
              </>
            ) : (
              <>
                <span className="fab-damage-label">Projected damage</span>
                <span className="fab-damage-value">{panelView.projectedDamage ?? 0}</span>
                <span className="fab-damage-formula" data-testid="fab-chain-damage-formula">
                  {panelView.attackPower} − {panelView.totalDefense}
                </span>
              </>
            )}
          </div>
        </div>

        <span className="visually-hidden" data-testid="fab-chain-reactions">
          {resolvedReactions.length > 0
            ? `${resolvedReactions.length} reaction${resolvedReactions.length === 1 ? "" : "s"} played`
            : "No reactions played"}
        </span>
      </div>
    </ActiveCombatChainFrame>
  );
}
