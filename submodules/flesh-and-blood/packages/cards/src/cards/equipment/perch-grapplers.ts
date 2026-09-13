import { bladeBreak, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/perch-grapplers.generated.ts";

export const perchGrapplers = defineCard(fabCardIdentitiesByCanonicalId["8CLhBWj6dbMgg9gfPCQjH"], {
  keywords: [bladeBreak],
  abilities: {
    actionDestroyPerchGrapplersUntilEndTurnFaceUp: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "mixed",
        type: "all",
        costs: [
          {
            class: "asset",
            type: "resources",
            amount: 2,
          },
          {
            class: "effect",
            type: "destroy-self",
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["stack", "combat-chain"],
          filter: {
            typeBox: {
              subtypes: ["Arrow"],
            },
            hasStatus: "face-up",
            playedFromZones: ["arsenal"],
          },
          count: {
            type: "all",
          },
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Arrow"],
            },
            hasStatus: "face-up",
            playedFromZones: ["arsenal"],
          },
          count: { type: "all" },
        },
      },
    },
  },
});
