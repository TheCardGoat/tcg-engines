import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/inspire-lightning.generated.ts";

export const inspireLightning = definePitchFamily(fabPitchFamilies["inspire-lightning"], {
  keywords: [fusion("Lightning")],

  abilities: () => ({
    hasStatusFusedDealDamage: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 3,
        target: {
          selector: "any-hero",
        },
      },
    },
  }),
});
export const {
  red: inspireLightningRed,
  yellow: inspireLightningYellow,
  blue: inspireLightningBlue,
} = inspireLightning.cards;
