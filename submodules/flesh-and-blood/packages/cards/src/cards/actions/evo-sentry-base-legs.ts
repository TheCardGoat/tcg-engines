import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-sentry-base-legs.generated.ts";

import { battleworn } from "../shared/keywords.ts";

export const evoSentryBaseLegs = definePitchFamily(fabPitchFamilies["evo-sentry-base-legs"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseLegsEquippedTransformIntoThenEquip: {
      kind: "resolution",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Legs"],
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
              selector: "self",
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
export const { red: evoSentryBaseLegsRed } = evoSentryBaseLegs.cards;
