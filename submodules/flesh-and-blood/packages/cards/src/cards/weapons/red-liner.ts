import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/red-liner.generated.ts";

export const redLiner = defineCard(fabCardIdentitiesByCanonicalId["6fGDjThJfHN7ttFCHGGnC"], {
  abilities: {
    oncePerTurnAction0NoArsenalPutArrowHandFaceUpArsenalGoAgain: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      layerKeywords: [goAgain],
      effect: {
        type: "conditional",
        condition: {
          type: "zone-count",
          zone: "arsenal",
          player: "controller",
          comparison: {
            op: "eq",
            value: 0,
          },
        },
        then: {
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
      },
    },
  },
});
