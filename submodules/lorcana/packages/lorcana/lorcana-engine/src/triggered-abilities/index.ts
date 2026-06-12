import type {
  CardInstanceId,
  MoveEnumerationContext,
  MoveExecutionContext,
  MoveInput,
  MoveValidationContext,
  PlayerId,
} from "#core";
import type {
  BagEffectEntry,
  BufferedTriggeredEvent,
  DelayedTriggerTiming,
  DelayedTriggerWindow,
  LorcanaG,
  PendingActionEffect,
  PendingActionResolutionInput,
  PendingTriggeredEvent,
  TriggeredEventCandidate,
  TriggerRegistration,
  TriggerRegistrationAbility,
  TriggeredAbilitiesState,
} from "../types";
import type { CardPlayedPayload, LorcanaCard, LorcanaCardMeta } from "../types";
import type {
  Condition,
  LorcanaCardDefinition,
  TriggeredAbilityDefinition,
  Trigger,
  TriggerRestriction,
  TriggerSubject,
  TriggerSubjectQuery,
} from "@tcg/lorcana-types";
import { emitLorcanaDomainEvent } from "../types";
import { cloneActionResolutionInput } from "../runtime-moves/resolution/action-effects/pending-action-effects";
import { cardHasName, hasKeyword } from "../card-utils";
import { compareOperator } from "../rules/operator-utils";
import { getLorcanaCardName, traceLorcanaRuntimeStep } from "../runtime-trace";
import {
  normalizeTargetDescriptor,
  passesFilter,
  shouldSkipEffectWithNoValidTargets,
} from "../targeting/runtime";
import {
  buildPlayZoneCardTypeCache,
  countDamagedCharactersInPlay,
  evaluateCondition,
} from "../rules/condition-evaluator";
import type { PlayZoneCardTypeCache } from "../rules/condition-evaluator";
import { buildConditionContext } from "../rules/condition-context";
import type { LorcanaCardDerived } from "../types/projected-board";
import { projectLorcanaCardDerived } from "../projection/card-derived";
import { createProjectionState } from "../rules/derived-state";
import { getOrBuildMoveRegistry } from "../runtime-moves/rules/move-registry-cache";

export type TriggerWindow =
  | "challenge-declaration"
  | "after-challenge"
  | "start-of-turn"
  | "end-of-turn";

type TriggerRuntimeContext = Pick<MoveExecutionContext<MoveInput>, "G" | "framework" | "cards">;

type TriggerReadContext =
  | Pick<MoveValidationContext<MoveInput>, "G" | "framework">
  | Pick<MoveEnumerationContext, "G" | "framework">
  | Pick<MoveExecutionContext<MoveInput>, "G" | "framework">;

type TriggerBagStateContext =
  | Pick<MoveValidationContext<MoveInput>, "G">
  | Pick<MoveEnumerationContext, "G">
  | Pick<MoveExecutionContext<MoveInput>, "G">;

const EMPTY_TRIGGERED_ABILITIES_STATE: TriggeredAbilitiesState = {
  pendingEvents: [],
  registrations: [],
  bag: {
    nextSeq: 1,
    items: [],
  },
  usageLedger: {
    occurrences: {},
    resolutions: {},
  },
};

type TriggeredEventInput = Omit<PendingTriggeredEvent, "id">;

type TriggerMatchCandidate = {
  abilityId: string;
  abilityIndex?: number;
  controllerId: PlayerId;
  sourceId: CardInstanceId;
  cardPlayed: CardPlayedPayload;
  ability: TriggerRegistrationAbility;
  resolutionInput: PendingActionResolutionInput;
};

type TriggerSourceZone = "play" | "hand" | "discard" | "inkwell";
type PrintedTriggerScanZones = readonly TriggerSourceZone[] | null;
type DerivedRuntimeCard = import("#core").RuntimeCardWithDefinition & LorcanaCardDerived;

type RegisterAbilityParams = {
  controllerId: PlayerId;
  sourceId: CardInstanceId;
  cardPlayed: CardPlayedPayload;
  ability: TriggerRegistrationAbility;
  abilityIndex?: number;
  lifecycle:
    | {
        kind: "floating";
        startsAtTurn: number;
        expiresAtTurn: number;
      }
    | {
        kind: "delayed";
        timing: DelayedTriggerTiming;
      };
  resolutionInput: PendingActionResolutionInput;
};

function getTriggeredAbilitiesState(G: LorcanaG): TriggeredAbilitiesState {
  const currentState = G.triggeredAbilities;
  if (currentState) {
    currentState.pendingEvents ??= [];
    currentState.registrations ??= [];
    currentState.bag ??= { nextSeq: 1, items: [] };
    currentState.bag.items ??= [];
    currentState.usageLedger ??= { occurrences: {}, resolutions: {} };
    currentState.usageLedger.occurrences ??= {};
    currentState.usageLedger.resolutions ??= {};
    return currentState;
  }

  G.triggeredAbilities = {
    pendingEvents: [],
    registrations: [],
    bag: {
      nextSeq: 1,
      items: [],
    },
    usageLedger: {
      occurrences: {},
      resolutions: {},
    },
  };

  return G.triggeredAbilities;
}

function getTriggeredAbilitiesStateView(
  G: TriggerReadContext["G"] | TriggerBagStateContext["G"],
): TriggeredAbilitiesState {
  return (
    (G.triggeredAbilities as TriggeredAbilitiesState | undefined) ?? EMPTY_TRIGGERED_ABILITIES_STATE
  );
}

function getCurrentTurn(ctx: Pick<TriggerRuntimeContext, "framework">): number {
  return ctx.framework.state.status.turn ?? 1;
}

/**
 * Turn player for "during your turn" (`whose: "your"`) trigger restrictions — OTP + completed turns.
 * `framework.state.currentPlayer` follows priority and can differ from the turn player while
 * bag effects resolve (e.g. Cursed Mermaid — Poor Souls). Restrictions with `whose: "opponent"`
 * intentionally keep using `currentPlayer` (priority) for backward-compatible matching.
 */
function resolveTurnPlayerForTriggerRestrictions(
  ctx: Pick<TriggerRuntimeContext, "framework" | "G">,
): PlayerId | undefined {
  const otp = ctx.framework.state.status.otp as PlayerId | undefined;
  if (!otp) {
    return ctx.framework.state.currentPlayer as PlayerId | undefined;
  }

  const playerIds = ctx.framework.state.playerIds;
  const turnsCompleted = (ctx.G.turnsCompletedByPlayer ?? {}) as Record<string, number>;
  const totalCompletedTurns = Object.values(turnsCompleted).reduce(
    (sum, count) => sum + (count ?? 0),
    0,
  );

  if (totalCompletedTurns === 0) {
    return otp;
  }

  const otpIndex = playerIds.findIndex((p) => p === otp);
  if (otpIndex < 0 || playerIds.length === 0) {
    return otp;
  }

  const offset = totalCompletedTurns % playerIds.length;
  return playerIds[(otpIndex + offset) % playerIds.length] as PlayerId;
}

function getCompletedTurnsForPlayer(G: LorcanaG, playerId: PlayerId): number {
  return G.turnsCompletedByPlayer[playerId] ?? 0;
}

function getDelayedDueWindow(timing: DelayedTriggerTiming): DelayedTriggerWindow {
  return timing === "start-of-next-turn" ? "start-of-turn" : "end-of-turn";
}

function getDelayedDuePlayerId(
  ctx: TriggerRuntimeContext,
  timing: DelayedTriggerTiming,
  controllerId: PlayerId,
): PlayerId {
  if (timing === "end-of-turn") {
    return ctx.framework.state.currentPlayer ?? controllerId;
  }

  return controllerId;
}

function getDelayedDueCompletedTurns(
  G: LorcanaG,
  timing: DelayedTriggerTiming,
  duePlayerId: PlayerId,
  controllerId: PlayerId,
): number {
  if (timing === "end-of-turn") {
    return getCompletedTurnsForPlayer(G, duePlayerId);
  }

  return getCompletedTurnsForPlayer(G, controllerId) + 1;
}

function getCardOwnerId(
  ctx: TriggerRuntimeContext,
  cardId: string | undefined,
): PlayerId | undefined {
  if (!cardId) {
    return undefined;
  }

  return ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined;
}

function getCardType(
  ctx: TriggerRuntimeContext,
  cardId: string | undefined,
): LorcanaCard["cardType"] | undefined {
  if (!cardId) {
    return undefined;
  }

  return (ctx.cards.getDefinition(cardId) as LorcanaCard | undefined)?.cardType;
}

function getDerivedRuntimeCard(
  ctx: TriggerRuntimeContext,
  cardId: CardInstanceId,
): DerivedRuntimeCard | undefined {
  return ctx.cards.get(cardId) as DerivedRuntimeCard | undefined;
}

function normalizeBufferedEvent(raw: string | undefined): BufferedTriggeredEvent | undefined {
  switch (raw) {
    case "play":
      return "play";
    case "sing":
      return "sing";
    case "discard":
      return "discard";
    case "draw":
      return "draw";
    case "quest":
      return "quest";
    case "support":
      return "support";
    case "challenge":
      return "challenge";
    case "challenged":
      return "challenged";
    case "challenged-and-banished":
      return "challenged-and-banished";
    case "move":
      return "move";
    case "banish":
      return "banish";
    case "remove-damage":
      return "remove-damage";
    case "ready":
      return "ready";
    case "banish-in-challenge":
      return "banish-in-challenge";
    case "return-to-hand":
      return "return-to-hand";
    case "ink":
    case "inkwell":
    case "put-into-inkwell":
    case "add-to-inkwell":
      return "ink";
    case "start-turn":
    case "start-of-turn":
      return "start-turn";
    case "end-turn":
    case "end-of-turn":
      return "end-turn";
    case "be-chosen":
      return "be-chosen";
    case "boost":
      return "boost";
    case "put-card-under":
      return "put-card-under";
    case "damage":
      return "damage";
    case "deal-damage":
      return "deal-damage";
    case "exert":
      return "exert";
    case "gain-lore":
      return "gain-lore";
    case "lose-lore":
      return "lose-lore";
    case "leave-discard":
      return "leave-discard";
    default:
      return undefined;
  }
}

