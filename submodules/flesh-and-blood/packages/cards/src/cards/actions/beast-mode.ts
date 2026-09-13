import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/beast-mode.generated.ts";

export const beastMode = definePitchFamily(fabPitchFamilies["beast-mode"], {
  abilities: () => ({
    resolutionPerformedTurnIntimidateOpponentModifyNumericPower: {
      kind: "resolution",
      condition: {
        type: "performed-this-turn",
        event: "intimidate-an-opponent",
        player: "controller",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: beastModeRed, yellow: beastModeYellow, blue: beastModeBlue } = beastMode.cards;
