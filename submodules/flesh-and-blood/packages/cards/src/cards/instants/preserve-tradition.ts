import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/preserve-tradition.generated.ts";

export const preserveTradition = definePitchFamily(fabPitchFamilies["preserve-tradition"], {
  keywords: [legendary],
  abilities: () => ({
    putTargetActionFromGraveyardBottomDeck: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["graveyard"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
          },
          count: 1,
        },
        to: {
          zone: "deck",
          position: "bottom",
        },
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

export const { blue: preserveTraditionBlue } = preserveTradition.cards;
