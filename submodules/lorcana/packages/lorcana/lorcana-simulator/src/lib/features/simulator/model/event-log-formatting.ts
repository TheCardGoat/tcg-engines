import {
  type CardInstanceId,
  type DamageEntry,
  type LorcanaLogMessage,
  type LorcanaLogMessageKey,
  type LorcanaLogMessageMap,
  type LogTargetId,
  type LegacyFlatMoveLog,
  type MoveLog,
  type MoveOutcomes,
  type PlayerId,
  type ResolveBagCancelledCause,
  type ScryDestinationEntry,
} from "@tcg/lorcana-engine";
import { getLorcanaLogTemplate, type LorcanaLogLocale } from "@tcg/lorcana-engine/i18n";
import { m } from "$lib/i18n/messages.js";
import { getLocale } from "$lib/paraglide/runtime.js";
import type {
  LorcanaPlayerSide,
  LorcanaSimulatorLocale,
  MoveLogEntrySnapshot,
  SimulatorSerializedValue,
} from "@/features/simulator/model/contracts.js";
import { getScryZoneLabel } from "@/features/simulator/model/scry-destinations.js";

export type EventLogPlayerTone = "self" | "opponent" | "playerOne" | "playerTwo" | "system";
export type EventLogMarkerId =
  | "setup"
  | "ability"
  | "ink"
  | "scry"
  | "play"
  | "challenge"
  | "quest"
  | "move"
  | "pass"
  | "turn";

export type EventLogSegment =
  | { kind: "text"; text: string }
  | { kind: "card"; cardId: string; fallbackLabel?: string; fallbackInkType?: string[] }
  | { kind: "player"; text: string; tone: EventLogPlayerTone; playerId?: string }
  | { kind: "stat"; text: string }
  | { kind: "icon"; icon: "inkable"; label: string };

type LegacyPrivateField<T> = T | { __private: true; value: T; visibleTo: string[] };

type LegacyFlatResolutionForFormatting = {
  kind:
    | "targetSelection"
    | "discardChoice"
    | "choiceSelection"
    | "optionalSelection"
    | "nameCardSelection"
    | "scrySelection"
    | "revealTopCard"
    | "cancelled"
    | "targets";
  targets: LogTargetId[];
  discarded: LogTargetId[];
  effectType?: string;
  choiceIndex: number;
  choiceLabel?: string;
  revealedCardId?: CardInstanceId;
  accepted: boolean;
  abilityName?: string;
  namedCard: string;
  detail?: LegacyPrivateField<ScryDestinationEntry[]>;
  publicRevealed?: ScryDestinationEntry[];
  targetPlayerId: PlayerId;
  cardId: CardInstanceId;
  destination?: string;
  isAutoBottom?: boolean;
  cause?: ResolveBagCancelledCause;
};

type LegacyFlatMoveLogForFormatting = LegacyFlatMoveLog & {
  abilityName?: string;
  attackerId: CardInstanceId;
  banished: CardInstanceId[];
  cancelReason?: ResolveBagCancelledCause;
  cardId: CardInstanceId;
  cardIds: CardInstanceId[];
  characterId: CardInstanceId;
  chosenPlayerId: PlayerId;
  count: number;
  damage: { attacker: number; defender: number };
  defenderId: CardInstanceId;
  discardCardIds?: CardInstanceId[];
  drawn?: LegacyPrivateField<CardInstanceId[]>;
  dropperPlayerId: PlayerId;
  droppedPlayerId: PlayerId;
  locationId: CardInstanceId;
  lookedAtInkwell?: { count: number; cardIds?: LegacyPrivateField<CardInstanceId[]> };
  loreGained: number;
  mulliganed?: LegacyPrivateField<CardInstanceId[]>;
  outcomes?: MoveOutcomes;
  reason: string;
  resolution: LegacyFlatResolutionForFormatting;
  shiftTargetId: CardInstanceId;
  singerIds: CardInstanceId[];
  skipperPlayerId: PlayerId;
  sourceCardId: CardInstanceId;
  sourceId: CardInstanceId;
  stallerPlayerId: PlayerId;
  status: "completed" | "skipped" | "pending" | "cancelled";
  totalLore: number;
  turn: number;
  winnerId: PlayerId;
};

export type EventLogBody = {
  marker: EventLogMarkerId;
  segments: EventLogSegment[];
  source: "typed" | "fallback";
  text: string;
};

/**
 * Optional resolver used to populate `fallbackLabel` on card segments at format time and
 * to inject the inkable icon for `lorcana.card.inked` entries.
 * Needed for non-interactive contexts (spectator, devtools) where CardLogToken is not rendered.
 * In the interactive simulator, CardLogToken does live lookup instead.
 */
export type CardReferenceResolver = (
  cardId: string,
) => { label?: string; inkable?: boolean } | null;

export function composeMoveLogForViewer(log: MoveLog, viewerId?: string | null): MoveLog {
  const privateMessages = viewerId ? (log.privateByPlayerId?.[viewerId as PlayerId] ?? []) : [];
  return {
    ...log,
    public: [...log.public, ...privateMessages],
    privateByPlayerId: undefined,
  };
}

const ENGINE_LOG_LOCALE_BY_SIMULATOR_LOCALE: Record<LorcanaSimulatorLocale, LorcanaLogLocale> = {
  en: "en",
  es: "es",
  de: "de",
  it: "it",
  "pt-br": "pt-br",
};

/** Maps new MoveLog.type values to UI markers */
const MOVE_LOG_TYPE_TO_MARKER: Record<string, EventLogMarkerId> = {
  playCard: "play",
  shiftCard: "play",
  singCard: "play",
  challenge: "challenge",
  quest: "quest",
  questWithAll: "quest",
  inkCard: "ink",
  lookAtInkwell: "ability",
  activateAbility: "ability",
  moveToLocation: "move",
  passTurn: "pass",
  concede: "pass",
  alterHand: "setup",
  chooseFirstPlayer: "setup",
  resolveBag: "ability",
  resolveEffect: "ability",
  turnStart: "turn",
  gameEnd: "turn",
};