/**
 * "leave-play" is a composite trigger that matches any event where a card
 * exits the play zone: banish, banish-in-challenge, return-to-hand, or ink.
 */
const LEAVE_PLAY_EVENTS: BufferedTriggeredEvent[] = [
  "banish",
  "banish-in-challenge",
  "return-to-hand",
  "ink",
];

function expandTriggerEvent(raw: string | undefined): BufferedTriggeredEvent[] {
  if (raw === "leave-play") {
    return LEAVE_PLAY_EVENTS;
  }
  const normalized = normalizeBufferedEvent(raw);
  return normalized ? [normalized] : [];
}

function getPendingTriggeredEventId(
  ctx: TriggerRuntimeContext,
  event: BufferedTriggeredEvent,
): string {
  const stateId = ctx.framework.state.stateID ?? 0;
  const nextIndex = getTriggeredAbilitiesState(ctx.G).pendingEvents.length + 1;
  return `trigger-event:${stateId}:${event}:${nextIndex}`;
}

function getTriggerRegistrationId(
  ctx: TriggerRuntimeContext,
  sourceId: CardInstanceId,
  controllerId: PlayerId,
): string {
  const stateId = ctx.framework.state.stateID ?? 0;
  const nextIndex = getTriggeredAbilitiesState(ctx.G).registrations.length + 1;
  return `trigger-registration:${stateId}:${sourceId}:${controllerId}:${nextIndex}`;
}

function getBagItemId(ctx: TriggerRuntimeContext): string {
  const bag = getTriggeredAbilitiesState(ctx.G).bag;
  return `bag:${ctx.framework.state.stateID ?? 0}:${bag.nextSeq}`;
}

const ZONE_CHANGE_EVENTS: Set<BufferedTriggeredEvent> = new Set([
  "banish",
  "banish-in-challenge",
  "return-to-hand",
  "ink",
]);

function shouldAllowSnapshotCandidate(
  candidate: TriggerMatchCandidate,
  event: PendingTriggeredEvent,
): boolean {
  if (candidate.sourceId !== event.subjectCardId) {
    return true;
  }
  if (
    event.event === "banish-in-challenge" &&
    candidate.ability.trigger?.on === "OTHER_CHARACTERS" &&
    event.triggerSourceCardId !== candidate.sourceId
  ) {
    return true;
  }

  // A card entering play cannot observe its own entry through a non-SELF trigger.
  // "Whenever you play a character" requires the observer to already be in play.
  // Only explicit "When you play this character" (on: "SELF") abilities should fire.
  if (event.event === "play") {
    return candidate.ability.trigger?.on === "SELF";
  }

  // A card moving into the inkwell cannot observe its own move through a non-SELF trigger.
  // "Whenever a card is put into your inkwell" needs another card (or the ability must be
  // explicitly on this card, e.g. "When you put this character into your inkwell").
  if (event.event === "ink") {
    return candidate.ability.trigger?.on === "SELF";
  }

  // Only apply self-trigger filtering for zone-change events (banish, ink, return-to-hand).
  // For other events (e.g., remove-damage), a card CAN observe its own state changes.
  if (!ZONE_CHANGE_EVENTS.has(event.event)) {
    return true;
  }

  // When the trigger source is the subject card itself (e.g. a card being
  // banished or inked), only allow it through if the trigger can legitimately
  // match the source card.
  //
  // Triggers that explicitly exclude the source card (OTHER_CHARACTERS,
  // YOUR_OTHER_CHARACTERS, and ink-type variants) are blocked here so a
  // banished card cannot fire an ability that was intentionally written to
  // exclude itself. subjectMatches also enforces this, but the early exit
  // avoids unnecessary work.
  //
  // All other string triggers (YOUR_CHARACTERS, ANY_CHARACTER, YOUR_ITEMS,
  // etc.) are inclusive — "your characters" includes the card itself — so we
  // let subjectMatches make the final call.
  //
  // Query-based objects are also passed through; triggerMatchesEvent decides.
  const triggerOn = candidate.ability.trigger?.on;
  if (triggerOn === "SELF") {
    return true;
  }
  if (typeof triggerOn === "object" && triggerOn !== null) {
    // Query-based triggers (e.g. { controller: "you", classification: "Puppy" })
    // may legitimately match the source card — let triggerMatchesEvent decide.
    return true;
  }
  // Triggers explicitly named "other" exclude the source card by definition.
  const SELF_EXCLUSIVE_TRIGGERS = new Set([
    "OTHER_CHARACTERS",
    "YOUR_OTHER_CHARACTERS",
    "YOUR_OTHER_AMETHYST_CHARACTERS",
    "YOUR_OTHER_SAPPHIRE_CHARACTERS",
    "YOUR_OTHER_STEEL_CHARACTERS",
  ]);
  if (SELF_EXCLUSIVE_TRIGGERS.has(triggerOn as string)) {
    return false;
  }
  // All remaining string triggers are inclusive (YOUR_CHARACTERS, ANY_CHARACTER,
  // OPPONENT_CHARACTERS, YOUR_ITEMS, etc.) — pass to subjectMatches.
  return true;
}

function buildSourcePayload(ctx: TriggerRuntimeContext, sourceId: string): CardPlayedPayload {
  const definition = ctx.cards.getDefinition(sourceId) as LorcanaCard | undefined;
  const playerId = getCardOwnerId(ctx, sourceId);
  if (!definition || !playerId) {
    throw new Error(`Unable to build trigger payload for source '${String(sourceId)}'`);
  }

  return {
    playerId,
    cardId: sourceId as CardInstanceId,
    cardType: definition.cardType,
    costType: "free",
  };
}

function normalizeTriggerSourceZone(zoneKey: string | undefined): TriggerSourceZone | undefined {
  if (!zoneKey) {
    return undefined;
  }

  if (zoneKey === "play" || zoneKey.startsWith("play:")) {
    return "play";
  }
  if (zoneKey === "hand" || zoneKey.startsWith("hand:")) {
    return "hand";
  }
  if (zoneKey === "discard" || zoneKey.startsWith("discard:")) {
    return "discard";
  }
  if (zoneKey === "inkwell" || zoneKey.startsWith("inkwell:")) {
    return "inkwell";
  }

  return undefined;
}

function collectTriggeredCandidatesFromCard(args: {
  ctx: TriggerRuntimeContext;
  sourceId: CardInstanceId;
  controllerId: PlayerId;
  zone: TriggerSourceZone;
}): TriggerMatchCandidate[] {
  const { ctx, sourceId, controllerId, zone } = args;
  const definition = ctx.cards.getDefinition(sourceId) as LorcanaCard | undefined;
  if (!definition) {
    return [];
  }

  const triggerAbilities = (definition.abilities ?? [])
    .map((ability, index) => ({ ability, index }))
    .filter(
      (
        entry,
      ): entry is {
        ability: Extract<typeof entry.ability, { type: "triggered" }>;
        index: number;
      } => entry.ability.type === "triggered",
    );
  const hasPrintedSupportTriggeredAbility = triggerAbilities.some(({ ability }) => {
    if (
      ability.trigger.event !== "quest" ||
      ability.trigger.on !== "SELF" ||
      ability.effect.type !== "optional"
    ) {
      return false;
    }

    const nestedEffect = ability.effect.effect;
    return nestedEffect?.type === "support";
  });
  const meta = ctx.cards.require(sourceId).meta as LorcanaCardMeta | undefined;
  const temporaryAbilityEntries = Object.entries(meta?.temporaryAbilities ?? {});
  const currentTurn = getCurrentTurn(ctx);
  // Use the full derived card projection to check for Support. The cards API now projects from
  // a plain state snapshot (no Mutative proxy overhead), so this correctly handles Support granted
  // via conditional static abilities (e.g., "characters with strength ≥ N gain Support").
  const derived = zone === "play" ? getDerivedRuntimeCard(ctx, sourceId) : undefined;
  const hasDerivedSupport = zone === "play" && Boolean(derived?.hasSupport);

  if (
    triggerAbilities.length === 0 &&
    temporaryAbilityEntries.length === 0 &&
    !(hasDerivedSupport && !hasPrintedSupportTriggeredAbility)
  ) {
    return [];
  }
  const sourcePayload = buildSourcePayload(ctx, sourceId);
  const candidates: TriggerMatchCandidate[] = [];

  triggerAbilities.forEach(({ ability, index: abilityIndex }) => {
    const sourceZones = ability.sourceZones ?? ["play"];
    if (!sourceZones.includes(zone)) {
      return;
    }

    candidates.push({
      abilityId: ability.id ?? `${sourceId}:printed-trigger:${abilityIndex}`,
      abilityIndex,
      controllerId,
      sourceId,
      cardPlayed: sourcePayload,
      ability: {
        id: ability.id,
        name: ability.name,
        trigger: ability.trigger,
        sourceZones: ability.sourceZones,
        condition: ability.condition,
        effect: ability.effect,
        ...(ability.autoResolve === true ? { autoResolve: true } : {}),
      },
      resolutionInput: {},
    });
  });

  if (hasDerivedSupport && !hasPrintedSupportTriggeredAbility && zone === "play") {
    candidates.push({
      abilityId: `${sourceId}:synthetic-support`,
      controllerId,
      sourceId,
      cardPlayed: sourcePayload,
      ability: {
        id: `${sourceId}:synthetic-support`,
        name: "Support",
        trigger: {
          event: "quest",
          on: "SELF",
          timing: "whenever",
        },
        effect: {
          chooser: "CONTROLLER",
          effect: {
            target: "ANOTHER_CHOSEN_CHARACTER",
            type: "support",
          },
          type: "optional",
        },
      },
      resolutionInput: {},
    });
  }

  for (const [abilityKey, expiryTurn] of temporaryAbilityEntries) {
    if (
      typeof expiryTurn !== "number" ||
      !Number.isFinite(expiryTurn) ||
      currentTurn > expiryTurn
    ) {
      continue;
    }

    const startsAtTurn = meta?.temporaryAbilityStarts?.[abilityKey] ?? 1;
    if (
      typeof startsAtTurn !== "number" ||
      !Number.isFinite(startsAtTurn) ||
      currentTurn < startsAtTurn
    ) {
      continue;
    }

    const payload = meta?.temporaryAbilityPayloads?.[abilityKey] as
      | Partial<TriggeredAbilityDefinition>
      | undefined;
    if (!payload || payload.type !== "triggered" || !payload.trigger || !payload.effect) {
      continue;
    }

    const sourceZones = payload.sourceZones ?? ["play"];
    if (!sourceZones.includes(zone)) {
      continue;
    }

    const baseAbilityId =
      typeof payload.id === "string" && payload.id.length > 0
        ? payload.id
        : `${sourceId}:temporary-trigger:${abilityKey}`;

    // When multiple source cards have granted the same triggered ability to this
    // card (e.g. two Medallion Weights each granting "draw-when-challenging"),
    // instanceSourceIds accumulates each granting card's ID. Produce one candidate
    // per instance so they aren't collapsed by deduplication in
    // finalizeResolutionBoundary (which keys on sourceId:controllerId:abilityId).
    const instanceSourceIds: string[] = Array.isArray(
      (payload as Record<string, unknown>).instanceSourceIds,
    )
      ? ((payload as Record<string, unknown>).instanceSourceIds as string[])
      : [];

    const instances = instanceSourceIds.length > 1 ? instanceSourceIds : [undefined];

    for (const instanceId of instances) {
      candidates.push({
        abilityId: instanceId !== undefined ? `${baseAbilityId}:${instanceId}` : baseAbilityId,
        controllerId,
        sourceId,
        cardPlayed: sourcePayload,
        ability: {
          id: instanceId !== undefined ? `${baseAbilityId}:${instanceId}` : baseAbilityId,
          name: payload.name,
          trigger: payload.trigger,
          sourceZones: payload.sourceZones,
          condition: payload.condition,
          effect: payload.effect,
          ...(payload.autoResolve === true ? { autoResolve: true } : {}),
        },
        resolutionInput: {},
      });
    }
  }

  return candidates;
}

