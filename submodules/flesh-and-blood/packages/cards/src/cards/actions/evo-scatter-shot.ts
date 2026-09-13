import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-scatter-shot.generated.ts";

import { battleworn } from "../shared/keywords.ts";

export const evoScatterShot = definePitchFamily(fabPitchFamilies["evo-scatter-shot"], {
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
    tekloBlasterGets1EachOpposingHero: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: {
          type: "count",
          what: "heroes",
          player: "opponent",
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Teklo Blaster",
          },
          count: {
            type: "all",
          },
        },
        duration: "while-in-arena",
      },
      label: {
        name: "transform",
      },
    },
  }),
});
export const { blue: evoScatterShotBlue } = evoScatterShot.cards;
