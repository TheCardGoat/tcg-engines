import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/starting-point.generated.ts";

export const startingPoint = defineCard(fabCardIdentitiesByCanonicalId["h8WG7GncNP7qN7hnzTdN9"], {
  abilities: {
    attackReactionDestroyTargetAttackGetsGoAgainActivate: {
      kind: "activated",
      abilityType: "attack-reaction",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "has-status",
        status: "played-card-or-activated-ability-this-reaction-step",
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
          },
          count: 1,
        },
        duration: "this-turn",
        outputBinding: "it",
      },
    },
  },
});
