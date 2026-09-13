import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/lava-vein-loyalty.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const lavaVeinLoyalty = definePitchFamily(fabPitchFamilies["lava-vein-loyalty"], {
  abilities: () => ({
    compareAmountCountGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "chain-links",
          player: "controller",
          filter: { typeBox: { supertypes: ["Draconic"] } },
        },
        comparison: { op: "gte", value: 2 },
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
    },
  }),
});

export const {
  red: lavaVeinLoyaltyRed,
  yellow: lavaVeinLoyaltyYellow,
  blue: lavaVeinLoyaltyBlue,
} = lavaVeinLoyalty.cards;
