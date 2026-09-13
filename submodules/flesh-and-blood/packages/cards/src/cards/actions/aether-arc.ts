import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/aether-arc.generated.ts";

export const aetherArc = definePitchFamily(fabPitchFamilies["aether-arc"], {
  abilities: () => ({
    deal1ArcaneDamageEachOpposingHeroCreatePonder: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "deal-damage",
            damageType: "arcane",
            amount: 1,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["hero"],
              count: {
                type: "all",
              },
            },
          },
          {
            type: "create-token",
            token: "ponder",
            controller: "controller",
            count: {
              type: "count",
              what: "heroes-dealt-damage-this-way",
            },
          },
        ],
      },
    },
  }),
});
export const { blue: aetherArcBlue } = aetherArc.cards;
