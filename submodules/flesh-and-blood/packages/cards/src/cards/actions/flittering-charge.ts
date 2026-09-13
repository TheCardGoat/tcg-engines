import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/flittering-charge.generated.ts";
const abilities = {
  continuousGrantProperty: {
    kind: "static",
    staticKind: "continuous",
    condition: {
      type: "played-this",
      per: "chain-link",
      filter: {
        typeBox: {
          types: ["Instant"],
        },
      },
      comparison: {
        op: "gte",
        value: 1,
      },
    },
    effect: {
      type: "grant-property",
      property: {
        kind: "keyword",
        keyword: {
          name: "go-again",
        },
      },
      target: {
        selector: "self",
      },
      duration: "while-in-arena",
    },
  },
} as const;
export const flitteringCharge = definePitchFamily(fabPitchFamilies["flittering-charge"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: flitteringChargeRed,
  yellow: flitteringChargeYellow,
  blue: flitteringChargeBlue,
} = flitteringCharge.cards;