const MARKER_BY_LOG_KEY: Partial<Record<LorcanaLogMessageKey, EventLogMarkerId>> = {
  "lorcana.setup.firstPlayerChosen": "setup",
  "lorcana.setup.mulligan.count": "setup",
  "lorcana.setup.mulligan.detail": "setup",
  "lorcana.setup.done": "setup",
  "lorcana.ability.activated": "ability",
  "lorcana.ability.activated.named": "ability",
  "lorcana.ability.activated.named.discardCost": "ability",
  "lorcana.ability.activated.discardCost": "ability",
  "lorcana.card.inked": "ink",
  "lorcana.scry.count": "scry",
  "lorcana.scry.detail": "scry",
  "lorcana.effect.lookAtInkwell": "ability",
  "lorcana.effect.lookAtInkwell.detail": "ability",
  "lorcana.move.playCard": "play",
  "lorcana.move.quest": "quest",
  "lorcana.move.questWithAll": "quest",
  "lorcana.move.challenge": "challenge",
  "lorcana.move.moveCharacterToLocation": "move",
  "lorcana.move.passTurn": "pass",
  "lorcana.move.concede": "pass",
  "lorcana.bag.resolve.completed": "ability",
  "lorcana.bag.resolve.completed.named": "ability",
  "lorcana.bag.resolve.completed.targets": "ability",
  "lorcana.bag.resolve.completed.targets.named": "ability",
  "lorcana.bag.resolve.skipped": "ability",
  "lorcana.bag.resolve.skipped.named": "ability",
  "lorcana.bag.resolve.pending": "ability",
  "lorcana.bag.resolve.pending.named": "ability",
  "lorcana.bag.resolve.pending.named.targets": "ability",
  "lorcana.effect.resolve.discardChoice": "ability",
  "lorcana.effect.resolve.targetSelection": "ability",
  "lorcana.effect.resolve.choiceSelection": "ability",
  "lorcana.effect.resolve.optionalSelection.accepted": "ability",
  "lorcana.effect.resolve.optionalSelection.accepted.targets": "ability",
  "lorcana.effect.resolve.optionalSelection.accepted.targets.named": "ability",
  "lorcana.effect.resolve.optionalSelection.rejected": "ability",
  "lorcana.effect.resolve.nameCardSelection": "ability",
  "lorcana.effect.resolve.scrySelection": "ability",
  "lorcana.effect.resolve.scrySelection.detail": "ability",
  "lorcana.effect.resolve.revealTopCard": "ability",
  "lorcana.effect.resolve.revealTopCard.autoBottom": "ability",
  "lorcana.effect.resolve.choiceSelection.withReveal": "ability",
  "lorcana.bag.resolve.cancelled": "ability",
  "lorcana.bag.resolve.cancelled.named": "ability",
  "lorcana.effect.cancelled": "ability",
  "lorcana.outcome.combatDamage": "challenge",
  "lorcana.outcome.effectDamage": "challenge",
  "lorcana.outcome.damageMoved": "ability",
  "lorcana.outcome.damagePrevented": "ability",
  "lorcana.outcome.cardBanished": "challenge",
  "lorcana.outcome.cardsDrawn": "ability",
  "lorcana.outcome.cardsDrawn.detail": "ability",
  "lorcana.outcome.cardsDiscarded.detail": "ability",
  "lorcana.outcome.cardReturnedToHand": "ability",
  "lorcana.outcome.loreGained": "quest",
  "lorcana.outcome.locationLoreGained": "quest",
  "lorcana.outcome.loreLost": "quest",
  "lorcana.outcome.cardExerted": "ability",
  "lorcana.outcome.cardReadied": "ability",
  "lorcana.outcome.cardsMilled": "ability",
  "lorcana.outcome.cardsPutOnBottom": "ability",
  "lorcana.move.playCard.shift": "play",
  "lorcana.move.playCard.sing": "play",
  "lorcana.outcome.cardInked": "ink",
  "lorcana.outcome.cardInkedExerted": "ink",
  "lorcana.system.turnSkipped": "turn",
  "lorcana.system.playerDropped": "turn",
  "lorcana.move.forfeitGame": "turn",
};

const PLAYER_VALUE_KEYS = new Set([
  "chooser",
  "chosen",
  "dropperPlayerId",
  "droppedPlayerId",
  "newPlayer",
  "playerId",
  "previousPlayer",
  "skipperPlayerId",
  "winnerId",
  "stallerPlayerId",
  "targetPlayerId",
]);
const CARD_VALUE_KEYS = new Set([
  "attackerId",
  "cardId",
  "characterId",
  "defenderId",
  "locationId",
  "revealedCardId",
  "sourceCardId",
  "sourceId",
  "shiftTargetId",
  "targetId",
]);
const CARD_LIST_VALUE_KEYS = new Set([
  "cardIds",
  "discardCardIds",
  "drawn",
  "lookedAt",
  "mulliganed",
  "singerIds",
]);
const TARGET_VALUE_KEYS = new Set(["targets"]);
const STAT_VALUE_KEYS = new Set([
  "amount",
  "attackerDamage",
  "choiceIndex",
  "count",
  "defenderDamage",
  "inkPaid",
  "loreGained",
]);

// =============================================================================
// Public API
// =============================================================================

/**
 * Manual / Board-State-Correction move IDs don't produce typed MoveLog
 * entries (they bypass the normal move pipeline), so they reach the
 * formatter without a `typedLogEntry`. Surface readable text instead of
 * the raw moveId so the game log clearly attributes the correction.
 */
const MANUAL_MOVE_LABELS: Record<string, string> = {
  manualSetLore: "Manual: set lore",
  manualSetDamage: "Manual: set damage",
  manualMoveCard: "Manual: moved card",
  manualExertCard: "Manual: exerted card",
  manualReadyCard: "Manual: readied card",
  manualDryCard: "Manual: dried card",
  manualShuffleDeck: "Manual: shuffled deck",
  manualPassTurn: "Manual: passed turn",
};

const MANUAL_MOVE_ZONE_LABELS: Record<string, string> = {
  hand: "hand",
  play: "play",
  discard: "discard",
  inkwell: "inkwell",
  deck: "deck",
  "deck-top": "top of deck",
  "deck-bottom": "bottom of deck",
};

function manualZoneLabel(zoneId: unknown, position?: unknown): string | undefined {
  if (typeof zoneId !== "string" || zoneId.length === 0) {
    return undefined;
  }
  const [zone] = zoneId.split(":");
  if (!zone) {
    return undefined;
  }
  if (zone === "deck" && (position === "top" || position === "bottom")) {
    return MANUAL_MOVE_ZONE_LABELS[`deck-${position}`] ?? zone;
  }
  return MANUAL_MOVE_ZONE_LABELS[zone] ?? zone;
}

function buildManualMoveSegments(
  entry: MoveLogEntrySnapshot,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
): EventLogSegment[] | undefined {
  const params = entry.params ?? {};
  const cardId = typeof params["cardId"] === "string" ? params["cardId"] : undefined;

  // Lead with the dispatcher so corrections are clearly attributed to whoever
  // made them, not the turn player. The chip color (driven by actorSide) and
  // the inline name should always agree.
  const actorPrefix: EventLogSegment[] = entry.playerId
    ? [
        playerSegmentForPlayerId(entry, entry.playerId, viewerSide, locale),
        { kind: "text", text: " — " },
      ]
    : [];

  switch (entry.moveId) {
    case "manualSetDamage": {
      if (!cardId) return undefined;
      const damage = params["damage"];
      const segments: EventLogSegment[] = [
        ...actorPrefix,
        { kind: "text", text: "manually set damage on " },
        cardSegment(cardId),
      ];
      if (typeof damage === "number") {
        segments.push({ kind: "text", text: " to " });
        segments.push({ kind: "stat", text: String(damage) });
      }
      segments.push({ kind: "text", text: "." });
      return segments;
    }
    case "manualSetLore": {
      const targetPlayerId =
        typeof params["playerId"] === "string" ? params["playerId"] : undefined;
      const amount = params["amount"];
      const segments: EventLogSegment[] = [...actorPrefix, { kind: "text", text: "manually set " }];
      if (targetPlayerId) {
        segments.push(playerSegmentForPlayerId(entry, targetPlayerId, viewerSide, locale));
        segments.push({ kind: "text", text: "'s lore" });
      } else {
        segments.push({ kind: "text", text: "lore" });
      }
      if (typeof amount === "number") {
        segments.push({ kind: "text", text: " to " });
        segments.push({ kind: "stat", text: String(amount) });
      }
      segments.push({ kind: "text", text: "." });
      return segments;
    }
    case "manualMoveCard": {
      if (!cardId) return undefined;
      const segments: EventLogSegment[] = [
        ...actorPrefix,
        { kind: "text", text: "manually moved " },
        cardSegment(cardId),
      ];
      const zoneLabel = manualZoneLabel(params["targetZoneId"], params["position"]);
      if (zoneLabel) {
        segments.push({ kind: "text", text: " to " });
        segments.push({ kind: "text", text: zoneLabel });
      }
      segments.push({ kind: "text", text: "." });
      return segments;
    }
    case "manualExertCard":
      if (!cardId) return undefined;
      return [
        ...actorPrefix,
        { kind: "text", text: "manually exerted " },
        cardSegment(cardId),
        { kind: "text", text: "." },
      ];
    case "manualReadyCard":
      if (!cardId) return undefined;
      return [
        ...actorPrefix,
        { kind: "text", text: "manually readied " },
        cardSegment(cardId),
        { kind: "text", text: "." },
      ];
    case "manualDryCard":
      if (!cardId) return undefined;
      return [
        ...actorPrefix,
        { kind: "text", text: "manually set " },
        cardSegment(cardId),
        { kind: "text", text: " to drying." },
      ];
    case "manualShuffleDeck": {
      const targetPlayerId =
        typeof params["playerId"] === "string" ? params["playerId"] : undefined;
      const segments: EventLogSegment[] = [
        ...actorPrefix,
        { kind: "text", text: "manually shuffled " },
      ];
      if (targetPlayerId) {
        segments.push(playerSegmentForPlayerId(entry, targetPlayerId, viewerSide, locale));
        segments.push({ kind: "text", text: "'s deck." });
      } else {
        segments.push({ kind: "text", text: "deck." });
      }
      return segments;
    }
    case "manualPassTurn":
      return [...actorPrefix, { kind: "text", text: "manually passed turn." }];
    default:
      return undefined;
  }
}

