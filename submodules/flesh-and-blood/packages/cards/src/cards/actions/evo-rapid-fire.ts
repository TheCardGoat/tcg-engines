import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-rapid-fire.generated.ts";

import { battleworn, goAgain } from "../shared/keywords.ts";

export const evoRapidFire = definePitchFamily(fabPitchFamilies["evo-rapid-fire"], {
  keywords: [battleworn],
  abilities: () => ({
    ifHaveBaseLegsEquippedTransformIntoThenEquip: {
      kind: "resolution",
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
    tekloBlasterAttacksGetGoAgain: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: goAgain,
        },
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["combat-chain"],
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
export const { blue: evoRapidFireBlue } = evoRapidFire.cards;
