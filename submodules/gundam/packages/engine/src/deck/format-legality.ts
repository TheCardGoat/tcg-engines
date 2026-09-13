/**
 * A dated policy snapshot for one constructed format. The engine deliberately
 * contains no current ban list: callers provide the complete historical and
 * scheduled policy data, so a future snapshot can become effective without a
 * code deployment.
 */
export interface GundamFormatLegalityPolicy {
  readonly id: string;
  readonly formatId: string;
  readonly version: string;
  /** ISO-8601 date on which this snapshot was officially announced. */
  readonly announcedAt?: string;
  /** Inclusive ISO-8601 date or timestamp. */
  readonly effectiveFrom: string;
  /** Exclusive ISO-8601 date or timestamp. Omit when superseded by a later snapshot. */
  readonly effectiveUntil?: string;
  readonly sourceUrls?: ReadonlyArray<string>;
  /**
   * Official exceptions retained as data when the validator cannot prove their
   * full preconstructed-lineup condition. These are intentionally not applied.
   */
  readonly unresolvedExceptions?: ReadonlyArray<GundamUnresolvedPolicyException>;
  /**
   * Narrow exemptions that apply only when the submitted Main Deck and
   * Resource Deck exactly match an officially registered lineup.
   */
  readonly unchangedLineupExceptions?: ReadonlyArray<GundamUnchangedLineupException>;
  readonly bannedCards?: ReadonlyArray<GundamBannedCardRestriction>;
  readonly copyRestrictions?: ReadonlyArray<GundamCopyRestriction>;
  readonly compositionRestrictions?: ReadonlyArray<GundamCompositionRestriction>;
}

export interface GundamUnresolvedPolicyException {
  readonly id: string;
  readonly description: string;
  readonly sourceUrl: string;
}

export interface GundamRegisteredLineupEntry {
  /** Printed card number. Exact-lineup matching never substitutes canonical identities. */
  readonly cardNumber: string;
  readonly count: number;
}

export interface GundamRegisteredLineup {
  readonly mainDeck: ReadonlyArray<GundamRegisteredLineupEntry>;
  readonly resourceDeck: ReadonlyArray<GundamRegisteredLineupEntry>;
  /**
   * Registered starter exceptions are Main Deck + Resource Deck products.
   * Any submitted sideboard makes the comparison fail closed.
   */
  readonly sideboard?: ReadonlyArray<GundamRegisteredLineupEntry>;
}

export interface GundamUnchangedLineupException {
  readonly id: string;
  readonly description: string;
  readonly sourceUrl: string;
  readonly registeredLineup: GundamRegisteredLineup;
  /**
   * Only the named restrictions are waived. Every other active restriction
   * continues to produce its ordinary violation.
   */
  readonly waivedCopyRestrictionCardIds?: ReadonlyArray<string>;
  readonly waivedCompositionRestrictionIds?: ReadonlyArray<string>;
}

export interface GundamBannedCardRestriction {
  /** A catalog card number or canonical card identity. */
  readonly cardId: string;
  readonly reason?: string;
}

export interface GundamCopyRestriction {
  /** A catalog card number or canonical card identity. */
  readonly cardId: string;
  readonly maxCopies: number;
  readonly reason?: string;
}

export type GundamCompositionRestriction =
  | {
      readonly id: string;
      readonly kind: "cannot-combine";
      /** Every listed identity must be present for this restriction to be violated. */
      readonly cardIds: readonly [string, string, ...string[]];
      readonly reason?: string;
    }
  | {
      readonly id: string;
      readonly kind: "combined-copy-limit";
      readonly cardIds: readonly [string, string, ...string[]];
      readonly maxCombinedCopies: number;
      readonly reason?: string;
    }
  | {
      readonly id: string;
      readonly kind: "mutually-exclusive-identities";
      readonly cardIds: readonly [string, string, ...string[]];
      readonly reason?: string;
    };

export interface GundamFormatLegalityContext {
  readonly formatId: string;
  /** Required and caller-injected; format validation never reads the system clock. */
  readonly asOf: Date | string;
  readonly policies: ReadonlyArray<GundamFormatLegalityPolicy>;
}

export interface DeckCardIdentityCount {
  readonly cardNumber: string;
  readonly canonicalId: string;
  readonly count: number;
  readonly zone?: "main" | "sideboard";
}

export interface AppliedFormatPolicy {
  readonly id: string;
  readonly formatId: string;
  readonly version: string;
  readonly announcedAt?: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil?: string;
  readonly sourceUrls?: ReadonlyArray<string>;
  readonly unresolvedExceptions?: ReadonlyArray<GundamUnresolvedPolicyException>;
}

