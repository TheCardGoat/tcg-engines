import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/barbed-barrage.generated.ts";

export const barbedBarrage = definePitchFamily(fabPitchFamilies["barbed-barrage"], {
  abilities: () => ({
    asAdditionalCostPlayMayPayIfDoAttacks: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "additional-cost",
        cost: {
          class: "asset",
          type: "resources",
          amount: 3,
        },
        optional: true,
        then: {
          type: "rule-modification",
          mode: "allow",
          action: "attack-target",
          target: "additional-hero",
          duration: "this-turn",
        },
      },
    },
  }),
});
export const { red: barbedBarrageRed } = barbedBarrage.cards;