export function formatEventLogBody(
  entry: MoveLogEntrySnapshot,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
  resolveCard?: CardReferenceResolver,
): EventLogBody {
  if (!entry.typedLogEntry) {
    let segments = buildManualMoveSegments(entry, viewerSide, locale);
    if (segments && resolveCard) {
      segments = segments.map((segment) =>
        segment.kind === "card"
          ? {
              ...segment,
              fallbackLabel: resolveCard(segment.cardId)?.label ?? segment.fallbackLabel,
            }
          : segment,
      );
    }
    if (segments && segments.length > 0) {
      const text = flattenEventLogSegments(segments);
      return {
        marker: "move",
        segments,
        source: "fallback",
        text,
      };
    }
    const manualLabel = MANUAL_MOVE_LABELS[entry.moveId];
    const text = manualLabel ?? entry.title ?? entry.moveId;
    return {
      marker: "move",
      segments: [{ kind: "text", text }],
      source: "fallback",
      text,
    };
  }

  const typed = entry.typedLogEntry;
  const typedRaw = typed as Record<string, unknown>;

  if ("public" in typedRaw && Array.isArray(typedRaw.public)) {
    const moveLog = typed as MoveLog;
    const marker = MOVE_LOG_TYPE_TO_MARKER[moveLog.moveType] ?? "move";
    const messages = moveLog.public;
    const segments =
      messages.length > 0
        ? joinSegments(
            messages.map((message) =>
              renderTypedLogMessage(entry, message, viewerSide, locale, resolveCard),
            ),
            " ",
          )
        : [];
    const text =
      segments.length > 0 ? flattenEventLogSegments(segments) : entry.title || moveLog.moveType;
    return {
      marker,
      segments: segments.length > 0 ? segments : [{ kind: "text", text }],
      source: "typed",
      text,
    };
  }

  // MoveLog entries have flat fields instead of nested { type, values }.
  // Detect by checking for the .values property.
  if (!("values" in typedRaw) || typedRaw.values === undefined) {
    const moveLog = typed as unknown as LegacyFlatMoveLogForFormatting;
    const moveType = String(moveLog.type ?? "move");
    const marker = MOVE_LOG_TYPE_TO_MARKER[moveType] ?? "move";
    let segments = renderFlatMoveLog(entry, moveLog, viewerSide, locale, resolveCard);

    if (resolveCard) {
      segments = segments.map((segment) =>
        segment.kind === "card"
          ? {
              ...segment,
              fallbackLabel: resolveCard(segment.cardId)?.label ?? segment.fallbackLabel,
            }
          : segment,
      );
    }

    const text = segments.length > 0 ? flattenEventLogSegments(segments) : entry.title || moveType;
    return {
      marker,
      segments: segments.length > 0 ? segments : [{ kind: "text", text }],
      source: "typed",
      text,
    };
  }

  const typedMessageEntry = typed as Extract<typeof typed, { values: unknown }>;
  const message = {
    key: typedMessageEntry.type,
    values: typedMessageEntry.values,
  } as LorcanaLogMessage;
  let segments = renderTypedLogMessage(entry, message, viewerSide, locale, resolveCard);

  if (resolveCard) {
    segments = segments.map((s) =>
      s.kind === "card"
        ? { ...s, fallbackLabel: resolveCard(s.cardId)?.label ?? s.fallbackLabel }
        : s,
    );
  }

  return {
    marker: MARKER_BY_LOG_KEY[typedMessageEntry.type] ?? "ability",
    segments,
    source: "typed",
    text: flattenEventLogSegments(segments),
  };
}

function renderFlatMoveLog(
  entry: MoveLogEntrySnapshot,
  moveLog: LegacyFlatMoveLogForFormatting,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
  resolveCard?: CardReferenceResolver,
): EventLogSegment[] {
  const inlinePlayedTargets = getInlinePlayedTargetSelection(moveLog);
  if (inlinePlayedTargets) {
    return inlinePlayedTargets;
  }

  const inlineEffectDamage = getInlineGroupedEffectDamage(moveLog);
  const messages = buildMessagesFromMoveLog(moveLog, {
    skipEffectDamage: inlineEffectDamage !== undefined,
    skipBanished: inlineEffectDamage !== undefined,
  });
  if (messages.length > 0) {
    const segments = joinSegments(
      messages.map((message) =>
        renderTypedLogMessage(entry, message, viewerSide, locale, resolveCard),
      ),
      " ",
    );
    return inlineEffectDamage
      ? appendInlineEffectDamageSegments(segments, inlineEffectDamage)
      : segments;
  }

  switch (moveLog.type) {
    case "turnStart":
      return [
        { kind: "text", text: "Turn " },
        { kind: "stat", text: String(moveLog.turn) },
        { kind: "text", text: " started." },
      ];
    case "gameEnd": {
      const segments: EventLogSegment[] = [{ kind: "text", text: "Game ended" }];
      if (moveLog.winnerId) {
        segments.push({ kind: "text", text: ". Winner: " });
        segments.push(playerSegmentForPlayerId(entry, moveLog.winnerId, viewerSide, locale));
      }
      segments.push({ kind: "text", text: "." });
      return segments;
    }
    default:
      return entry.title ? [{ kind: "text", text: entry.title }] : [];
  }
}