function cloneTriggeredEventCandidate(candidate: TriggeredEventCandidate): TriggeredEventCandidate {
  return {
    abilityId: candidate.abilityId,
    controllerId: candidate.controllerId,
    sourceId: candidate.sourceId,
    cardPlayed: {
      ...candidate.cardPlayed,
      singerIds: candidate.cardPlayed.singerIds ? [...candidate.cardPlayed.singerIds] : undefined,
    },
    ability: {
      id: candidate.ability.id,
      name: candidate.ability.name,
      trigger: candidate.ability.trigger,
      sourceZones: candidate.ability.sourceZones,
      condition: candidate.ability.condition,
      effect: candidate.ability.effect,
      ...(candidate.ability.autoResolve === true ? { autoResolve: true } : {}),
    },
    resolutionInput: cloneActionResolutionInput(candidate.resolutionInput),
  };
}

export function snapshotTriggeredCandidatesForCard(
  ctx: TriggerRuntimeContext,
  sourceId: CardInstanceId,
): TriggeredEventCandidate[] {
  const controllerId = getCardOwnerId(ctx, sourceId);
  const zone = normalizeTriggerSourceZone(ctx.framework.zones.getCardZone(sourceId));
  if (!controllerId || !zone) {
    return [];
  }

  return collectTriggeredCandidatesFromCard({
    ctx,
    sourceId,
    controllerId,
    zone,
  }).map((candidate) => cloneTriggeredEventCandidate(candidate));
}

/**
 * Snapshot all printed + floating trigger candidates from the current board state.
 * Call this BEFORE a batch effect (e.g. banish-all, AoE damage) starts moving cards
 * so that observer triggers (like "whenever one of your other characters is banished")
 * are captured while the observers are still in play.
 */
export function snapshotBoardTriggerCandidates(
  ctx: TriggerRuntimeContext,
): TriggeredEventCandidate[] {
  return [...collectPrintedTriggerCandidates(ctx), ...collectFloatingTriggerCandidates(ctx)].map(
    (candidate) => cloneTriggeredEventCandidate(candidate),
  );
}

function relationMatches(
  activePlayer: PlayerId | undefined,
  controllerId: PlayerId,
  whose: "your" | "opponent",
): boolean {
  if (!activePlayer) {
    return false;
  }

  return whose === "your" ? activePlayer === controllerId : activePlayer !== controllerId;
}

function subjectHasKeyword(
  ctx: TriggerRuntimeContext,
  event: PendingTriggeredEvent,
  subjectCardId: CardInstanceId,
  keyword: Parameters<typeof hasKeyword>[1],
): boolean {
  // 1. Check snapshot keywords (for banished cards)
  const snapshotKeywords = event.eventSnapshot?.keywordsBeforeBanish;
  if (Array.isArray(snapshotKeywords) && snapshotKeywords.includes(keyword)) {
    return true;
  }

  if (!ctx.cards.getDefinition(subjectCardId)) {
    return false;
  }

  // Use the full derived card state — the cards API projects from a plain state snapshot
  // so this correctly handles printed, temporary, and statically-granted keywords.
  const projected = getDerivedRuntimeCard(ctx, subjectCardId);
  return Array.isArray(projected?.keywords) && projected.keywords.includes(keyword);
}

function queryMatchesSubject(
  ctx: TriggerRuntimeContext,
  candidate: TriggerMatchCandidate,
  event: PendingTriggeredEvent,
  subject: TriggerSubjectQuery,
): boolean {
  const subjectCardId = event.subjectCardId;
  if (!subjectCardId) {
    return false;
  }

  const definition = ctx.cards.getDefinition(subjectCardId) as LorcanaCard | undefined;
  if (!definition) {
    return false;
  }

  const ownerId = getCardOwnerId(ctx, subjectCardId);
  if (!ownerId) {
    return false;
  }

  if (subject.excludeSelf && subjectCardId === candidate.sourceId) {
    return false;
  }

  if (subject.shiftedOntoSelf === true) {
    if (
      event.event !== "play" ||
      event.cardPlayed?.usedShift !== true ||
      event.cardPlayed.shiftTargetId !== candidate.sourceId
    ) {
      return false;
    }
  }

  if (subject.controller === "you" && ownerId !== candidate.controllerId) {
    return false;
  }
  if (subject.controller === "opponent" && ownerId === candidate.controllerId) {
    return false;
  }

  if (subject.cardType) {
    const requestedCardTypes = Array.isArray(subject.cardType)
      ? subject.cardType
      : [subject.cardType];
    const matchesRequestedCardType = requestedCardTypes.some((requestedCardType) => {
      if (definition.cardType === requestedCardType) {
        return true;
      }

      return (
        requestedCardType === "song" &&
        definition.cardType === "action" &&
        "actionSubtype" in definition &&
        definition.actionSubtype === "song"
      );
    });

    if (!matchesRequestedCardType) {
      return false;
    }
  }

  if (
    subject.excludeSong &&
    definition.cardType === "action" &&
    "actionSubtype" in definition &&
    definition.actionSubtype === "song"
  ) {
    return false;
  }

  if (subject.classification) {
    const snapshotClassifications = event.eventSnapshot?.classificationsBeforeBanish;
    const classifications: readonly string[] = Array.isArray(snapshotClassifications)
      ? [...snapshotClassifications]
      : (() => {
          const projected = getDerivedRuntimeCard(ctx, subjectCardId);
          const definitionClassifications =
            "classifications" in definition ? (definition.classifications as string[]) : undefined;
          return projected?.classifications ?? definitionClassifications ?? [];
        })();
    if (!classifications.includes(subject.classification)) {
      return false;
    }
  }

  if (subject.name && !cardHasName(definition, subject.name)) {
    return false;
  }

  if (subject.hasKeyword) {
    const keyword = subject.hasKeyword as Parameters<typeof hasKeyword>[1];
    if (!subjectHasKeyword(ctx, event, subjectCardId, keyword)) {
      return false;
    }
  }

  if (Array.isArray(subject.filters) && subject.filters.length > 0) {
    const meta = ctx.cards.require(subjectCardId).meta ?? {};
    for (const filter of subject.filters) {
      if (!filter || typeof filter !== "object" || !("type" in filter)) {
        return false;
      }

      switch (filter.type) {
        case "damaged":
          if (Number(meta.damage ?? 0) <= 0) {
            return false;
          }
          break;
        case "exerted":
          if (meta.state !== "exerted") {
            return false;
          }
          break;
        case "ready":
          if (meta.state === "exerted") {
            return false;
          }
          break;
        case "has-keyword":
          if (!subjectHasKeyword(ctx, event, subjectCardId, filter.keyword)) {
            return false;
          }
          break;
        case "ink-type": {
          const inkType = filter.inkType;
          const cardInkTypes = definition.inkType ?? [];
          if (!inkType || !cardInkTypes.includes(inkType)) {
            return false;
          }
          break;
        }
        case "strength-comparison": {
          const baseStrength = definition.cardType === "character" ? definition.strength : 0;
          // Section 3 invalidates `staticEffectsVersion` on play (zone change → "play"),
          // so the cached registry includes static modifiers (e.g. Grumpy's +1) for
          // a card that has just entered play. Previous fresh-build workaround removed.
          const freshRegistry = getOrBuildMoveRegistry(ctx);
          const getDefById = (id: CardInstanceId) =>
            ctx.cards.getDefinition(id) as LorcanaCardDefinition | undefined;
          const runtimeCard = ctx.cards.require(subjectCardId) as DerivedRuntimeCard;
          const projected = projectLorcanaCardDerived({
            definition,
            meta: (runtimeCard.meta ?? {}) as LorcanaCardMeta,
            state: createProjectionState(ctx.framework.state, ctx.G),
            cardInstanceId: subjectCardId,
            ownerID: ownerId as PlayerId,
            controllerID: (runtimeCard.controllerID ?? ownerId) as PlayerId,
            zoneID: runtimeCard.zoneID ?? "play",
            getDefinitionByInstanceId: getDefById,
            registry: freshRegistry,
          });
          const strength = Number(projected.strength ?? baseStrength ?? 0);
          if (typeof filter.value !== "number") {
            return false;
          }
          const comparisonValue = filter.value;
          if (!compareOperator(strength, String(filter.comparison ?? "equal"), comparisonValue)) {
            return false;
          }
          break;
        }
        case "cost-comparison": {
          // Two semantics share this filter:
          //   - "with cost N" → printed cost (default; e.g. Stitch — Rock
          //     Star's Adoring Fans matches by the card's printed ink cost,
          //     even when shifted in for less).
          //   - "pay N {I} or less to play" → paid ink (opt-in via
          //     costSource: "paid"; e.g. Buzz Lightyear's Secret Mission,
          //     Jessie's YODEL-AY-HEE-HOO!, Babyhead's Tighten the Bolts).
          // Without the discriminator, shift plays would incorrectly fire
          // "with cost N" triggers whenever the shift cost happened to land
          // in the trigger band.
          const filterCostSource =
            "costSource" in filter && filter.costSource ? filter.costSource : "printed";
          // For costSource: "paid", missing `inkPaid` means the card was
          // played for free (or via a non-ink cost) and the player paid
          // 0 ink — NOT that we should fall back to printed cost. A card
          // played free should still satisfy a "pay 2 or less" trigger.
          // For costSource: "printed" (or unspecified), use printed cost.
          const inkPaidCandidate =
            typeof event.cardPlayed?.inkPaid === "number" &&
            Number.isFinite(event.cardPlayed.inkPaid)
              ? event.cardPlayed.inkPaid
              : undefined;
          const cost =
            filterCostSource === "paid" ? (inkPaidCandidate ?? 0) : Number(definition.cost ?? 0);
          if (typeof filter.value !== "number") {
            return false;
          }
          const comparisonValue = filter.value;
          if (!compareOperator(cost, String(filter.comparison ?? "equal"), comparisonValue)) {
            return false;
          }
          break;
        }
        case "has-classification": {
          const snapshotClassifications = event.eventSnapshot?.classificationsBeforeBanish;
          const classifications: readonly string[] = Array.isArray(snapshotClassifications)
            ? [...snapshotClassifications]
            : (() => {
                const projected = getDerivedRuntimeCard(ctx, subjectCardId);
                const definitionClassifications =
                  "classifications" in definition
                    ? (definition.classifications as string[])
                    : undefined;
                return projected?.classifications ?? definitionClassifications ?? [];
              })();
          if (!classifications.includes(filter.classification)) {
            return false;
          }
          break;
        }
        case "at-location": {
          const subjectLocationId = meta.atLocationId as CardInstanceId | undefined;
          if (!subjectLocationId) {
            return false;
          }

          if (filter.locationName) {
            const locationDefinition = ctx.cards.getDefinition(subjectLocationId);
            return locationDefinition?.name === filter.locationName;
          }

          const expectedLocationId =
            filter.location === "this"
              ? candidate.sourceId
              : typeof filter.location === "string"
                ? (filter.location as CardInstanceId)
                : undefined;
          if (expectedLocationId) {
            return subjectLocationId === expectedLocationId;
          }

          // No explicit location was requested, so any current location satisfies the filter.
          return true;
        }
        default:
          return false;
      }
    }
  }

  return true;
}

