import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/pass-over.generated.ts";

export const passOver = definePitchFamily(fabPitchFamilies["pass-over"], {
  keywords: [legendary],
  abilities: () => ({
    banishTargetFromOpposingHeroSGraveyard: {
      kind: "resolution",
      effect: {
        type: "banish",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "opponent",
          zones: ["graveyard"],
          count: 1,
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

export const { blue: passOverBlue } = passOver.cards;
