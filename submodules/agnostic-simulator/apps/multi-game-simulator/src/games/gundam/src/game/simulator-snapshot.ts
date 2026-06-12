import { useMemo } from "react";
import { deriveClockView } from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";
import type {
  EngineInteractionView,
  InteractionAction,
  InteractionInput as ProtocolInteractionInput,
} from "@tcg/protocol";
import type {
  BoardBlock,
  BoardLayout as SimulatorBoardLayout,
  BoardSection,
  EntityKind,
  EntityState,
  HarnessFixture,
  InteractionInput,
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorInteraction,
  SimulatorSeat,
  SimulatorTable,
  SimulatorZone,
  ZoneRole,
  ZoneVisibility,
} from "@tcg/simulator-contract";

import { useClockNow } from "./use-clock-now.ts";
import {
  asMoveName,
  useBoardProjection,
  useInteractionView,
  useLogEntries,
  usePending,
  useViewerId,
  type BoardProjection,
  type PendingMoveControls,
  type PendingState,
  type SubmitOutcome,
  type TurnTaggedLogEntry,
  type ViewerId,
} from "./index.ts";
import { useGundamGame } from "./context.tsx";
import {
  cardImageUrlOf,
  countActiveResources,
  mapZone,
  resolveOpponentId,
  toGameCardData,
  zoneCount,
} from "../components/containers/mappers.ts";
import { useSubmitError } from "../components/containers/submit-error-context.tsx";

type InteractionSelection = {
  entityIds: string[];
  optionIds: string[];
  paymentIds: string[];
  orderedIds: string[];
};

const ACTION_INTERACTION_PREFIX = "action:";
const PENDING_INTERACTION_PREFIX = "pending:";
const PENDING_CONFIRM_INTERACTION_ID = "pending:confirm";
const PENDING_SUBMIT_INTERACTION_ID = "pending:submit";
const PENDING_CANCEL_INTERACTION_ID = "pending:cancel";

const MOVE_LABELS: Record<string, string> = {
  activateAbility: "Activate Ability",
  alterHand: "Alter Hand",
  assignPilot: "Assign Pilot",
  chooseFirstPlayer: "Choose First Player",
  concede: "Concede",
  declareBlock: "Declare Block",
  deployBase: "Deploy Base",
  deployUnit: "Deploy Unit",
  discardToHandLimit: "Discard to Hand Limit",
  dropOpponent: "Drop Opponent",
  enterBattle: "Enter Battle",
  passActionStep: "Pass Action Step",
  passBattleAction: "Pass Battle Action",
  passBlock: "Pass Block",
  passTurn: "Pass Turn",
  playCommand: "Play Command",
  resolveEffect: "Resolve Effect",
  skipOpponentTurn: "Skip Opponent Turn",
};

export const GUNDAM_CARD_BACK_URL = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420">
  <defs>
    <radialGradient id="core" cx="50%" cy="45%" r="58%">
      <stop offset="0%" stop-color="#e1c06a"/>
      <stop offset="42%" stop-color="#8a6f33"/>
      <stop offset="100%" stop-color="#24170d"/>
    </radialGradient>
    <radialGradient id="plate" cx="50%" cy="45%" r="80%">
      <stop offset="0%" stop-color="#22195c"/>
      <stop offset="58%" stop-color="#120d36"/>
      <stop offset="100%" stop-color="#050413"/>
    </radialGradient>
  </defs>
  <path d="M24 4h272v382l-30 30H4V34z" fill="url(#plate)" stroke="#3b335d" stroke-width="4"/>
  <path d="M52 48h196v276H78z" fill="none" stroke="#d6b76a" stroke-opacity=".22" stroke-width="3"/>
  <circle cx="150" cy="188" r="42" fill="url(#core)"/>
  <circle cx="150" cy="188" r="64" fill="none" stroke="#d6b76a" stroke-opacity=".12" stroke-width="6"/>
  <path d="M24 4h272v382l-30 30H4V34z" fill="none" stroke="#090719" stroke-width="8"/>
