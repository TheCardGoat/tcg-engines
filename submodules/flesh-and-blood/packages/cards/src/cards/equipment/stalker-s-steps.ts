import { arcaneBarrier, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stalker-s-steps.generated.ts";

export const stalkerSSteps = defineCard(fabCardIdentitiesByCanonicalId["mknwdmQhzHPbhmdtNqMfj"], {
  keywords: [arcaneBarrier(1)],
  abilities: {
    attackReactionDestroyTargetAttackStealthGetsGoAgain: {
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
            typeBox: {
              subtypes: ["Attack"],
            },
            hasKeyword: "stealth",
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  },
});
