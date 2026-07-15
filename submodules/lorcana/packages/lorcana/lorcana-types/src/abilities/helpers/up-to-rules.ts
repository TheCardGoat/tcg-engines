/**
 * Up-to rule registry
 *
 * When an effect carries `amount: { type: "up-to", value: N }`, the chooser
 * may submit any value in `[0, N]` — but the effective maximum usually
 * depends on runtime state (e.g. the target's current damage caps a
 * remove-damage choice). The rules here are the single source of truth for:
 *
 * 1. Which effect types accept up-to semantics.
 * 2. How to compute the slider's upper bound from the base amount plus the
 *    chooser's current target selection.
 *
 * The UI (selection-state builder) and any runtime that wants to validate a
 * chooser submission consult the same registry. The per-target *clamp*
 * applied during resolution (e.g. "can't remove more damage than the target
 * has") still lives inside each effect's resolver — the registry's job is
 * to bound the chooser prompt, not to replace resolver logic.
 *
 * Registering a new effect:
 * 1. Add an entry to `UP_TO_RULES` mapping the effect type to a rule.
 * 2. Ensure the effect's resolver re-clamps per target.
 */

/**
 * Read-only accessors the rules may consult. Thin by design — new accessors
 * should only be added when a new rule actually needs them.
 */
export interface UpToCapContext {
  /** Current damage on a card (0 if unknown / not in play). */
  getCardDamage(cardId: string): number;
}

export interface UpToRuleParams {
  /** The numeric `value` extracted from `{ type: "up-to", value: N }`. */
  baseAmount: number;
  /**
   * Card IDs the chooser has selected so far (not player IDs). Ordered the
   * same way the UI collected them — by convention slot 0 is the "source" /
   * "subject" for effects that have one.
   */
  selectedCardTargets: readonly string[];
  ctx: UpToCapContext;
}

export interface UpToRule {
  /**
   * Return the maximum value the chooser may submit given the current
   * selection. Must be `>= 0` and `<= baseAmount`. Runtime-state-derived
   * caps (target's damage, etc.) are applied here.
   */
  getSelectionMax(params: UpToRuleParams): number;
  /**
   * Human-readable slider label (e.g. "Damage to remove"). Kept next to the
   * rule so UI copy doesn't drift from semantics.
   */
  label: string;
}

const clampNonNegative = (value: number): number => (value > 0 ? Math.floor(value) : 0);

/**
 * Default rules covering the effects that ship with "up to" today. Future
 * effects register additional entries here (or via a registration helper, if
 * we ever need card-pack-level extensibility).
 */
const UP_TO_RULES: Readonly<Record<string, UpToRule>> = {
  "remove-damage": {
    label: "Damage to remove",
    getSelectionMax({ baseAmount, selectedCardTargets, ctx }) {
      if (selectedCardTargets.length !== 1) {
        return clampNonNegative(baseAmount);
      }
      const targetId = selectedCardTargets[0];
      return targetId
        ? Math.min(clampNonNegative(baseAmount), clampNonNegative(ctx.getCardDamage(targetId)))
        : clampNonNegative(baseAmount);
    },
  },
  "move-damage": {
    label: "Damage to move",
    getSelectionMax({ baseAmount, selectedCardTargets, ctx }) {
      // Move-damage collects [source, destination]; the source's damage is
      // the binding cap. If no source picked yet, fall back to base.
      const sourceId = selectedCardTargets[0];
      return sourceId
        ? Math.min(clampNonNegative(baseAmount), clampNonNegative(ctx.getCardDamage(sourceId)))
        : clampNonNegative(baseAmount);
    },
  },
};

export function getUpToRule(effectType: string): UpToRule | undefined {
  return Object.hasOwn(UP_TO_RULES, effectType) ? UP_TO_RULES[effectType] : undefined;
}

export function supportsUpTo(effectType: string): boolean {
  return Object.hasOwn(UP_TO_RULES, effectType);
}

export function listUpToRuleEffectTypes(): readonly string[] {
  return Object.keys(UP_TO_RULES);
}
