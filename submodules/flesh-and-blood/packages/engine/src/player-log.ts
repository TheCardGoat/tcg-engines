import { isFabMoveName, type FabMoveName } from "./moves.ts";
import type { FabPhase } from "./game/turn.ts";
import type { FabAttackTarget, FabAttackTargetRef } from "./game/combat.ts";
import type { FabRulesSnapshot } from "./kernel/transaction-kernel.ts";
import type { FabObjectSnapshot } from "./rules/events.ts";
import { findObject } from "./rules/proposals/shared.ts";
import {
  FAB_LOG_ACTOR_VALUE_KEYS,
  FAB_LOG_KEYS,
  FAB_LOG_KEY_CATEGORIES,
  FAB_LOG_TRANSLATION_VALUE_KEYS,
  fabLogActorSlotUsage,
  fabObjectDisplayName,
  renderFabLogTemplate,
  type FabLogActorLabelUsage,
  type FabLogFact,
  type FabLogKey,
  type FabLogLocale,
  type FabLogMessageValuesByName,
  type FabLogTemplateValue,
} from "./log/index.ts";

/**
 * Reducer-owned semantic facts for the player narrative.
 *
 * These are deliberately not rules events. A reducer emits a fact only after
 * the corresponding state change succeeds, and the command boundary turns
 * the committed facts into one viewer-safe, localizable receipt.
 */
export type FabPlayerLogFact =
  | {
      readonly kind: "card-played";
      readonly actorId: string;
      readonly card: FabPlayerLogCardReference;
      readonly from: string;
    }
  | {
      readonly kind: "modal-modes-declared";
      readonly actorId: string;
      readonly card: FabPlayerLogCardReference;
      readonly modeTexts: readonly string[];
    }
  | {
      readonly kind: "card-pitched";
      readonly playerId: string;
      readonly card: FabPlayerLogCardReference;
      readonly resources: number;
    }
  | {
      readonly kind: "attack-declared";
      readonly actorId: string;
      readonly card: FabPlayerLogCardReference;
      readonly effectSource?: FabPlayerLogCardReference;
      readonly target: FabPlayerLogTarget;
      readonly attack: number;
    }
  | {
      readonly kind: "card-defended";
      readonly actorId: string;
      readonly card: FabPlayerLogCardReference;
      readonly defense: number;
    }
  | {
      readonly kind: "combat-resolved";
      readonly card: FabPlayerLogCardReference;
      readonly target: FabPlayerLogTarget;
      readonly attack: number;
      readonly defense: number;
      readonly damage: number;
      readonly defended: boolean;
    }
  | {
      readonly kind: "card-drawn";
      readonly playerId: string;
      readonly card: FabPlayerLogCardReference;
    }
  | {
      /** A draw proposal that a replacement turned into no draw event. */
      readonly kind: "draw-replaced";
      readonly playerId: string;
    }
  | {
      /** A private hand/arsenal card deliberately placed on the bottom of the deck. */
      readonly kind: "card-bottomed";
      readonly playerId: string;
      readonly card: FabPlayerLogCardReference;
      readonly from: "hand" | "arsenal";
    }
  | {
      /** Migration path for already-curated engine facts not yet reducer-owned. */
      readonly kind: "localized-message";
      readonly message: FabLogFact;
    };

export interface FabPlayerLogCardReference {
  readonly instanceId: string;
  readonly canonicalId: string | null;
  readonly name: string;
}

export type FabPlayerLogTarget =
  | { readonly kind: "player"; readonly playerId: string }
  | { readonly kind: "card"; readonly card: FabPlayerLogCardReference };

/** A translation-keyed message. English prose is never persisted. */
export type FabPlayerLogMessage = {
  readonly [TKey in FabLogKey]: {
    readonly key: TKey;
    readonly values: FabLogMessageValuesByName[TKey];
    readonly category: (typeof FAB_LOG_KEY_CATEGORIES)[TKey];
    readonly cardRefs?: readonly FabPlayerLogCardReference[];
    readonly metrics?:
      | { readonly kind: "attack"; readonly attack: number }
      | { readonly kind: "defense"; readonly defense: number }
      | {
          readonly kind: "combat-outcome";
          readonly attack: number;
          readonly defense: number;
          readonly damage: number;
        };
  };
}[FabLogKey];

