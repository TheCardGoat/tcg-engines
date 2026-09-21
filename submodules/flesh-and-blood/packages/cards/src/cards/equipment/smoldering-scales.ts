import { guardwell } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/smoldering-scales.generated.ts";

export const smolderingScales = defineCard(
  fabCardIdentitiesByCanonicalId["mKGPnwbkjcGbmPn7JJNBF"],
  {
    keywords: [guardwell],
    abilities: {
      ifOneMoreFrostbiteTokensWouldBeCreatedUnder: {
        kind: "static",
        staticKind: "continuous",
        effect: {
          type: "replacement",
          replacementKind: "standard",
          replaces: {
            name: "create",
            creator: "any",
            occurrences: "every",
            filter: {
              name: "Frostbite",
            },
            player: "controller",
          },
          modification: {
            type: "optional",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
          },
          duration: "while-in-arena",
        },
      },
    },
  },
);
