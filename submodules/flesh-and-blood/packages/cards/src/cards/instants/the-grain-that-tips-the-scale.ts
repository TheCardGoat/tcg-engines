import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/the-grain-that-tips-the-scale.generated.ts";

export const theGrainThatTipsTheScale = definePitchFamily(
  fabPitchFamilies["the-grain-that-tips-the-scale"],
  {
    keywords: [legendary],
    abilities: () => ({
      targetAttackGets1: {
        kind: "resolution",
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
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
  },
);

export const { blue: theGrainThatTipsTheScaleBlue } = theGrainThatTipsTheScale.cards;
