import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tiger-form-incantation.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const tigerFormIncantation = definePitchFamily(fabPitchFamilies["tiger-form-incantation"], {
  parameters: pitchMap({ red: { bonus: 3 }, yellow: { bonus: 2 }, blue: { bonus: 1 } }),
  keywords: [goAgain],
  abilities: ({ bonus: _bonus }) => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            name: "Crouching Tiger",
          },
        },
      },
    },
    resolutionCreateToken: {
      kind: "resolution",
      condition: {
        type: "pitch-zone-has",
        filter: {
          color: ["blue"],
        },
      },
      effect: {
        type: "create-token",
        token: "crouching-tiger",
        controller: "controller",
        to: {
          zone: "hand",
        },
      },
    },
  }),
});

export const {
  red: tigerFormIncantationRed,
  yellow: tigerFormIncantationYellow,
  blue: tigerFormIncantationBlue,
} = tigerFormIncantation.cards;
