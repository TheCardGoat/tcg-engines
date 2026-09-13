import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rune-flash.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const runeFlash = definePitchFamily(fabPitchFamilies["rune-flash"], {
  keywords: [goAgain],
  parameters: {
    red: { duration: "while-in-arena", self: true },
    yellow: { duration: "permanent", self: false },
    blue: { duration: "while-in-arena", self: true },
  },
  abilities: ({ duration }) => ({
    continuousModifyNumericCostCountRunechant: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "cost",
        op: "subtract",
        amount: {
          type: "count",
          what: "cards-in-zone",
          zone: "permanent",
          player: "controller",
          filter: {
            // CR 8.6.3: the engine token's name is "Runechant" (exact match);
            // "Runechant Token" never matched and the discount stayed 0 (W1-FIX, §5).
            name: "Runechant",
          },
        },
        target: {
          selector: "self",
        },
        duration,
      },
    },
  }),
});

export const { red: runeFlashRed, yellow: runeFlashYellow, blue: runeFlashBlue } = runeFlash.cards;
