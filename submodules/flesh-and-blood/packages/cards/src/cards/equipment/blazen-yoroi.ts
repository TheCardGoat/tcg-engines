import { bladeBreak } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/blazen-yoroi.generated.ts";

/**
 * DYN045 Blazen Yoroi — Ninja Chest d1 Blade Break.
 *
 * Printed:
 *   While Blazen Yoroi is defending on chain link 4 or higher, it has +4{d}.
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - Continuous +4{d} gated by defending-on-chain-link-4-or-higher (live combat
 *   facts: subject defending + chainLinkNumber >= 4).
 * - Equipment remains functional while defending on the combat chain.
 */
export const blazenYoroi = defineCard(fabCardIdentitiesByCanonicalId["Fm6dT9jM6BhLtRphtfrFR"], {
  keywords: [bladeBreak],
  abilities: {
    whileBlazenYoroiIsDefendingChainLink4Higher: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "defending-on-chain-link-4-or-higher",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 4,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  },
});
