import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tip-off.generated.ts";

export const tipOff = definePitchFamily(fabPitchFamilies["tip-off"], {
  abilities: () => ({
    activatedMark: {
      kind: "activated",
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "discard-self",
      },
      effect: {
        type: "mark",
        target: {
          selector: "opponent",
        },
      },
    },
  }),
});

export const { red: tipOffRed, yellow: tipOffYellow, blue: tipOffBlue } = tipOff.cards;
