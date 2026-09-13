import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-beta-base-chest.generated.ts";

import { battleworn } from "../shared/keywords.ts";

/**
 * PEN069 Evo Beta Base Chest (blue) — Mechanologist Action Evo Base Chest d1.
 *
 * Printed:
 *   If you have a base chest equipped, transform it into this, then equip this.
 *   Evo chests cost you {r} less to play.
 *   Battleworn
 *
 * Model notes (hand-authored; twin of PEN068 head):
 * - Printed "base chest" requires Base+Chest, not any equipped Chest.
 * - Transform target is the equipped base (CR 8.5.36 put-under), not the
 *   resolving Evo itself — under-zone / non-self transform still §7 OPEN.
 */
export const evoBetaBaseChest = definePitchFamily(fabPitchFamilies["evo-beta-base-chest"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseChestEquippedTransformIntoThenEquip: {
      kind: "resolution",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Chest"],
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
              zones: ["equipment-chest"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Chest"],
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
    evoChestsCostLessPlay: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "cost-reduction",
        filter: {
          typeBox: {
            subtypes: ["Evo", "Chest"],
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
export const { blue: evoBetaBaseChestBlue } = evoBetaBaseChest.cards;
