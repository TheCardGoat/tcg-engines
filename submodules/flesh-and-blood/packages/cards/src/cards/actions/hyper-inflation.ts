import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hyper-inflation.generated.ts";

export const hyperInflation = definePitchFamily(fabPitchFamilies["hyper-inflation"], {
  keywords: [goAgain],

  abilities: () => ({
    triggeredAttackModifyNumericCostAllThisTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "cost",
          op: "add",
          amount: 1,
          target: {
            selector: "object",
            declared: "at-resolution",
            zones: ["hand"],
            count: {
              type: "all",
            },
          },
          duration: "this-turn",
        },
      },
    },
  }),
});
export const {
  red: hyperInflationRed,
  yellow: hyperInflationYellow,
  blue: hyperInflationBlue,
} = hyperInflation.cards;
