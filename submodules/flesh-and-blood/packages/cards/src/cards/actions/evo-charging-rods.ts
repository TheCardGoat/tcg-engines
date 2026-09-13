import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-charging-rods.generated.ts";

import { bladeBreak } from "../shared/keywords.ts";

export const evoChargingRods = definePitchFamily(fabPitchFamilies["evo-charging-rods"], {
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
    oncePerTurnInstantDestroyUnderCreateQuickenToken: {
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
        type: "create-token",
        token: "quicken",
        controller: "controller",
      },
      label: {
        name: "transform",
      },
    },
  }),
});
export const { yellow: evoChargingRodsYellow } = evoChargingRods.cards;
