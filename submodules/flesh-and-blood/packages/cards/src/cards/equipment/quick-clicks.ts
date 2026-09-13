import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/quick-clicks.generated.ts";

export const quickClicks = defineCard(fabCardIdentitiesByCanonicalId["BzRFcMpm9fmqgDPNdCRQ9"], {
  abilities: {
    actionDestroyNextAttackTurnGetsGoAgainActivate: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "destroy-self",
      },
      condition: {
        type: "played-this",
        per: "turn",
        filter: { name: "Nimblism" },
        comparison: { op: "gte", value: 1 },
      },
      layerKeywords: [goAgain],
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
  },
});
