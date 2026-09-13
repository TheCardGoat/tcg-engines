import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/rising-power.generated.ts";

export const risingPower = definePitchFamily(fabPitchFamilies["rising-power"], {
  supertypeSets: [["Brute"], ["Guardian"]],
  abilities: () => ({
    performedThisTurnDrawModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "draw", player: "controller" },
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
  red: risingPowerRed,
  yellow: risingPowerYellow,
  blue: risingPowerBlue,
} = risingPower.cards;
