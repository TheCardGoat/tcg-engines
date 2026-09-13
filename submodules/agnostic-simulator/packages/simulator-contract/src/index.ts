export type GameSlug =
  | "one-piece"
  | "gundam"
  | "cyberpunk"
  | "lorcana"
  | "riftbound"
  | "flesh-and-blood"
  | "grand-archive"
  | "naruto"
  | "platform";

/** Full-card width / height ratio shared by standard poker-sized TCG cards. */
export const STANDARD_CARD_IMAGE_ASPECT_RATIO = 5 / 7;

export type {
  SimulatorActivityEntry,
  SimulatorStatement,
  SimulatorStatementAction,
  SimulatorStatementActionInput,
  SimulatorStatementsState,
} from "./statements";

export type ZoneRole =
  | "leader"
  | "hand"
  | "deck"
  | "discard"
  | "battlefield"
  | "resource"
  | "life"
  | "score"
  | "support"
  | "custom";

export type ZoneVisibility = "public" | "private" | "secret" | "owner";

export type EntityKind = "card" | "leader" | "unit" | "character" | "resource" | "die" | "token";

export type EntityState = "ready" | "rested" | "active" | "attached" | "hidden";

export type InteractionInputKind =
  | "action"
  | "single-target"
  | "multi-target"
  | "option"
  | "ordering"
  | "payment"
  | "drag-drop-target";

export interface SimulatorMetadataItem {
  label: string;
  value: string;
  /** Printed value before continuous effects or other runtime modifiers. */
  baseValue?: string;
  /** Optional game-owned explanation of how the current value was derived. */
  detail?: string;
}

export type CardInteractionMode = "detailed" | "quick";

export type SimulatorCardActionAvailability =
  | { kind: "enabled" }
  | {
      kind: "disabled";
      /** Player-facing, localized explanation of the current blocker. */
      reason: string;
      /** Optional game-owned diagnostic key used by tests and telemetry. */
      reasonCode?: string;
    };

/**
 * A game-owned action projected for one public card. The shared UI presents
 * this data but does not interpret legality or construct engine payloads.
 */
export interface SimulatorCardAction {
  id: string;
  sourceEntityId: string;
  label: string;
  detail?: string;
  order: number;
  shortcut?: string;
  activation: "execute" | "begin-selection";
  /** Opaque reference resolved by the game integration against current state. */
  commandRef?: string;
  availability: SimulatorCardActionAvailability;
}

export interface SimulatorEntityRule {
  id: string;
  kind: "text" | "keyword" | "ability";
  label?: string;
  text: string;
  /** Associates printed explanatory text with an action when available. */
  actionId?: string;
}

export interface SimulatorEntityRelationship {
  id: string;
  label: string;
  entityIds: string[];
  /** Public display labels for relationship targets, when the adapter can expose them. */
  entityLabels?: Array<{ id: string; label: string }>;
}

export interface SimulatorEntityDetails {
  rules: SimulatorEntityRule[];
  relationships?: SimulatorEntityRelationship[];
}

export interface SimulatorEntityDecoration {
  id: string;
  slot: "top-start" | "top-end" | "bottom-start" | "bottom-end";
  ariaLabel: string;
  content: { kind: "icon"; token: string } | { kind: "text"; text: string };
  tone?: "neutral" | "positive" | "negative" | "warning";
}

export interface SimulatorCounter {
  label: string;
  value: string;
}

export interface SimulatorActiveEffect {
  id: string;
  targetKind: "entity" | "seat";
  targetId: string;
  sourceEntityId?: string;
  sourceLabel: string;
  label: string;
  detail: string;
  tone: "buff" | "debuff" | "neutral";
  durationLabel?: string;
  kind?: string;
  rule?: string;
}

export interface SimulatorSeat {
  id: string;
  label: string;
  role: "human" | "agent";
  perspective: "bottom" | "top";
  counters: SimulatorCounter[];
  activeEffects?: SimulatorActiveEffect[];
  timerMs?: number;
  timerState?: "running" | "paused" | "expired";
  avatarUrl?: string;
  connectionStatus?: "online" | "offline" | "thinking";
}

export interface SimulatorEntity {
  id: string;
  title: string;
  subtitle: string;
  kind: EntityKind;
  ownerId: string;
  face: "public" | "hidden";
  /** Viewer-safe state context appended to the entity's accessible name. */
  accessibilityDescription?: string;
  states: EntityState[];
  stats: SimulatorMetadataItem[];
  traits: string[];
  imageUrl?: string;
  backImageUrl?: string;
  /**
   * Stable width / height ratio for the complete card face.
   *
   * Games project this value from their native card format so shared UI can
   * reserve the correct footprint before the image decodes. Image components
   * must not infer or mutate layout from the downloaded asset.
   */
  imageAspectRatio?: number;
  /**
   * A zone-selected, identity-safe footprint for a hidden card back.
   *
   * This intentionally permits only a square back rather than propagating a
   * card's native image geometry through the hidden-card privacy boundary.
   */
  hiddenBackLayout?: "square";
  frameStyle?: { color: string; pattern?: string };
  decorations?: SimulatorEntityDecoration[];
  activeEffects?: SimulatorActiveEffect[];
  /** Public, normalized reading data for the detailed card context mode. */
  details?: SimulatorEntityDetails;
  dataAttributes?: Record<string, string | number | boolean | undefined>;
}

