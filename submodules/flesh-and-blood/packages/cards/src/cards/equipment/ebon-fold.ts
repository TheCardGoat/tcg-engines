import { spellvoid } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/ebon-fold.generated.ts";

export const ebonFold = defineCard(fabCardIdentitiesByCanonicalId["RKDPjzdGtKWMQnNcHBdF8"], {
  keywords: [spellvoid(2)],
  abilities: {
    instantDestroyEbonFoldBanishFromHandIfS: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 1,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                typeBox: {
                  supertypes: ["Shadow"],
                },
              },
            },
            then: {
              type: "draw",
              count: 1,
              player: "controller",
            },
          },
        ],
      },
    },
  },
});
