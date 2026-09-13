import { goAgain, legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/path-well-traveled.generated.ts";

export const pathWellTraveled = definePitchFamily(fabPitchFamilies["path-well-traveled"], {
  keywords: [legendary],
  abilities: () => ({
    targetAttackGetsGoAgain: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
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

export const { blue: pathWellTraveledBlue } = pathWellTraveled.cards;
