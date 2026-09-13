import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-sentry-base-chest.generated.ts";

import { battleworn } from "../shared/keywords.ts";

/**
 * EVO043 Evo Sentry Base Chest (red) — Mechanologist Action Evo Base Chest d2.
 *
 * Printed:
 *   If you have a base chest equipped, transform it into this, then equip this.
 *   Battleworn
 *
 * Model notes (hand-authored; chest sibling of EVO042 Sentry Base Head):
 * - Printed "base chest" requires Base+Chest, not any Chest.
 * - Transform targets the equipped base in equipment-chest (CR 8.5.36), not self.
 * - Play transform/equip blocked on under-zone architecture (§7).
 */
export const evoSentryBaseChest = definePitchFamily(fabPitchFamilies["evo-sentry-base-chest"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseChestEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed base chest; transform the equipped base (CR 8.5.36), not self.
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
  }),
});
export const { red: evoSentryBaseChestRed } = evoSentryBaseChest.cards;
