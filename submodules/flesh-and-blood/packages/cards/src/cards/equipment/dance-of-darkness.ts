import { bloodDebt } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/dance-of-darkness.generated.ts";

export const danceOfDarkness = defineCard(fabCardIdentitiesByCanonicalId["HjgMJg6DrhJqR6fMnp6fc"], {
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
