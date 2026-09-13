import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/red-alert-visor.generated.ts";

/**
 * HNT192 Red Alert Visor — Assassin/Warrior Head d1 Blade Break.
 *
 * Printed: If an attack reaction has been played or activated this chain
 * link, this gets +1{d}. Blade Break
 *
 * Model notes (hand-authored):
 * - Continuous + has-status condition re-eval (not this-turn latch).
 * - duration permanent on the leaf: static reconciler already uses
 *   while-functional; this-turn was misleading residue.
 * - Status is combat-scoped via facts.combat.attackReactionPlayedOrActivated.
 */
export const redAlertVisor = defineCard(fabCardIdentitiesByCanonicalId["Lf6kGcR7qqdFHCHLnGkng"], {
  keywords: [bladeBreak],
  abilities: {
    ifAttackReactionHasBeenPlayedActivatedChainLink: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "attack-reaction-played-or-activated-this-chain-link",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
});
