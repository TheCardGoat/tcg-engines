import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/soul-butcher.generated.ts";

export const soulButcher = definePitchFamily(fabPitchFamilies["soul-butcher"], {
  keywords: [bloodDebt],
  abilities: () => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "soul",
        player: "defending-hero",
        comparison: { op: "gte", value: 1 },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: soulButcherRed,
  yellow: soulButcherYellow,
  blue: soulButcherBlue,
} = soulButcher.cards;
