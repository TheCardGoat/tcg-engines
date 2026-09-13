import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/payload.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const payload = definePitchFamily(fabPitchFamilies["payload"], {
  abilities: () => ({
    compareAmountCountGrantPropertyThisTurn: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "boosts-this-combat-chain",
        },
        comparison: { op: "gte", value: 1 },
      },
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

export const { red: payloadRed, yellow: payloadYellow, blue: payloadBlue } = payload.cards;
