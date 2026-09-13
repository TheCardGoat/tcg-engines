import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/goldwing-turbine.generated.ts";
export const goldwingTurbine = definePitchFamily(fabPitchFamilies["goldwing-turbine"], {
  parameters: pitchMap({ red: { value1: 3 }, yellow: { value1: 2 }, blue: { value1: 1 } }),
  abilities: ({ value1 }) => ({
    resolutionModifyNumericPower: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: value1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              supertypes: ["Mechanologist"],
            },
          },
        },
      },
    },
    resolutionCreateTokenGoldenCog: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "golden-cog",
        controller: "controller",
      },
    },
  }),
});
export const {
  red: goldwingTurbineRed,
  yellow: goldwingTurbineYellow,
  blue: goldwingTurbineBlue,
} = goldwingTurbine.cards;