export interface SimulatorZone {
  id: string;
  label: string;
  role: ZoneRole;
  ownerId?: string;
  visibility: ZoneVisibility;
  entityIds: string[];
  count?: number;
  hint: string;
  layoutHint?: "grid" | "fan" | "stack" | "row";
  orientation?: "portrait" | "landscape";
  allowedDropRoles?: ZoneRole[];
  deckReveal?: SimulatorDeckReveal;
}

export interface SimulatorDeckRevealCard {
  entityId?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  frameColor?: string;
}

export interface SimulatorDeckReveal {
  id: string;
  zoneId: string;
  ownerId?: string;
  position: "top" | "bottom";
  visibility: "public" | "private";
  turnNumber: number;
  count: number;
  cards: SimulatorDeckRevealCard[];
}

export interface SimulatorStatus {
  activeSeatId: string;
  phase: string;
  turn: number;
  stateVersion: number;
}

export interface SimulatorTable {
  status: SimulatorStatus;
  seats: SimulatorSeat[];
  zones: SimulatorZone[];
}

export interface InteractionOption {
  id: string;
  label: string;
}

export interface InteractionInput {
  kind: InteractionInputKind;
  min?: number;
  max?: number;
  candidateEntityIds: string[];
  targetZoneIds: string[];
  options: InteractionOption[];
}

export interface InteractionMovePreview {
  engine: string;
  command: string;
  payload: string;
}

export interface SimulatorInteraction {
  id: string;
  label: string;
  prompt: string;
  sourceEntityId?: string;
  input: InteractionInput;
  movePreview: InteractionMovePreview;
}

export interface SimulatorCardReference {
  /** Legacy game-native identity. New projections should use the explicit fields below. */
  id?: string;
  name: string;
  /** Current-table entity identity, when the historical fact named an exact object. */
  entityId?: string;
  /** Printed/card-definition identity used for exact preview rendering. */
  definitionId?: string;
}

export interface SimulatorEventLogSection {
  id: string;
  /** Optional enclosing activity, embedded so parents need no synthetic log row. */
  parent?: SimulatorEventLogSection;
  /** Viewer-relative seat that played or initiated this activity, when unambiguous. */
  actorSeatId?: string;
  label: string;
  /** Short structural state shown alongside the label while expanded. */
  meta?: string;
  tone?: string;
  /** Some low-priority groups should begin collapsed even when they are the newest section. */
  collapsedByDefault?: boolean;
  /** One-line outcome of the section, shown when the group is collapsed. */
  summary?: string;
  /** Structured card mentions in the label, meta, or summary. */
  cardRefs?: SimulatorCardReference[];
}

export interface SimulatorEventLogEntry {
  id: string;
  turn: number;
  phase: string;
  seatId?: string;
  timestamp: string;
  message: string;
  /** Game-owned stable event key for classification without parsing localized copy. */
  sourceKey?: string;
  tags: ("move" | "combat" | "ability" | "system")[];
  /** Routine entries can be visually demoted or collapsed without parsing localized prose. */
  importance?: "normal" | "routine";
  entityIds?: string[];
  cardRefs?: SimulatorCardReference[];
  section?: SimulatorEventLogSection;
}

export type SimulatorMatchHistoryMetric =
  | { kind: "value"; label: string; value: number }
  | { kind: "change"; label: string; before: number; after: number }
  | { kind: "comparison"; leftLabel: string; left: number; rightLabel: string; right: number };

export type SimulatorMatchHistoryDetail =
  | { kind: "text"; label?: string; text: string }
  | {
      kind: "cards";
      label: string;
      cards: SimulatorCardReference[];
      lead?: string;
      trail?: string;
      amount?: number;
    };

/** Flat, append-only player history. Game projections own native vocabulary. */
export interface SimulatorMatchHistoryRow {
  id: string;
  turn: number;
  timestamp: string;
  actorSeatId?: string;
  /** Player who owns this turn, independent from the actor who produced the row. */
  turnOwnerSeatId?: string;
  kind: "match-start" | "activity" | "combat" | "outcome" | "turn-end" | "priority-pass";
  title: string;
  details?: SimulatorMatchHistoryDetail[];
  metrics?: SimulatorMatchHistoryMetric[];
  entityIds?: string[];
  cardRefs?: SimulatorCardReference[];
}

export interface SimulatorTargetingIntent {
  id: string;
  sourceEntityId: string;
  targetEntityIds: string[];
  targetZoneIds: string[];
  preview?: { damage?: number; banish?: boolean; label?: string };
}

export type SimulatorCombatEndpoint =
  | { kind: "entity"; id: string }
  | { kind: "zone"; id: string }
  | { kind: "player"; id: string };

