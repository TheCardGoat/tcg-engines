import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/overcharge.generated.ts";
import { goAgain } from "../shared/keywords.ts";

const abilities = {
  whilePlayedThisModifyNumericPowerPermanent: {
    kind: "static",
    staticKind: "while",
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
      type: "modify-numeric",
      property: "power",
      op: "add",
      amount: 3,
      target: {
        selector: "self",
      },
      duration: "permanent",
    },
  },
} as const;

export const overcharge = definePitchFamily(fabPitchFamilies["overcharge"], {
  keywords: [goAgain],
  abilities: () => ({ ...abilities }),
});

export const {
  red: overchargeRed,
  yellow: overchargeYellow,
  blue: overchargeBlue,
} = overcharge.cards;
