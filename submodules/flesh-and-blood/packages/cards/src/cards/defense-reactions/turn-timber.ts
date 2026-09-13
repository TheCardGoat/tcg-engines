import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fusion } from "../shared/keywords.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/turn-timber.generated.ts";

export const turnTimber = definePitchFamily(fabPitchFamilies["turn-timber"], {
  keywords: [fusion("Earth")],

  abilities: () => ({
    fusedDefenseBonus: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "fused",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const {
  red: turnTimberRed,
  yellow: turnTimberYellow,
  blue: turnTimberBlue,
} = turnTimber.cards;
