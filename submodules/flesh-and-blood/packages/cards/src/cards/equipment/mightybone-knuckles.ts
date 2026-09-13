import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/mightybone-knuckles.generated.ts";

export const mightyboneKnuckles = defineCard(
  fabCardIdentitiesByCanonicalId["kjJTFcHjQdjkfFNr8kRQw"],
  {
    keywords: [bladeBreak],
    abilities: {
      actionDestroyCreate3MightTokensActivateOnlyIf: {
        kind: "activated",
        abilityType: "action",
        cost: {
          class: "mixed",
          type: "all",
          costs: [
            {
              class: "asset",
              type: "resources",
              amount: 3,
            },
            {
              class: "effect",
              type: "destroy-self",
            },
          ],
        },
        condition: {
          type: "life-comparison",
          player: "self",
          vs: "each-other-hero",
          op: "gt",
        },
        layerKeywords: [goAgain],
        effect: {
          type: "create-token",
          token: "might",
          controller: "controller",
          count: 3,
        },
      },
    },
  },
);
