import { bloodDebt } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/grasp-of-darkness.generated.ts";

/**
 * DTD167 Grasp of Darkness — Shadow Arms (no printed defense) + Blood Debt.
 *
 * Printed: If your hero would be dealt damage, you may banish this to prevent
 * 2 of that damage. Blood Debt
 *
 * Model notes (hand-authored; sibling of DTD165 Shroud / DTD166 Cloak):
 * - Prior optionalCost banish from:arena count 1 — "Banish this" is banish-self.
 * - Continuous while-in-arena prevention fixed 2; optional cost auto-pays.
 */
export const graspOfDarkness = defineCard(fabCardIdentitiesByCanonicalId["76MpwMj77CmK8wDp6HMDn"], {
  keywords: [bloodDebt],
  abilities: {
    ifHeroWouldBeDealtDamageMayBanishPrevent: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        optionalCost: {
          class: "effect",
          type: "banish-self",
        },
        duration: "while-in-arena",
      },
    },
  },
});
