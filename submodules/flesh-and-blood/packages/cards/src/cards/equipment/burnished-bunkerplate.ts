import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/burnished-bunkerplate.generated.ts";

export const burnishedBunkerplate = defineCard(
  fabCardIdentitiesByCanonicalId["C6zqr6WKMwc8MqGjnqRLK"],
  {
    abilities: {
      defenseReactionDestroyMayAddActionFromArsenalActive: {
        kind: "activated",
        abilityType: "defense-reaction",
        cost: {
          class: "effect",
          type: "destroy-self",
        },
        effect: {
          type: "optional",
          effect: {
            type: "add-defending",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              filter: {
                typeBox: {
                  types: ["Action"],
                },
              },
              count: 1,
            },
          },
        },
      },
    },
  },
);