function subjectMatches(
  ctx: TriggerRuntimeContext,
  candidate: TriggerMatchCandidate,
  event: PendingTriggeredEvent,
  subject: TriggerSubject | undefined,
): boolean {
  const subjectCardId =
    event.event === "banish-in-challenge" && subject === "OTHER_CHARACTERS"
      ? (event.triggerSourceCardId ?? event.subjectCardId)
      : event.subjectCardId;
  const subjectOwnerId = getCardOwnerId(ctx, subjectCardId);
  const subjectCardType = getCardType(ctx, subjectCardId);

  if (!subject) {
    return true;
  }

  if (typeof subject === "object") {
    return queryMatchesSubject(ctx, candidate, event, subject);
  }

  switch (subject) {
    case "SELF":
      return subjectCardId === candidate.sourceId;
    case "YOUR_CHARACTERS":
      return subjectOwnerId === candidate.controllerId && subjectCardType === "character";
    case "YOUR_OTHER_CHARACTERS":
      return (
        subjectOwnerId === candidate.controllerId &&
        subjectCardType === "character" &&
        subjectCardId !== candidate.sourceId
      );
    case "YOUR_OTHER_AMETHYST_CHARACTERS":
    case "YOUR_OTHER_SAPPHIRE_CHARACTERS":
    case "YOUR_OTHER_STEEL_CHARACTERS": {
      if (
        subjectOwnerId !== candidate.controllerId ||
        subjectCardType !== "character" ||
        subjectCardId === candidate.sourceId
      ) {
        return false;
      }
      const requiredInk =
        subject === "YOUR_OTHER_AMETHYST_CHARACTERS"
          ? "amethyst"
          : subject === "YOUR_OTHER_SAPPHIRE_CHARACTERS"
            ? "sapphire"
            : "steel";
      const def = subjectCardId
        ? (ctx.cards.getDefinition(subjectCardId) as LorcanaCardDefinition | undefined)
        : undefined;
      return def?.inkType?.includes(requiredInk as never) ?? false;
    }
    case "OPPONENT_CHARACTERS":
    case "OPPOSING_CHARACTERS":
      return subjectOwnerId !== undefined && subjectOwnerId !== candidate.controllerId;
    case "OTHER_CHARACTERS":
      return subjectCardType === "character" && subjectCardId !== candidate.sourceId;
    case "ANY_CHARACTER":
      return subjectCardType === "character";
    case "YOUR_ITEMS":
      return subjectOwnerId === candidate.controllerId && subjectCardType === "item";
    case "ANY_ITEM":
      return subjectCardType === "item";
    case "YOUR_LOCATIONS":
      return subjectOwnerId === candidate.controllerId && subjectCardType === "location";
    case "YOUR_CHARACTERS_OR_LOCATIONS":
      return (
        subjectOwnerId === candidate.controllerId &&
        (subjectCardType === "character" || subjectCardType === "location")
      );
    case "YOUR_CHARACTERS_OR_LOCATIONS_WITH_CARD_UNDER": {
      if (!subjectCardId) {
        return false;
      }
      if (
        subjectOwnerId !== candidate.controllerId ||
        (subjectCardType !== "character" && subjectCardType !== "location")
      ) {
        return false;
      }

      const cardsUnder = ctx.cards.require(subjectCardId).meta?.cardsUnder;
      return Array.isArray(cardsUnder) && cardsUnder.length > 0;
    }
    case "YOUR_ACTIONS":
      return subjectOwnerId === candidate.controllerId && subjectCardType === "action";
    case "YOUR_SONGS": {
      if (subjectOwnerId !== candidate.controllerId || subjectCardType !== "action") {
        return false;
      }
      const songDefinition = subjectCardId
        ? (ctx.cards.getDefinition(subjectCardId) as LorcanaCardDefinition | undefined)
        : undefined;
      return (
        songDefinition?.cardType === "action" &&
        "actionSubtype" in songDefinition &&
        songDefinition.actionSubtype === "song"
      );
    }
    case "CHARACTERS_HERE":
    case "CHARACTER_HERE": {
      const subjectAtLocationId =
        (event.eventSnapshot?.subjectAtLocationId as CardInstanceId | undefined) ??
        (subjectCardId
          ? (ctx.cards.get(subjectCardId)?.meta?.atLocationId as CardInstanceId | undefined)
          : undefined);
      return (
        subjectCardId !== undefined &&
        subjectCardType === "character" &&
        subjectAtLocationId === candidate.sourceId
      );
    }
    case "YOU":
    case "CONTROLLER":
      return event.playerId === candidate.controllerId;
    case "OPPONENT":
      return event.playerId !== undefined && event.playerId !== candidate.controllerId;
    case "ANY_PLAYER":
      return event.playerId !== undefined;
    default:
      return false;
  }
}

function restrictionsMatch(
  ctx: TriggerRuntimeContext,
  candidate: TriggerMatchCandidate,
  trigger: Trigger,
  event: PendingTriggeredEvent,
): boolean {
  const restrictions = trigger.restrictions ?? [];
  if (restrictions.length === 0) {
    return true;
  }

  return restrictions.every((restriction: TriggerRestriction) => {
    switch (restriction.type) {
      case "during-turn": {
        const activePlayer = resolveTurnPlayerForTriggerRestrictions(ctx);
        return relationMatches(activePlayer, candidate.controllerId, restriction.whose);
      }
      case "from-location":
        return typeof event.fromZone === "string" && event.fromZone.startsWith("location:");
      case "from-discard":
        return (
          typeof event.fromZone === "string" &&
          (event.fromZone === "discard" || event.fromZone.startsWith("discard:"))
        );
      case "to-hand":
        return typeof event.toZone === "string" && event.toZone === "hand";
      case "in-challenge":
        return event.happenedInChallenge === true;
      case "defender-is-character":
        return event.defenderId !== undefined && getCardType(ctx, event.defenderId) === "character";
      case "once-per-turn":
      case "first-time-each-turn":
      case "n-times-per-turn":
      case "once-per-song":
        return true;
      default:
        return false;
    }
  });
}

