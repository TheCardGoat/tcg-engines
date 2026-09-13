import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-thruster.generated.ts";

import { bladeBreak } from "../shared/keywords.ts";

export const evoThruster = definePitchFamily(fabPitchFamilies["evo-thruster"], {
  keywords: [bladeBreak],
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
    oncePerTurnInstantDestroyUnderMayAttackAdditional: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy",
        from: "under-this",
      },
      effect: {
        type: "modify-activation-limit",
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["weapon"],
          count: 1,
        },
        operation: "additional",
        count: 1,
        duration: "this-turn",
      },
      label: {
        name: "transform",
      },
    },
  }),
});
export const { yellow: evoThrusterYellow } = evoThruster.cards;