function buildMessagesFromMoveLog(
  moveLog: LegacyFlatMoveLogForFormatting,
  options: { skipEffectDamage?: boolean; skipBanished?: boolean } = {},
): LorcanaLogMessage[] {
  const messages: LorcanaLogMessage[] = [];

  switch (moveLog.type) {
    case "playCard":
      messages.push(
        createLogMessage("lorcana.move.playCard", {
          playerId: moveLog.playerId,
          cardId: moveLog.cardId,
        }),
      );
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, options);
      break;
    case "shiftCard":
      messages.push(
        createLogMessage("lorcana.move.playCard.shift", {
          playerId: moveLog.playerId,
          cardId: moveLog.cardId,
          shiftTargetId: moveLog.shiftTargetId,
        }),
      );
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, options);
      break;
    case "singCard":
      messages.push(
        createLogMessage("lorcana.move.playCard.sing", {
          playerId: moveLog.playerId,
          cardId: moveLog.cardId,
          singerIds: moveLog.singerIds,
        }),
      );
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, options);
      break;
    case "challenge":
      messages.push(
        createLogMessage("lorcana.move.challenge", {
          playerId: moveLog.playerId,
          attackerId: moveLog.attackerId,
          defenderId: moveLog.defenderId,
        }),
      );
      if (moveLog.damage.attacker > 0 || moveLog.damage.defender > 0) {
        messages.push(
          createLogMessage("lorcana.outcome.combatDamage", {
            playerId: moveLog.playerId,
            attackerId: moveLog.attackerId,
            defenderId: moveLog.defenderId,
            attackerDamage: moveLog.damage.attacker,
            defenderDamage: moveLog.damage.defender,
          }),
        );
      }
      for (const cardId of moveLog.banished) {
        messages.push(
          createLogMessage("lorcana.outcome.cardBanished", {
            playerId: moveLog.playerId,
            cardId,
          }),
        );
      }
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, {
        skipCombatDamage: true,
        skipBanished: true,
      });
      break;
    case "quest":
      messages.push(
        createLogMessage("lorcana.move.quest", {
          playerId: moveLog.playerId,
          cardId: moveLog.cardId,
          loreGained: moveLog.loreGained,
        }),
      );
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, options);
      break;
    case "questWithAll":
      messages.push(
        createLogMessage("lorcana.move.questWithAll", {
          playerId: moveLog.playerId,
          cardIds: moveLog.cardIds,
          loreGained: moveLog.totalLore,
          count: moveLog.cardIds.length,
        }),
      );
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, options);
      break;
    case "inkCard":
      messages.push(
        createLogMessage("lorcana.card.inked", {
          playerId: moveLog.playerId,
          cardId: moveLog.cardId,
        }),
      );
      break;
    case "lookAtInkwell": {
      const cardIds = unwrapPrivateField(moveLog.cardIds);
      messages.push(
        cardIds && cardIds.length > 0
          ? createLogMessage("lorcana.effect.lookAtInkwell.detail", {
              playerId: moveLog.playerId,
              count: moveLog.count,
              cardIds,
            })
          : createLogMessage("lorcana.effect.lookAtInkwell", {
              playerId: moveLog.playerId,
              count: moveLog.count,
            }),
      );
      break;
    }
    case "activateAbility": {
      const discardIds = moveLog.discardCardIds;
      if (discardIds && discardIds.length > 0) {
        messages.push(
          moveLog.abilityName
            ? createLogMessage("lorcana.ability.activated.named.discardCost", {
                playerId: moveLog.playerId,
                cardId: moveLog.cardId,
                abilityName: moveLog.abilityName,
                discardCardIds: discardIds,
              })
            : createLogMessage("lorcana.ability.activated.discardCost", {
                playerId: moveLog.playerId,
                cardId: moveLog.cardId,
                discardCardIds: discardIds,
              }),
        );
      } else {
        messages.push(
          moveLog.abilityName
            ? createLogMessage("lorcana.ability.activated.named", {
                playerId: moveLog.playerId,
                cardId: moveLog.cardId,
                abilityName: moveLog.abilityName,
              })
            : createLogMessage("lorcana.ability.activated", {
                playerId: moveLog.playerId,
                cardId: moveLog.cardId,
              }),
        );
      }
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, options);
      break;
    }
    case "moveToLocation":
      messages.push(
        createLogMessage("lorcana.move.moveCharacterToLocation", {
          playerId: moveLog.playerId,
          characterId: moveLog.characterId,
          locationId: moveLog.locationId,
        }),
      );
      break;
    case "passTurn":
      messages.push(createLogMessage("lorcana.move.passTurn", { playerId: moveLog.playerId }));
      break;
    case "concede":
      messages.push(createLogMessage("lorcana.move.concede", { playerId: moveLog.playerId }));
      break;
    case "forfeitGame":
      messages.push(
        createLogMessage("lorcana.move.forfeitGame", {
          winnerId: moveLog.winnerId,
          reason: moveLog.reason,
        }),
      );
      break;
    case "turnSkipped":
      messages.push(
        createLogMessage("lorcana.system.turnSkipped", {
          skipperPlayerId: moveLog.skipperPlayerId,
          stallerPlayerId: moveLog.stallerPlayerId,
        }),
      );
      break;
    case "playerDropped":
      messages.push(
        createLogMessage("lorcana.system.playerDropped", {
          dropperPlayerId: moveLog.dropperPlayerId,
          droppedPlayerId: moveLog.droppedPlayerId,
          reason: moveLog.reason,
        }),
      );
      break;
    case "alterHand":
      messages.push(
        moveLog.mulliganed || moveLog.drawn
          ? createLogMessage("lorcana.setup.mulligan.detail", {
              playerId: moveLog.playerId,
              count: moveLog.count,
              mulliganed: unwrapPrivateField(moveLog.mulliganed) ?? [],
              drawn: unwrapPrivateField(moveLog.drawn) ?? [],
            })
          : createLogMessage("lorcana.setup.mulligan.count", {
              playerId: moveLog.playerId,
              count: moveLog.count,
            }),
      );
      break;
    case "chooseFirstPlayer":
      messages.push(
        createLogMessage("lorcana.setup.firstPlayerChosen", {
          chooser: moveLog.playerId,
          chosen: moveLog.chosenPlayerId,
        }),
      );
      break;
    case "resolveBag":
      messages.push(...buildResolveBagMessages(moveLog));
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, {
        ...options,
      });
      break;
    case "resolveEffect":
      messages.push(...buildResolveEffectMessages(moveLog));
      appendOutcomeMessages(messages, moveLog.playerId, moveLog.outcomes, {
        ...options,
      });
      break;
    case "turnStart":
    case "gameEnd":
      break;
  }

  return messages;
}

function getInlinePlayedTargetSelection(
  moveLog: LegacyFlatMoveLogForFormatting,
): EventLogSegment[] | undefined {
  if (moveLog.type !== "resolveEffect" || moveLog.resolution.kind !== "targetSelection") {
    return undefined;
  }

  if (moveLog.resolution.effectType != null && moveLog.resolution.effectType !== "play-card") {
    return undefined;
  }

  const cardsMovedToPlay = new Set(
    ((moveLog.outcomes?.cardsMovedToZone ?? []) as Array<{ zone: string; cardId: CardInstanceId }>)
      .filter((move) => move.zone === "play")
      .map((move) => move.cardId),
  );
  if (cardsMovedToPlay.size === 0) {
    return undefined;
  }

  const playedTargets = (moveLog.resolution.targets as CardInstanceId[])
    .map((target) => target as CardInstanceId)
    .filter((target) => cardsMovedToPlay.has(target));
  if (playedTargets.length === 0) {
    return undefined;
  }

  return [
    { kind: "text", text: "Resolved " },
    cardSegment(moveLog.sourceCardId),
    { kind: "text", text: " by playing " },
    ...joinHumanListSegments(playedTargets.map((targetId) => [cardSegment(targetId)])),
    { kind: "text", text: "." },
  ];
}

type InlineGroupedEffectDamage = {
  amount: number;
  targetIds: CardInstanceId[];
  banishedTargetIds: CardInstanceId[];
};

function getInlineGroupedEffectDamage(
  moveLog: LegacyFlatMoveLogForFormatting,
): InlineGroupedEffectDamage | undefined {
  if (
    moveLog.type !== "playCard" &&
    moveLog.type !== "resolveEffect" &&
    moveLog.type !== "resolveBag"
  ) {
    return undefined;
  }

  const outcomes = moveLog.outcomes;
  if (!outcomes || hasNonDamageOutcomes(outcomes)) {
    return undefined;
  }

  const damageEntries = (outcomes.damageDealt ?? []) as DamageEntry[];
  if (damageEntries.length === 0 || damageEntries.some((damage) => damage.kind !== "effect")) {
    return undefined;
  }

  const primarySourceId = getPrimarySourceIdForInlineEffectDamage(moveLog);
  if (!primarySourceId) {
    return undefined;
  }

  const groups = new Map<string, DamageEntry[]>();
  for (const damage of damageEntries) {
    const key = `${damage.sourceId}:${damage.amount}`;
    const existing = groups.get(key) ?? [];
    existing.push(damage);
    groups.set(key, existing);
  }

  if (groups.size !== 1) {
    return undefined;
  }

  const group = [...groups.values()][0];
  if (!group || group.length === 0 || group[0]?.sourceId !== primarySourceId) {
    return undefined;
  }

  const targetIds = group.map((damage) => damage.targetId);
  const banishedTargetIds = (outcomes.cardsBanished ?? []) as CardInstanceId[];
  if (banishedTargetIds.some((cardId) => !targetIds.includes(cardId))) {
    return undefined;
  }

  return {
    amount: group[0]!.amount,
    targetIds,
    banishedTargetIds,
  };
}

