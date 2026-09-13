import { bloodDebt } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/shroud-of-darkness.generated.ts";

export const shroudOfDarkness = defineCard(
  fabCardIdentitiesByCanonicalId["Lzr8Htn8MrNnMggczHwGd"],
  {
    keywords: [bloodDebt],
    abilities: {
      ifHeroWouldBeDealtDamageMayBanishPrevent: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "prevention",
          preventionKind: "fixed",
          amount: 2,
          // "Banish this" is banish-self (not banish any arena permanent).
          optionalCost: {
            class: "effect",
            type: "banish-self",
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
