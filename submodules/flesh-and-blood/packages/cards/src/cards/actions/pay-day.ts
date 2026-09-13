import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pay-day.generated.ts";

export const payDay = definePitchFamily(fabPitchFamilies["pay-day"], {
  abilities: () => ({
    completedContractTurnCreate4SilverTokens: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "complete-contract", player: "controller" },
      effect: {
        type: "create-token",
        token: "silver",
        controller: "controller",
        count: 4,
      },
    },
  }),
});

export const { blue: payDayBlue } = payDay.cards;