/**
 * One meaningful consequence inside an accepted move. A private message
 * replaces its public form for that viewer; it is not appended as a duplicate
 * line.
 */
export interface FabPlayerLogEntry {
  readonly entryId: string;
  readonly publicMessage: FabPlayerLogMessage | null;
  readonly privateMessageByPlayerId?: Readonly<Record<string, FabPlayerLogMessage>>;
}

/** Exactly one player-narrative receipt for one accepted command. */
export interface FabPlayerLog {
  readonly kind: "player-narrative";
  readonly schemaVersion: 1;
  readonly commandId: string;
  readonly moveType: FabMoveName;
  readonly actorId: string;
  readonly timestamp: number;
  readonly turnNumber: number;
  /** Command-start turn owner, duplicated so presentation never reconstructs it from events. */
  readonly turnPlayerId: string;
  readonly phase: FabPhase;
  readonly entries: readonly FabPlayerLogEntry[];
}

/** Viewer-safe wire form produced by the host before gateway publication. */
export interface FabVisiblePlayerLogEntry {
  readonly entryId: string;
  readonly message: FabPlayerLogMessage;
}

export interface FabVisiblePlayerLog extends Omit<FabPlayerLog, "entries"> {
  readonly entries: readonly FabVisiblePlayerLogEntry[];
}

const FAB_PLAYER_LOG_KEY_SET: ReadonlySet<string> = new Set(FAB_LOG_KEYS);

function isFabPlayerLogKey(value: unknown): value is FabLogKey {
  return typeof value === "string" && FAB_PLAYER_LOG_KEY_SET.has(value);
}

function isFabPlayerLogCardReference(value: unknown): value is FabPlayerLogCardReference {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const card = value as Record<string, unknown>;
  return (
    typeof card.instanceId === "string" &&
    (card.canonicalId === null || typeof card.canonicalId === "string") &&
    typeof card.name === "string"
  );
}

