import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/path-of-vengeance.generated.ts";

export const pathOfVengeance = defineCard(fabCardIdentitiesByCanonicalId["MLFcr8MRb7J7mDBzh6Lhk"], {
  keywords: [bladeBreak],
  abilities: {
    attackReactionDestroyTargetAttackIsAttackingArakniGets: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
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
                  subtypes: ["Attack"],
                },
              },
              {
                typeBox: {
                  metatypes: ["Arakni"],
                },
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
