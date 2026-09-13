import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/push-the-point.generated.ts";

export const pushThePoint = definePitchFamily(fabPitchFamilies["push-the-point"], {
  abilities: () => ({
    hasStatusLastAttackOnCombatChainHitModifyNumericPowerThisTurn: {
      kind: "resolution",
      condition: {
        type: "has-status",
        status: "last-attack-on-combat-chain-hit",
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
    },
  }),
});

export const {
  red: pushThePointRed,
  yellow: pushThePointYellow,
  blue: pushThePointBlue,
} = pushThePoint.cards;