</svg>
`)}`;

const GUNDAM_ZONE_DEFS: readonly {
  key: string;
  label: string;
  role: ZoneRole;
  layoutHint: NonNullable<SimulatorZone["layoutHint"]>;
  visibility: ZoneVisibility;
  blockSize: BoardBlock["size"];
  note: string;
}[] = [
  {
    key: "hand",
    label: "Hand",
    role: "hand",
    layoutHint: "row",
    visibility: "owner",
    blockSize: "full",
    note: "Playable cards and private information.",
  },
  {
    key: "battleArea",
    label: "Battle Area",
    role: "battlefield",
    layoutHint: "grid",
    visibility: "public",
    blockSize: "wide",
    note: "Units, bases, and attached pilots in play.",
  },
  {
    key: "baseSection",
    label: "Base",
    role: "support",
    layoutHint: "row",
    visibility: "public",
    blockSize: "compact",
    note: "Base cards and support pieces.",
  },
  {
    key: "shieldArea",
    label: "Shields",
    role: "life",
    layoutHint: "stack",
    visibility: "secret",
    blockSize: "compact",
    note: "Shield stack count.",
  },
  {
    key: "resourceArea",
    label: "Resources",
    role: "resource",
    layoutHint: "row",
    visibility: "public",
    blockSize: "wide",
    note: "Ready resources pay costs.",
  },
  {
    key: "deck",
    label: "Deck",
    role: "deck",
    layoutHint: "stack",
    visibility: "secret",
    blockSize: "compact",
    note: "Hidden deck count.",
  },
  {
    key: "trash",
    label: "Trash",
    role: "discard",
    layoutHint: "stack",
    visibility: "public",
    blockSize: "compact",
    note: "Discarded cards.",
  },
];

const TOP_SEAT_ZONE_ORDER = [
  "hand",
  "trash",
  "deck",
  "resourceArea",
  "shieldArea",
  "baseSection",
  "battleArea",
] as const;

const BOTTOM_SEAT_ZONE_ORDER = [
  "battleArea",
  "baseSection",
  "shieldArea",
  "resourceArea",
  "deck",
  "trash",
  "hand",
] as const;

export interface GundamSimulatorSnapshotInput {
  readonly view: BoardProjection;
  readonly viewerId: ViewerId;
  readonly interactionView: EngineInteractionView;
  readonly pendingState: PendingState;
  readonly logEntries: readonly TurnTaggedLogEntry[];
  readonly now: number;
}

export function useGundamSimulatorSnapshot(): HarnessFixture {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const interactionView = useInteractionView();
  const pending = usePending();
  const logEntries = useLogEntries();
  const now = useClockNow();

  return useMemo(
    () =>
      projectGundamSimulatorSnapshot({
        view,
        viewerId,
        interactionView,
        pendingState: pending.state,
        logEntries,
        now,
      }),
    [view, viewerId, interactionView, pending.state, logEntries, now],
  );
}

export function useSubmitGundamSimulatorInteraction(): (
  interactionId: string,
  selection: InteractionSelection,
) => void {
  const pending = usePending();
  const interactionView = useInteractionView();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();

  return (interactionId, selection) => {
    submitGundamSimulatorInteraction({
      interactionId,
      selection,
      pending,
      interactionView,
      report,
      submitMove: (move, input) => adapter.submit(asMoveName(move), input),
    });
  };
}

