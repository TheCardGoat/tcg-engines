import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-spindle.generated.ts";

export const aetherSpindle = definePitchFamily(fabPitchFamilies["aether-spindle"], {
  parameters: pitchMap({ red: { damage: 4 }, yellow: { damage: 3 }, blue: { damage: 2 } }),
  keywords: [
    {
      name: "opt",
      value: {
        type: "x",
      },
    },
  ],
  abilities: ({ damage }) => ({
    resolutionDealDamageArcane: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: damage,
        target: {
          selector: "opponent",
        },
      },
    },
    resolutionOpt: {
      kind: "resolution",
      effect: {
        type: "opt",
        count: {
          type: "count",
          what: "damage-dealt",
          per: "turn",
          filter: {
            name: "Aether Spindle",
          },
        },
      },
    },
  }),
});

export const {
  red: aetherSpindleRed,
  yellow: aetherSpindleYellow,
  blue: aetherSpindleBlue,
} = aetherSpindle.cards;
