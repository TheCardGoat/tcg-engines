import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/shattering-grasp.generated.ts";

export const shatteringGrasp = defineCard(fabCardIdentitiesByCanonicalId["DrfFF7FFQTbwwcbDckGH9"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyDestroyTargetFrozenAllyGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      layerKeywords: [goAgain],
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "on-stack",
          // “target frozen ally” has no controller restriction.
          player: "any",
          zones: ["permanent"],
          filter: {
            hasStatus: "frozen",
            typeBox: {
              subtypes: ["Ally"],
            },
          },
          count: 1,
        },
      },
    },
  },
});
