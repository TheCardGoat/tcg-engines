import { bloodDebt } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/cloak-of-darkness.generated.ts";

/**
 * DTD166 Cloak of Darkness — Shadow Chest (no printed defense) + Blood Debt.
 *
 * Printed:
 *   If your hero would be dealt damage, you may banish this to prevent 2 of
 *   that damage.
 *
 * Model notes (hand-authored, sibling of DTD165 Shroud of Darkness):
 * - "Banish this" is banish-self (not banish any arena permanent).
 * - Continuous while-in-arena prevention; optional cost auto-pays on damage.
 */
export const cloakOfDarkness = defineCard(fabCardIdentitiesByCanonicalId["TtgGwwdkkjjMHBbMztjrG"], {
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
