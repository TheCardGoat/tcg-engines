import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/valiant-thrust.generated.ts";

const abilities = {
  resolutionModifyNumeric: {
    kind: "resolution",
    condition: {
      type: "performed-this-turn",
      event: "charge",
      player: "controller",
    },
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 3,
      target: {
        selector: "self",
      },
      duration: "this-turn",
    },
  },
} as const;

export const valiantThrust = definePitchFamily(fabPitchFamilies["valiant-thrust"], {
  abilities: () => abilities,
});

export const {
  red: valiantThrustRed,
  yellow: valiantThrustYellow,
  blue: valiantThrustBlue,
} = valiantThrust.cards;
