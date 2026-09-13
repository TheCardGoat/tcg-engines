import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/barraging-beatdown.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const barragingBeatdown = definePitchFamily(fabPitchFamilies["barraging-beatdown"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  keywords: [goAgain],
  abilities: (amount) => ({
    resolutionGrantPropertyIntimidate: {
      kind: "resolution",
      effect: {
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            id: "staticWhileHasStatusDefendedByFewerThan2Non",
            text: "",
            kind: "static",
            staticKind: "while",
            condition: {
              type: "has-status",
              status: "defended-by-fewer-than-2-non-equipment-cards",
            },
            effect: {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
          },
        },
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Brute"],
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
  red: barragingBeatdownRed,
  yellow: barragingBeatdownYellow,
  blue: barragingBeatdownBlue,
} = barragingBeatdown.cards;
