import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/foreboding-bolt.generated.ts";
import { opt } from "../shared/keywords.ts";
export const forebodingBolt = definePitchFamily(fabPitchFamilies["foreboding-bolt"], {
  parameters: pitchMap({ red: { damage: 3 }, yellow: { damage: 2 }, blue: { damage: 1 } }),
  keywords: [opt(1)],
  abilities: ({ damage }) => ({
    resolutionDealDamageGeneric: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "generic",
        amount: damage,
        target: {
          selector: "any-hero",
        },
      },
    },
  }),
});
export const {
  red: forebodingBoltRed,
  yellow: forebodingBoltYellow,
  blue: forebodingBoltBlue,
} = forebodingBolt.cards;
