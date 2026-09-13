import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/vexing-malice.generated.ts";

export const vexingMalice = definePitchFamily(fabPitchFamilies["vexing-malice"], {
  abilities: () => ({
    resolutionDealDamage: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 2,
        target: {
          selector: "any-hero",
        },
      },
    },
  }),
});

export const {
  red: vexingMaliceRed,
  yellow: vexingMaliceYellow,
  blue: vexingMaliceBlue,
} = vexingMalice.cards;
