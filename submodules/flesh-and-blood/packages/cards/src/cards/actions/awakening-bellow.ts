import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/awakening-bellow.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const awakeningBellow = definePitchFamily(fabPitchFamilies["awakening-bellow"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionModifyNumericPowerIntimidate: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Brute"],
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const {
  red: awakeningBellowRed,
  yellow: awakeningBellowYellow,
  blue: awakeningBellowBlue,
} = awakeningBellow.cards;
