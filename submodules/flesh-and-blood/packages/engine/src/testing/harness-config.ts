/**
 * Test-harness convenience configuration for {@link FabTestEngine}.
 *
 * These flags never change engine legality — they only auto-fill choices the
 * test author would otherwise spell out (pitch payment, response-free priority
 * passes, end-turn pitch order). The smart defaults are ON: auto-pitch covers
 * unpaid costs, stack/combat priority passes automatically only when no
 * non-pass action is legal, and multi-card pitch is bottomed in the order it
 * was pitched. Tests that genuinely exercise
 * priority timing, CR 4.4.3c pitch ordering, or payment selection opt out
 * explicitly (`{ autoPitch: false, autoPassPriority: false, pitchStack:
 * "manual" }`).
 */

/** How multi-card pitch is ordered onto the bottom of the deck (CR 4.4.3c). */
export type FabPitchStackStrategy = "manual" | "as-pitched" | "high-first" | "low-first";

/**
 * Optional assists accepted by {@link FabTestEngine.start} (and related factories).
 * Every field is optional; omitted fields inherit the smart default (ON).
 */
export interface FabHarnessConfig {
  /**
   * When `play()` omits `pitch` and the card costs more RP than available,
   * greedily pitch highest-value hand cards first until the shortfall is covered.
   * Explicit `options.pitch` always wins. Default `true` (opt out with `false`).
   */
  readonly autoPitch?: boolean;

  /**
   * After a successful harness move, repeatedly pass only during stack/combat
   * priority when the priority player has no legal non-pass action. It never
   * submits a no-blockers declaration and never completes an empty-stack Action
   * Phase pass cycle. Default `true` (opt out with `false`).
   */
  readonly autoPassPriority?: boolean;

  /**
   * End-turn multi-card pitch bottom order (CR 4.4.3c).
   * - `"as-pitched"` (default): harness auto-answers the ordering decision in zone order
   * - `"high-first"` | `"low-first"`: harness auto-answers by printed pitch value
   * - `"manual"`: opt out — caller answers the persisted ordering decision
   */
  readonly pitchStack?: FabPitchStackStrategy;
}

/** Normalized harness config with every field filled. */
export interface FabHarnessConfigResolved {
  readonly autoPitch: boolean;
  readonly autoPassPriority: boolean;
  readonly pitchStack: FabPitchStackStrategy;
}

export const DEFAULT_FAB_HARNESS_CONFIG: FabHarnessConfigResolved = {
  autoPitch: true,
  autoPassPriority: true,
  pitchStack: "as-pitched",
};

/**
 * Opt out of every smart assist. Use when the test asserts pre-payment cost,
 * on-declaration power, pitch order, or a specific optional (reload, etc.).
 */
export const FAB_MANUAL_HARNESS = {
  autoPassPriority: false,
  autoPitch: false,
  pitchStack: "manual",
} as const satisfies FabHarnessConfig;

export function normalizeFabHarnessConfig(
  raw: FabHarnessConfig | undefined | null,
): FabHarnessConfigResolved {
  if (!raw) return { ...DEFAULT_FAB_HARNESS_CONFIG };
  const strategy = raw.pitchStack;
  return {
    autoPitch: raw.autoPitch ?? DEFAULT_FAB_HARNESS_CONFIG.autoPitch,
    autoPassPriority: raw.autoPassPriority ?? DEFAULT_FAB_HARNESS_CONFIG.autoPassPriority,
    pitchStack:
      strategy === "manual" ||
      strategy === "as-pitched" ||
      strategy === "high-first" ||
      strategy === "low-first"
        ? strategy
        : DEFAULT_FAB_HARNESS_CONFIG.pitchStack,
  };
}

/**
 * Greedy highest-pitch payment selection (auto-pitch assist).
 * Picks hand cards (excluding `excludeId`) until `need` RP is covered.
 * Returns `[]` when nothing is needed or when coverage cannot be met.
 */
export function selectAutoPitchPayment(
  handInstanceIds: readonly string[],
  need: number,
  pitchValueOf: (instanceId: string) => number,
  excludeId?: string,
): string[] {
  if (need <= 0) return [];
  const candidates = handInstanceIds
    .filter((id) => id !== excludeId && pitchValueOf(id) > 0)
    .map((id) => ({ id, value: pitchValueOf(id) }))
    .sort((a, b) => b.value - a.value || a.id.localeCompare(b.id));
  const selected: string[] = [];
  let sum = 0;
  for (const c of candidates) {
    if (sum >= need) break;
    selected.push(c.id);
    sum += c.value;
  }
  return sum >= need ? selected : [];
}

/**
 * Sort pitch-zone instance ids for CR 4.4.3c bottom order.
 * `as-pitched` / `manual` keep zone order; high/low sort by printed pitch value.
 */
export function orderPitchForBottom(
  strategy: FabPitchStackStrategy,
  pitchInstanceIds: readonly string[],
  pitchValueOf: (instanceId: string) => number,
): string[] {
  const ids = pitchInstanceIds.slice();
  if (strategy === "as-pitched" || strategy === "manual") {
    return ids;
  }
  const mult = strategy === "high-first" ? -1 : 1;
  return ids.sort((a, b) => {
    const d = (pitchValueOf(a) - pitchValueOf(b)) * mult;
    return d !== 0 ? d : a.localeCompare(b);
  });
}
