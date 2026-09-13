import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/liquid-cooled-mayhem.generated.ts";

export const liquidCooledMayhem = definePitchFamily(fabPitchFamilies["liquid-cooled-mayhem"], {
  abilities: () => ({
    continuousModifyNumericCostCountWhileInArenaEvoUpgrade: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "evos-equipped",
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
      label: {
        name: "evo-upgrade",
      },
    },
  }),
});

export const {
  red: liquidCooledMayhemRed,
  yellow: liquidCooledMayhemYellow,
  blue: liquidCooledMayhemBlue,
} = liquidCooledMayhem.cards;
