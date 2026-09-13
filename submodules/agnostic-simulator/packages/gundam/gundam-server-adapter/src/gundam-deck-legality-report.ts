import {
  DECK_LEGALITY_REPORT_SCHEMA_VERSION,
  type DeckLegalityReportV1,
  type DeckLegalityViolationV1,
} from "@tcg/game-page-contract";
import type { DeckValidationResult, DeckValidationViolation } from "@tcg/gundam-engine";

export interface GundamDeckLegalityReportOptions {
  /** Player-facing construction format, for example `standard` or `best-of-three`. */
  readonly formatId: string;
}

/**
 * Maps the Gundam-native validation report into the cross-game transport
 * contract. Gundam violation codes and zone ids remain adapter-owned data.
 */
export function gundamDeckValidationToLegalityReport(
  result: DeckValidationResult,
  options: GundamDeckLegalityReportOptions,
): DeckLegalityReportV1 {
  return {
    schemaVersion: DECK_LEGALITY_REPORT_SCHEMA_VERSION,
    game: "gundam",
    formatId: options.formatId,
    valid: result.ok,
    ...("policy" in result && result.policy
      ? {
          policy: {
            id: result.policy.id,
            version: result.policy.version,
            effectiveFrom: result.policy.effectiveFrom,
            sourceUrls: [...(result.policy.sourceUrls ?? [])],
            unresolvedExceptions: (result.policy.unresolvedExceptions ?? []).map((exception) => ({
              id: exception.id,
              message: exception.description,
              sourceUrl: exception.sourceUrl,
            })),
          },
        }
      : {}),
    violations: result.ok ? [] : result.violations.map(mapGundamViolation),
  };
}

function mapGundamViolation(violation: DeckValidationViolation): DeckLegalityViolationV1 {
  const zones =
    "zones" in violation ? [...violation.zones] : violation.zone ? [violation.zone] : undefined;
  return {
    code: violation.code,
    message: violation.message,
    ...(zones && zones.length > 0 ? { zones } : {}),
    ...(violation.cardIds && violation.cardIds.length > 0
      ? {
          cardIdentities: violation.cardIds.map((canonicalId) => ({ canonicalId })),
        }
      : {}),
    ...(violation.actual === undefined ? {} : { actual: violation.actual }),
    ...(violation.allowed === undefined ? {} : { allowed: violation.allowed }),
    ...("restrictionId" in violation ? { restrictionId: violation.restrictionId } : {}),
  };
}
