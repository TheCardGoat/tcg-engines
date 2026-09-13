import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-dart.generated.ts";

export const aetherDart = definePitchFamily(fabPitchFamilies["aether-dart"], {
  parameters: pitchMap({ red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } }),
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
  red: aetherDartRed,
  yellow: aetherDartYellow,
  blue: aetherDartBlue,
} = aetherDart.cards;