function getPrimarySourceIdForInlineEffectDamage(
  moveLog: LegacyFlatMoveLogForFormatting,
): CardInstanceId | undefined {
  switch (moveLog.type) {
    case "playCard":
      return moveLog.cardId;
    case "resolveBag":
      return moveLog.sourceCardId;
    case "resolveEffect":
      return moveLog.sourceCardId;
    default:
      return undefined;
  }
}

function hasNonDamageOutcomes(outcomes: MoveOutcomes): boolean {
  return Boolean(
    (outcomes.cardsDrawn?.length ?? 0) > 0 ||
    (outcomes.cardsDiscarded?.length ?? 0) > 0 ||
    outcomes.loreChanged ||
    outcomes.cardsMilled ||
    (outcomes.cardsExerted?.length ?? 0) > 0 ||
    (outcomes.cardsReadied?.length ?? 0) > 0 ||
    (outcomes.cardsReturnedToHand?.length ?? 0) > 0 ||
    (outcomes.cardsMovedToZone?.length ?? 0) > 0 ||
    (outcomes.cardsInked?.length ?? 0) > 0,
  );
}

function appendInlineEffectDamageSegments(
  segments: EventLogSegment[],
  damage: InlineGroupedEffectDamage,
): EventLogSegment[] {
  return [
    ...removeTrailingPeriod(segments),
    { kind: "text", text: ", dealing " },
    { kind: "stat", text: String(damage.amount) },
    { kind: "text", text: " damage to " },
    ...joinHumanListSegments(damage.targetIds.map((targetId) => [cardSegment(targetId)])),
    ...renderInlineBanishedDamageSegments(damage),
    { kind: "text", text: "." },
  ];
}

function renderInlineBanishedDamageSegments(damage: InlineGroupedEffectDamage): EventLogSegment[] {
  if (damage.banishedTargetIds.length === 0) {
    return [];
  }

  return [
    { kind: "text", text: ", banishing " },
    ...joinHumanListSegments(damage.banishedTargetIds.map((targetId) => [cardSegment(targetId)])),
  ];
}

function removeTrailingPeriod(segments: EventLogSegment[]): EventLogSegment[] {
  const result = [...segments];
  const lastTextIndex = result.findLastIndex(
    (segment) => segment.kind === "text" && segment.text.trimEnd().endsWith("."),
  );
  if (lastTextIndex < 0) {
    return result;
  }

  const segment = result[lastTextIndex];
  if (!segment || segment.kind !== "text") {
    return result;
  }

  const periodIndex = segment.text.lastIndexOf(".");
  result[lastTextIndex] = { ...segment, text: segment.text.slice(0, periodIndex) };
  return result;
}

function joinHumanListSegments(items: EventLogSegment[][]): EventLogSegment[] {
  if (items.length <= 1) {
    return items[0] ?? [];
  }

  const segments: EventLogSegment[] = [];
  items.forEach((item, index) => {
    if (index > 0) {
      segments.push({ kind: "text", text: index === items.length - 1 ? " and " : ", " });
    }
    segments.push(...item);
  });
  return segments;
}

function appendOutcomeMessages(
  messages: LorcanaLogMessage[],
  actorPlayerId: PlayerId,
  outcomes?: MoveOutcomes,
  options: { skipCombatDamage?: boolean; skipBanished?: boolean; skipEffectDamage?: boolean } = {},
): void {
  if (!outcomes) {
    return;
  }

  for (const discard of outcomes.cardsDiscarded ?? []) {
    messages.push(
      createLogMessage("lorcana.outcome.cardsDiscarded.detail", {
        playerId: discard.playerId,
        amount: discard.amount,
        cardIds: discard.detail,
      }),
    );
  }

  for (const cardsDrawn of outcomes.cardsDrawn ?? []) {
    const drawnCards = unwrapPrivateField(cardsDrawn.detail);
    messages.push(
      drawnCards && drawnCards.length > 0
        ? createLogMessage("lorcana.outcome.cardsDrawn.detail", {
            playerId: cardsDrawn.playerId,
            amount: cardsDrawn.amount,
            cardIds: drawnCards,
          })
        : createLogMessage("lorcana.outcome.cardsDrawn", {
            playerId: cardsDrawn.playerId,
            amount: cardsDrawn.amount,
          }),
    );
  }

  if (!options.skipBanished) {
    for (const cardId of outcomes.cardsBanished ?? []) {
      messages.push(
        createLogMessage("lorcana.outcome.cardBanished", { playerId: actorPlayerId, cardId }),
      );
    }
  }

  for (const damage of outcomes.damageDealt ?? []) {
    if (damage.kind === "combat") {
      if (options.skipCombatDamage) {
        continue;
      }

      messages.push(
        createLogMessage("lorcana.outcome.combatDamage", {
          playerId: actorPlayerId,
          attackerId: damage.sourceId,
          defenderId: damage.targetId,
          attackerDamage: damage.amount,
          defenderDamage: 0,
        }),
      );
      continue;
    }

    if (!options.skipEffectDamage) {
      messages.push(
        createLogMessage("lorcana.outcome.effectDamage", {
          playerId: actorPlayerId,
          sourceId: damage.sourceId,
          targetId: damage.targetId,
          amount: damage.amount,
        }),
      );
    }
  }

  for (const moved of outcomes.damageMoved ?? []) {
    messages.push(
      createLogMessage("lorcana.outcome.damageMoved", {
        playerId: actorPlayerId,
        sourceId: moved.sourceCharacterId,
        targetId: moved.targetId,
        amount: moved.amount,
      }),
    );
  }

  if (outcomes.loreChanged) {
    messages.push(
      outcomes.loreChanged.operation === "add"
        ? createLogMessage("lorcana.outcome.loreGained", {
            playerId: outcomes.loreChanged.playerId,
            amount: outcomes.loreChanged.amount,
          })
        : createLogMessage("lorcana.outcome.loreLost", {
            playerId: outcomes.loreChanged.playerId,
            amount: outcomes.loreChanged.amount,
          }),
    );
  }

  for (const cardId of outcomes.cardsExerted ?? []) {
    messages.push(
      createLogMessage("lorcana.outcome.cardExerted", { playerId: actorPlayerId, cardId }),
    );
  }

  for (const cardId of outcomes.cardsReadied ?? []) {
    messages.push(
      createLogMessage("lorcana.outcome.cardReadied", { playerId: actorPlayerId, cardId }),
    );
  }

  if (outcomes.cardsMilled) {
    messages.push(
      createLogMessage("lorcana.outcome.cardsMilled", {
        playerId: outcomes.cardsMilled.playerId,
        amount: outcomes.cardsMilled.amount,
      }),
    );
  }

  const cardsPutOnBottom = (outcomes.cardsMovedToZone ?? [])
    .filter((move) => move.zone === "deck-bottom")
    .map((move) => move.cardId);
  if (cardsPutOnBottom.length > 0) {
    messages.push(
      createLogMessage("lorcana.outcome.cardsPutOnBottom", {
        playerId: actorPlayerId,
        cardIds: cardsPutOnBottom,
      }),
    );
  }

  for (const cardId of outcomes.cardsReturnedToHand ?? []) {
    messages.push(
      createLogMessage("lorcana.outcome.cardReturnedToHand", {
        playerId: actorPlayerId,
        cardId,
      }),
    );
  }

  for (const { cardId, exerted } of outcomes.cardsInked ?? []) {
    // cardId is undefined for non-owner viewers when the ink came from a
    // private zone (hand/deck via an effect). Skip the named log line — the
    // surrounding resolveBag/resolveEffect entry still records that an ink
    // happened; the inked card's identity is intentionally hidden.
    if (typeof cardId !== "string") continue;
    messages.push(
      createLogMessage(exerted ? "lorcana.outcome.cardInkedExerted" : "lorcana.outcome.cardInked", {
        playerId: actorPlayerId,
        cardId,
      }),
    );
  }
}