function getUsageKey(
  turn: number,
  sourceId: CardInstanceId,
  abilityId: string,
  occurrenceScope?: string,
): string {
  return occurrenceScope
    ? `${turn}:${sourceId}:${abilityId}:${occurrenceScope}`
    : `${turn}:${sourceId}:${abilityId}`;
}

function getOccurrenceScope(
  trigger: Trigger | undefined,
  event?: Pick<PendingTriggeredEvent, "triggerSourceCardId">,
): string | undefined {
  if (
    trigger?.restrictions?.some((restriction) => restriction.type === "once-per-song") &&
    event?.triggerSourceCardId
  ) {
    return `song:${event.triggerSourceCardId}`;
  }

  return undefined;
}

function shouldSkipByNTimesPerTurn(
  ctx: TriggerRuntimeContext,
  candidate: TriggerMatchCandidate,
  event?: Pick<PendingTriggeredEvent, "triggerSourceCardId">,
): boolean {
  const restrictions = candidate.ability.trigger.restrictions;
  if (!restrictions) {
    return false;
  }
  const currentTurn = getCurrentTurn(ctx);
  const abilityKey = getUsageKey(
    currentTurn,
    candidate.sourceId,
    candidate.abilityId,
    getOccurrenceScope(candidate.ability.trigger, event),
  );
  const occurrences = getTriggeredAbilitiesState(ctx.G).usageLedger.occurrences[abilityKey] ?? 0;
  const resolutions = getTriggeredAbilitiesState(ctx.G).usageLedger.resolutions[abilityKey] ?? 0;

  if (restrictions.some((r) => r.type === "once-per-turn") && occurrences > 0) {
    return true;
  }

  if (restrictions.some((r) => r.type === "first-time-each-turn") && occurrences > 0) {
    return true;
  }

  if (restrictions.some((r) => r.type === "once-per-song") && occurrences > 0) {
    return true;
  }

  const nTimesRestriction = restrictions.find(
    (r): r is Extract<TriggerRestriction, { type: "n-times-per-turn" }> =>
      r.type === "n-times-per-turn",
  );
  if (nTimesRestriction && resolutions >= nTimesRestriction.count) {
    return true;
  }

  return false;
}

function challengeParticipantMatches(args: {
  ctx: TriggerRuntimeContext;
  candidate: TriggerMatchCandidate;
  participantCardId?: CardInstanceId;
  participant?: { controller?: string; filters?: readonly unknown[] };
  event: PendingTriggeredEvent;
}): boolean {
  const { ctx, candidate, participantCardId, participant, event } = args;
  if (!participant) {
    return true;
  }

  if (!participantCardId) {
    return false;
  }

  const participantDefinition = ctx.cards.getDefinition(participantCardId) as
    | LorcanaCard
    | undefined;
  if (participantDefinition?.cardType !== "character") {
    return false;
  }

  const participantOwnerId = getCardOwnerId(ctx, participantCardId);
  if (!participantOwnerId) {
    return false;
  }

  if (participant.controller === "you" && participantOwnerId !== candidate.controllerId) {
    return false;
  }
  if (participant.controller === "opponent" && participantOwnerId === candidate.controllerId) {
    return false;
  }

  const filters = Array.isArray(participant.filters) ? participant.filters : [];
  const eventSnapshot = {
    ...(event.eventSnapshot ? { ...event.eventSnapshot } : {}),
    subjectCardId: event.subjectCardId,
    triggerSourceCardId: event.triggerSourceCardId,
    attackerId: event.attackerId,
    defenderId: event.defenderId,
    fromZone: event.fromZone,
    toZone: event.toZone,
  };

  return filters.every(
    (filter) =>
      filter &&
      typeof filter === "object" &&
      passesFilter(
        ctx as Parameters<typeof passesFilter>[0],
        participantCardId,
        filter as Parameters<typeof passesFilter>[2],
        candidate.controllerId,
        {
          eventSnapshot,
          sourceCardId: candidate.sourceId,
          strictUnknownFilters: true,
        },
      ),
  );
}

function buildTriggeredResolutionInput(
  candidate: TriggerMatchCandidate,
  event: PendingTriggeredEvent,
): PendingActionResolutionInput {
  return {
    ...cloneActionResolutionInput(candidate.resolutionInput),
    ...(event.event === "sing" &&
    event.triggerSourceCardId &&
    candidate.resolutionInput.targets === undefined
      ? { targets: event.triggerSourceCardId }
      : {}),
    eventSnapshot: {
      ...(event.eventSnapshot ? { ...event.eventSnapshot } : {}),
      ...(event.cardPlayed
        ? {
            playedCardSingerCount: Array.isArray(event.cardPlayed.singerIds)
              ? event.cardPlayed.singerIds.length
              : undefined,
            playedCardUsedShift: event.cardPlayed.usedShift === true,
          }
        : {}),
      subjectCardId: event.subjectCardId,
      triggerSourceCardId: event.triggerSourceCardId,
      attackerId: event.attackerId,
      defenderId: event.defenderId,
      fromZone: event.fromZone,
      toZone: event.toZone,
    },
    triggerContext: {
      playerId: event.playerId,
      subjectCardId: event.subjectCardId,
      triggerSourceCardId: event.triggerSourceCardId,
      attackerId: event.attackerId,
      defenderId: event.defenderId,
    },
  };
}

function evaluateTriggeredAbilityCondition(args: {
  ctx: TriggerRuntimeContext;
  candidate: TriggerMatchCandidate;
  condition: Condition | undefined;
  resolutionInput: PendingActionResolutionInput;
  triggerEvent?: string;
  zoneTypeCache?: PlayZoneCardTypeCache;
}): boolean {
  const { ctx, candidate, condition, resolutionInput, triggerEvent, zoneTypeCache } = args;
  if (!condition) {
    return true;
  }

  switch (condition.type) {
    case "and":
      return condition.conditions.every((entry) =>
        evaluateTriggeredAbilityCondition({
          ctx,
          candidate,
          condition: entry,
          resolutionInput,
          triggerEvent,
          zoneTypeCache,
        }),
      );
    case "or":
      return condition.conditions.some((entry) =>
        evaluateTriggeredAbilityCondition({
          ctx,
          candidate,
          condition: entry,
          resolutionInput,
          triggerEvent,
          zoneTypeCache,
        }),
      );
    case "not":
      return !evaluateTriggeredAbilityCondition({
        ctx,
        candidate,
        condition: condition.condition,
        resolutionInput,
        triggerEvent,
        zoneTypeCache,
      });
    case "during-turn":
    case "turn": {
      const activePlayer =
        condition.whose === "your"
          ? resolveTurnPlayerForTriggerRestrictions(ctx)
          : ((ctx.framework.state.priority.holder ?? ctx.framework.state.currentPlayer) as
              | PlayerId
              | undefined);
      return relationMatches(activePlayer, candidate.controllerId, condition.whose);
    }
    case "your-turn":
      return resolveTurnPlayerForTriggerRestrictions(ctx) === candidate.controllerId;
    case "is-exerted":
    case "exerted": {
      const selectedTargets = Array.isArray(resolutionInput.targets)
        ? resolutionInput.targets
        : resolutionInput.targets
          ? [resolutionInput.targets]
          : [];
      const conditionTarget =
        "target" in condition ? (condition as { target?: string }).target : undefined;
      const targetId =
        conditionTarget === "SELF" || conditionTarget == null
          ? candidate.sourceId
          : selectedTargets[0];
      if (!targetId) {
        return false;
      }
      return ctx.cards.require(targetId).meta?.state === "exerted";
    }
    case "opponent-has-damaged-character": {
      const opponentIds = ctx.framework.state.playerIds.filter(
        (playerId) => playerId !== candidate.controllerId,
      );
      return opponentIds.some(
        (playerId) => countDamagedCharactersInPlay(ctx, playerId, zoneTypeCache) > 0,
      );
    }
    case "trigger-subject-had-card-under": {
      const snapshotCount = resolutionInput.eventSnapshot?.cardsUnderCountBeforeBanish;
      return typeof snapshotCount === "number" && snapshotCount > 0;
    }
    case "turn-metric": {
      // For draw events with a "cards-drawn-by-player" metric, we can eagerly evaluate
      // using the per-event snapshot count. This correctly handles batch draws: each
      // individual draw event carries the count at draw time rather than the batch-updated
      // game state, avoiding false positives/negatives from concurrent draw increments.
      if (
        triggerEvent === "draw" &&
        condition.metric === "cards-drawn-by-player" &&
        condition.comparison
      ) {
        const snapshotCount = resolutionInput.eventSnapshot?.drawCountForPlayerThisTurn;
        const drawingPlayerId = resolutionInput.triggerContext?.playerId;
        if (snapshotCount !== undefined && drawingPlayerId !== undefined) {
          const controllerId = candidate.controllerId;
          const drawerIsOpponent = drawingPlayerId !== controllerId;
          const drawerIsController = drawingPlayerId === controllerId;
          const scopeMatchesDrawer =
            (condition.playerScope === "opponent" && drawerIsOpponent) ||
            ((condition.playerScope === "you" || condition.playerScope === undefined) &&
              drawerIsController) ||
            (condition.playerScope === "any" && ctx.framework.state.playerIds.length <= 2);
          if (scopeMatchesDrawer) {
            return compareOperator(
              snapshotCount,
              condition.comparison.operator,
              condition.comparison.value,
            );
          }
        }
      }

      // For end-turn triggers, evaluate turn-metric conditions eagerly at trigger time
      // because the turn state is fully settled. For other triggers (e.g. play events),
      // defer to resolution time since metrics may not be fully updated yet.
      if (triggerEvent !== "end-turn") {
        return true;
      }
      const conditionCtx = buildConditionContext({
        ctx,
        playerId: candidate.controllerId,
        sourceCardId: candidate.sourceId,
        resolutionInput,
        zoneTypeCache,
      });
      return evaluateCondition(condition, conditionCtx);
    }
    case "target-query":
    case "comparison":
    case "resource-count":
    case "no-damage":
    case "has-no-damage":
    case "has-named-character":
    case "has-character-count":
    case "has-item-count":
    case "has-location-count":
    case "has-location-in-play":
    case "has-character-with-classification":
    case "has-another-character":
    case "has-card-under":
    case "put-card-under-self-this-turn":
    case "at-location":
    case "stat-threshold": {
      // Board-state "if" conditions must be checked at trigger time per Lorcana rules:
      // if the condition is not met when the event occurs, the ability should not trigger.
      const conditionCtx = buildConditionContext({
        ctx,
        playerId: candidate.controllerId,
        sourceCardId: candidate.sourceId,
        resolutionInput,
        zoneTypeCache,
      });
      return evaluateCondition(condition, conditionCtx);
    }
    case "used-shift":
      return (
        candidate.cardPlayed?.usedShift === true ||
        resolutionInput.eventSnapshot?.playedCardUsedShift === true
      );
    default:
      return true;
  }
}

