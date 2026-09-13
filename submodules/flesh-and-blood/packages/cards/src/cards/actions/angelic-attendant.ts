import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/angelic-attendant.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const angelicAttendant = definePitchFamily(fabPitchFamilies["angelic-attendant"], {
  keywords: [
    {
      name: "awaken",
    },
    goAgain,
  ],
  abilities: () => ({
    awakenTargetFigmentControl: {
      kind: "resolution",
      effect: {
        type: "awaken",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Figment"],
            },
          },
          count: 1,
        },
      },
    },
    putIntoSoul: {
      kind: "resolution",
      effect: {
        type: "move-card",
        target: {
          selector: "self",
        },
        to: {
          zone: "soul",
        },
      },
    },
  }),
});
export const { yellow: angelicAttendantYellow } = angelicAttendant.cards;