export type FormatLegalityViolation =
  | {
      readonly code: "format-banned-card";
      readonly message: string;
      readonly cardIds: ReadonlyArray<string>;
      readonly actual: number;
      readonly allowed: 0;
      readonly zones: ReadonlyArray<"main" | "sideboard">;
      readonly policy: AppliedFormatPolicy;
    }
  | {
      readonly code: "format-copy-limit";
      readonly message: string;
      readonly cardIds: ReadonlyArray<string>;
      readonly actual: number;
      readonly allowed: number;
      readonly zones: ReadonlyArray<"main" | "sideboard">;
      readonly policy: AppliedFormatPolicy;
    }
  | {
      readonly code: "format-composition";
      readonly message: string;
      readonly cardIds: ReadonlyArray<string>;
      readonly restrictionId: string;
      readonly actual?: number;
      readonly allowed?: number;
      readonly zones: ReadonlyArray<"main" | "sideboard">;
      readonly policy: AppliedFormatPolicy;
    };

export interface FormatLegalityReport {
  readonly policy?: AppliedFormatPolicy;
  readonly appliedExceptionIds?: ReadonlyArray<string>;
  readonly violations: ReadonlyArray<FormatLegalityViolation>;
}

function parsePolicyDate(value: string, field: string, policyId: string): number {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new Error(`format policy "${policyId}" has invalid ${field} date "${value}"`);
  }
  return timestamp;
}

function asTimestamp(value: Date | string): number {
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new Error(`format legality asOf must be a valid date (received "${String(value)}")`);
  }
  return timestamp;
}

/**
 * Selects the latest active policy snapshot for a format. `effectiveFrom` is
 * inclusive and `effectiveUntil` is exclusive. A later active snapshot
 * supersedes an earlier open-ended snapshot.
 */
export function selectGundamFormatLegalityPolicy(
  context: GundamFormatLegalityContext,
): GundamFormatLegalityPolicy | undefined {
  const at = asTimestamp(context.asOf);
  let selected: GundamFormatLegalityPolicy | undefined;
  let selectedFrom = Number.NEGATIVE_INFINITY;

  for (const policy of context.policies) {
    if (policy.formatId !== context.formatId) continue;
    const from = parsePolicyDate(policy.effectiveFrom, "effectiveFrom", policy.id);
    const until =
      policy.effectiveUntil === undefined
        ? Number.POSITIVE_INFINITY
        : parsePolicyDate(policy.effectiveUntil, "effectiveUntil", policy.id);
    if (until <= from) {
      throw new Error(`format policy "${policy.id}" must have effectiveUntil after effectiveFrom`);
    }
    if (from <= at && at < until && from > selectedFrom) {
      selected = policy;
      selectedFrom = from;
    }
  }

  return selected;
}

function appliedPolicy(policy: GundamFormatLegalityPolicy): AppliedFormatPolicy {
  return {
    id: policy.id,
    formatId: policy.formatId,
    version: policy.version,
    ...(policy.announcedAt === undefined ? {} : { announcedAt: policy.announcedAt }),
    effectiveFrom: policy.effectiveFrom,
    ...(policy.effectiveUntil === undefined ? {} : { effectiveUntil: policy.effectiveUntil }),
    ...(policy.sourceUrls === undefined ? {} : { sourceUrls: policy.sourceUrls }),
    ...(policy.unresolvedExceptions === undefined
      ? {}
      : { unresolvedExceptions: policy.unresolvedExceptions }),
  };
}

function countForIdentity(entries: ReadonlyArray<DeckCardIdentityCount>, cardId: string): number {
  return entries.reduce(
    (total, entry) =>
      entry.cardNumber === cardId || entry.canonicalId === cardId ? total + entry.count : total,
    0,
  );
}

function zonesForIdentities(
  entries: ReadonlyArray<DeckCardIdentityCount>,
  cardIds: ReadonlyArray<string>,
): ReadonlyArray<"main" | "sideboard"> {
  const zones = new Set<"main" | "sideboard">();
  for (const entry of entries) {
    if (
      entry.zone &&
      cardIds.some((cardId) => entry.cardNumber === cardId || entry.canonicalId === cardId)
    ) {
      zones.add(entry.zone);
    }
  }
  return [...zones];
}

function reasonSuffix(reason: string | undefined): string {
  return reason ? ` — ${reason}` : "";
}

function registeredLineupMultiset(
  entries: ReadonlyArray<GundamRegisteredLineupEntry>,
): Map<string, number> | undefined {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    if (
      entry.cardNumber.trim().length === 0 ||
      !Number.isInteger(entry.count) ||
      entry.count <= 0
    ) {
      return undefined;
    }
    counts.set(entry.cardNumber, (counts.get(entry.cardNumber) ?? 0) + entry.count);
  }
  return counts;
}

function sameRegisteredLineupZone(
  submitted: ReadonlyArray<GundamRegisteredLineupEntry>,
  registered: ReadonlyArray<GundamRegisteredLineupEntry>,
): boolean {
  const submittedCounts = registeredLineupMultiset(submitted);
  const registeredCounts = registeredLineupMultiset(registered);
  if (!submittedCounts || !registeredCounts || submittedCounts.size !== registeredCounts.size) {
    return false;
  }
  for (const [cardNumber, count] of registeredCounts) {
    if (submittedCounts.get(cardNumber) !== count) return false;
  }
  return true;
}