export function submitGundamSimulatorInteraction({
  interactionId,
  selection,
  pending,
  interactionView,
  report,
  submitMove,
}: {
  readonly interactionId: string;
  readonly selection: InteractionSelection;
  readonly pending: PendingMoveControls;
  readonly interactionView: EngineInteractionView;
  readonly report: (outcome: SubmitOutcome | null | undefined) => SubmitOutcome | null | undefined;
  readonly submitMove: (move: string, input: Record<string, unknown>) => SubmitOutcome;
}): void {
  if (
    interactionId === PENDING_CONFIRM_INTERACTION_ID ||
    interactionId === PENDING_SUBMIT_INTERACTION_ID
  ) {
    report(pending.confirm());
    return;
  }

  if (interactionId === PENDING_CANCEL_INTERACTION_ID) {
    pending.cancel();
    return;
  }

  if (interactionId.startsWith(PENDING_INTERACTION_PREFIX)) {
    const step = pending.state.status === "collecting" ? pending.state.steps[0] : undefined;
    if (!step) return;
    if (step.kind === "selectTarget") {
      let nextState: PendingMoveControls["state"] | undefined;
      for (const entityId of selection.entityIds) {
        nextState = pending.provideTarget(step, entityId);
      }
      if (nextState) confirmIfReady(nextState, pending, report);
      return;
    }
    if (step.kind === "selectMode") {
      const optionId = selection.optionIds[0];
      if (optionId !== undefined) {
        const asNumber = Number(optionId);
        const nextState = pending.provide(
          "effectIndex",
          Number.isFinite(asNumber) ? asNumber : optionId,
        );
        confirmIfReady(nextState, pending, report);
      }
      return;
    }
    if (step.kind === "selectCost") {
      if (isValidPendingCostSelection(step.candidateIds, selection.paymentIds)) {
        const nextState = pending.provide("cost", { 0: selection.paymentIds });
        confirmIfReady(nextState, pending, report);
      }
      return;
    }
    return;
  }

  if (!interactionId.startsWith(ACTION_INTERACTION_PREFIX)) return;

  const actionId = interactionId.slice(ACTION_INTERACTION_PREFIX.length);
  const action = interactionView.actions.find((candidate) => candidate.id === actionId);
  if (!action) return;

  const sourceInput = action.inputs.find(
    (input) => input.kind === "entity-selection" && input.id === "cardId",
  );
  if (sourceInput && selection.entityIds[0]) {
    const nextState = pending.startForCard(asMoveName(action.id), selection.entityIds[0]);
    confirmIfReady(nextState, pending, report);
    return;
  }

  if (action.inputs.length === 0) {
    report(submitMove(action.id, {}));
    return;
  }

  const nextState = pending.start(
    asMoveName(action.id),
    partialInputFromActionSelection(action, selection),
  );
  confirmIfReady(nextState, pending, report);
}

function confirmIfReady(
  state: PendingMoveControls["state"],
  pending: PendingMoveControls,
  report: (outcome: SubmitOutcome | null | undefined) => SubmitOutcome | null | undefined,
): void {
  if (state.status === "collecting" && state.steps.length === 0) {
    report(pending.confirm());
  }
}

export function projectGundamSimulatorSnapshot({
  view,
  viewerId,
  interactionView,
  pendingState,
  logEntries,
  now,
}: GundamSimulatorSnapshotInput): HarnessFixture {
  const viewerIdString = String(viewerId);
  const opponentId = resolveOpponentId(view, viewerIdString) ?? fallbackOpponentId(viewerIdString);
  const entities = projectEntities(view);
  const table = projectTable(view, viewerIdString, opponentId, now);
  const boardLayout = projectBoardLayout(view, viewerIdString, opponentId);

  return {
    id: `gundam-live-${view.stateID}`,
    gameSlug: "gundam",
    name: "Gundam Live Match",
    summary: "Live Gundam match projected into the shared simulator snapshot contract.",
    adapterGoal:
      "Keep Gundam rules in the adapter while shared UI renders normalized seats, zones, cards, and actions.",
    table,
    boardLayout,
    entities,
    interactions: projectInteractions(interactionView, pendingState),
    guideSteps: [
      {
        title: "Read the board",
        body: "Opponent, shared status, and viewer zones are projected from the same normalized table.",
      },
      {
        title: "Choose actions",
        body: "Available engine actions and pending selections appear in the shared interaction panel.",
      },
    ],
    agentChecks: [
      "Board uses shared simulator-ui blocks.",
      "Gundam card metadata is adapter-projected.",
    ],
    coreComponents: [
      { name: "Board", responsibility: "Renders projected Gundam table sections." },
      { name: "ZoneFrame", responsibility: "Frames every Gundam zone block from SimulatorZone." },
      {
        name: "InteractionPanel",
        responsibility: "Drafts normalized actions back to Gundam moves.",
      },
      { name: "EventLogPanel", responsibility: "Displays visible engine log entries." },
    ],
    eventLog: projectEventLog(logEntries),
  };
}

