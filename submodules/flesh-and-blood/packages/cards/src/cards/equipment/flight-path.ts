import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/flight-path.generated.ts";

export const flightPath = defineCard(fabCardIdentitiesByCanonicalId["mRMLQ9PM6rhFMcMKWdcbm"], {
  keywords: [battleworn],
  abilities: {
    attackReactionDestroyTargetArrowAttackAimCounterGets: {
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
                  subtypes: ["Arrow"],
                },
              },
              {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
              {
                hasCounter: "aim",
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
