import { battleworn, goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/equipment/glidewell-fins.generated.ts";

export const glidewellFins = defineCard(fabCardIdentitiesByCanonicalId["N8krkMtHG86TBmG8Fp69t"], {
  keywords: [battleworn],
  abilities: {
    actionDestroyPutArrowFromHandFaceUpInto: {
      kind: "activated",
      abilityType: "action",
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
      // A mandatory move into the single-card arsenal is only legal when the
      // controller has both an Arrow to choose and an empty arsenal.
      condition: {
        type: "and",
        conditions: [
          {
            type: "zone-count",
            zone: "arsenal",
            player: "controller",
            comparison: { op: "eq", value: 0 },
          },
          {
            type: "zone-count",
            zone: "hand",
            player: "controller",
            filter: {
              typeBox: {
                subtypes: ["Arrow"],
              },
            },
            comparison: { op: "gte", value: 1 },
          },
        ],
      },
      layerKeywords: [goAgain],
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
              },
              count: 1,
            },
            to: {
              zone: "arsenal",
              visibility: "face-up",
            },
            outputBinding: "it",
          },
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  },
});
