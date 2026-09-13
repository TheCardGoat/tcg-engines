import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-beta-base-arms.generated.ts";

import { battleworn } from "../shared/keywords.ts";

export const evoBetaBaseArms = definePitchFamily(fabPitchFamilies["evo-beta-base-arms"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseArmsEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed "base arms" requires Base+Arms, not any equipped Arms.
      // Transform target is the equipped base (CR 8.5.36 put-under), not self.
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Arms"],
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
              zones: ["equipment-arms"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Arms"],
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
    evoArmsCostLessPlay: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "cost-reduction",
        filter: {
          typeBox: {
            subtypes: ["Evo", "Arms"],
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
export const { blue: evoBetaBaseArmsBlue } = evoBetaBaseArms.cards;
