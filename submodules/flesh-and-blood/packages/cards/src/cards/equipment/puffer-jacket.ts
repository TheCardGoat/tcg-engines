import { temper } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/puffer-jacket.generated.ts";

export const pufferJacket = defineCard(fabCardIdentitiesByCanonicalId["fJTDNGKmzzzmwzrpCdgbT"], {
  keywords: [temper],
  abilities: {
    nonTokenHyperDriversControlEnterArenaAdditionalSteam: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "enter-arena",
          subject: {
            name: "Hyper Driver",
            typeBox: {
              excludeMetatypes: ["Token"],
            },
          },
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          count: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            count: 1,
            filter: {
              name: "Hyper Driver",
              typeBox: {
                excludeMetatypes: ["Token"],
              },
            },
          },
        },
        duration: "while-in-arena",
      },
    },
  },
});
