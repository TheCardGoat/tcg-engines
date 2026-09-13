import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sprocket-rocket.generated.ts";
import { boost } from "../shared/keywords.ts";

export const sprocketRocket = definePitchFamily(fabPitchFamilies["sprocket-rocket"], {
  keywords: [boost],
  abilities: () => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      condition: {
        type: "or",
        conditions: [
          {
            type: "binding-matches",
            binding: "boostBanished",
            filter: { typeBox: { subtypes: ["Item"] } },
          },
          {
            type: "binding-matches",
            binding: "boostBanished",
            filter: { typeBox: { types: ["Equipment"] } },
          },
        ],
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: sprocketRocketRed,
  yellow: sprocketRocketYellow,
  blue: sprocketRocketBlue,
} = sprocketRocket.cards;