function projectTable(
  view: BoardProjection,
  viewerId: string,
  opponentId: string,
  now: number,
): SimulatorTable {
  return {
    status: {
      activeSeatId: String(view.status.activePlayer ?? view.status.turnPlayer ?? viewerId),
      phase: String(view.status.phase ?? view.status.gameSegment ?? "setup"),
      turn: Number(view.status.turn ?? 0),
      stateVersion: view.stateID,
    },
    seats: [projectSeat(view, opponentId, "top", now), projectSeat(view, viewerId, "bottom", now)],
    zones: [
      ...projectZonesForSeat(view, opponentId, viewerId),
      ...projectZonesForSeat(view, viewerId, viewerId),
    ],
  };
}

function projectSeat(
  view: BoardProjection,
  playerId: string,
  perspective: SimulatorSeat["perspective"],
  now: number,
): SimulatorSeat {
  const clockSnapshot = view.timerView.players?.[playerId];
  const clock = clockSnapshot ? deriveClockView(clockSnapshot, now) : null;

  return {
    id: playerId,
    label: perspective === "bottom" ? "You" : "Opponent",
    role: "human",
    perspective,
    timerMs: clock?.displayMs,
    timerState: clock?.timedOutWithPriority ? "expired" : clock?.isRunning ? "running" : "paused",
    connectionStatus: clock?.isRunning ? "thinking" : "online",
    counters: [
      { label: "Deck", value: zoneCount(view, "deck", playerId).toString() },
      { label: "Trash", value: zoneCount(view, "trash", playerId).toString() },
      { label: "Shields", value: zoneCount(view, "shieldArea", playerId).toString() },
      { label: "Ready", value: countActiveResources(view, playerId).toString() },
    ],
  };
}

function projectZonesForSeat(
  view: BoardProjection,
  playerId: string,
  viewerId: string,
): SimulatorZone[] {
  return GUNDAM_ZONE_DEFS.map((definition) => {
    const id = zoneId(definition.key, playerId);
    const cards = mapZone(view, definition.key, playerId);
    const entityIds =
      definition.visibility === "secret" && definition.layoutHint === "stack"
        ? []
        : cards.map((card) => card.instanceId).filter((entityId) => !isFoldedPilot(view, entityId));

    return {
      id,
      label: definition.label,
      role: definition.role,
      ownerId: playerId,
      visibility:
        definition.key === "hand" && playerId === viewerId ? "owner" : definition.visibility,
      entityIds,
      count: view.zones.zones[id]?.count ?? entityIds.length,
      hint: definition.note,
      layoutHint: definition.layoutHint,
      orientation: "portrait",
    };
  });
}

