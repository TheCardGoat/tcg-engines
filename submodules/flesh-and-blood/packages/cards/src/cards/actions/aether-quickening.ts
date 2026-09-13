import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-quickening.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const aetherQuickening = definePitchFamily(fabPitchFamilies["aether-quickening"], {
  parameters: pitchMap({ red: { damage: 4 }, yellow: { damage: 3 }, blue: { damage: 2 } }),
  keywords: [goAgain],
  abilities: ({ damage }) => ({
    resolutionDealDamageArcane: {
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
    resolutionSourceDamageDealtGrantPropertySurge: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: damage },
      },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "surge",
      },
    },
  }),
});

export const {
  red: aetherQuickeningRed,
  yellow: aetherQuickeningYellow,
  blue: aetherQuickeningBlue,
} = aetherQuickening.cards;
