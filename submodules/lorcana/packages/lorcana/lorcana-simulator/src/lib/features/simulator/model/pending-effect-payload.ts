import type {
  EnginePendingEffectProjection,
  ResolutionSelectionRevealedCard,
} from "@tcg/lorcana-engine";
import type { CardFilter, ScryCardOrdering } from "@tcg/lorcana-types";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import { isSupportedResolutionTargetEffectType } from "@/features/simulator/model/resolution-target-prompt.js";
import type { CardSnapshotMap } from "./board-utils.js";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function getRecordString(record: Record<string, unknown> | null, key: string): string | undefined {
  const value = record?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function getRecordNumber(record: Record<string, unknown> | null, key: string): number | undefined {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getStringArray(record: Record<string, unknown> | null, key: string): string[] {
  const value = record?.[key];
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

function getFilterArray(record: Record<string, unknown> | null, key: string): CardFilter[] {
  const value = record?.[key];
  if (Array.isArray(value)) {
    return value.filter((entry): entry is CardFilter =>
      Boolean(entry && typeof entry === "object" && !Array.isArray(entry)),
    );
  }

  if (value && typeof value === "object") {
    return [value as CardFilter];
  }

  return [];
}

export interface PendingEffectPayloadMeta {
  kind?: string;
  sourceId?: string;
  sourceCardId?: string;
  chooserId?: string;
  controllerId?: string;
  abilityIndex?: number;
  effectType?: string;
}

export interface BagEffectPayloadMeta {
  kind?: string;
  sourceId?: string;
  sourceCardId?: string;
  chooserId?: string;
  controllerId?: string;
  abilityIndex?: number;
  effectType?: string;
}

export type EffectInstanceReferenceKind =
  | "self"
  | "source"
  | "trigger-source"
  | "trigger-subject"
  | "attacker"
  | "defender"
  | "previous-target"
  | "selected-first"
  | "selected-all"
  | "revealed-first"
  | "revealed-all"
  | "chosen-or-source"
  | "singers";

export interface EffectInstanceReferenceMeta {
  kind: EffectInstanceReferenceKind;
  cardIds: string[];
}

export interface ScryDestinationRuleView {
  id: string;
  zone: string;
  min: number;
  max: number | null;
  remainder: boolean;
  label?: string;
  filters: readonly CardFilter[];
  playFilters: readonly CardFilter[];
  ordering?: ScryCardOrdering;
  reveal: boolean;
  exclusiveGroup?: string;
  cost?: "free" | "reduced";
  entersExerted?: boolean;
  grantsRush?: boolean;
  banishAtEndOfTurn?: boolean;
  exerted?: boolean;
  facedown?: boolean;
}

export interface ScryPendingEffectView {
  effectId: string;
  chooserId: string;
  sourceCardId: string | null;
  sourceCard: LorcanaCardSnapshot | null;
  amount: number;
  revealedCardIds: string[];
  revealedCards: ResolutionSelectionRevealedCard[];
  destinationRules: ScryDestinationRuleView[];
}

export function getPendingEffectPayloadMeta(payload: unknown): PendingEffectPayloadMeta {
  const payloadRecord = asRecord(payload);
  const effectRecord = asRecord(payloadRecord?.effect);
  return {
    kind: getRecordString(payloadRecord, "kind"),
    sourceId: getRecordString(payloadRecord, "sourceId"),
    sourceCardId: getRecordString(payloadRecord, "sourceCardId"),
    chooserId: getRecordString(payloadRecord, "chooserId"),
    controllerId: getRecordString(payloadRecord, "controllerId"),
    abilityIndex: getRecordNumber(payloadRecord, "abilityIndex"),
    effectType: getRecordString(effectRecord, "type"),
  };
}

function unwrapOptionalEffect(
  effectRecord: Record<string, unknown> | null,
): Record<string, unknown> | null {
  if (!effectRecord) {
    return null;
  }
  const type = getRecordString(effectRecord, "type");
  // Unwrap optional wrappers so the inner effect type is surfaced (e.g.
  // "move-damage" inside an optional triggered ability shows the two-slot
  // prompt instead of being treated as "optional").
  if (type === "optional") {
    const inner = asRecord(effectRecord.effect);
    return inner ? (unwrapOptionalEffect(inner) ?? inner) : effectRecord;
  }
  // Sequence wrappers (e.g. Julieta SIGNATURE RECIPE:
  // `{type:"sequence", steps:[{type:"optional", effect:{type:"remove-damage", ...}}, ...]}`).
  // Scan for the first step whose unwrapped type is a supported resolution-
  // target effect type. Earlier non-target steps (e.g. Miracle Candle's
  // `gain-lore` preceding `remove-damage`) would otherwise short-circuit the
  // scan and hide the target overlay / amount picker.
  if (type === "sequence" && Array.isArray(effectRecord.steps)) {
    for (const step of effectRecord.steps) {
      const stepRecord = asRecord(step);
      if (!stepRecord) {
        continue;
      }
      const unwrapped = unwrapOptionalEffect(stepRecord);
      const unwrappedType = getRecordString(unwrapped, "type");
      if (isSupportedResolutionTargetEffectType(unwrappedType)) {
        return unwrapped;
      }
    }
    // No step matched a supported resolution-target type. Return the
    // original sequence so callers can fall back to generic copy/handling
    // (resolveBag still drains correctly; the overlay just won't engage).
    return effectRecord;
  }
  return effectRecord;
}

export function getBagEffectPayloadMeta(payload: unknown): BagEffectPayloadMeta {
  const payloadRecord = asRecord(payload);
  const rawEffectRecord = asRecord(payloadRecord?.effect);
  const effectRecord = unwrapOptionalEffect(rawEffectRecord);

  return {
    kind: getRecordString(payloadRecord, "kind"),
    sourceId: getRecordString(payloadRecord, "sourceId"),
    sourceCardId: getRecordString(payloadRecord, "sourceCardId"),
    chooserId: getRecordString(payloadRecord, "chooserId"),
    controllerId: getRecordString(payloadRecord, "controllerId"),
    abilityIndex: getRecordNumber(payloadRecord, "abilityIndex"),
    effectType: getRecordString(effectRecord, "type"),
  };
}

const EFFECT_INSTANCE_REFERENCE_KINDS = new Set<EffectInstanceReferenceKind>([
  "self",
  "source",
  "trigger-source",
  "trigger-subject",
  "attacker",
  "defender",
  "previous-target",
  "selected-first",
  "selected-all",
  "revealed-first",
  "revealed-all",
  "chosen-or-source",
  "singers",
]);

function getCardIdList(record: Record<string, unknown> | null, key: string): string[] {
  const value = record?.[key];
  if (typeof value === "string" && value.length > 0) {
    return [value];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

function getSelectionCardIds(resolutionInput: Record<string, unknown> | null): string[] {
  return [
    ...getCardIdList(resolutionInput, "currentTargets"),
    ...getCardIdList(resolutionInput, "targets"),
    ...getCardIdList(resolutionInput, "contextTargets"),
  ];
}

function resolveEffectInstanceReferenceCardIds(
  kind: EffectInstanceReferenceKind,
  payloadRecord: Record<string, unknown> | null,
): string[] {
  const resolutionInput = asRecord(payloadRecord?.resolutionInput);
  const eventSnapshot = asRecord(resolutionInput?.eventSnapshot);
  const sourceCardId =
    getRecordString(payloadRecord, "sourceCardId") ?? getRecordString(payloadRecord, "sourceId");
  const selectedCardIds = getSelectionCardIds(resolutionInput);

  switch (kind) {
    case "self":
    case "source":
      return sourceCardId ? [sourceCardId] : [];
    case "trigger-source":
      return getCardIdList(eventSnapshot, "triggerSourceCardId");
    case "trigger-subject":
      return getCardIdList(eventSnapshot, "subjectCardId");
    case "attacker":
      return getCardIdList(eventSnapshot, "attackerId");
    case "defender":
      return getCardIdList(eventSnapshot, "defenderId");
    case "previous-target":
    case "selected-first":
      return selectedCardIds[0] ? [selectedCardIds[0]] : [];
    case "selected-all":
      return selectedCardIds;
    case "revealed-first": {
      const revealedCardIds = getCardIdList(eventSnapshot, "revealedCardIds");
      return revealedCardIds[0] ? [revealedCardIds[0]] : [];
    }
    case "revealed-all":
      return getCardIdList(eventSnapshot, "revealedCardIds");
    case "chosen-or-source": {
      const chosenCardId = getRecordString(eventSnapshot, "chosenCardId");
      return chosenCardId ? [chosenCardId] : sourceCardId ? [sourceCardId] : [];
    }
    case "singers": {
      const cardPlayed = asRecord(payloadRecord?.cardPlayed);
      return getCardIdList(cardPlayed, "singerIds");
    }
  }
}

function collectEffectInstanceReferenceKinds(
  value: unknown,
  collected: Set<EffectInstanceReferenceKind>,
  visited: Set<unknown>,
): void {
  if (!value || typeof value !== "object") {
    return;
  }

  if (visited.has(value)) {
    return;
  }
  visited.add(value);

  if (Array.isArray(value)) {
    for (const entry of value) {
      collectEffectInstanceReferenceKinds(entry, collected, visited);
    }
    return;
  }

  const record = value as Record<string, unknown>;
  const directReference = record.reference;
  if (
    typeof directReference === "string" &&
    EFFECT_INSTANCE_REFERENCE_KINDS.has(directReference as EffectInstanceReferenceKind)
  ) {
    collected.add(directReference as EffectInstanceReferenceKind);
  }

  const legacyReference = record.ref;
  if (
    typeof legacyReference === "string" &&
    EFFECT_INSTANCE_REFERENCE_KINDS.has(legacyReference as EffectInstanceReferenceKind)
  ) {
    collected.add(legacyReference as EffectInstanceReferenceKind);
  }

  const targetReference = record.targetRef;
  if (
    typeof targetReference === "string" &&
    EFFECT_INSTANCE_REFERENCE_KINDS.has(targetReference as EffectInstanceReferenceKind)
  ) {
    collected.add(targetReference as EffectInstanceReferenceKind);
  }

  for (const entry of Object.values(record)) {
    collectEffectInstanceReferenceKinds(entry, collected, visited);
  }
}

export function getResolutionEffectInstanceReferences(
  payload: unknown,
): EffectInstanceReferenceMeta[] {
  const payloadRecord = asRecord(payload);
  const effectRecord = asRecord(payloadRecord?.effect);
  if (!effectRecord) {
    return [];
  }

  const referenceKinds = new Set<EffectInstanceReferenceKind>();
  collectEffectInstanceReferenceKinds(effectRecord, referenceKinds, new Set<unknown>());

  return [...referenceKinds]
    .map<EffectInstanceReferenceMeta | null>((kind) => {
      const cardIds = [...new Set(resolveEffectInstanceReferenceCardIds(kind, payloadRecord))];
      return cardIds.length > 0 ? { kind, cardIds } : null;
    })
    .filter((entry): entry is EffectInstanceReferenceMeta => entry !== null);
}

export function parseScryPendingEffect(
  pendingEffect: EnginePendingEffectProjection,
  cardSnapshotsById: CardSnapshotMap,
): ScryPendingEffectView | null {
  const selectionContext = asRecord(
    (
      pendingEffect as EnginePendingEffectProjection & {
        selectionContext?: unknown;
      }
    ).selectionContext ?? null,
  );
  if (getRecordString(selectionContext, "kind") === "scry-selection") {
    const chooserId = getRecordString(selectionContext, "chooserId");
    const sourceCardId =
      getRecordString(selectionContext, "sourceCardId") ?? pendingEffect.sourceId;
    const amount = getRecordNumber(selectionContext, "amount");
    const revealedCardIds = getStringArray(selectionContext, "revealedCardIds");
    const destinationRules = Array.isArray(selectionContext?.destinationRules)
      ? selectionContext.destinationRules
          .map((entry) => asRecord(entry))
          .filter((entry): entry is Record<string, unknown> => entry !== null)
          .map<ScryDestinationRuleView | null>((entry, index) => {
            const zone = getRecordString(entry, "zone");
            if (!zone) {
              return null;
            }

            return {
              id: getRecordString(entry, "id") ?? `${pendingEffect.id}:${zone}:${index}`,
              zone,
              min: getRecordNumber(entry, "min") ?? 0,
              max: getRecordNumber(entry, "max") ?? null,
              remainder: entry.remainder === true,
              label: getRecordString(entry, "label"),
              filters: getFilterArray(entry, "filters"),
              playFilters: getFilterArray(entry, "playFilters"),
              ordering: getRecordString(entry, "ordering") as ScryCardOrdering | undefined,
              reveal: entry.reveal === true,
              exclusiveGroup: getRecordString(entry, "exclusiveGroup"),
              cost: getRecordString(entry, "cost") as "free" | "reduced" | undefined,
              entersExerted:
                typeof entry.entersExerted === "boolean" ? entry.entersExerted : undefined,
              grantsRush: typeof entry.grantsRush === "boolean" ? entry.grantsRush : undefined,
              banishAtEndOfTurn:
                typeof entry.banishAtEndOfTurn === "boolean" ? entry.banishAtEndOfTurn : undefined,
              exerted: typeof entry.exerted === "boolean" ? entry.exerted : undefined,
              facedown: typeof entry.facedown === "boolean" ? entry.facedown : undefined,
            };
          })
          .filter((entry): entry is ScryDestinationRuleView => entry !== null)
      : [];

    if (!chooserId || !amount || revealedCardIds.length === 0 || destinationRules.length === 0) {
      return null;
    }

    const revealedCardRecords = Array.isArray(selectionContext?.revealedCards)
      ? selectionContext.revealedCards
          .map((entry) => asRecord(entry))
          .filter((entry): entry is Record<string, unknown> => entry !== null)
      : [];
    const revealedCards = revealedCardIds.map<ResolutionSelectionRevealedCard | null>(
      (cardId, index) => {
        const record = revealedCardRecords[index] ?? null;
        const snapshot = cardSnapshotsById[cardId] ?? null;
        const label = getRecordString(record, "label") ?? snapshot?.label;
        if (!label) {
          return null;
        }

        const cardType = getRecordString(record, "cardType");
        const actionSubtype = getRecordString(record, "actionSubtype");
        const cost = getRecordNumber(record, "cost");
        const classifications = getStringArray(record, "classifications");

        return {
          cardId: cardId as ResolutionSelectionRevealedCard["cardId"],
          label,
          cardType:
            cardType === "character" ||
            cardType === "action" ||
            cardType === "item" ||
            cardType === "location"
              ? cardType
              : snapshot?.cardType,
          actionSubtype: actionSubtype ?? snapshot?.actionSubtype,
          cost: cost ?? snapshot?.cost,
          classifications: classifications.length > 0 ? classifications : snapshot?.classifications,
        };
      },
    );
    if (revealedCards.some((card) => card === null)) {
      return null;
    }

    return {
      effectId: pendingEffect.id,
      chooserId,
      sourceCardId: sourceCardId ?? null,
      sourceCard: sourceCardId ? (cardSnapshotsById[sourceCardId] ?? null) : null,
      amount,
      revealedCardIds,
      revealedCards: revealedCards.filter(
        (card): card is ResolutionSelectionRevealedCard => card !== null,
      ),
      destinationRules,
    };
  }

  const payloadRecord = asRecord(pendingEffect.payload);
  if (getRecordString(payloadRecord, "kind") !== "scry-selection") {
    return null;
  }

  const chooserId = getRecordString(payloadRecord, "chooserId");
  if (!chooserId) {
    return null;
  }

  const effectRecord = asRecord(payloadRecord?.effect);
  if (getRecordString(effectRecord, "type") !== "scry") {
    return null;
  }

  const amount = getRecordNumber(effectRecord, "amount");
  if (!amount || amount <= 0) {
    return null;
  }

  const destinationRecords = Array.isArray(effectRecord?.destinations)
    ? effectRecord.destinations
        .map((entry) => asRecord(entry))
        .filter((entry): entry is Record<string, unknown> => entry !== null)
    : [];

  const destinationRules = destinationRecords
    .map<ScryDestinationRuleView | null>((entry, index) => {
      const zone = getRecordString(entry, "zone");
      if (!zone) {
        return null;
      }

      return {
        id: `${pendingEffect.id}:${zone}:${index}`,
        zone,
        min: getRecordNumber(entry, "min") ?? 0,
        max: getRecordNumber(entry, "max") ?? null,
        remainder: entry.remainder === true,
        label: getRecordString(entry, "label"),
        filters: getFilterArray(entry, "filters"),
        playFilters: getFilterArray(entry, "playFilters"),
        ordering: getRecordString(entry, "ordering") as ScryCardOrdering | undefined,
        reveal: entry.reveal === true,
        exclusiveGroup: getRecordString(entry, "exclusiveGroup"),
        cost: getRecordString(entry, "cost") as "free" | "reduced" | undefined,
        entersExerted: typeof entry.entersExerted === "boolean" ? entry.entersExerted : undefined,
        grantsRush: typeof entry.grantsRush === "boolean" ? entry.grantsRush : undefined,
        banishAtEndOfTurn:
          typeof entry.banishAtEndOfTurn === "boolean" ? entry.banishAtEndOfTurn : undefined,
        exerted: typeof entry.exerted === "boolean" ? entry.exerted : undefined,
        facedown: typeof entry.facedown === "boolean" ? entry.facedown : undefined,
      };
    })
    .filter((entry): entry is ScryDestinationRuleView => entry !== null);

  if (destinationRules.length === 0) {
    return null;
  }

  const resolutionInputRecord = asRecord(payloadRecord?.resolutionInput);
  const eventSnapshotRecord = asRecord(resolutionInputRecord?.eventSnapshot);
  const revealedCardIds = getStringArray(eventSnapshotRecord, "revealedCardIds");
  if (revealedCardIds.length === 0) {
    return null;
  }

  const revealedCards = revealedCardIds.map<ResolutionSelectionRevealedCard | null>((cardId) => {
    const snapshot = cardSnapshotsById[cardId] ?? null;
    if (!snapshot) {
      return null;
    }

    return {
      cardId: cardId as ResolutionSelectionRevealedCard["cardId"],
      label: snapshot.label,
      cardType: snapshot.cardType,
      actionSubtype: snapshot.actionSubtype,
      cost: snapshot.cost,
      classifications: snapshot.classifications,
    };
  });
  if (revealedCards.some((card) => card === null)) {
    return null;
  }

  const sourceCardId =
    pendingEffect.sourceId ??
    getRecordString(payloadRecord, "sourceCardId") ??
    getRecordString(payloadRecord, "sourceId") ??
    null;

  return {
    effectId: pendingEffect.id,
    chooserId,
    sourceCardId,
    sourceCard: sourceCardId ? (cardSnapshotsById[sourceCardId] ?? null) : null,
    amount,
    revealedCardIds,
    revealedCards: revealedCards.filter(
      (card): card is ResolutionSelectionRevealedCard => card !== null,
    ),
    destinationRules,
  };
}
