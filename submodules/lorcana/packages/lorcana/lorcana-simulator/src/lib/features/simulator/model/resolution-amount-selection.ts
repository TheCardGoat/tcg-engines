import { getUpToRule, isUpToAmount, type UpToCapContext } from "@tcg/lorcana-types";
import type { AmountExpr } from "@tcg/lorcana-types";
import type {
  LorcanaCardSnapshot,
  ResolutionAmountSelectionState,
} from "@/features/simulator/model/contracts.js";

type CardSnapshotMap = Record<string, LorcanaCardSnapshot>;

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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Drill into wrapper effects to surface the inner effect that owns the
 * `up-to` amount (if any). Handles:
 *  - `optional` — unwraps to its inner effect.
 *  - `sequence` — descends into each step until one yields an `up-to`-aware
 *    effect; matches the engine's step-by-step bag resolution order. Without
 *    this, payloads like Julieta's
 *    `{type:"sequence", steps:[{type:"optional", effect:{type:"remove-damage", amount:{type:"up-to",value:2}}}, ...]}`
 *    short-circuit at "sequence" and never expose the amount picker.
 */
function unwrapOptionalEffect(
  effectRecord: Record<string, unknown> | null,
): Record<string, unknown> | null {
  if (!effectRecord) {
    return null;
  }
  const type = getRecordString(effectRecord, "type");
  if (type === "optional") {
    const inner = asRecord(effectRecord.effect);
    return inner ? (unwrapOptionalEffect(inner) ?? inner) : effectRecord;
  }
  if (type === "sequence") {
    const steps = Array.isArray(effectRecord.steps) ? effectRecord.steps : [];
    for (const step of steps) {
      const stepRecord = asRecord(step);
      if (!stepRecord) {
        continue;
      }
      const unwrapped = unwrapOptionalEffect(stepRecord);
      const unwrappedType = getRecordString(unwrapped, "type");
      if (unwrappedType && getUpToRule(unwrappedType)) {
        return unwrapped;
      }
    }
    return effectRecord;
  }
  return effectRecord;
}

function readUpToBaseAmount(amount: unknown): number | null {
  if (!isUpToAmount(amount as AmountExpr)) {
    return null;
  }
  const inner = (amount as { value: unknown }).value;
  return typeof inner === "number" && Number.isFinite(inner) && inner >= 0
    ? Math.floor(inner)
    : null;
}

function getCardDamage(cardSnapshotsById: CardSnapshotMap, cardId: string | undefined): number {
  if (!cardId) {
    return 0;
  }

  const damage = cardSnapshotsById[cardId]?.damage ?? 0;
  return typeof damage === "number" && Number.isFinite(damage) && damage > 0
    ? Math.floor(damage)
    : 0;
}

function cardMatchesPrintedName(card: LorcanaCardSnapshot | undefined, name: string): boolean {
  if (!card || card.isMasked) {
    return false;
  }

  const label = card.label.trim();
  return label === name || label.startsWith(`${name} - `);
}

function getSelectedTargetSelfReplacementAmount(
  effectRecord: Record<string, unknown> | null,
  selectedTargets: readonly string[],
  cardSnapshotsById: CardSnapshotMap,
): number | null {
  const replacement = asRecord(effectRecord?.selfReplacement);
  const condition = asRecord(replacement?.condition);
  if (getRecordString(condition, "type") !== "selected-target-name") {
    return null;
  }

  const name = getRecordString(condition, "name");
  const value = replacement?.value;
  if (!name || typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  const matchesSelectedTarget = selectedTargets.some((targetId) =>
    cardMatchesPrintedName(cardSnapshotsById[targetId], name),
  );
  return matchesSelectedTarget ? Math.floor(value) : null;
}

export function buildResolutionAmountSelectionState(params: {
  payload: unknown;
  selectedTargets: readonly string[];
  currentAmount?: number | null;
  cardSnapshotsById: CardSnapshotMap;
}): ResolutionAmountSelectionState | null {
  const payloadRecord = asRecord(params.payload);
  const rawEffectRecord = asRecord(payloadRecord?.effect);
  const effectRecord = unwrapOptionalEffect(rawEffectRecord);
  const effectType = getRecordString(effectRecord, "type");
  if (!effectType) {
    return null;
  }

  const rule = getUpToRule(effectType);
  if (!rule) {
    return null;
  }

  const printedBaseAmount = readUpToBaseAmount(effectRecord?.amount);
  if (printedBaseAmount === null) {
    return null;
  }

  const baseAmount =
    getSelectedTargetSelfReplacementAmount(
      effectRecord,
      params.selectedTargets,
      params.cardSnapshotsById,
    ) ?? printedBaseAmount;

  const ctx: UpToCapContext = {
    getCardDamage: (cardId) => getCardDamage(params.cardSnapshotsById, cardId),
  };

  // Keep only targets that resolve to cards we know about — player-id selections
  // for, say, "each opponent" shouldn't influence the card-damage cap.
  const selectedCardTargets = params.selectedTargets.filter((targetId) =>
    Boolean(params.cardSnapshotsById[targetId]),
  );

  const max = Math.max(
    0,
    rule.getSelectionMax({
      baseAmount,
      selectedCardTargets,
      ctx,
    }),
  );

  const value =
    typeof params.currentAmount === "number" && Number.isFinite(params.currentAmount)
      ? clamp(Math.floor(params.currentAmount), 0, max)
      : max;

  return {
    label: rule.label,
    min: 0,
    max,
    value,
  };
}
