import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/power-of-make-believe.generated.ts";

const abilities = {
  continuousModifyNumericPowerCountWhileInArena: {
    kind: "static",
    staticKind: "continuous",
    effect: {
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: {
        type: "count",
        what: "cards-defending",
        per: "chain-link",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
        },
      },
      target: {
        selector: "self",
      },
      duration: "while-in-arena",
    },
  },
} as const;

export const powerOfMakeBelieve = definePitchFamily(fabPitchFamilies["power-of-make-believe"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: powerOfMakeBelieveRed,
  yellow: powerOfMakeBelieveYellow,
  blue: powerOfMakeBelieveBlue,
} = powerOfMakeBelieve.cards;