function projectEntities(view: BoardProjection): SimulatorEntity[] {
  const entities: SimulatorEntity[] = [];
  for (const zone of Object.values(view.zones.zones)) {
    for (const card of zone.cards) {
      if (isFoldedPilot(view, card.instanceId)) continue;
      const data = toGameCardData(view, card);
      const definition = card.definition as Card | null;
      const faceHidden = data.faceDown === true || !definition;
      const states: EntityState[] = [];
      if (faceHidden) states.push("hidden");
      if (data.exerted) states.push("rested");
      else states.push("ready");
      if (data.cardType === "pilot") states.push("attached");
      const damage = data.damage ?? 0;

      entities.push({
        id: card.instanceId,
        title: faceHidden ? "Hidden card" : data.name,
        subtitle: faceHidden ? "Private information" : (data.subtitle ?? "Gundam card"),
        kind: entityKindForCardType(data.cardType),
        ownerId: String(card.ownerId),
        face: faceHidden ? "hidden" : "public",
        states,
        stats: [
          ...(data.cost !== undefined ? [{ label: "Cost", value: String(data.cost) }] : []),
          ...(data.level !== undefined ? [{ label: "Level", value: String(data.level) }] : []),
          ...(data.ap !== null && data.ap !== undefined
            ? [{ label: "AP", value: String(data.ap) }]
            : []),
          ...(data.hp !== null && data.hp !== undefined
            ? [{ label: "HP", value: String(data.hp) }]
            : []),
        ],
        traits: [...(data.traits ?? [])],
        imageUrl: definition ? cardImageUrlOf(definition) : undefined,
        backImageUrl: GUNDAM_CARD_BACK_URL,
        frameStyle: data.color ? { color: colorForGundamCard(data.color) } : undefined,
        overlayBadges: [
          ...(damage > 0
            ? [{ label: `${damage} DMG`, color: "#d7263d", position: "tr" as const }]
            : []),
          ...(data.deployedThisTurn
            ? [{ label: "NEW", color: "#2d6bff", position: "tl" as const }]
            : []),
          ...(hasPairedPilot(view, card.instanceId)
            ? [{ label: "PILOT", color: "#7b4182", position: "bl" as const }]
            : []),
          ...(data.cantAttack
            ? [{ label: "NO ATK", color: "#c8155a", position: "br" as const }]
            : []),
        ],
      });
    }
  }
  return entities;
}

function projectBoardLayout(
  view: BoardProjection,
  viewerId: string,
  opponentId: string,
): SimulatorBoardLayout {
  return {
    title: "Gundam Match Board",
    summary: "A live Gundam table rendered through shared simulator-ui board sections.",
    appearance: {
      variant: "lanes",
      density: "compact",
      labelPlacement: "hidden",
      fit: "viewport",
    },
    buildingBlocks: [
      { name: "Seats", responsibility: "Viewer and opponent summaries come from SimulatorSeat." },
      { name: "Zones", responsibility: "Gundam-native zones are normalized into SimulatorZone." },
      { name: "Cards", responsibility: "Runtime cards render as SimulatorEntity records." },
      { name: "Status", responsibility: "Turn, phase, priority, and resources are counters." },
    ],
    sections: [
      seatSection(view, opponentId, "opponent"),
      sharedSection(),
      seatSection(view, viewerId, "player"),
    ],
  };
}

function seatSection(
  view: BoardProjection,
  playerId: string,
  role: BoardSection["role"],
): BoardSection {
  return {
    id: `${role}:${playerId}`,
    label: role === "player" ? "Player" : "Opponent",
    role,
    layout: { columns: 12, flow: "grid", labelPlacement: "hidden", span: "full" },
    blocks: zoneDefinitionsForRole(role).map((definition) => {
      const id = zoneId(definition.key, playerId);
      return {
        id: `${role}:${definition.key}`,
        kind: "zone",
        label: definition.label,
        size: definition.blockSize,
        zoneId: id,
        value: String(view.zones.zones[id]?.count ?? 0),
        note:
          definition.key === "resourceArea"
            ? `${countActiveResources(view, playerId)} ready resources`
            : definition.note,
      } satisfies BoardBlock;
    }),
  };
}

function zoneDefinitionsForRole(role: BoardSection["role"]): typeof GUNDAM_ZONE_DEFS {
  const definitionsByKey = new Map(
    GUNDAM_ZONE_DEFS.map((definition) => [definition.key, definition]),
  );
  const orderedKeys = role === "player" ? BOTTOM_SEAT_ZONE_ORDER : TOP_SEAT_ZONE_ORDER;
  return orderedKeys.map((key) => {
    const definition = definitionsByKey.get(key);
    if (!definition) throw new Error(`Missing Gundam zone definition for ${key}.`);
    return definition;
  });
}

function sharedSection(): BoardSection {
  return {
    id: "shared-status",
    label: "Status",
    role: "shared",
    layout: { columns: 12, flow: "row", labelPlacement: "hidden", span: "full" },
    blocks: [],
  };
}

