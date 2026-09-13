import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/proclamation-of-abundance.generated.ts";

export const proclamationOfAbundance = defineCard(
  fabCardIdentitiesByCanonicalId["wQcpct8M6ddWK6BkKMMgC"],
  {
    abilities: {
      actionDestroyEachHeroDrawsUpTheir: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        effect: {
          type: "draw",
          count: {
            type: "up-to",
            amount: {
              type: "hero-property",
              property: "intellect",
              player: "each",
            },
          },
          player: "each",
        },
      },
    },
  },
);
