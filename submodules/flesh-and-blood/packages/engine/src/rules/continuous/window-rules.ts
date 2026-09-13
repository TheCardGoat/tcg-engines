import type { FabEffect } from "@tcg/flesh-and-blood-types";

/**
 * CR 7 defend/activation-window rule-modifications. A rule-modification with
 * action "defend" or "activate" printed on an attacking card governs the
 * defend/reaction/activation window of that very attack ("The defending hero
 * can't defend this with attack action cards with cost less than X…" —
 * EVO061-063 Heavy Artillery, "Defense reactions can't be played to
 * Widowmaker's chain link" — AZL015, "you may activate abilities of bows you
 * control an additional time this turn and as though they were an instant" —
 * ELE041-043 Snap Shot). Such effects must materialize while the attack sits
 * on the stack/combat chain, not when its layer resolves after the window.
 *
 * Shared by the reconciler's resolution-window projection (positive) and the
 * layer-resolution effect path (suppresses the late materialization so the
 * rule is never generated twice).
 */
/** The rule-modification effect member (action is a wide union; callers that
 * need the defend/activate subset use the runtime check below). */
export type FabWindowRuleEffect = Extract<FabEffect, { readonly type: "rule-modification" }>;

export function effectTreeWindowRuleModification(
  effect: FabEffect | undefined,
): FabWindowRuleEffect | null {
  if (!effect) return null;
  if (effect.type === "rule-modification") {
    return effect.action === "defend" || effect.action === "activate" ? effect : null;
  }
  if (effect.type === "sequence") {
    for (const step of effect.steps) {
      const found = effectTreeWindowRuleModification(step);
      if (found) return found;
    }
    return null;
  }
  if (effect.type === "conditional") {
    return (
      effectTreeWindowRuleModification(effect.then) ?? effectTreeWindowRuleModification(effect.else)
    );
  }
  if (effect.type === "optional") return effectTreeWindowRuleModification(effect.effect);
  return null;
}
