import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-beta-base-head.generated.ts";

import { battleworn } from "../shared/keywords.ts";

export const evoBetaBaseHead = definePitchFamily(fabPitchFamilies["evo-beta-base-head"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseHeadEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed "base head" requires Base+Head, not any equipped Head.
      // Transform target is the equipped base (CR 8.5.36 put-under), not the
      // resolving Evo itself — under-zone / non-self transform still §7 OPEN.
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Head"],
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
              zones: ["equipment-head"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Head"],
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
    evoHeadsCostLessPlay: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "cost-reduction",
        filter: {
          typeBox: {
            subtypes: ["Evo", "Head"],
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
export const { blue: evoBetaBaseHeadBlue } = evoBetaBaseHead.cards;
