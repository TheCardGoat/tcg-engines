import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/bolt-n-boots.generated.ts";

export const boltNBoots = defineCard(fabCardIdentitiesByCanonicalId["dMgNNhpNmBbDpjQHKC8j7"], {
  keywords: [battleworn],
  abilities: {
    attackReactionDestroyTargetArrowAttackGreaterThanBase: {
      kind: "activated",
      abilityType: "attack-reaction",
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
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            and: [
              {
                typeBox: {
                  subtypes: ["Arrow"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              {
                hasStatus: "power-greater-than-base",
              },
            ],
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  },
});
