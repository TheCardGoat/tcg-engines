import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scalding-rain.generated.ts";

export const scaldingRain = definePitchFamily(fabPitchFamilies["scalding-rain"], {
  parameters: pitchMap({ red: { damage: 4 }, yellow: { damage: 3 }, blue: { damage: 2 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "any-hero",
        },
      },
    },
  }),
});

export const {
  red: scaldingRainRed,
  yellow: scaldingRainYellow,
  blue: scaldingRainBlue,
} = scaldingRain.cards;
