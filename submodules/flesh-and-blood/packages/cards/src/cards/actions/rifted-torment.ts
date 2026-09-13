import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rifted-torment.generated.ts";
import { bloodDebt } from "../shared/keywords.ts";

export const riftedTorment = definePitchFamily(fabPitchFamilies["rifted-torment"], {
  keywords: [bloodDebt],
  abilities: () => ({
    playDealDamage: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "any-hero",
        },
      },
    },
  }),
});

export const {
  red: riftedTormentRed,
  yellow: riftedTormentYellow,
  blue: riftedTormentBlue,
} = riftedTorment.cards;
