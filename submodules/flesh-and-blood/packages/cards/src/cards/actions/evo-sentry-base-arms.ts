import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-sentry-base-arms.generated.ts";

import { battleworn } from "../shared/keywords.ts";

/**
 * EVO044 Evo Sentry Base Arms (red) — Mechanologist Action Evo Base Arms d2.
 *
 * Printed: If you have a base arms equipped, transform it into this, then equip this.
 * Battleworn
 *
 * Model: Base+Arms transform object on equipment-arms (was self/any Arms).
 * Play transform OPEN under-zone.
 */
export const evoSentryBaseArms = definePitchFamily(fabPitchFamilies["evo-sentry-base-arms"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseArmsEquippedTransformIntoThenEquip: {
      kind: "resolution",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Arms"],
          },
        },
        comparison: { op: "gte", value: 1 },
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
            target: { selector: "self" },
          },
        ],
      },
      label: { name: "transform" },
    },
  }),
});
export const { red: evoSentryBaseArmsRed } = evoSentryBaseArms.cards;