function buildResolveBagMessages(moveLog: LegacyFlatMoveLogForFormatting): LorcanaLogMessage[] {
  const messages: LorcanaLogMessage[] = [];
  const commonValues = {
    playerId: moveLog.playerId,
    sourceId: moveLog.sourceCardId,
  };

  switch (moveLog.status) {
    case "completed":
      if (moveLog.resolution?.kind === "targets") {
        // After perspective stripping, `targets` is undefined for non-owner
        // viewers when the resolution targeted a card from a private zone.
        // In that case fall back to the no-targets phrasing so the log line
        // doesn't reveal the inked card's name.
        const targets = moveLog.resolution.targets as Array<LogTargetId> | undefined;
        const hasVisibleTargets = Array.isArray(targets) && targets.length > 0;
        if (hasVisibleTargets) {
          messages.push(
            moveLog.abilityName
              ? createLogMessage("lorcana.bag.resolve.completed.targets.named", {
                  ...commonValues,
                  abilityName: moveLog.abilityName,
                  targets,
                })
              : createLogMessage("lorcana.bag.resolve.completed.targets", {
                  ...commonValues,
                  targets,
                }),
          );
        } else {
          messages.push(
            moveLog.abilityName
              ? createLogMessage("lorcana.bag.resolve.completed.named", {
                  ...commonValues,
                  abilityName: moveLog.abilityName,
                })
              : createLogMessage("lorcana.bag.resolve.completed", commonValues),
          );
        }
      } else {
        messages.push(
          moveLog.abilityName
            ? createLogMessage("lorcana.bag.resolve.completed.named", {
                ...commonValues,
                abilityName: moveLog.abilityName,
              })
            : createLogMessage("lorcana.bag.resolve.completed", commonValues),
        );
      }
      break;
    case "skipped":
      messages.push(
        moveLog.abilityName
          ? createLogMessage("lorcana.bag.resolve.skipped.named", {
              ...commonValues,
              abilityName: moveLog.abilityName,
            })
          : createLogMessage("lorcana.bag.resolve.skipped", commonValues),
      );
      break;
    case "pending":
      if (moveLog.resolution?.kind === "targets") {
        messages.push(
          moveLog.abilityName
            ? createLogMessage("lorcana.bag.resolve.pending.named.targets", {
                ...commonValues,
                abilityName: moveLog.abilityName,
                targets: moveLog.resolution.targets as LogTargetId[],
              })
            : createLogMessage("lorcana.bag.resolve.pending", commonValues),
        );
      } else {
        messages.push(
          moveLog.abilityName
            ? createLogMessage("lorcana.bag.resolve.pending.named", {
                ...commonValues,
                abilityName: moveLog.abilityName,
              })
            : createLogMessage("lorcana.bag.resolve.pending", commonValues),
        );
      }
      break;
    case "cancelled":
      messages.push(
        moveLog.abilityName
          ? createLogMessage("lorcana.bag.resolve.cancelled.named", {
              ...commonValues,
              abilityName: moveLog.abilityName,
              cause: moveLog.cancelReason ?? "restriction",
            })
          : createLogMessage("lorcana.bag.resolve.cancelled", {
              ...commonValues,
              cause: moveLog.cancelReason ?? "restriction",
            }),
      );
      break;
  }

  if (moveLog.lookedAtInkwell) {
    const cardIds = unwrapPrivateField(moveLog.lookedAtInkwell.cardIds);
    messages.push(
      cardIds && cardIds.length > 0
        ? createLogMessage("lorcana.effect.lookAtInkwell.detail", {
            playerId: moveLog.playerId,
            count: moveLog.lookedAtInkwell.count,
            cardIds,
          })
        : createLogMessage("lorcana.effect.lookAtInkwell", {
            playerId: moveLog.playerId,
            count: moveLog.lookedAtInkwell.count,
          }),
    );
  }

  return messages;
}

function buildResolveEffectMessages(moveLog: LegacyFlatMoveLogForFormatting): LorcanaLogMessage[] {
  const commonValues = {
    playerId: moveLog.playerId,
    sourceCardId: moveLog.sourceCardId,
  };

  switch (moveLog.resolution.kind) {
    case "targetSelection":
      return [
        createLogMessage("lorcana.effect.resolve.targetSelection", {
          ...commonValues,
          targets: moveLog.resolution.targets,
          effectType: moveLog.resolution.effectType,
        }),
      ];
    case "discardChoice":
      return [
        createLogMessage("lorcana.effect.resolve.discardChoice", {
          ...commonValues,
          targets: moveLog.resolution.discarded,
        }),
      ];
    case "choiceSelection":
      return moveLog.resolution.revealedCardId
        ? [
            createLogMessage("lorcana.effect.resolve.choiceSelection.withReveal", {
              ...commonValues,
              revealedCardId: moveLog.resolution.revealedCardId,
              choiceIndex: moveLog.resolution.choiceIndex,
              choiceLabel: moveLog.resolution.choiceLabel,
            }),
          ]
        : [
            createLogMessage("lorcana.effect.resolve.choiceSelection", {
              ...commonValues,
              choiceIndex: moveLog.resolution.choiceIndex,
              choiceLabel: moveLog.resolution.choiceLabel,
            }),
          ];
    case "optionalSelection": {
      if (!moveLog.resolution.accepted) {
        return [
          createLogMessage("lorcana.effect.resolve.optionalSelection.rejected", commonValues),
        ];
      }
      const targets = moveLog.resolution.targets;
      if (targets && targets.length > 0) {
        return [
          moveLog.resolution.abilityName
            ? createLogMessage("lorcana.effect.resolve.optionalSelection.accepted.targets.named", {
                ...commonValues,
                abilityName: moveLog.resolution.abilityName,
                targets,
              })
            : createLogMessage("lorcana.effect.resolve.optionalSelection.accepted.targets", {
                ...commonValues,
                targets,
              }),
        ];
      }
      return [createLogMessage("lorcana.effect.resolve.optionalSelection.accepted", commonValues)];
    }
    case "nameCardSelection":
      return [
        createLogMessage("lorcana.effect.resolve.nameCardSelection", {
          ...commonValues,
          namedCard: moveLog.resolution.namedCard,
        }),
      ];
    case "scrySelection": {
      const detail = unwrapPrivateField(moveLog.resolution.detail);
      if (detail?.length) {
        return [
          createLogMessage("lorcana.effect.resolve.scrySelection.detail", {
            ...commonValues,
            selection: [],
            destinations: detail,
          }),
        ];
      }
      // Non-chooser viewers (or spectators) still see destinations whose cards
      // were revealed publicly to all players (e.g. "reveal a card and put it
      // into your hand").
      const publicRevealed = moveLog.resolution.publicRevealed;
      if (publicRevealed?.length) {
        return [
          createLogMessage("lorcana.effect.resolve.scrySelection.detail", {
            ...commonValues,
            selection: [],
            destinations: publicRevealed,
          }),
        ];
      }
      return [createLogMessage("lorcana.effect.resolve.scrySelection", commonValues)];
    }
    case "revealTopCard":
      return [
        createLogMessage(
          moveLog.resolution.isAutoBottom === true ||
            moveLog.resolution.destination === "deck-bottom"
            ? "lorcana.effect.resolve.revealTopCard.autoBottom"
            : "lorcana.effect.resolve.revealTopCard",
          {
            ...commonValues,
            targetPlayerId: moveLog.resolution.targetPlayerId,
            revealedCardId: moveLog.resolution.cardId,
          },
        ),
      ];
    case "cancelled":
      return [
        createLogMessage("lorcana.effect.cancelled", {
          ...commonValues,
          cause: moveLog.resolution.cause ?? "no-valid-targets",
        }),
      ];
  }
  return [];
}

function createLogMessage<TKey extends LorcanaLogMessageKey>(
  key: TKey,
  values: LorcanaLogMessageMap[TKey],
): LorcanaLogMessage<TKey> {
  return {
    key,
    values,
  } as LorcanaLogMessage<TKey>;
}