/**
 * Projected combat truth for a relationship that must remain visible longer
 * than a transient animation packet. Games map their native battle state into
 * this shape; shared UI owns geometry and presentation.
 */
export interface SimulatorCombatIntent {
  id: string;
  attackerEntityId: string;
  declaredTarget: SimulatorCombatEndpoint;
  currentTarget: SimulatorCombatEndpoint;
  phase: "declared" | "redirected" | "resolving";
  attackKind: "direct" | "fight";
  declaredTargetLabel?: string;
  currentTargetLabel?: string;
  ariaLabel?: string;
}

export interface SimulatorTargetFilter {
  kind: "entity";
  entityKind?: EntityKind;
  ownerId?: string;
  zoneId?: string;
  zoneRole?: ZoneRole;
  includeHidden?: boolean;
}

export function resolveSimulatorTargetFilter(
  filter: SimulatorTargetFilter,
  table: SimulatorTable,
  entities: readonly SimulatorEntity[],
): SimulatorEntity[] {
  const zoneIds = new Set(
    table.zones
      .filter((zone) => {
        if (filter.zoneId !== undefined && zone.id !== filter.zoneId) return false;
        if (filter.zoneRole !== undefined && zone.role !== filter.zoneRole) return false;
        if (filter.ownerId !== undefined && zone.ownerId !== filter.ownerId) return false;
        return true;
      })
      .map((zone) => zone.id),
  );

  return entities.filter((entity) => {
    if (filter.entityKind !== undefined && entity.kind !== filter.entityKind) return false;
    if (filter.ownerId !== undefined && entity.ownerId !== filter.ownerId) return false;
    if (filter.includeHidden !== true && entity.face === "hidden") return false;

    if (filter.zoneId !== undefined || filter.zoneRole !== undefined) {
      const entityZoneId =
        entity.dataAttributes?.["zoneId"] ?? entity.dataAttributes?.["data-zone-id"];
      if (typeof entityZoneId !== "string" || !zoneIds.has(entityZoneId)) return false;
    }

    return true;
  });
}

export interface FixtureGuideStep {
  title: string;
  body: string;
}

export interface CoreUiComponent {
  name: string;
  responsibility: string;
}

export type BoardLayoutVariant = "lanes" | "opposed" | "theater" | "dashboard";

export type BoardDensity = "compact" | "normal" | "spacious";

export type BoardSectionRole = "opponent" | "shared" | "player" | "side";

export type BoardSectionFlow = "grid" | "row" | "column";

export type BoardSectionLabelPlacement = "rail" | "top" | "hidden";

export type BoardSectionSpan = "auto" | "full";

export type BoardBlockKind = "seat" | "zone" | "stack" | "counter" | "token-row" | "spotlight";

export type BoardBlockSize = "compact" | "normal" | "wide" | "full" | "tall";

export interface BoardToken {
  label: string;
  value: string;
  state?: "ready" | "rested" | "hidden" | "active";
}

export interface BoardLayoutAppearance {
  variant: BoardLayoutVariant;
  density?: BoardDensity;
  labelPlacement?: BoardSectionLabelPlacement;
  fit?: "content" | "viewport";
}

export interface BoardBlock {
  id: string;
  kind: BoardBlockKind;
  label: string;
  size: BoardBlockSize;
  seatId?: string;
  zoneId?: string;
  entityIds?: string[];
  value?: string;
  tokens?: BoardToken[];
  note?: string;
}

export interface BoardSection {
  id: string;
  label: string;
  role: BoardSectionRole;
  layout?: {
    columns?: 4 | 6 | 8 | 10 | 12;
    flow?: BoardSectionFlow;
    labelPlacement?: BoardSectionLabelPlacement;
    span?: BoardSectionSpan;
  };
  blocks: BoardBlock[];
}

export interface BoardLayout {
  title: string;
  summary: string;
  appearance?: BoardLayoutAppearance;
  buildingBlocks: CoreUiComponent[];
  sections: BoardSection[];
}

export interface InteractionSelection {
  entityIds: string[];
  optionIds: string[];
  paymentIds: string[];
  orderedIds: string[];
}

export interface SimulatorRendererProps {
  fixture: HarnessFixture;
  onSubmitInteraction?: (interactionId: string, selection: InteractionSelection) => void;
}

export interface SimulatorRendererPackage<Renderer = unknown> {
  BoardRenderer: Renderer;
  InteractionRenderer?: Renderer;
  MobileBoardRenderer?: Renderer;
}

export interface HarnessFixture {
  id: string;
  gameSlug: GameSlug;
  name: string;
  summary: string;
  adapterGoal: string;
  table: SimulatorTable;
  boardLayout: BoardLayout;
  entities: SimulatorEntity[];
  interactions: SimulatorInteraction[];
  guideSteps: FixtureGuideStep[];
  agentChecks: string[];
  coreComponents: CoreUiComponent[];
  eventLog?: SimulatorEventLogEntry[];
  targetingIntents?: SimulatorTargetingIntent[];
}
