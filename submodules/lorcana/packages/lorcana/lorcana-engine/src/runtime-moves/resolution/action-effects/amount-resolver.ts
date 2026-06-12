import type { CardInstanceId } from "#core";
import type { Amount, AmountString } from "@tcg/lorcana-types";
import { isUpToAmount, supportsUpTo } from "@tcg/lorcana-types";
import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext } from "./types";
import {
  assertNoLegacyDynamicAmount,
  normalizeVariableAmount,
} from "../../shared/amount/normalize-variable-amount";
import {
  isVariableAmountObject,
  resolveAmountString,
  resolveVariableAmount,
  type ResolvedTargetAmountMap,
  type ResolvedVariableAmount,
  type VariableAmountResolutionContext,
} from "../../shared/amount/resolve-variable-amount";

export type DynamicFieldName = "amount" | "modifier" | "value";

export type ResolvedDynamicField = ResolvedVariableAmount;

export type ResolvedEffectDynamicFields = Partial<Record<DynamicFieldName, ResolvedDynamicField>>;

export type { ResolvedTargetAmountMap };

export interface ResolveEffectDynamicFieldsContext {
  ctx: PlayCardExecutionContext;
  cardPlayed: CardPlayedPayload;
  eventSnapshot?: DynamicAmountEventSnapshot;
}

function buildResolutionContext(
  context: ResolveEffectDynamicFieldsContext,
  resolvedTargets?: CardInstanceId[],
): VariableAmountResolutionContext {
  return {
    cardPlayed: context.cardPlayed,
    controllerId: context.cardPlayed.playerId,
    ctx: context.ctx,
    eventSnapshot: context.eventSnapshot,
    sourceId: context.cardPlayed.cardId,
    targets: resolvedTargets,
  };
}

function inputNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function resolveAllStringAmount(
  context: VariableAmountResolutionContext,
): ResolvedVariableAmount | undefined {
  if (!context.targets || context.targets.length === 0) {
    return {
      mode: "aggregate",
      value: 0,
    };
  }

  const perTarget: ResolvedTargetAmountMap = {};
  for (const targetId of context.targets) {
    const currentDamage = inputNumber(context.ctx.cards.require(targetId).meta?.damage);
    perTarget[targetId] = currentDamage;
  }

  return {
    mode: "per-target",
    perTarget,
  };
}

function resolveDynamicField(
  rawValue: unknown,
  context: VariableAmountResolutionContext,
): ResolvedDynamicField | undefined {
  if (rawValue === undefined || rawValue === null) {
    return undefined;
  }

  // Unwrap `{ type: "up-to", value: X }` — the up-to semantics are consumed by
  // the resolver/UI layer via `isUpToAmount(effect.amount)`. The concrete
  // amount computed here is always the (clamped) maximum.
  if (isUpToAmount(rawValue as Amount)) {
    return resolveDynamicField((rawValue as { value: unknown }).value, context);
  }

  if (typeof rawValue === "number") {
    if (!Number.isFinite(rawValue)) {
      return undefined;
    }

    return {
      mode: "aggregate",
      value: rawValue,
    };
  }

  if (typeof rawValue === "string") {
    const amountString = rawValue as AmountString;
    if (amountString === "all") {
      return resolveAllStringAmount(context);
    }

    return resolveAmountString(amountString, context);
  }

  assertNoLegacyDynamicAmount(rawValue);

  const normalized = normalizeVariableAmount(rawValue as Amount);
  if (!normalized || typeof normalized !== "object") {
    return undefined;
  }

  if (!isVariableAmountObject(normalized)) {
    return undefined;
  }

  return resolveVariableAmount(normalized, context);
}

function getRawFieldValue(effect: unknown, fieldName: DynamicFieldName): unknown {
  if (!effect || typeof effect !== "object") {
    return undefined;
  }

  return (effect as Record<string, unknown>)[fieldName];
}

export function resolveEffectDynamicFields(
  effect: unknown,
  context: ResolveEffectDynamicFieldsContext,
  resolvedTargets?: CardInstanceId[],
): ResolvedEffectDynamicFields {
  const resolutionContext = buildResolutionContext(context, resolvedTargets);

  const resolvedDynamic: ResolvedEffectDynamicFields = {};
  const rawAmount = getRawFieldValue(effect, "amount");
  const rawModifier = getRawFieldValue(effect, "modifier");
  const rawValue = getRawFieldValue(effect, "value");

  if (rawAmount !== undefined) {
    // "Up to" is only meaningful for effect types that have registered a rule
    // describing how to clamp the chooser prompt. A wrapped amount on any
    // other effect is a silent bug waiting to produce the maximum value every
    // time — surface it loudly so card authors notice.
    if (isUpToAmount(rawAmount as Amount)) {
      const effectType =
        effect && typeof effect === "object" ? (effect as { type?: unknown }).type : undefined;
      if (typeof effectType !== "string" || !supportsUpTo(effectType)) {
        throw new Error(
          `Effect type "${String(effectType ?? "<unknown>")}" is not registered ` +
            `for up-to amount semantics. Either register it in up-to-rules.ts ` +
            `or remove the { type: "up-to", value } wrapper.`,
        );
      }
    }

    resolvedDynamic.amount = resolveDynamicField(rawAmount, resolutionContext);
  }

  if (rawModifier !== undefined) {
    resolvedDynamic.modifier = resolveDynamicField(rawModifier, resolutionContext);
  }

  if (rawValue !== undefined) {
    resolvedDynamic.value = resolveDynamicField(rawValue, resolutionContext);
  }

  return resolvedDynamic;
}

export function resolveAggregateFieldAmount(
  field: ResolvedDynamicField | undefined,
): number | undefined {
  if (!field) {
    return undefined;
  }

  if (field.mode === "aggregate") {
    return typeof field.value === "number" && Number.isFinite(field.value) && field.value >= 0
      ? field.value
      : undefined;
  }

  return Object.values(field.perTarget ?? {}).find(
    (value) => typeof value === "number" && Number.isFinite(value) && value >= 0,
  );
}

export function resolvePerTargetFieldAmounts(
  field: ResolvedDynamicField | undefined,
  targets: CardInstanceId[],
): ResolvedTargetAmountMap | undefined {
  if (!field || targets.length === 0) {
    return undefined;
  }

  const perTarget: ResolvedTargetAmountMap = {};
  if (field.mode === "aggregate") {
    if (typeof field.value === "number" && Number.isFinite(field.value)) {
      for (const targetId of targets) {
        perTarget[targetId] = field.value;
      }
    }
  } else {
    for (const targetId of targets) {
      const value = field.perTarget?.[targetId];
      if (typeof value === "number" && Number.isFinite(value)) {
        perTarget[targetId] = value;
      }
    }
  }

  return Object.keys(perTarget).length > 0 ? perTarget : undefined;
}
