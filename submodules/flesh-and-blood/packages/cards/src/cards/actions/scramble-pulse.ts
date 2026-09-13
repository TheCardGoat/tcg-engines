import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/scramble-pulse.generated.ts";
import { boost } from "../shared/keywords.ts";

export const scramblePulse = definePitchFamily(fabPitchFamilies["scramble-pulse"], {
  keywords: [boost],
  abilities: () => ({
    resolutionModifyNumeric: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "defense",
        op: "subtract",
        amount: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
            defending: true,
          },
          count: {
            type: "all",
          },
        },
        duration: "this-combat-chain",
      },
    },
  }),
});

export const {
  red: scramblePulseRed,
  yellow: scramblePulseYellow,
  blue: scramblePulseBlue,
} = scramblePulse.cards;
