import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/florian.generated.ts";

export const florian = defineCard(fabCardIdentitiesByCanonicalId["Ht8qhJWDMHjjMjzqgf6KG"], {
  keywords: [
    {
      name: "essence",
      supertypes: ["Earth"],
    },
  ],
  abilities: {
    there4MoreEarthBanishedZoneFlorianGetsCreate1MoreAuraTokensInsteadCreateManyPlus1Tokens: {
      // Printed "Florian gets [replacement]" while 4+ Earth are banished.
      // Modeled as a static continuous replacement gated by zone-count — not a
      // grant-property nest — so the replacement engine collects it from the
      // hero's functional abilities when the threshold holds.
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
        filter: {
          typeBox: {
            supertypes: ["Earth"],
          },
        },
        comparison: {
          op: "gte",
          value: 4,
        },
      },
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "create",
          filter: {
            typeBox: {
              metatypes: ["Token"],
              subtypes: ["Aura"],
            },
          },
        },
        modification: {
          type: "create-extra",
          amount: 1,
        },
        duration: "while-condition",
      },
    },
  },
});
