import { goAgain } from "../shared/keywords.ts";
import { defineCard } from "../../authoring/card.ts";
import { fabCardIdentitiesByCanonicalId } from "../../generated/card-identities/weapons/redspine-manta.generated.ts";

export const redspineManta = defineCard(fabCardIdentitiesByCanonicalId["HWLzjqBjW6KJQ8gJNbRwJ"], {
  abilities: {
    actionTapPutArrowHandFaceUpArsenalGoAgain: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      layerKeywords: [goAgain],
      effect: {
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
});