function isFabPlayerLogTemplatePrimitive(value: unknown): boolean {
  return (
    typeof value === "string" ||
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

function isFabPlayerLogTemplateValue(value: unknown): boolean {
  return (
    isFabPlayerLogTemplatePrimitive(value) ||
    (Array.isArray(value) && value.every(isFabPlayerLogTemplatePrimitive))
  );
}

function isFabPlayerLogMetrics(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const metrics = value as Record<string, unknown>;
  switch (metrics.kind) {
    case "attack":
      return typeof metrics.attack === "number" && Number.isFinite(metrics.attack);
    case "defense":
      return typeof metrics.defense === "number" && Number.isFinite(metrics.defense);
    case "combat-outcome":
      return (
        typeof metrics.attack === "number" &&
        Number.isFinite(metrics.attack) &&
        typeof metrics.defense === "number" &&
        Number.isFinite(metrics.defense) &&
        typeof metrics.damage === "number" &&
        Number.isFinite(metrics.damage)
      );
    default:
      return false;
  }
}

function isFabPlayerLogMessage(value: unknown): value is FabPlayerLogMessage {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const message = value as Record<string, unknown>;
  if (!isFabPlayerLogKey(message.key)) return false;
  if (
    typeof message.values !== "object" ||
    message.values === null ||
    Array.isArray(message.values)
  ) {
    return false;
  }
  const values = message.values as Record<string, unknown>;
  const expectedValueKeys = FAB_LOG_TRANSLATION_VALUE_KEYS[message.key];
  const actualValueKeys = Object.keys(values);
  return (
    message.category === FAB_LOG_KEY_CATEGORIES[message.key] &&
    actualValueKeys.length === expectedValueKeys.length &&
    expectedValueKeys.every((key) => Object.hasOwn(values, key)) &&
    Object.values(values).every(isFabPlayerLogTemplateValue) &&
    (message.cardRefs === undefined ||
      (Array.isArray(message.cardRefs) && message.cardRefs.every(isFabPlayerLogCardReference))) &&
    (message.metrics === undefined || isFabPlayerLogMetrics(message.metrics))
  );
}

const LEGACY_PUBLIC_KEYS_BY_PRIVATE_KEY: Readonly<
  Partial<Record<FabLogKey, readonly FabLogKey[]>>
> = {
  "flesh-and-blood.look.private": ["flesh-and-blood.look"],
  "flesh-and-blood.opt.private": ["flesh-and-blood.opt", "flesh-and-blood.opt.cards"],
  "flesh-and-blood.search.found": ["flesh-and-blood.search"],
};

function messagePlayerId(message: FabPlayerLogMessage): string | undefined {
  const values = message.values as Readonly<Record<string, unknown>>;
  return typeof values.playerId === "string" ? values.playerId : undefined;
}

/** Validate an untrusted persisted canonical FAB narrative before rendering it. */
export function isFabPlayerLog(value: unknown): value is FabPlayerLog {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const log = value as Record<string, unknown>;
  if (
    log.kind !== "player-narrative" ||
    log.schemaVersion !== 1 ||
    typeof log.commandId !== "string" ||
    typeof log.moveType !== "string" ||
    !isFabMoveName(log.moveType) ||
    typeof log.actorId !== "string" ||
    typeof log.timestamp !== "number" ||
    !Number.isFinite(log.timestamp) ||
    typeof log.turnNumber !== "number" ||
    !Number.isFinite(log.turnNumber) ||
    typeof log.turnPlayerId !== "string" ||
    (log.phase !== "start" && log.phase !== "action" && log.phase !== "end") ||
    !Array.isArray(log.entries)
  ) {
    return false;
  }
  return log.entries.every((value) => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    const entry = value as Record<string, unknown>;
    if (
      typeof entry.entryId !== "string" ||
      (entry.publicMessage !== null && !isFabPlayerLogMessage(entry.publicMessage))
    ) {
      return false;
    }
    if (entry.privateMessageByPlayerId === undefined) return true;
    return (
      typeof entry.privateMessageByPlayerId === "object" &&
      entry.privateMessageByPlayerId !== null &&
      !Array.isArray(entry.privateMessageByPlayerId) &&
      Object.values(entry.privateMessageByPlayerId).every(isFabPlayerLogMessage)
    );
  });
}

export function fabPlayerLogCard(object: FabObjectSnapshot): FabPlayerLogCardReference {
  return {
    instanceId: object.instanceId,
    canonicalId: object.canonicalId,
    name: fabObjectDisplayName(object),
  };
}

/**
 * Modal labels are normally localized before a card enters a match. Keep a
 * readable semantic fallback for rules-only cards used by engine tooling so a
 * committed choice can never become an empty player-log line.
 */
export function fabPlayerLogModalModeText(mode: {
  readonly id: string;
  readonly text: string;
}): string {
  const localized = mode.text.trim();
  if (localized.length > 0) return localized;
  const semanticKey = mode.id.split(":").at(-1) ?? mode.id;
  const humanized = semanticKey
    .replaceAll(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll(/[-_]+/g, " ")
    .trim();
  return humanized.length > 0
    ? `${humanized[0]!.toUpperCase()}${humanized.slice(1)}`
    : "Unnamed mode";
}

function cardForInstance(state: FabRulesSnapshot, instanceId: string): FabPlayerLogCardReference {
  const snapshot = findObject(state, instanceId);
  if (snapshot) return fabPlayerLogCard(snapshot);
  const record = state.objects[instanceId];
  const definition = record ? state.cardDefinitions[record.canonicalId] : undefined;
  return {
    instanceId,
    canonicalId: record?.canonicalId ?? null,
    name: definition?.base.names.join(" // ") || record?.canonicalId || instanceId,
  };
}

export function fabPlayerLogTarget(
  state: FabRulesSnapshot,
  target: FabAttackTarget | FabAttackTargetRef,
): FabPlayerLogTarget {
  if (target.kind === "hero") return { kind: "player", playerId: target.playerId };
  // Damage can destroy a token before the combat outcome is recorded. Resolve
  // the declared incarnation, rather than a missing or subsequently moved card.
  if (state.objects[target.ref.instanceId]?.incarnation !== target.ref.incarnation) {
    const previous = Object.values(state.lkiArena).find(
      (snapshot) =>
        snapshot.ref.instanceId === target.ref.instanceId &&
        snapshot.ref.incarnation === target.ref.incarnation &&
        snapshot.zone.zone === "arena",
    );
    if (previous) {
      return {
        kind: "card",
        card: {
          instanceId: target.ref.instanceId,
          canonicalId: previous.canonicalId,
          name:
            previous.current.names.join(" // ") ||
            previous.base.names.join(" // ") ||
            previous.canonicalId,
        },
      };
    }
  }
  return { kind: "card", card: cardForInstance(state, target.ref.instanceId) };
}

function targetName(target: FabPlayerLogTarget): string {
  return target.kind === "player" ? target.playerId : target.card.name;
}

function targetCardRefs(target: FabPlayerLogTarget): readonly FabPlayerLogCardReference[] {
  return target.kind === "card" ? [target.card] : [];
}

type FabPlayerLogDrawFact = Extract<
  FabPlayerLogFact,
  { readonly kind: "card-drawn" | "draw-replaced" }
>;

function finalizeDraws(
  commandId: string,
  entryIndex: number,
  facts: readonly FabPlayerLogDrawFact[],
): readonly FabPlayerLogEntry[] {
  const playerId = facts[0]!.playerId;
  const cards = facts.flatMap((fact) => (fact.kind === "card-drawn" ? [fact.card] : []));
  const replacedCount = facts.length - cards.length;
  const entries: FabPlayerLogEntry[] = [];
  if (cards.length > 0) {
    const publicMessage: FabPlayerLogMessage =
      cards.length === 1
        ? { key: "flesh-and-blood.draw", values: { playerId }, category: "action" }
        : {
            key: "flesh-and-blood.draw.cards",
            values: { playerId, count: cards.length },
            category: "action",
          };
    entries.push({
      entryId: `${commandId}:entry-${entryIndex}`,
      publicMessage,
      privateMessageByPlayerId: {
        [playerId]: {
          key: "flesh-and-blood.draw.private",
          values: { playerId, cardNames: cards.map((card) => card.name).join(", ") },
          category: "action",
          cardRefs: cards,
        },
      },
    });
  }
  if (replacedCount > 0) {
    entries.push({
      entryId: `${commandId}:entry-${entryIndex + entries.length}`,
      publicMessage:
        replacedCount === 1
          ? {
              key: "flesh-and-blood.draw.replaced",
              values: { playerId },
              category: "action",
            }
          : {
              key: "flesh-and-blood.draw.replaced.cards",
              values: { playerId, count: replacedCount },
              category: "action",
            },
    });
  }
  return entries;
}

/** Finalize reducer facts once, after the candidate state passes validation. */
export function finalizeFabPlayerLog(input: {
  readonly commandId: string;
  readonly moveType: FabMoveName;
  readonly actorId: string;
  readonly timestamp: number;
  readonly turnNumber: number;
  readonly turnPlayerId: string;
  readonly phase: FabPhase;
  readonly facts: readonly FabPlayerLogFact[];
}): FabPlayerLog {
  const entries: FabPlayerLogEntry[] = [];
  let pendingDraws: FabPlayerLogDrawFact[] = [];
  const localizedFacts = input.facts.flatMap((fact) =>
    fact.kind === "localized-message" ? [fact.message] : [],
  );
  const redundantClashRevealFactIndexes = new Set<number>();
  for (const [outcomeIndex, fact] of input.facts.entries()) {
    if (fact.kind !== "localized-message" || fact.message.key !== "flesh-and-blood.clash.outcome") {
      continue;
    }
    const outcomeActivity = fact.message.activityRef;
    for (const instanceId of [
      fact.message.objectRefs?.firstCardName?.instanceId,
      fact.message.objectRefs?.secondCardName?.instanceId,
    ]) {
      if (instanceId === undefined) continue;
      let nearestMatch: number | undefined;
      for (let candidateIndex = outcomeIndex - 1; candidateIndex >= 0; candidateIndex -= 1) {
        if (redundantClashRevealFactIndexes.has(candidateIndex)) continue;
        const candidate = input.facts[candidateIndex];
        if (
          candidate?.kind !== "localized-message" ||
          candidate.message.key !== "flesh-and-blood.reveal" ||
          candidate.message.objectRefs?.cardName?.instanceId !== instanceId
        ) {
          continue;
        }
        nearestMatch ??= candidateIndex;
        const candidateActivity = candidate.message.activityRef;
        if (
          outcomeActivity?.kind === "stack-layer-event" &&
          candidateActivity?.kind === "stack-layer-event" &&
          outcomeActivity.layerId === candidateActivity.layerId
        ) {
          nearestMatch = candidateIndex;
          break;
        }
      }
      if (nearestMatch !== undefined) redundantClashRevealFactIndexes.add(nearestMatch);
    }
  }
  const boostBanishedInstanceIds = new Set(
    localizedFacts.flatMap((message) =>
      message.key === "flesh-and-blood.boost.banish" && message.objectRefs?.banishedName?.instanceId
        ? [message.objectRefs.banishedName.instanceId]
        : [],
    ),
  );
  const activatedInstanceIds = new Set(
    localizedFacts.flatMap((message) =>
      message.key === "flesh-and-blood.activate" && message.objectRefs?.cardName?.instanceId
        ? [message.objectRefs.cardName.instanceId]
        : [],
    ),
  );

  const flushDraws = (): void => {
    if (pendingDraws.length === 0) return;
    entries.push(...finalizeDraws(input.commandId, entries.length, pendingDraws));
    pendingDraws = [];
  };

  for (const [factIndex, fact] of input.facts.entries()) {
    if (redundantClashRevealFactIndexes.has(factIndex)) continue;
    if (
      fact.kind === "localized-message" &&
      ((fact.message.key === "flesh-and-blood.banish" &&
        fact.message.objectRefs?.cardName?.instanceId !== undefined &&
        boostBanishedInstanceIds.has(fact.message.objectRefs.cardName.instanceId)) ||
        ((fact.message.key === "flesh-and-blood.discard" ||
          fact.message.key === "flesh-and-blood.discard.random") &&
          fact.message.objectRefs?.cardName?.instanceId !== undefined &&
          activatedInstanceIds.has(fact.message.objectRefs.cardName.instanceId)))
    ) {
      continue;
    }
    if (fact.kind === "card-drawn" || fact.kind === "draw-replaced") {
      if (pendingDraws[0]?.playerId !== undefined && pendingDraws[0].playerId !== fact.playerId) {
        flushDraws();
      }
      pendingDraws.push(fact);
      continue;
    }
    flushDraws();
    const entryId = `${input.commandId}:entry-${entries.length}`;
    switch (fact.kind) {
      case "card-played":
        entries.push({
          entryId,
          publicMessage:
            fact.from === "hand"
              ? {
                  key: "flesh-and-blood.play",
                  values: { actorId: fact.actorId, cardName: fact.card.name },
                  category: "action",
                  cardRefs: [fact.card],
                }
              : {
                  key: "flesh-and-blood.play.from-zone",
                  values: { actorId: fact.actorId, cardName: fact.card.name, from: fact.from },
                  category: "action",
                  cardRefs: [fact.card],
                },
        });
        break;
      case "modal-modes-declared":
        entries.push({
          entryId,
          publicMessage: {
            key: "flesh-and-blood.modal.modes-chosen",
            values: {
              actorId: fact.actorId,
              cardName: fact.card.name,
              modeCount: fact.modeTexts.length,
              modePlural: fact.modeTexts.length === 1 ? "" : "s",
              modeText: fact.modeTexts.length > 0 ? fact.modeTexts.join(" · ") : "None",
            },
            category: "ability",
            cardRefs: [fact.card],
          },
        });
        break;
      case "card-pitched":
        entries.push({
          entryId,
          publicMessage: {
            key: "flesh-and-blood.pitch",
            values: {
              playerId: fact.playerId,
              cardName: fact.card.name,
              resources: fact.resources,
            },
            category: "action",
            cardRefs: [fact.card],
          },
        });
        break;
      case "attack-declared":
        entries.push({
          entryId,
          publicMessage: fact.effectSource
            ? {
                key: "flesh-and-blood.attack.by-source",
                values: {
                  sourceName: fact.effectSource.name,
                  cardName: fact.card.name,
                  targetName: targetName(fact.target),
                },
                category: "combat",
                cardRefs: [fact.effectSource, fact.card, ...targetCardRefs(fact.target)],
                metrics: { kind: "attack", attack: fact.attack },
              }
            : {
                key: "flesh-and-blood.attack",
                values: {
                  actorId: fact.actorId,
                  cardName: fact.card.name,
                  targetName: targetName(fact.target),
                },
                category: "combat",
                cardRefs: [fact.card, ...targetCardRefs(fact.target)],
                metrics: { kind: "attack", attack: fact.attack },
              },
        });
        break;
      case "card-defended":
        entries.push({
          entryId,
          publicMessage: {
            key: "flesh-and-blood.defend",
            values: { actorId: fact.actorId, cardName: fact.card.name },
            category: "combat",
            cardRefs: [fact.card],
            metrics: { kind: "defense", defense: fact.defense },
          },
        });
        break;
      case "combat-resolved":
        entries.push({
          entryId,
          publicMessage:
            fact.damage > 0
              ? {
                  key: "flesh-and-blood.combat.hit",
                  values: {
                    cardName: fact.card.name,
                    targetName: targetName(fact.target),
                    damage: fact.damage,
                  },
                  category: "combat",
                  cardRefs: [fact.card, ...targetCardRefs(fact.target)],
                  metrics: {
                    kind: "combat-outcome",
                    attack: fact.attack,
                    defense: fact.defense,
                    damage: fact.damage,
                  },
                }
              : {
                  key: fact.defended
                    ? "flesh-and-blood.combat.blocked"
                    : "flesh-and-blood.combat.missed",
                  values: {
                    cardName: fact.card.name,
                    targetName: targetName(fact.target),
                  },
                  category: "combat",
                  cardRefs: [fact.card, ...targetCardRefs(fact.target)],
                  metrics: {
                    kind: "combat-outcome",
                    attack: fact.attack,
                    defense: fact.defense,
                    damage: 0,
                  },
                },
        });
        break;
      case "card-bottomed":
        entries.push({
          entryId,
          publicMessage: {
            key: "flesh-and-blood.deck-bottom",
            values: { playerId: fact.playerId, from: fact.from },
            category: "action",
          },
          privateMessageByPlayerId: {
            [fact.playerId]: {
              key: "flesh-and-blood.deck-bottom.private",
              values: { playerId: fact.playerId, cardName: fact.card.name, from: fact.from },
              category: "action",
              cardRefs: [fact.card],
            },
          },
        });
        break;
      case "localized-message": {
        const message = playerMessageFromLogFact(fact.message);
        if (fact.message.visibleTo === undefined || fact.message.visibleTo.length === 0) {
          entries.push({ entryId, publicMessage: message });
          break;
        }
        const publicKeys = LEGACY_PUBLIC_KEYS_BY_PRIVATE_KEY[message.key];
        const previous = entries.at(-1);
        const publicMessage = previous?.publicMessage;
        const privatePlayerId = messagePlayerId(message);
        const publicPlayerId = publicMessage ? messagePlayerId(publicMessage) : undefined;
        if (
          previous &&
          publicMessage &&
          publicKeys?.includes(publicMessage.key) &&
          (privatePlayerId === undefined ||
            publicPlayerId === undefined ||
            privatePlayerId === publicPlayerId)
        ) {
          entries[entries.length - 1] = {
            ...previous,
            privateMessageByPlayerId: {
              ...previous.privateMessageByPlayerId,
              ...Object.fromEntries(fact.message.visibleTo.map((playerId) => [playerId, message])),
            },
          };
          break;
        }
        entries.push({
          entryId,
          publicMessage: null,
          privateMessageByPlayerId: Object.fromEntries(
            fact.message.visibleTo.map((playerId) => [playerId, message]),
          ),
        });
        break;
      }
    }
  }
  flushDraws();

  return {
    kind: "player-narrative",
    schemaVersion: 1,
    commandId: input.commandId,
    moveType: input.moveType,
    actorId: input.actorId,
    timestamp: input.timestamp,
    turnNumber: input.turnNumber,
    turnPlayerId: input.turnPlayerId,
    phase: input.phase,
    entries,
  };
}

/** Select private replacements for one viewer and remove the canonical map. */
export function visibleFabPlayerLog(
  log: FabPlayerLog,
  viewerId: string | null,
): FabVisiblePlayerLog {
  return {
    kind: log.kind,
    schemaVersion: log.schemaVersion,
    commandId: log.commandId,
    moveType: log.moveType,
    actorId: log.actorId,
    timestamp: log.timestamp,
    turnNumber: log.turnNumber,
    turnPlayerId: log.turnPlayerId,
    phase: log.phase,
    entries: log.entries.flatMap((entry) => {
      const privateMessage = viewerId ? entry.privateMessageByPlayerId?.[viewerId] : undefined;
      const message = privateMessage ?? entry.publicMessage;
      return message ? [{ entryId: entry.entryId, message }] : [];
    }),
  };
}

export function visibleFabPlayerLogMessages(
  log: FabPlayerLog,
  viewerId: string | null,
): readonly FabPlayerLogMessage[] {
  return visibleFabPlayerLog(log, viewerId).entries.map((entry) => entry.message);
}

export type FabPlayerLogActorLabel = (
  actorId: string,
  usage: FabLogActorLabelUsage,
) => string | undefined;

function playerMessageFromLogFact<TKey extends FabLogKey>(
  fact: Extract<FabLogFact, { readonly key: TKey }>,
): Extract<FabPlayerLogMessage, { readonly key: TKey }> {
  const cardRefs = Object.entries(fact.objectRefs ?? {}).flatMap(([slot, reference]) => {
    if (!reference) return [];
    const value = (fact.values as Readonly<Record<string, unknown>>)[slot];
    return [
      {
        instanceId: reference.instanceId,
        canonicalId: reference.canonicalId,
        name: typeof value === "string" ? value : (reference.canonicalId ?? reference.instanceId),
      },
    ];
  });
  return {
    key: fact.key,
    values: fact.values,
    category: fact.category,
    ...(cardRefs.length > 0 ? { cardRefs } : {}),
  } as Extract<FabPlayerLogMessage, { readonly key: TKey }>;
}

/** Production renderer for a viewer-safe message; tests assert this text. */
export function renderFabPlayerLogMessage(
  message: FabPlayerLogMessage,
  options: {
    /** Localized seat labeler supplied by the presentation boundary. */
    readonly actorLabel?: FabPlayerLogActorLabel;
    readonly locale?: FabLogLocale;
  },
): string {
  const values: Record<string, FabLogTemplateValue> = {};
  for (const [slot, value] of Object.entries(message.values)) {
    values[slot] =
      typeof value === "string" && FAB_LOG_ACTOR_VALUE_KEYS.has(slot)
        ? (options.actorLabel?.(value, fabLogActorSlotUsage(message.key, slot)) ?? value)
        : value;
  }
  return renderFabLogTemplate(message.key, values, options.locale);
}

export function renderFabPlayerLog(
  log: FabPlayerLog,
  options: {
    readonly viewerId: string | null;
    /** Localized seat labeler supplied by the presentation boundary. */
    readonly actorLabel?: FabPlayerLogActorLabel;
    readonly locale?: FabLogLocale;
  },
): readonly string[] {
  return visibleFabPlayerLogMessages(log, options.viewerId).map((message) =>
    renderFabPlayerLogMessage(message, options),
  );
}
