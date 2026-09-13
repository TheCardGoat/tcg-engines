import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seeds-of-strength.generated.ts";

export const seedsOfStrength = definePitchFamily(fabPitchFamilies["seeds-of-strength"], {
  parameters: pitchMap({
    red: { base: 3, earth: 4 },
    yellow: { base: 2, earth: 3 },
    blue: { base: 1, earth: 2 },
  }),
  abilities: (amounts) => ({
    createMightIfEarthCardPitched: {
      kind: "resolution",
      effect: {
        type: "conditional",
        condition: {
          type: "binding-numeric",
          binding: "pitched-this-way-earth-card",
          comparison: { op: "eq", value: 1 },
        },
        then: {
          type: "create-token",
          token: "might",
          controller: "controller",
          count: amounts.earth,
        },
        else: {
          type: "create-token",
          token: "might",
          controller: "controller",
          count: amounts.base,
        },
      },
      label: {
        name: "earth-bond",
      },
    },
  }),
});
export const {
  red: seedsOfStrengthRed,
  yellow: seedsOfStrengthYellow,
  blue: seedsOfStrengthBlue,
} = seedsOfStrength.cards;
