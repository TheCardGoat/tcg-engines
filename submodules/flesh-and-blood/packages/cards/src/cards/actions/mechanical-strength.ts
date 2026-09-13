import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mechanical-strength.generated.ts";

export const mechanicalStrength = definePitchFamily(fabPitchFamilies["mechanical-strength"], {
  abilities: () => ({
    modifyNumericPowerCountThisTurnEvoUpgrade: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "evos-equipped",
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "evo-upgrade",
      },
    },
  }),
});

export const {
  red: mechanicalStrengthRed,
  yellow: mechanicalStrengthYellow,
  blue: mechanicalStrengthBlue,
} = mechanicalStrength.cards;
