export type GameSlug = "one-piece" | "gundam" | "cyberpunk" | "lorcana";

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
}

export interface SimulatorCounter {
  label: string;
  value: string;
}

export interface SimulatorSeat {
  id: string;
  label: string;
  role: "human" | "agent";
  perspective: "bottom" | "top";
  counters: SimulatorCounter[];
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
  states: EntityState[];
  stats: SimulatorMetadataItem[];
  traits: string[];
  imageUrl?: string;
  backImageUrl?: string;
  frameStyle?: { color: string; pattern?: string };
  overlayBadges?: { label: string; color: string; position: "tl" | "tr" | "bl" | "br" }[];
  spawnAnimation?: "fade" | "slide-up" | "flip";
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
  transitionStyle?: "instant" | "slide" | "shuffle";
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

export interface SimulatorEventLogEntry {
  id: string;
  turn: number;
  phase: string;
  seatId?: string;
  timestamp: string;
  message: string;
  tags: ("move" | "combat" | "ability" | "system")[];
  entityIds?: string[];
}

export interface SimulatorTargetingIntent {
  id: string;
  sourceEntityId: string;
  targetEntityIds: string[];
  targetZoneIds: string[];
  preview?: { damage?: number; banish?: boolean };
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
