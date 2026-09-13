import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/salt-the-wound.generated.ts";

export const saltTheWound = definePitchFamily(fabPitchFamilies["salt-the-wound"], {
  abilities: () => ({
    getsNumber1PowerForEachAttackHasHitCombatChain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "attacks-hit-this-combat-chain",
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const { yellow: saltTheWoundYellow } = saltTheWound.cards;
