import { GAME_TYPES, type GameType } from "./ids.js";

export const DECK_LEGALITY_REPORT_SCHEMA_VERSION = 1 as const;

export interface DeckLegalityPolicySourceV1 {
  id: string;
  version: string;
  effectiveFrom: string;
  sourceUrls: string[];
  unresolvedExceptions: DeckLegalityUnresolvedExceptionV1[];
}

export interface DeckLegalityUnresolvedExceptionV1 {
  id: string;
  message: string;
  sourceUrl: string;
}

export interface DeckLegalityCardIdentityV1 {
  canonicalId: string;
  printingId?: string;
}

export interface DeckLegalityViolationV1 {
  /** Stable game-owned violation code. */
  code: string;
  message: string;
  /** Stable game-owned zone ids; shared consumers render but do not interpret them. */
  zones?: string[];
  cardIdentities?: DeckLegalityCardIdentityV1[];
  actual?: number;
  allowed?: number;
  restrictionId?: string;
}

/**
 * Cross-game transport report. Games own policy semantics, violation codes,
 * zone ids, and card identity mapping; shared clients can safely display and
 * persist the normalized result without importing a game engine.
 */
export interface DeckLegalityReportV1 {
  schemaVersion: typeof DECK_LEGALITY_REPORT_SCHEMA_VERSION;
  game: GameType;
  formatId: string;
  valid: boolean;
  policy?: DeckLegalityPolicySourceV1;
  violations: DeckLegalityViolationV1[];
}

export type DeckLegalityReportParseResult =
  | { ok: true; report: DeckLegalityReportV1 }
  | { ok: false; errors: string[] };

export function parseDeckLegalityReport(value: unknown): DeckLegalityReportParseResult {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ["report must be an object"] };

  if (value.schemaVersion !== DECK_LEGALITY_REPORT_SCHEMA_VERSION) {
    errors.push(
      `schemaVersion must be ${DECK_LEGALITY_REPORT_SCHEMA_VERSION} (received ${String(value.schemaVersion)})`,
    );
  }
  if (!isGameType(value.game)) errors.push("game must be a supported game id");
  if (!isNonEmptyString(value.formatId)) errors.push("formatId must be a non-empty string");
  if (typeof value.valid !== "boolean") errors.push("valid must be a boolean");

  const policy = parsePolicy(value.policy, errors);
  const violations = parseViolations(value.violations, errors);
  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    report: {
      schemaVersion: DECK_LEGALITY_REPORT_SCHEMA_VERSION,
      game: value.game as GameType,
      formatId: value.formatId as string,
      valid: value.valid as boolean,
      ...(policy ? { policy } : {}),
      violations,
    },
  };
}

export function encodeDeckLegalityReportToJson(
  report: DeckLegalityReportV1,
): DeckLegalityReportParseResult & { json?: string } {
  const parsed = parseDeckLegalityReport(report);
  if (!parsed.ok) return parsed;
  return { ...parsed, json: JSON.stringify(parsed.report) };
}

export function decodeDeckLegalityReportFromJson(json: string): DeckLegalityReportParseResult {
  try {
    return parseDeckLegalityReport(JSON.parse(json));
  } catch {
    return { ok: false, errors: ["report must be valid JSON"] };
  }
}

function parsePolicy(value: unknown, errors: string[]): DeckLegalityPolicySourceV1 | undefined {
  if (value === undefined) return undefined;
  if (!isRecord(value)) {
    errors.push("policy must be an object when present");
    return undefined;
  }

  if (!isNonEmptyString(value.id)) errors.push("policy.id must be a non-empty string");
  if (!isNonEmptyString(value.version)) errors.push("policy.version must be a non-empty string");
  if (!isNonEmptyString(value.effectiveFrom)) {
    errors.push("policy.effectiveFrom must be a non-empty string");
  }
  const sourceUrls = parseStringArray(value.sourceUrls, "policy.sourceUrls", errors);
  const unresolvedExceptions = parseExceptions(value.unresolvedExceptions, errors);
  if (
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.version) ||
    !isNonEmptyString(value.effectiveFrom)
  ) {
    return undefined;
  }
  return {
    id: value.id,
    version: value.version,
    effectiveFrom: value.effectiveFrom,
    sourceUrls,
    unresolvedExceptions,
  };
}

