import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/arcanic-spike.generated.ts";

export const arcanicSpike = definePitchFamily(fabPitchFamilies["arcanic-spike"], {
  abilities: () => ({
    resolutionDamageDealtArcaneModifyNumericPower: {
      kind: "resolution",
      condition: {
        type: "damage-dealt",
        damageType: "arcane",
        player: "controller",
        per: "turn",
        comparison: {
          op: "gte",
          value: 1,
        },
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
  red: arcanicSpikeRed,
  yellow: arcanicSpikeYellow,
  blue: arcanicSpikeBlue,
} = arcanicSpike.cards;