function triggerMatchesEvent(
  ctx: TriggerRuntimeContext,
  candidate: TriggerMatchCandidate,
  event: PendingTriggeredEvent,
  zoneTypeCache?: PlayZoneCardTypeCache,
): boolean {
  const trigger = candidate.ability.trigger;
  const supportedEvents = [
    trigger.event,
    ...(Array.isArray(trigger.events)
      ? trigger.events
          .map((entry) => (typeof entry === "string" ? entry : entry?.event))
          .filter((entry): entry is string => typeof entry === "string")
      : []),
  ].flatMap((entry) => expandTriggerEvent(entry));

  if (supportedEvents.length === 0 || !supportedEvents.includes(event.event)) {
    return false;
  }

  if (!subjectMatches(ctx, candidate, event, trigger.on)) {
    return false;
  }

  if (
    trigger.sourceFilter?.cardType &&
    trigger.sourceFilter.cardType.length > 0 &&
    (!event.sourceCardType ||
      !trigger.sourceFilter.cardType.includes(
        event.sourceCardType as "character" | "action" | "item" | "location",
      ))
  ) {
    return false;
  }

  // Check sourceController filter (e.g., "opponent" means only opponent's actions trigger)
  if (trigger.sourceFilter?.sourceController && event.triggerSourceCardId) {
    const sourceOwner = ctx.framework.zones.getCardOwner(event.triggerSourceCardId) as
      | PlayerId
      | undefined;
    if (sourceOwner) {
      const isOpponent = sourceOwner !== candidate.controllerId;
      if (trigger.sourceFilter.sourceController === "opponent" && !isOpponent) {
        return false;
      }
      if (trigger.sourceFilter.sourceController === "you" && isOpponent) {
        return false;
      }
    }
  }

  if (!restrictionsMatch(ctx, candidate, trigger, event)) {
    return false;
  }

  if (
    !challengeParticipantMatches({
      ctx,
      candidate,
      participantCardId: event.attackerId,
      participant: "attacker" in trigger ? trigger.attacker : undefined,
      event,
    })
  ) {
    return false;
  }

  if (
    !challengeParticipantMatches({
      ctx,
      candidate,
      participantCardId: event.defenderId,
      participant: "defender" in trigger ? trigger.defender : undefined,
      event,
    })
  ) {
    return false;
  }

  const triggerDef = candidate.ability.trigger;
  const triggerEvent =
    typeof triggerDef === "object" && triggerDef !== null && "event" in triggerDef
      ? (triggerDef as { event: string }).event
      : undefined;

  const resolvedResolutionInput = buildTriggeredResolutionInput(candidate, event);

  const triggerCondition =
    typeof triggerDef === "object" && triggerDef !== null && "condition" in triggerDef
      ? (triggerDef as { condition?: Condition }).condition
      : undefined;

  if (
    !evaluateTriggeredAbilityCondition({
      ctx,
      candidate,
      condition: triggerCondition,
      resolutionInput: resolvedResolutionInput,
      triggerEvent,
      zoneTypeCache,
    })
  ) {
    return false;
  }

  // Board-state conditions on ability.condition (e.g. has-character-count,
  // has-character-with-classification) are also evaluated at trigger time.
  // evaluateTriggeredAbilityCondition returns true for non-board-state types
  // (turn-metric, your-turn, used-shift, etc.), so they are not affected here
  // and continue to be checked only at resolution time per CRD 2.0 Rule 6.2.7.
  const abilityCondition = candidate.ability.condition;
  if (
    abilityCondition &&
    !evaluateTriggeredAbilityCondition({
      ctx,
      candidate,
      condition: abilityCondition,
      resolutionInput: resolvedResolutionInput,
      triggerEvent,
      zoneTypeCache,
    })
  ) {
    return false;
  }

  return true;
}

function shouldDeduplicateDiscardBatch(trigger: Trigger, event: PendingTriggeredEvent): boolean {
  if (event.event !== "discard" || !event.eventSnapshot?.triggerBatchKey) {
    return false;
  }

  switch (trigger.on) {
    case "YOU":
    case "CONTROLLER":
    case "OPPONENT":
    case "ANY_PLAYER":
      return true;
    default:
      return false;
  }
}

function recordOccurrence(
  ctx: TriggerRuntimeContext,
  sourceId: CardInstanceId,
  abilityId: string,
  occurrenceScope?: string,
): { abilityKey: string; occurrenceIndex: number } {
  const currentTurn = getCurrentTurn(ctx);
  const abilityKey = getUsageKey(currentTurn, sourceId, abilityId, occurrenceScope);
  const ledger = getTriggeredAbilitiesState(ctx.G).usageLedger.occurrences;
  const occurrenceIndex = (ledger[abilityKey] ?? 0) + 1;
  ledger[abilityKey] = occurrenceIndex;
  return { abilityKey, occurrenceIndex };
}

function enqueueBagEffect(
  ctx: TriggerRuntimeContext,
  entry: Omit<BagEffectEntry, "id" | "type">,
): BagEffectEntry {
  const bag = getTriggeredAbilitiesState(ctx.G).bag;
  const bagEntry: BagEffectEntry = {
    id: getBagItemId(ctx),
    type: "bag-effect",
    ...entry,
  };

  bag.nextSeq += 1;
  bag.items.push(bagEntry);
  traceLorcanaRuntimeStep({
    kind: "bag.effect.queued",
    moveId: "resolveBag",
    playerId: bagEntry.controllerId,
    bagItemId: bagEntry.id,
    cardId: bagEntry.sourceId,
    cardName: getLorcanaCardName(bagEntry.sourceId, (cardId) => ctx.cards.getDefinition(cardId)),
    message: "Bag effect is queued",
    payload: {
      abilityId: bagEntry.abilityId,
      occurrenceIndex: bagEntry.occurrenceIndex,
    },
  });
  return bagEntry;
}

function getPrintedTriggerScanZones(window?: TriggerWindow): PrintedTriggerScanZones {
  switch (window) {
    case "after-challenge":
      return ["play"];
    case "start-of-turn":
      return ["play", "discard"];
    case "end-of-turn":
      return ["play"];
    default:
      return null;
  }
}

function isDelayedTriggerWindow(window: TriggerWindow): window is DelayedTriggerWindow {
  return window === "start-of-turn" || window === "end-of-turn";
}

function collectPrintedTriggerCandidates(
  ctx: TriggerRuntimeContext,
  params?: { window?: TriggerWindow },
): TriggerMatchCandidate[] {
  const candidates: TriggerMatchCandidate[] = [];
  const zoneBuckets =
    getPrintedTriggerScanZones(params?.window) ?? (["play", "hand", "discard", "inkwell"] as const);

  for (const playerId of ctx.framework.state.playerIds) {
    const visitedCardIds = new Set<string>();

    for (const zone of zoneBuckets) {
      const cardsInZone = ctx.framework.zones.getCards({ zone, playerId });
      for (const cardId of cardsInZone) {
        if (visitedCardIds.has(cardId)) {
          continue;
        }

        const definition = ctx.cards.getDefinition(cardId);
        if (!definition) {
          continue;
        }

        visitedCardIds.add(cardId);
        candidates.push(
          ...collectTriggeredCandidatesFromCard({
            ctx,
            sourceId: cardId as CardInstanceId,
            controllerId: playerId,
            zone,
          }),
        );
      }
    }
  }

  return candidates;
}

function collectFloatingTriggerCandidates(ctx: TriggerRuntimeContext): TriggerMatchCandidate[] {
  const currentTurn = getCurrentTurn(ctx);
  return getTriggeredAbilitiesState(ctx.G)
    .registrations.filter(
      (entry) =>
        entry.lifecycle.kind === "floating" &&
        currentTurn >= entry.lifecycle.startsAtTurn &&
        currentTurn <= entry.lifecycle.expiresAtTurn,
    )
    .map((entry) => ({
      abilityId: entry.abilityId,
      abilityIndex: entry.abilityIndex,
      controllerId: entry.controllerId,
      sourceId: entry.sourceId,
      cardPlayed: {
        ...entry.cardPlayed,
        singerIds: entry.cardPlayed.singerIds ? [...entry.cardPlayed.singerIds] : undefined,
      },
      ability: entry.ability,
      resolutionInput: cloneActionResolutionInput(entry.resolutionInput),
    }));
}