function parseExceptions(value: unknown, errors: string[]): DeckLegalityUnresolvedExceptionV1[] {
  if (!Array.isArray(value)) {
    errors.push("policy.unresolvedExceptions must be an array");
    return [];
  }
  return value.flatMap((exception, index) => {
    if (!isRecord(exception)) {
      errors.push(`policy.unresolvedExceptions[${index}] must be an object`);
      return [];
    }
    if (!isNonEmptyString(exception.id)) {
      errors.push(`policy.unresolvedExceptions[${index}].id must be a non-empty string`);
    }
    if (!isNonEmptyString(exception.message)) {
      errors.push(`policy.unresolvedExceptions[${index}].message must be a non-empty string`);
    }
    if (!isNonEmptyString(exception.sourceUrl)) {
      errors.push(`policy.unresolvedExceptions[${index}].sourceUrl must be a non-empty string`);
    }
    return isNonEmptyString(exception.id) &&
      isNonEmptyString(exception.message) &&
      isNonEmptyString(exception.sourceUrl)
      ? [{ id: exception.id, message: exception.message, sourceUrl: exception.sourceUrl }]
      : [];
  });
}

function parseViolations(value: unknown, errors: string[]): DeckLegalityViolationV1[] {
  if (!Array.isArray(value)) {
    errors.push("violations must be an array");
    return [];
  }
  return value.flatMap((violation, index) => {
    const path = `violations[${index}]`;
    if (!isRecord(violation)) {
      errors.push(`${path} must be an object`);
      return [];
    }
    if (!isNonEmptyString(violation.code)) errors.push(`${path}.code must be a non-empty string`);
    if (!isNonEmptyString(violation.message)) {
      errors.push(`${path}.message must be a non-empty string`);
    }
    const zones =
      violation.zones === undefined
        ? undefined
        : parseStringArray(violation.zones, `${path}.zones`, errors);
    const cardIdentities =
      violation.cardIdentities === undefined
        ? undefined
        : parseCardIdentities(violation.cardIdentities, path, errors);
    parseOptionalFiniteNumber(violation.actual, `${path}.actual`, errors);
    parseOptionalFiniteNumber(violation.allowed, `${path}.allowed`, errors);
    if (violation.restrictionId !== undefined && !isNonEmptyString(violation.restrictionId)) {
      errors.push(`${path}.restrictionId must be a non-empty string when present`);
    }
    if (!isNonEmptyString(violation.code) || !isNonEmptyString(violation.message)) return [];
    return [
      {
        code: violation.code,
        message: violation.message,
        ...(zones ? { zones } : {}),
        ...(cardIdentities ? { cardIdentities } : {}),
        ...(typeof violation.actual === "number" ? { actual: violation.actual } : {}),
        ...(typeof violation.allowed === "number" ? { allowed: violation.allowed } : {}),
        ...(isNonEmptyString(violation.restrictionId)
          ? { restrictionId: violation.restrictionId }
          : {}),
      },
    ];
  });
}

function parseCardIdentities(
  value: unknown,
  violationPath: string,
  errors: string[],
): DeckLegalityCardIdentityV1[] {
  if (!Array.isArray(value)) {
    errors.push(`${violationPath}.cardIdentities must be an array`);
    return [];
  }
  return value.flatMap((identity, index) => {
    const path = `${violationPath}.cardIdentities[${index}]`;
    if (!isRecord(identity)) {
      errors.push(`${path} must be an object`);
      return [];
    }
    if (!isNonEmptyString(identity.canonicalId)) {
      errors.push(`${path}.canonicalId must be a non-empty string`);
      return [];
    }
    if (identity.printingId !== undefined && !isNonEmptyString(identity.printingId)) {
      errors.push(`${path}.printingId must be a non-empty string when present`);
      return [];
    }
    return [
      {
        canonicalId: identity.canonicalId,
        ...(isNonEmptyString(identity.printingId) ? { printingId: identity.printingId } : {}),
      },
    ];
  });
}

function parseStringArray(value: unknown, path: string, errors: string[]): string[] {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return [];
  }
  const strings: string[] = [];
  value.forEach((entry, index) => {
    if (!isNonEmptyString(entry)) errors.push(`${path}[${index}] must be a non-empty string`);
    else strings.push(entry);
  });
  return strings;
}

function parseOptionalFiniteNumber(value: unknown, path: string, errors: string[]): void {
  if (value !== undefined && (typeof value !== "number" || !Number.isFinite(value))) {
    errors.push(`${path} must be a finite number when present`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isGameType(value: unknown): value is GameType {
  return GAME_TYPES.some((gameType) => gameType === value);
}
