import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/condemn-to-slaughter.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const condemnToSlaughter = definePitchFamily(fabPitchFamilies["condemn-to-slaughter"], {
  parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionModifyNumericPower: {
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
              supertypes: ["Runeblade"],
            },
          },
        },
      },
    },
    resolutionOptionalDestroyDestroy: {
      kind: "resolution",
      effect: {
        type: "optional",
        effect: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
        then: {
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const {
  red: condemnToSlaughterRed,
  yellow: condemnToSlaughterYellow,
  blue: condemnToSlaughterBlue,
} = condemnToSlaughter.cards;
