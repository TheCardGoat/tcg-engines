import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/stand-strong.generated.ts";

export const standStrong = defineCard(fabCardIdentitiesByCanonicalId["ggMjPPrkLjJJwWPFGdnDq"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyCreateConfidenceTokenActivateOnlyIfControl: {
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
        type: "control-object",
        filter: {
          typeBox: {
            subtypes: ["Aura"],
          },
          hasKeyword: "suspense",
        },
      },
      layerKeywords: [goAgain],
      effect: {
        type: "create-token",
        token: "confidence",
        controller: "controller",
      },
    },
  },
});
