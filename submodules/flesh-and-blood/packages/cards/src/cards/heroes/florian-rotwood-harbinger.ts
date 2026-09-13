import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/heroes/florian-rotwood-harbinger.generated.ts";

export const florianRotwoodHarbinger = defineCard(
  fabCardIdentitiesByCanonicalId["hjMQGwKgDTh8LzFdnk8Rg"],
  {
    keywords: [
      {
        name: "essence",
        supertypes: ["Earth"],
      },
    ],
    abilities: {
      there8MoreEarthBanishedZoneFlorianGetsCreate1MoreAuraTokensInsteadCreateManyPlus1Tokens: {
        // Adult threshold is 8 Earth in banished (Young is 4).
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
            value: 8,
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
  },
);
