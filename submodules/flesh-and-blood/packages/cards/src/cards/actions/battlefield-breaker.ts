import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/battlefield-breaker.generated.ts";

export const battlefieldBreaker = definePitchFamily(fabPitchFamilies["battlefield-breaker"], {
  keywords: [bloodDebt],

  abilities: () => ({
    modifyNumericPower: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "banish-power-6", player: "controller" },
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
  red: battlefieldBreakerRed,
  yellow: battlefieldBreakerYellow,
  blue: battlefieldBreakerBlue,
} = battlefieldBreaker.cards;