function isExactRegisteredLineup(
  submitted: GundamRegisteredLineup | undefined,
  registered: GundamRegisteredLineup,
): boolean {
  if (!submitted || (submitted.sideboard?.length ?? 0) > 0) return false;
  return (
    sameRegisteredLineupZone(submitted.mainDeck, registered.mainDeck) &&
    sameRegisteredLineupZone(submitted.resourceDeck, registered.resourceDeck)
  );
}

export function evaluateGundamFormatLegality(
  entries: ReadonlyArray<DeckCardIdentityCount>,
  context: GundamFormatLegalityContext,
  submittedLineup?: GundamRegisteredLineup,
): FormatLegalityReport {
  const policy = selectGundamFormatLegalityPolicy(context);
  if (!policy) return { violations: [] };

  const applied = appliedPolicy(policy);
  const violations: FormatLegalityViolation[] = [];
  const appliedExceptions = (policy.unchangedLineupExceptions ?? []).filter((exception) =>
    isExactRegisteredLineup(submittedLineup, exception.registeredLineup),
  );
  const waivedCopyRestrictionCardIds = new Set(
    appliedExceptions.flatMap((exception) => exception.waivedCopyRestrictionCardIds ?? []),
  );
  const waivedCompositionRestrictionIds = new Set(
    appliedExceptions.flatMap((exception) => exception.waivedCompositionRestrictionIds ?? []),
  );

  for (const restriction of policy.bannedCards ?? []) {
    const actual = countForIdentity(entries, restriction.cardId);
    if (actual > 0) {
      violations.push({
        code: "format-banned-card",
        message: `${restriction.cardId} is banned in ${policy.formatId}${reasonSuffix(restriction.reason)}`,
        cardIds: [restriction.cardId],
        actual,
        allowed: 0,
        zones: zonesForIdentities(entries, [restriction.cardId]),
        policy: applied,
      });
    }
  }

  for (const restriction of policy.copyRestrictions ?? []) {
    if (waivedCopyRestrictionCardIds.has(restriction.cardId)) continue;
    const actual = countForIdentity(entries, restriction.cardId);
    if (actual > restriction.maxCopies) {
      violations.push({
        code: "format-copy-limit",
        message: `${restriction.cardId}: ${actual} copies exceeds the ${policy.formatId} limit of ${restriction.maxCopies}${reasonSuffix(restriction.reason)}`,
        cardIds: [restriction.cardId],
        actual,
        allowed: restriction.maxCopies,
        zones: zonesForIdentities(entries, [restriction.cardId]),
        policy: applied,
      });
    }
  }

  for (const restriction of policy.compositionRestrictions ?? []) {
    if (waivedCompositionRestrictionIds.has(restriction.id)) continue;
    const counts = restriction.cardIds.map((cardId) => countForIdentity(entries, cardId));
    if (restriction.kind === "cannot-combine") {
      if (counts.every((count) => count > 0)) {
        violations.push({
          code: "format-composition",
          message: `${restriction.cardIds.join(" and ")} cannot be used together in ${policy.formatId}${reasonSuffix(restriction.reason)}`,
          cardIds: restriction.cardIds,
          restrictionId: restriction.id,
          zones: zonesForIdentities(entries, restriction.cardIds),
          policy: applied,
        });
      }
      continue;
    }

    if (restriction.kind === "mutually-exclusive-identities") {
      const presentCardIds = restriction.cardIds.filter((_, index) => (counts[index] ?? 0) > 0);
      if (presentCardIds.length > 1) {
        violations.push({
          code: "format-composition",
          message: `Only one of ${restriction.cardIds.join(", ")} may be used in ${policy.formatId}${reasonSuffix(restriction.reason)}`,
          cardIds: presentCardIds,
          restrictionId: restriction.id,
          actual: presentCardIds.length,
          allowed: 1,
          zones: zonesForIdentities(entries, presentCardIds),
          policy: applied,
        });
      }
      continue;
    }

    const actual = counts.reduce((total, count) => total + count, 0);
    if (actual > restriction.maxCombinedCopies) {
      violations.push({
        code: "format-composition",
        message: `${restriction.cardIds.join(" + ")}: ${actual} combined copies exceeds the ${policy.formatId} limit of ${restriction.maxCombinedCopies}${reasonSuffix(restriction.reason)}`,
        cardIds: restriction.cardIds,
        restrictionId: restriction.id,
        actual,
        allowed: restriction.maxCombinedCopies,
        zones: zonesForIdentities(entries, restriction.cardIds),
        policy: applied,
      });
    }
  }

  return {
    policy: applied,
    ...(appliedExceptions.length > 0
      ? { appliedExceptionIds: appliedExceptions.map(({ id }) => id) }
      : {}),
    violations,
  };
}
