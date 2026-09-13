import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-beta-base-legs.generated.ts";

import { battleworn } from "../shared/keywords.ts";

export const evoBetaBaseLegs = definePitchFamily(fabPitchFamilies["evo-beta-base-legs"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseLegsEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed "base legs" requires Base+Legs, not any equipped Legs.
      // Transform target is the equipped base (CR 8.5.36 put-under), not self.
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Legs"],
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "transform",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-legs"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Legs"],
                },
              },
              count: 1,
            },
            into: "this",
          },
          {
            type: "equip",
            target: {
              selector: "self",
            },
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
    evoLegsCostLessPlay: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "cost-reduction",
        filter: {
          typeBox: {
            subtypes: ["Evo", "Legs"],
          },
        },
        cost: {
          class: "asset",
          type: "resources",
          amount: 1,
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});
export const { blue: evoBetaBaseLegsBlue } = evoBetaBaseLegs.cards;