function unwrapPrivateField<T>(value: T | { value: T } | undefined): T | undefined {
  if (!value) {
    return undefined;
  }

  if (typeof value === "object" && "value" in value) {
    return value.value;
  }

  return value;
}

export function flattenEventLogSegments(segments: readonly EventLogSegment[]): string {
  return segments
    .map((segment) => {
      switch (segment.kind) {
        case "card":
          return segment.fallbackLabel ?? segment.cardId;
        case "player":
        case "stat":
        case "text":
          return segment.text;
        case "icon":
          return `[${segment.label}]`;
      }
    })
    .join("");
}

// =============================================================================
// Rendering
// =============================================================================

const BAG_RESOLVE_COMPLETED_KEYS = new Set<LorcanaLogMessageKey>([
  "lorcana.bag.resolve.completed",
  "lorcana.bag.resolve.completed.named",
  "lorcana.bag.resolve.completed.targets",
  "lorcana.bag.resolve.completed.targets.named",
]);

const SCRY_SELECTION_KEYS = new Set<LorcanaLogMessageKey>([
  "lorcana.effect.resolve.scrySelection",
  "lorcana.effect.resolve.scrySelection.detail",
  "lorcana.private.effect.resolve.scrySelection.detail",
]);

function renderTypedLogMessage(
  entry: MoveLogEntrySnapshot,
  message: LorcanaLogMessage,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
  resolveCard?: CardReferenceResolver,
): EventLogSegment[] {
  if (message.key === "lorcana.effect.resolve.choiceSelection" && message.values.choiceLabel) {
    return renderChoiceSelectionSegments(message.values.sourceCardId, message.values.choiceLabel);
  }

  if (
    message.key === "lorcana.effect.resolve.targetSelection" &&
    message.values.effectType === "play-card"
  ) {
    return renderPlayedTargetSelectionSegments(message.values.sourceCardId, message.values.targets);
  }

  if (
    message.key === "lorcana.effect.resolve.scrySelection.detail" ||
    message.key === "lorcana.private.effect.resolve.scrySelection.detail"
  ) {
    return renderScrySelectionDetailSegments(message, locale);
  }
  const template = getLorcanaLogTemplate(message.key, resolveEngineLogLocale(locale));
  const placeholderSegments = buildTemplatePlaceholderSegments(entry, message, viewerSide, locale);
  const renderedSegments = interpolateTemplateSegments(template, placeholderSegments);

  if (message.key === "lorcana.card.inked" && resolveCard) {
    return injectInkableIcon(renderedSegments, resolveCard, message.values.cardId);
  }

  if (BAG_RESOLVE_COMPLETED_KEYS.has(message.key) || SCRY_SELECTION_KEYS.has(message.key)) {
    const detailSegments = renderBagResolveDestinationDetail(entry);
    if (detailSegments.length > 0) {
      return [...renderedSegments, { kind: "text", text: " " }, ...detailSegments];
    }
  }

  return renderedSegments;
}

function renderChoiceSelectionSegments(
  sourceCardId: CardInstanceId,
  choiceLabel: string,
): EventLogSegment[] {
  const normalizedLabel = choiceLabel.trim().replace(/[.?!]+$/, "");
  return [
    { kind: "text", text: "Resolved " },
    cardSegment(sourceCardId),
    { kind: "text", text: " choosing " },
    { kind: "text", text: normalizedLabel },
    { kind: "text", text: "." },
  ];
}

function renderScrySelectionDetailSegments(
  message: Extract<
    LorcanaLogMessage,
    {
      key:
        | "lorcana.effect.resolve.scrySelection.detail"
        | "lorcana.private.effect.resolve.scrySelection.detail";
    }
  >,
  locale?: LorcanaSimulatorLocale,
): EventLogSegment[] {
  const template = getLorcanaLogTemplate(message.key, resolveEngineLogLocale(locale));
  const [beforeSelection, afterSelection = ""] = template.split("{selection}");
  const prefixSegments = interpolateTemplateSegments(beforeSelection ?? "", {
    sourceCardId: [cardSegment(message.values.sourceCardId)],
  });

  // Use structured destinations when available; fall back to the legacy
  // per-zone arrays for older log entries. Card names are resolved at render
  // time via the static-resources lookup in CardLogToken.
  const structuredDestinations = message.values.destinations;
  const orderedDestinations: Array<{
    zone: string;
    cardIds: CardInstanceId[];
  }> = [];

  if (structuredDestinations && structuredDestinations.length > 0) {
    for (const dest of structuredDestinations) {
      if (dest.cardIds.length > 0) {
        orderedDestinations.push({
          zone: dest.zone,
          cardIds: dest.cardIds,
        });
      }
    }
  } else {
    // Legacy path: reconstruct from per-zone arrays ordered by selection strings
    const legacyValues = message.values as {
      deckTopCards?: CardInstanceId[];
      deckBottomCards?: CardInstanceId[];
      handCards?: CardInstanceId[];
      playCards?: CardInstanceId[];
      inkwellCards?: CardInstanceId[];
      discardCards?: CardInstanceId[];
    };
    const legacyEntries: Array<{ zone: string; cards?: CardInstanceId[] }> = [
      { zone: "deck-top", cards: legacyValues.deckTopCards },
      { zone: "deck-bottom", cards: legacyValues.deckBottomCards },
      { zone: "hand", cards: legacyValues.handCards },
      { zone: "play", cards: legacyValues.playCards },
      { zone: "inkwell", cards: legacyValues.inkwellCards },
      { zone: "discard", cards: legacyValues.discardCards },
    ];
    const source =
      message.values.selection.length > 0
        ? message.values.selection
            .map((selectionText) => {
              const normalizedLabel = selectionText.split(":")[0]?.trim().toLowerCase();
              return (
                legacyEntries.find(
                  (entry) => getScryZoneLabel(entry.zone).toLowerCase() === normalizedLabel,
                ) ?? null
              );
            })
            .filter((e): e is { zone: string; cards?: CardInstanceId[] } => e !== null)
        : legacyEntries;
    for (const entry of source) {
      if (entry.cards && entry.cards.length > 0) {
        orderedDestinations.push({
          zone: entry.zone,
          cardIds: entry.cards,
        });
      }
    }
  }

  const renderedSelection = orderedDestinations.flatMap(({ zone, cardIds }, destinationIndex) => {
    const segments: EventLogSegment[] = [
      { kind: "text", text: `${getScryZoneLabel(zone)}: ` },
      ...joinSegments(
        cardIds.map((cardId) => [cardSegment(cardId)]),
        ", ",
      ),
    ];

    const hasMoreSelections = orderedDestinations
      .slice(destinationIndex + 1)
      .some((entry) => entry.cardIds.length > 0);
    if (hasMoreSelections) {
      segments.push({ kind: "text", text: ", " });
    }

    return segments;
  });

  return [
    ...prefixSegments,
    ...renderedSelection,
    ...interpolateTemplateSegments(afterSelection, {}),
  ];
}

function renderPlayedTargetSelectionSegments(
  sourceCardId: CardInstanceId,
  targets: Array<CardInstanceId | PlayerId>,
): EventLogSegment[] {
  const targetSegments = targets.map((targetId) => [cardSegment(targetId)]);

  return [
    { kind: "text", text: "Resolved " },
    cardSegment(sourceCardId),
    { kind: "text", text: " by playing " },
    ...joinHumanListSegments(targetSegments),
    { kind: "text", text: "." },
  ];
}

const DESTINATION_ZONE_LABELS: Record<string, string> = {
  hand: "Put into hand",
  "deck-bottom": "Put on bottom of deck",
  "deck-top": "Put on top of deck",
  play: "Put into play",
  discard: "Discarded",
  inkwell: "Put into inkwell",
};

