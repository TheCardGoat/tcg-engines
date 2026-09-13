import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-hail.generated.ts";

export const aetherHail = definePitchFamily(fabPitchFamilies["aether-hail"], {
  parameters: pitchMap({ red: { damage: 4 }, yellow: { damage: 3 }, blue: { damage: 2 } }),
  abilities: ({ damage }) => ({
    resolutionDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
  }),
});

export const {
  red: aetherHailRed,
  yellow: aetherHailYellow,
  blue: aetherHailBlue,
} = aetherHail.cards;
