import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/reckless-arithmetic.generated.ts";

export const recklessArithmetic = definePitchFamily(fabPitchFamilies["reckless-arithmetic"], {
  abilities: () => ({
    attacksRoll6SidedDieGetsXPowerWhereXNumberRolled: {
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
          type: "sequence",
          steps: [
            {
              type: "roll",
              sides: 6,
            },
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: {
                type: "roll-result",
              },
              target: {
                selector: "self",
              },
              duration: "this-turn",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: recklessArithmeticBlue } = recklessArithmetic.cards;
