import type { Amount } from "@tcg/lorcana-types";

export type LegacyDynamicAmountLike = {
  dynamic?: unknown;
};

export function isLegacyDynamicAmountLike(value: unknown): value is LegacyDynamicAmountLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "dynamic" in value &&
    (value as LegacyDynamicAmountLike).dynamic === true
  );
}

export function assertNoLegacyDynamicAmount(value: unknown): void {
  if (!isLegacyDynamicAmountLike(value)) {
    return;
  }

  throw new Error(
    "Legacy dynamic amount objects ({ dynamic: true }) are no longer supported at runtime. " +
      "Migrate card definitions to canonical VariableAmount forms.",
  );
}

export function normalizeVariableAmount(amount: Amount | undefined): Amount | undefined {
  assertNoLegacyDynamicAmount(amount);
  return amount;
}
