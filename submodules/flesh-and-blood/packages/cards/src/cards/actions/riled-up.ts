import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/riled-up.generated.ts";

export const riledUp = definePitchFamily(fabPitchFamilies["riled-up"], {
  abilities: () => ({
    performedThisTurnDiscardPower6ModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "discard-power-6", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: riledUpRed, yellow: riledUpYellow, blue: riledUpBlue } = riledUp.cards;