function renderBagResolveDestinationDetail(entry: MoveLogEntrySnapshot): EventLogSegment[] {
  const bagParams = entry.params?.params as
    | { destinations?: Array<{ zone: string; cards?: string[] }> }
    | undefined;

  const destinations = bagParams?.destinations;
  if (!destinations || destinations.length === 0) {
    return [];
  }

  const segments: EventLogSegment[] = [];

  for (const destination of destinations) {
    const cards = destination.cards;
    if (!cards || cards.length === 0) {
      continue;
    }

    const zoneLabel = DESTINATION_ZONE_LABELS[destination.zone] ?? destination.zone;
    const cardSegments = cards.map((cardId) => cardSegment(cardId));

    if (segments.length > 0) {
      segments.push({ kind: "text", text: " " });
    }

    segments.push({ kind: "text", text: `${zoneLabel}: ` });
    segments.push(
      ...joinSegments(
        cardSegments.map((s) => [s]),
        ", ",
      ),
    );
    segments.push({ kind: "text", text: "." });
  }

  return segments;
}

// =============================================================================
// Template interpolation
// =============================================================================

function buildTemplatePlaceholderSegments(
  entry: MoveLogEntrySnapshot,
  message: LorcanaLogMessage,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
): Record<string, EventLogSegment[]> {
  const placeholderSegments: Record<string, EventLogSegment[]> = {};
  const valueKeys = Object.keys(message.values) as Array<keyof typeof message.values & string>;

  for (const valueKey of valueKeys) {
    placeholderSegments[valueKey] = createSegmentsForValue(
      entry,
      valueKey,
      message.values[valueKey],
      viewerSide,
      locale,
    );
  }

  return placeholderSegments;
}

function createSegmentsForValue(
  entry: MoveLogEntrySnapshot,
  valueKey: string,
  value: SimulatorSerializedValue | undefined,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
): EventLogSegment[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    const items = value.map((item) =>
      createSegmentsForArrayItem(entry, valueKey, item, viewerSide, locale),
    );
    return joinSegments(items, ", ");
  }

  if (typeof value === "number" && STAT_VALUE_KEYS.has(valueKey)) {
    return [{ kind: "stat", text: String(value) }];
  }

  if (typeof value === "string") {
    if (PLAYER_VALUE_KEYS.has(valueKey)) {
      return [playerSegmentForPlayerId(entry, value, viewerSide, locale)];
    }
    if (CARD_VALUE_KEYS.has(valueKey)) {
      return [cardSegment(value)];
    }
    if (TARGET_VALUE_KEYS.has(valueKey)) {
      return [entitySegment(entry, value, viewerSide, locale)];
    }
  }

  return [{ kind: "text", text: String(value) }];
}

function createSegmentsForArrayItem(
  entry: MoveLogEntrySnapshot,
  valueKey: string,
  value: SimulatorSerializedValue,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
): EventLogSegment[] {
  if (typeof value === "number" && STAT_VALUE_KEYS.has(valueKey)) {
    return [{ kind: "stat", text: String(value) }];
  }

  if (typeof value !== "string") {
    return [{ kind: "text", text: String(value) }];
  }

  if (CARD_LIST_VALUE_KEYS.has(valueKey)) {
    return [cardSegment(value)];
  }
  if (TARGET_VALUE_KEYS.has(valueKey)) {
    return [entitySegment(entry, value, viewerSide, locale)];
  }

  return [{ kind: "text", text: value }];
}

function interpolateTemplateSegments(
  template: string,
  placeholderSegments: Record<string, EventLogSegment[]>,
): EventLogSegment[] {
  const segments: EventLogSegment[] = [];
  let cursor = 0;
  const matches = [...template.matchAll(/\{([a-zA-Z0-9_]+)\}/g)];

  for (const match of matches) {
    const placeholder = match[1] ?? "";
    const matchIndex = match.index ?? 0;
    if (matchIndex > cursor) {
      segments.push({ kind: "text", text: template.slice(cursor, matchIndex) });
    }

    segments.push(...(placeholderSegments[placeholder] ?? []));
    cursor = matchIndex + match[0].length;
  }

  if (cursor < template.length) {
    segments.push({ kind: "text", text: template.slice(cursor) });
  }

  return segments;
}

function injectInkableIcon(
  segments: EventLogSegment[],
  resolveCard: CardReferenceResolver,
  cardId: CardInstanceId,
): EventLogSegment[] {
  const cardRef = resolveCard(cardId);
  if (!cardRef?.inkable) {
    return segments;
  }

  const result: EventLogSegment[] = [];
  let inserted = false;

  for (const segment of segments) {
    if (!inserted && segment.kind === "card" && segment.cardId === cardId) {
      result.push({ kind: "icon", icon: "inkable", label: "Inkable" });
      result.push({ kind: "text", text: " " });
      inserted = true;
    }
    result.push(segment);
  }

  return result;
}

// =============================================================================
// Segment helpers
// =============================================================================

function resolveEventLogLocale(locale?: LorcanaSimulatorLocale): LorcanaSimulatorLocale {
  if (locale) {
    return locale;
  }

  const currentLocale = getLocale();
  return currentLocale === "es" ||
    currentLocale === "de" ||
    currentLocale === "it" ||
    currentLocale === "pt-br"
    ? currentLocale
    : "en";
}

function resolveEngineLogLocale(locale?: LorcanaSimulatorLocale): LorcanaLogLocale {
  return ENGINE_LOG_LOCALE_BY_SIMULATOR_LOCALE[resolveEventLogLocale(locale)];
}

function cardSegment(cardId: string): EventLogSegment {
  return { kind: "card", cardId };
}

function entitySegment(
  entry: MoveLogEntrySnapshot,
  value: string,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
): EventLogSegment {
  const resolvedSide = resolveSideForPlayerId(entry, value);
  if (resolvedSide) {
    const actor = buildActor(resolvedSide, viewerSide, locale);
    return { kind: "player", text: actor.label, tone: actor.tone, playerId: value };
  }

  return cardSegment(value);
}

function playerSegmentForPlayerId(
  entry: MoveLogEntrySnapshot,
  playerId: string,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
): EventLogSegment {
  const side = resolveSideForPlayerId(entry, playerId);
  const actor = buildActor(side, viewerSide, locale);
  return { kind: "player", text: actor.label, tone: actor.tone, playerId };
}

function resolveSideForPlayerId(
  entry: MoveLogEntrySnapshot,
  playerId: string,
): LorcanaPlayerSide | null {
  const actorSide = entry.actorSide;
  const actorPlayerId = entry.playerId;

  if (actorSide && actorPlayerId === playerId) {
    return actorSide;
  }

  if (playerId === "player_one") {
    return "playerOne";
  }

  if (playerId === "player_two") {
    return "playerTwo";
  }

  return null;
}

function buildActor(
  actorSide?: LorcanaPlayerSide | null,
  viewerSide?: LorcanaPlayerSide | null,
  locale?: LorcanaSimulatorLocale,
): { label: string; tone: EventLogPlayerTone } {
  const resolvedLocale = resolveEventLogLocale(locale);
  if (!actorSide) {
    return { label: "System", tone: "system" };
  }

  if (viewerSide && actorSide === viewerSide) {
    return { label: m["sim.player.you"]({}, { locale: resolvedLocale }), tone: "self" };
  }

  if (viewerSide && actorSide !== viewerSide) {
    return { label: m["sim.player.opponent"]({}, { locale: resolvedLocale }), tone: "opponent" };
  }

  return actorSide === "playerOne"
    ? {
        label: m["sim.player.side.playerOne"]({}, { locale: resolvedLocale }),
        tone: "playerOne",
      }
    : {
        label: m["sim.player.side.playerTwo"]({}, { locale: resolvedLocale }),
        tone: "playerTwo",
      };
}

function joinSegments(segments: EventLogSegment[][], separator: string): EventLogSegment[] {
  const result: EventLogSegment[] = [];

  segments.forEach((segmentGroup, index) => {
    if (index > 0) {
      result.push({ kind: "text", text: separator });
    }
    result.push(...segmentGroup);
  });

  return result;
}
