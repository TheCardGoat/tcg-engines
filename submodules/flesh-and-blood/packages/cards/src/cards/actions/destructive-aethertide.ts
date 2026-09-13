import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/destructive-aethertide.generated.ts";

export const destructiveAethertide = definePitchFamily(fabPitchFamilies["destructive-aethertide"], {
  abilities: () => ({
    deal1ArcaneDamageAnyTarget: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    ifDealsMoreThan1DamageHeroDestroyTheir: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: 1 },
        toHero: true,
      },
      effect: {
        type: "destroy",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["arsenal"],
          filter: {},
          count: 1,
        },
      },
      label: {
        name: "surge",
      },
    },
  }),
});
export const { blue: destructiveAethertideBlue } = destructiveAethertide.cards;
