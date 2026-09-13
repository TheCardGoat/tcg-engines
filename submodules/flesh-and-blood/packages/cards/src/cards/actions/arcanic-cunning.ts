import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arcanic-cunning.generated.ts";

export const arcanicCunning = definePitchFamily(fabPitchFamilies["arcanic-cunning"], {
  abilities: () => ({
    staticWhileHasStatusAttackingDefendingStackPreventionArcane: {
      kind: "static",
      staticKind: "while",
      condition: {
        type: "has-status",
        status: "attacking-defending-or-on-the-stack",
      },
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 1,
        damageType: "arcane",
        shielded: {
          selector: "controller",
        },
        duration: "while-condition",
      },
    },
  }),
});

export const {
  red: arcanicCunningRed,
  yellow: arcanicCunningYellow,
  blue: arcanicCunningBlue,
} = arcanicCunning.cards;
