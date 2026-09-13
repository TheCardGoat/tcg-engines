import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/a-drop-in-the-ocean.generated.ts";

export const aDropInTheOcean = definePitchFamily(fabPitchFamilies["a-drop-in-the-ocean"], {
  keywords: [legendary],
  abilities: () => ({
    targetAttackGets1: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 1,
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
      label: {
        name: "transcend",
      },
    },
    ifVePlayedAnotherBlueTurnTranscend: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "play-another-blue-card",
        player: "controller",
      },
      effect: {
        type: "transcend",
        target: {
          selector: "self",
        },
      },
      label: {
        name: "transcend",
      },
    },
  }),
});

export const { blue: aDropInTheOceanBlue } = aDropInTheOcean.cards;