function enqueueMatchedTrigger(
  ctx: TriggerRuntimeContext,
  candidate: TriggerMatchCandidate,
  event: PendingTriggeredEvent,
): BagEffectEntry {
  const { abilityKey, occurrenceIndex } = recordOccurrence(
    ctx,
    candidate.sourceId,
    candidate.abilityId,
    getOccurrenceScope(candidate.ability.trigger, event),
  );

  const resolutionInput = buildTriggeredResolutionInput(candidate, event);
  const cardPlayed = {
    ...candidate.cardPlayed,
    singerIds:
      event.event === "sing" && event.cardPlayed?.singerIds
        ? [...event.cardPlayed.singerIds]
        : candidate.cardPlayed.singerIds
          ? [...candidate.cardPlayed.singerIds]
          : undefined,
  };

  const entry = enqueueBagEffect(ctx, {
    kind: "triggered-ability",
    abilityId: candidate.abilityId,
    abilityIndex: candidate.abilityIndex,
    abilityKey,
    abilityName: candidate.ability.name,
    ...(candidate.ability.autoResolve === true ? { autoResolve: true } : {}),
    controllerId: candidate.controllerId,
    chooserId: candidate.controllerId,
    sourceId: candidate.sourceId,
    cardPlayed,
    trigger: candidate.ability.trigger,
    condition: candidate.ability.condition,
    effect: candidate.ability.effect,
    occurrenceIndex,
    resolutionInput,
  });
  return entry;
}

function enqueueDueDelayedRegistrations(
  ctx: TriggerRuntimeContext,
  params: {
    playerId: PlayerId;
    window: DelayedTriggerWindow;
  },
): number {
  const state = getTriggeredAbilitiesState(ctx.G);
  const completedTurns = getCompletedTurnsForPlayer(ctx.G, params.playerId);
  const dueRegistrations = state.registrations.filter(
    (entry) =>
      entry.lifecycle.kind === "delayed" &&
      entry.lifecycle.duePlayerId === params.playerId &&
      entry.lifecycle.dueWindow === params.window &&
      entry.lifecycle.dueCompletedTurns === completedTurns,
  );

  if (dueRegistrations.length === 0) {
    return 0;
  }

  state.registrations = state.registrations.filter(
    (entry) => !dueRegistrations.some((candidate) => candidate.id === entry.id),
  );

  for (const registration of dueRegistrations) {
    const { abilityKey, occurrenceIndex } = recordOccurrence(
      ctx,
      registration.sourceId,
      registration.abilityId,
    );
    enqueueBagEffect(ctx, {
      kind: "triggered-ability",
      abilityId: registration.abilityId,
      abilityIndex: registration.abilityIndex,
      abilityKey,
      abilityName: registration.ability.name,
      ...(registration.ability.autoResolve === true ? { autoResolve: true } : {}),
      controllerId: registration.controllerId,
      chooserId: registration.controllerId,
      sourceId: registration.sourceId,
      cardPlayed: {
        ...registration.cardPlayed,
        singerIds: registration.cardPlayed.singerIds
          ? [...registration.cardPlayed.singerIds]
          : undefined,
      },
      trigger: registration.ability.trigger,
      condition: registration.ability.condition,
      effect: registration.ability.effect,
      occurrenceIndex,
      resolutionInput: cloneActionResolutionInput(registration.resolutionInput),
    });
  }

  return dueRegistrations.length;
}

function getTriggerCandidateKey(
  candidate: Pick<TriggerMatchCandidate, "sourceId" | "controllerId" | "abilityId">,
): string {
  return `${candidate.sourceId}:${candidate.controllerId}:${candidate.abilityId}`;
}

export function recordEvent(
  ctx: TriggerRuntimeContext,
  input: TriggeredEventInput,
): PendingTriggeredEvent {
  const state = getTriggeredAbilitiesState(ctx.G);
  const entry: PendingTriggeredEvent = {
    id: getPendingTriggeredEventId(ctx, input.event),
    ...input,
    triggerCandidates: input.triggerCandidates?.map((candidate) =>
      cloneTriggeredEventCandidate(candidate),
    ),
  };

  state.pendingEvents.push(entry);
  return entry;
}

export function openWindow(
  ctx: TriggerRuntimeContext,
  params: {
    window: TriggerWindow;
    playerId?: PlayerId;
    events?: TriggeredEventInput | TriggeredEventInput[];
  },
): void {
  if (params.window === "start-of-turn" && params.playerId) {
    recordEvent(ctx, {
      event: "start-turn",
      playerId: params.playerId,
    });
  }

  if (params.window === "end-of-turn" && params.playerId) {
    recordEvent(ctx, {
      event: "end-turn",
      playerId: params.playerId,
    });
  }

  if (Array.isArray(params.events)) {
    params.events.forEach((entry) => recordEvent(ctx, entry));
    return;
  }

  if (params.events) {
    recordEvent(ctx, params.events);
  }
}

export function emitTriggeredLorcanaEvent<
  TType extends Parameters<typeof emitLorcanaDomainEvent>[1],
>(
  ctx: TriggerRuntimeContext,
  customType: TType,
  data: Parameters<typeof emitLorcanaDomainEvent<TType>>[2],
  triggeredEvent?: TriggeredEventInput | TriggeredEventInput[],
): void {
  emitLorcanaDomainEvent(ctx.framework.events, customType, data);
  const triggeredEventWithPayload = (entry: TriggeredEventInput): TriggeredEventInput => {
    if (customType !== "cardPlayed") {
      return entry;
    }

    const cardPlayed = data as CardPlayedPayload;
    return {
      ...entry,
      cardPlayed: {
        ...cardPlayed,
        singerIds: cardPlayed.singerIds ? [...cardPlayed.singerIds] : undefined,
      },
    };
  };

  if (Array.isArray(triggeredEvent)) {
    triggeredEvent.forEach((entry) => recordEvent(ctx, triggeredEventWithPayload(entry)));
    return;
  }

  if (triggeredEvent) {
    recordEvent(ctx, triggeredEventWithPayload(triggeredEvent));
  }
}

export function registerAbility(
  ctx: TriggerRuntimeContext,
  params: RegisterAbilityParams,
): TriggerRegistration {
  const state = getTriggeredAbilitiesState(ctx.G);
  const registrationId = getTriggerRegistrationId(ctx, params.sourceId, params.controllerId);
  const lifecycle =
    params.lifecycle.kind === "floating"
      ? {
          kind: "floating" as const,
          startsAtTurn: params.lifecycle.startsAtTurn,
          expiresAtTurn: params.lifecycle.expiresAtTurn,
        }
      : (() => {
          const duePlayerId = getDelayedDuePlayerId(
            ctx,
            params.lifecycle.timing,
            params.controllerId,
          );
          return {
            kind: "delayed" as const,
            timing: params.lifecycle.timing,
            dueWindow: getDelayedDueWindow(params.lifecycle.timing),
            duePlayerId,
            dueCompletedTurns: getDelayedDueCompletedTurns(
              ctx.G,
              params.lifecycle.timing,
              duePlayerId,
              params.controllerId,
            ),
          };
        })();

  const entry: TriggerRegistration = {
    id: registrationId,
    abilityId: params.ability.id ?? registrationId,
    abilityIndex: params.abilityIndex,
    sourceId: params.sourceId,
    controllerId: params.controllerId,
    cardPlayed: {
      ...params.cardPlayed,
      singerIds: params.cardPlayed.singerIds ? [...params.cardPlayed.singerIds] : undefined,
    },
    ability: {
      id: params.ability.id,
      name: params.ability.name,
      trigger: params.ability.trigger,
      sourceZones: params.ability.sourceZones,
      condition: params.ability.condition,
      effect: params.ability.effect,
      ...(params.ability.autoResolve === true ? { autoResolve: true } : {}),
    },
    lifecycle,
    resolutionInput: cloneActionResolutionInput(params.resolutionInput),
  };

  state.registrations.push(entry);
  return entry;
}

export function pruneExpiredTriggerRegistrations(G: LorcanaG, currentTurn: number): void {
  const state = getTriggeredAbilitiesState(G);
  state.registrations = state.registrations.filter(
    (entry) => entry.lifecycle.kind === "delayed" || currentTurn <= entry.lifecycle.expiresAtTurn,
  );
}

/**
 * CRD 6.2.7: Triggered abilities are enqueued unconditionally; conditions are checked at
 * resolution. However, `turn-metric` conditions reference immutable turn history (e.g.
 * "played a Princess character this turn") which cannot change during bag resolution. We
 * auto-fizzle these so the player is not presented with a pointless optional prompt.
 *
 * Other condition types (target-query, etc.) are NOT fizzled here because another bag
 * item resolving first could change the game state and make the condition true.
 */
function pruneFailedConditionBagEffects(ctx: TriggerRuntimeContext): void {
  const state = getTriggeredAbilitiesState(ctx.G);
  const bagItems = state.bag.items;
  if (!bagItems || bagItems.length === 0) return;

  const toRemove: string[] = [];
  for (const item of bagItems) {
    if (!item.condition) continue;
    // Only auto-fizzle turn-metric conditions — they check historical facts that
    // can't change during bag resolution.
    if ((item.condition as { type?: string }).type !== "turn-metric") continue;

    // NOTE: this site historically omitted `zoneTypeCache` and `registry`. The
    // canonical builder defaults `registry` to `getOrBuildMoveRegistry(ctx)`,
    // which is more correct than passing `undefined` — ability evaluation that
    // depends on static effects (e.g. granted abilities, stat-modified targets)
    // can now resolve. `zoneTypeCache` remains intentionally absent because
    // bag-prune runs once per item, not per zone-batch.
    const condCtx = buildConditionContext({
      ctx,
      playerId: item.controllerId,
      sourceCardId: item.sourceId,
      cardPlayed: item.cardPlayed,
      resolutionInput: item.resolutionInput ?? {},
    });

    try {
      if (!evaluateCondition(item.condition, condCtx)) {
        toRemove.push(item.id);
        traceLorcanaRuntimeStep({
          kind: "bag.effect.skipped",
          bagItemId: item.id,
          cardId: item.sourceId,
          cardName: item.abilityName,
          message:
            "Bag effect auto-fizzled: turn-metric condition already false at resolution boundary",
        });
      }
    } catch {
      // If condition evaluation fails (missing context), keep the item for resolution-time check.
    }
  }

  if (toRemove.length > 0) {
    state.bag.items = bagItems.filter((item) => !toRemove.includes(item.id));
  }
}