function projectInteractions(
  interactionView: EngineInteractionView,
  pendingState: PendingState,
): SimulatorInteraction[] {
  if (pendingState.status === "collecting") {
    return pendingInteractions(pendingState);
  }

  if (interactionView.status !== "ready" && interactionView.status !== "choosing") return [];

  return interactionView.actions
    .filter((action) => action.enabled)
    .map((action) => actionToSimulatorInteraction(action));
}

function pendingInteractions(
  state: Extract<PendingState, { status: "collecting" }>,
): SimulatorInteraction[] {
  const moveLabel = labelMove(String(state.move));
  const step = state.steps[0];

  if (!step) {
    return [
      {
        id: "pending:submit",
        label: `Submit ${moveLabel}`,
        prompt: "All required inputs are collected.",
        input: emptyActionInput(),
        movePreview: {
          engine: "gundam",
          command: String(state.move),
          payload: JSON.stringify(state.partialInput),
        },
      },
      cancelInteraction(state.move),
    ];
  }

  if (step.kind === "confirm") {
    return [
      {
        id: "pending:confirm",
        label: `Confirm ${moveLabel}`,
        prompt: `Confirm ${moveLabel}.`,
        input: emptyActionInput(),
        movePreview: {
          engine: "gundam",
          command: String(state.move),
          payload: JSON.stringify(state.partialInput),
        },
      },
      cancelInteraction(state.move),
    ];
  }

  if (step.kind === "selectTarget") {
    const multi = step.maxTargets > 1;
    return [
      {
        id: `pending:target:${step.role}`,
        label: `${moveLabel}: select ${step.role}`,
        prompt: `Choose ${multi ? `${step.minTargets}-${step.maxTargets}` : "one"} ${step.role}.`,
        input: {
          kind: multi ? "multi-target" : "single-target",
          min: step.minTargets,
          max: step.maxTargets,
          candidateEntityIds: [...step.candidateIds],
          targetZoneIds: [],
          options: [],
        },
        movePreview: {
          engine: "gundam",
          command: String(state.move),
          payload: JSON.stringify(state.partialInput),
        },
      },
      cancelInteraction(state.move),
    ];
  }

  if (step.kind === "selectMode") {
    return [
      {
        id: "pending:mode",
        label: `${moveLabel}: choose mode`,
        prompt: "Choose one mode for this ability.",
        input: {
          kind: "option",
          min: 1,
          max: 1,
          candidateEntityIds: [],
          targetZoneIds: [],
          options: step.modes.map((mode) => ({ id: mode.id, label: mode.label })),
        },
        movePreview: {
          engine: "gundam",
          command: String(state.move),
          payload: JSON.stringify(state.partialInput),
        },
      },
      cancelInteraction(state.move),
    ];
  }

  if (step.kind === "selectCost") {
    const hasCandidates = step.candidateIds.length > 0;
    return [
      {
        id: `pending:cost:${step.costType}`,
        label: `${moveLabel}: pay ${step.costType}`,
        prompt: `Choose resources to pay ${step.costType}.`,
        input: {
          kind: "payment",
          min: hasCandidates ? 1 : 0,
          max: step.candidateIds.length,
          candidateEntityIds: [...step.candidateIds],
          targetZoneIds: [],
          options: [],
        },
        movePreview: {
          engine: "gundam",
          command: String(state.move),
          payload: JSON.stringify(state.partialInput),
        },
      },
      cancelInteraction(state.move),
    ];
  }

  return [cancelInteraction(state.move)];
}

function isValidPendingCostSelection(
  candidateIds: readonly string[],
  paymentIds: readonly string[],
): boolean {
  if (paymentIds.length === 0 || paymentIds.length > candidateIds.length) return false;
  const candidates = new Set(candidateIds);
  return paymentIds.every((id) => candidates.has(id));
}

