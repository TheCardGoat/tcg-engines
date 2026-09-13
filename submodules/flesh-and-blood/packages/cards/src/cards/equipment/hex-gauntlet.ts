import { bloodDebt } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/hex-gauntlet.generated.ts";

/**
 * IAR004 Hex Gauntlet — Shadow Brute Arms (no printed defense) + Blood Debt.
 *
 * Printed:
 *   Instant - Banish this: Turn a card with blood debt in your banished zone
 *   face-down.
 *   Blood Debt
 *
 * Model notes (hand-authored; arms twin of IAR161 grille destroy-self path):
 * - "Banish this" is banish-self (not banish from:arena count 1 — that would
 *   let you banish an arbitrary arena permanent as the cost).
 * - On-stack target is a controller blood-debt card in banished (public).
 * - power:6 was catalog residue (no printed {p} on this equipment).
 * - After resolve, this is itself banished face-up with Blood Debt and will
 *   tick at end phase (CR 8.3.11) unless separately turned face-down.
 */
export const hexGauntlet = defineCard(fabCardIdentitiesByCanonicalId["zMHH8DntNfcWwFMNrPNnQ"], {
  keywords: [bloodDebt],
  abilities: {
    instantBanishTurnBloodDebtBanishedZoneFaceDown: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "banish-self",
      },
      effect: {
        type: "turn-face-down",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["banished"],
          filter: {
            hasKeyword: "blood-debt",
          },
          count: 1,
        },
      },
    },
  },
});
