import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/predatory-assault.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const predatoryAssault = definePitchFamily(fabPitchFamilies["predatory-assault"], {
  // No unconditional `keywords: [dominate]`: the printed text grants dominate
  // only via the a1 conditional (FIX-5, plan §5 — CRU151 class).
  abilities: () => ({
    performedThisTurnDiscardPower6GrantPropertyThisTurn: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "discard-power-6", player: "controller" },
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: dominate,
        },
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: predatoryAssaultRed,
  yellow: predatoryAssaultYellow,
  blue: predatoryAssaultBlue,
} = predatoryAssault.cards;
