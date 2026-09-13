import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/eternal-inferno.generated.ts";

export const eternalInferno = definePitchFamily(fabPitchFamilies["eternal-inferno"], {
  abilities: () => ({
    deal4ArcaneDamageAnyTarget: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 4,
        target: {
          selector: "object",
          declared: "on-stack",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    },
    ifDealsMoreThan4DamageBanishMayPlay: {
      kind: "resolution",
      condition: {
        type: "source-damage-dealt",
        per: "turn",
        comparison: { op: "gt", value: 4 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "self",
            },
            outputBinding: "it",
          },
          {
            type: "play-card",
            fromZones: ["banished"],
            source: {
              selector: "binding",
              binding: "it",
            },
            duration: "this-turn",
          },
        ],
      },
      label: {
        name: "surge",
      },
    },
  }),
});
export const { red: eternalInfernoRed } = eternalInferno.cards;