function actionToSimulatorInteraction(action: InteractionAction): SimulatorInteraction {
  return {
    id: `${ACTION_INTERACTION_PREFIX}${action.id}`,
    label: labelMove(action.id),
    prompt: labelText(action.text),
    sourceEntityId: action.source?.instanceId,
    input: inputFromAction(action),
    movePreview: {
      engine: "gundam",
      command: action.id,
      payload: JSON.stringify({ requestId: action.requestId }),
    },
  };
}

function inputFromAction(action: InteractionAction): InteractionInput {
  const input = displayInputFromAction(action);
  if (!input) return emptyActionInput();

  if (input.kind === "entity-selection") {
    const candidateEntityIds = input.candidates
      .filter((candidate) => candidate.enabled)
      .map((candidate) => candidate.entity.instanceId);
    return {
      kind: input.ordered
        ? "ordering"
        : input.role === "cost"
          ? "payment"
          : input.max > 1
            ? "multi-target"
            : "single-target",
      min: input.min,
      max: input.max,
      candidateEntityIds,
      targetZoneIds: [],
      options: [],
    };
  }

  if (input.kind === "option-selection") {
    return {
      kind: "option",
      min: input.min,
      max: input.max,
      candidateEntityIds: [],
      targetZoneIds: [],
      options: input.options
        .filter((option) => option.enabled)
        .map((option) => ({ id: option.id, label: labelText(option.text) })),
    };
  }

  if (input.kind === "boolean") {
    return {
      kind: "option",
      min: 1,
      max: 1,
      candidateEntityIds: [],
      targetZoneIds: [],
      options: [
        { id: "true", label: labelText(input.trueText) },
        { id: "false", label: labelText(input.falseText) },
      ],
    };
  }

  if (input.kind === "ordering") {
    return {
      kind: "ordering",
      min: input.min,
      max: input.max,
      candidateEntityIds: input.candidates
        .filter((candidate) => candidate.enabled)
        .map((candidate) => candidate.entity.instanceId),
      targetZoneIds: [],
      options: [],
    };
  }

  return emptyActionInput();
}

function partialInputFromActionSelection(
  action: InteractionAction,
  selection: InteractionSelection,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const input of action.inputs) {
    const value = coerceActionInputValue(input, valueFromActionInputSelection(input, selection));
    if (value !== undefined) assignActionInputValue(values, nativeActionInputId(input.id), value);
  }

  return values;
}

function nativeActionInputId(inputId: string): string {
  return inputId.replace(/^(deckLookAnswers\.\d+)\.order$/, "$1.toTop");
}

function coerceActionInputValue(input: ProtocolInteractionInput, value: unknown): unknown {
  if (
    input.kind === "option-selection" &&
    input.id.startsWith("chooseOneAnswers.") &&
    !Array.isArray(value)
  ) {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? value : numeric;
  }

  return value;
}