export function finalizeResolutionBoundary(
  ctx: TriggerRuntimeContext,
  params?: {
    playerId?: PlayerId;
    window?: TriggerWindow;
  },
): number {
  const state = getTriggeredAbilitiesState(ctx.G);
  const events = [...state.pendingEvents];

  state.pendingEvents = [];

  let created = 0;
  if (events.length > 0) {
    const boardCandidates = [
      ...collectPrintedTriggerCandidates(ctx, { window: params?.window }),
      ...collectFloatingTriggerCandidates(ctx),
    ];
    const deduplicatedDiscardBatches = new Set<string>();
    const deduplicatedSingBatches = new Set<string>();
    const deduplicatedCompositeMatches = new Set<string>();
    const zoneTypeCache = buildPlayZoneCardTypeCache(ctx);

    for (const event of events) {
      const eventCandidates: TriggerMatchCandidate[] = (event.triggerCandidates ?? [])
        .map((candidate) => cloneTriggeredEventCandidate(candidate))
        .filter((candidate) => shouldAllowSnapshotCandidate(candidate, event));
      const filteredBoardCandidates = boardCandidates.filter((candidate) =>
        shouldAllowSnapshotCandidate(candidate, event),
      );
      const seenCandidates = new Set<string>();
      for (const candidate of [...eventCandidates, ...filteredBoardCandidates]) {
        const candidateKey = getTriggerCandidateKey(candidate);
        if (seenCandidates.has(candidateKey)) {
          continue;
        }
        seenCandidates.add(candidateKey);

        if (!triggerMatchesEvent(ctx, candidate, event, zoneTypeCache)) {
          continue;
        }

        // Deduplicate across events for composite triggers (e.g., "leave-play"
        // expands to ["banish", "banish-in-challenge", ...]).  When a challenge
        // emits both "banish" and "banish-in-challenge", the same candidate
        // should only fire once.
        const rawTriggerEvent = candidate.ability.trigger.event;
        if (rawTriggerEvent === "leave-play") {
          const compositeKey = `${candidateKey}:${rawTriggerEvent}`;
          if (deduplicatedCompositeMatches.has(compositeKey)) {
            continue;
          }
          deduplicatedCompositeMatches.add(compositeKey);
        }

        if (shouldDeduplicateDiscardBatch(candidate.ability.trigger, event)) {
          const dedupeKey = [
            candidate.sourceId,
            candidate.abilityId,
            event.playerId,
            event.eventSnapshot?.triggerBatchKey,
          ].join(":");
          if (deduplicatedDiscardBatches.has(dedupeKey)) {
            continue;
          }
          deduplicatedDiscardBatches.add(dedupeKey);
        }

        if (shouldSkipByNTimesPerTurn(ctx, candidate, event)) {
          continue;
        }

        if (
          shouldSkipEffectWithNoValidTargets(
            candidate.ability.effect,
            candidate.controllerId,
            ctx,
            candidate.sourceId,
          )
        ) {
          continue;
        }

        enqueueMatchedTrigger(ctx, candidate, event);
        created += 1;
      }
    }
  }

  if (params?.playerId && params.window && isDelayedTriggerWindow(params.window)) {
    created += enqueueDueDelayedRegistrations(ctx, {
      playerId: params.playerId,
      window: params.window,
    });
  }

  // CRD 6.2.7: Conditions are checked at resolution time, not enqueue time. However,
  // conditions that reference immutable turn history (turn-metric) can be safely evaluated
  // here to auto-fizzle bag effects before the player is prompted with a pointless choice.
  pruneFailedConditionBagEffects(ctx);

  const nextResolver = getNextBagResolver(ctx);
  if (nextResolver) {
    if (typeof ctx.framework.priority?.setHolder === "function") {
      ctx.framework.priority.setHolder(nextResolver);
    } else {
      (
        ctx.framework.state.priority as {
          holder?: PlayerId;
        }
      ).holder = nextResolver;
    }
  }

  return created;
}

export function canResolveBagEffectByRestrictions(
  ctx: Pick<TriggerRuntimeContext, "G">,
  bagEffect: Pick<BagEffectEntry, "abilityKey" | "occurrenceIndex" | "trigger">,
): boolean {
  const restrictions = bagEffect.trigger?.restrictions ?? [];
  if (restrictions.length === 0) {
    return true;
  }

  if (
    restrictions.some((restriction) => restriction.type === "first-time-each-turn") &&
    bagEffect.occurrenceIndex > 1
  ) {
    return false;
  }

  if (
    restrictions.some((restriction) => restriction.type === "once-per-turn") &&
    (getTriggeredAbilitiesState(ctx.G).usageLedger.resolutions[bagEffect.abilityKey] ?? 0) > 0
  ) {
    return false;
  }

  const nTimesRestriction = restrictions.find(
    (restriction): restriction is Extract<TriggerRestriction, { type: "n-times-per-turn" }> =>
      restriction.type === "n-times-per-turn",
  );
  if (
    nTimesRestriction &&
    (getTriggeredAbilitiesState(ctx.G).usageLedger.resolutions[bagEffect.abilityKey] ?? 0) >=
      nTimesRestriction.count
  ) {
    return false;
  }

  return true;
}

export function recordBagEffectResolution(
  ctx: Pick<TriggerRuntimeContext, "G">,
  bagEffect: Pick<BagEffectEntry, "abilityKey" | "trigger">,
): void {
  const restrictions = bagEffect.trigger?.restrictions ?? [];
  if (
    !restrictions.some(
      (restriction) =>
        restriction.type === "once-per-turn" ||
        restriction.type === "first-time-each-turn" ||
        restriction.type === "n-times-per-turn" ||
        restriction.type === "once-per-song",
    )
  ) {
    return;
  }

  const resolutions = getTriggeredAbilitiesState(ctx.G).usageLedger.resolutions;
  resolutions[bagEffect.abilityKey] = (resolutions[bagEffect.abilityKey] ?? 0) + 1;
}

export function getNextBagResolver(ctx: TriggerReadContext): PlayerId | undefined {
  const bagItems = getTriggeredAbilitiesStateView(ctx.G).bag.items ?? [];
  if (bagItems.length === 0) {
    return undefined;
  }

  const playerOrder = ctx.framework.state.playerIds;
  const lastResolvedPlayerId = getTriggeredAbilitiesStateView(ctx.G).bag.lastResolvedPlayerId;

  if (
    lastResolvedPlayerId &&
    bagItems.some((entry) => entry.controllerId === lastResolvedPlayerId)
  ) {
    return lastResolvedPlayerId;
  }

  const startPlayer =
    lastResolvedPlayerId ?? ctx.framework.state.currentPlayer ?? ctx.framework.state.playerIds[0];
  const startIndex = Math.max(0, playerOrder.indexOf(startPlayer));

  for (let offset = 0; offset < playerOrder.length; offset += 1) {
    const playerId = playerOrder[(startIndex + offset) % playerOrder.length]!;
    if (bagItems.some((entry) => entry.controllerId === playerId)) {
      return playerId;
    }
  }

  return undefined;
}

export function getBagItemsForCurrentResolver(ctx: TriggerReadContext): BagEffectEntry[] {
  const resolver = getNextBagResolver(ctx);
  if (!resolver) {
    return [];
  }

  return (getTriggeredAbilitiesStateView(ctx.G).bag.items ?? []).filter(
    (entry) => entry.controllerId === resolver,
  );
}

export function hasPendingBagItems(ctx: TriggerBagStateContext): boolean {
  return (getTriggeredAbilitiesStateView(ctx.G).bag.items?.length ?? 0) > 0;
}

export function removeBagEffect(
  ctx: Pick<TriggerRuntimeContext, "G">,
  bagId: string,
): BagEffectEntry | undefined {
  const bag = getTriggeredAbilitiesState(ctx.G).bag;
  const index = bag.items.findIndex((entry) => entry.id === bagId);
  if (index < 0) {
    return undefined;
  }

  const [entry] = bag.items.splice(index, 1);
  if (bag.items.length === 0) {
    bag.lastResolvedPlayerId = undefined;
  }
  return entry;
}

/**
 * When a bag effect suspended into a pending action effect (target selection, etc.),
 * the bag entry stays queued until {@link resolve-effect} finishes the pending work.
 * Call this after the pending effect fully resolves so the bag does not show a stale
 * duplicate of an already-completed triggered ability.
 */
export function removeBagItemMatchingPendingSource(
  ctx: Pick<TriggerRuntimeContext, "G">,
  pending: Pick<PendingActionEffect, "sourceCardId" | "abilityIndex">,
): boolean {
  const bag = getTriggeredAbilitiesState(ctx.G).bag;
  const items = bag.items;
  const index = items.findIndex(
    (entry) =>
      entry.sourceId === pending.sourceCardId &&
      (pending.abilityIndex === undefined || entry.abilityIndex === pending.abilityIndex),
  );
  if (index < 0) {
    return false;
  }

  items.splice(index, 1);
  if (items.length === 0) {
    bag.lastResolvedPlayerId = undefined;
  }
  return true;
}

export function updateBagEffectResolutionInput(
  ctx: Pick<TriggerRuntimeContext, "G">,
  bagId: string,
  partialInput: Partial<PendingActionResolutionInput>,
): boolean {
  const bag = getTriggeredAbilitiesState(ctx.G).bag;
  const entry = bag.items.find((item) => item.id === bagId);
  if (!entry) {
    return false;
  }

  entry.resolutionInput = {
    ...entry.resolutionInput,
    ...partialInput,
  };
  return true;
}

export function setLastBagResolver(
  ctx: Pick<TriggerRuntimeContext, "G">,
  playerId: PlayerId,
): void {
  getTriggeredAbilitiesState(ctx.G).bag.lastResolvedPlayerId = playerId;
}

export const queueTriggeredEvent = recordEvent;
export const flushTriggeredEventsToBag = finalizeResolutionBoundary;
