import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-sentry-base-head.generated.ts";

import { battleworn } from "../shared/keywords.ts";

export const evoSentryBaseHead = definePitchFamily(fabPitchFamilies["evo-sentry-base-head"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseHeadEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed base head; transform the equipped base (CR 8.5.36), not self.
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
  }),
});
export const { red: evoSentryBaseHeadRed } = evoSentryBaseHead.cards;