function assignActionInputValue(
  values: Record<string, unknown>,
  inputId: string,
  value: unknown,
): void {
  const parts = inputId.split(".");
  if (parts.length === 1) {
    values[inputId] = value;
    return;
  }

  let cursor = values;
  for (const part of parts.slice(0, -1)) {
    const existing = cursor[part];
    if (isPlainRecord(existing)) {
      cursor = existing;
    } else {
      const next: Record<string, unknown> = {};
      cursor[part] = next;
      cursor = next;
    }
  }

  const leaf = parts.at(-1);
  if (leaf !== undefined) cursor[leaf] = value;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function displayInputFromAction(action: InteractionAction): ProtocolInteractionInput | undefined {
  return action.inputs.find((input) => !isAutoFilledActionInput(input)) ?? action.inputs[0];
}

function isAutoFilledActionInput(input: ProtocolInteractionInput): boolean {
  if (input.kind !== "option-selection") return false;
  return input.options.filter((option) => option.enabled).length === 1;
}

function valueFromActionInputSelection(
  input: ProtocolInteractionInput,
  selection: InteractionSelection,
): unknown {
  if (input.kind === "entity-selection") {
    if (input.ordered) return selection.orderedIds;
    if (input.role === "cost") return selection.paymentIds;
    if (input.max > 1) return selection.entityIds;
    return selection.entityIds[0];
  }

  if (input.kind === "option-selection") {
    const selected = isAutoFilledActionInput(input)
      ? autoOptionIds(input)
      : selection.optionIds.length > 0
        ? selection.optionIds
        : autoOptionIds(input);
    return input.max > 1 ? selected : selected[0];
  }

  if (input.kind === "boolean") {
    const optionId = selection.optionIds[0];
    if (optionId === undefined) return undefined;
    return optionId === "true";
  }

  if (input.kind === "ordering") return selection.orderedIds;

  return undefined;
}

function autoOptionIds(input: ProtocolInteractionInput): string[] {
  if (input.kind !== "option-selection") return [];
  const enabled = input.options.filter((option) => option.enabled);
  return enabled.length === 1 ? [enabled[0]!.id] : [];
}

function fallbackOpponentId(viewerId: string): string {
  return `${viewerId}:opponent`;
}

function projectEventLog(logEntries: readonly TurnTaggedLogEntry[]): SimulatorEventLogEntry[] {
  return logEntries.map(({ entry, turnNumber }) => ({
    id: String(entry.id),
    turn: turnNumber,
    phase: entry.type,
    seatId: entry.playerId ? String(entry.playerId) : undefined,
    timestamp: new Date(entry.timestamp).toISOString(),
    message: entry.message,
    tags: [eventTag(entry.type)],
    entityIds: entry.cardIds,
  }));
}

function cancelInteraction(
  move: PendingState extends infer _T
    ? Extract<PendingState, { status: "collecting" }>["move"]
    : never,
): SimulatorInteraction {
  return {
    id: "pending:cancel",
    label: "Cancel",
    prompt: `Cancel ${labelMove(String(move))}.`,
    input: emptyActionInput(),
    movePreview: { engine: "gundam", command: "cancel", payload: "{}" },
  };
}

function emptyActionInput(): InteractionInput {
  return {
    kind: "action",
    candidateEntityIds: [],
    targetZoneIds: [],
    options: [],
  };
}

function labelMove(move: string): string {
  return (
    MOVE_LABELS[move] ??
    move.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (s) => s.toUpperCase())
  );
}

function labelText(text: {
  key: string;
  params?: Record<string, string | number | boolean>;
}): string {
  if (typeof text.params?.label === "string") return text.params.label;
  if (typeof text.params?.prompt === "string") return text.params.prompt;
  const key = text.key.split(".").at(-1) ?? text.key;
  return labelMove(key);
}

function zoneId(zone: string, playerId: string): string {
  return `${zone}:${playerId}`;
}

function isFoldedPilot(view: BoardProjection, entityId: string): boolean {
  const assignments =
    (view.G as { pilotAssignments?: Record<string, string> }).pilotAssignments ?? {};
  return Object.values(assignments).includes(entityId);
}

function hasPairedPilot(view: BoardProjection, entityId: string): boolean {
  const assignments =
    (view.G as { pilotAssignments?: Record<string, string> }).pilotAssignments ?? {};
  return assignments[entityId] !== undefined;
}

function entityKindForCardType(cardType: string | undefined): EntityKind {
  if (cardType === "unit") return "unit";
  if (cardType === "resource") return "resource";
  return "card";
}

function colorForGundamCard(color: string): string {
  switch (color) {
    case "blue":
      return "#1e49c7";
    case "green":
      return "#2ea65a";
    case "red":
      return "#d7263d";
    case "white":
      return "#d8e0ec";
    case "purple":
      return "#7b4182";
    default:
      return "#2d6bff";
  }
}

function eventTag(type: string): SimulatorEventLogEntry["tags"][number] {
  if (type.includes("attack") || type.includes("damage") || type.includes("battle"))
    return "combat";
  if (type.includes("effect") || type.includes("ability")) return "ability";
  if (type.includes("system") || type.includes("setup")) return "system";
  return "move";
}
