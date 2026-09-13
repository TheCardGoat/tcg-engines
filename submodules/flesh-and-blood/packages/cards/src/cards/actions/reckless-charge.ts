import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/reckless-charge.generated.ts";

export const recklessCharge = definePitchFamily(fabPitchFamilies["reckless-charge"], {
  keywords: [
    {
      name: "specialization",
      hero: "Kayo",
    },
  ],
  abilities: () => ({
    roll6SidedDieGainActionPointsEqualHalfNumberRolledRoundedDown: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "roll",
            sides: 6,
          },
          {
            type: "gain-action-points",
            amount: {
              type: "roll-result",
              divisor: 2,
              rounding: "down",
            },
          },
        ],
      },
    },
    rolled6DieTurnDraw: {
      kind: "resolution",
      condition: { type: "performed-this-turn", event: "roll-6", player: "controller" },
      effect: {
        type: "draw",
        count: 1,
        player: "controller",
      },
    },
  }),
});

export const { blue: recklessChargeBlue } = recklessCharge.cards;
