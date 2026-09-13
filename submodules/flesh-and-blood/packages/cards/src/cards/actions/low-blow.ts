import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/low-blow.generated.ts";

export const lowBlow = definePitchFamily(fabPitchFamilies["low-blow"], {
  abilities: () => ({
    booedTurnGets3Power: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "booed", player: "controller" },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const { red: lowBlowRed } = lowBlow.cards;
