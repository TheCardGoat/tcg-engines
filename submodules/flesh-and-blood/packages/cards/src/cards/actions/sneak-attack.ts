import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sneak-attack.generated.ts";

export const sneakAttack = definePitchFamily(fabPitchFamilies["sneak-attack"], {
  abilities: () => ({
    gainPowerAfterAttackReactionPlayed: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "compare-amount",
        amount: {
          type: "count",
          what: "attack-reactions-this-chain-link",
        },
        comparison: { op: "gte", value: 1 },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        target: {
          selector: "self",
        },
        duration: "permanent",
      },
    },
  }),
});
export const {
  red: sneakAttackRed,
  yellow: sneakAttackYellow,
  blue: sneakAttackBlue,
} = sneakAttack.cards;
