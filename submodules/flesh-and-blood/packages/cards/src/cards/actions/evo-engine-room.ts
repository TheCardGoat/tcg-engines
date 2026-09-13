import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-engine-room.generated.ts";

import { bladeBreak } from "../shared/keywords.ts";

/**
 * EVO035 Evo Engine Room (yellow) — Mechanologist Action Evo Chest d3.
 *
 * Printed:
 *   If you have a base chest equipped, transform it into this, then equip this.
 *   Once per Turn Instant - Destroy a card under this: Your next weapon attack
 *   this turn costs {r} less to activate.
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - Printed "base chest" requires Base+Chest; transform targets the equipped
 *   base in equipment-chest (CR 8.5.36), not self / any Chest.
 * - "weapon attack" appliesTo must use types:["Weapon"] — Weapon is FAB_TYPES,
 *   not a subtype (subtypes:["Weapon"] never matches matchesFilter vocabulary).
 * - a2 destroy-under cost needs under-zone cards after a real transform (§7).
 */
export const evoEngineRoom = definePitchFamily(fabPitchFamilies["evo-engine-room"], {
  keywords: [bladeBreak],
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
    oncePerTurnInstantDestroyUnderNextWeaponAttack: {
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
        type: "modify-activation-cost",
        op: "subtract",
        amount: 1,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              types: ["Weapon"],
            },
          },
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});
export const { yellow: evoEngineRoomYellow } = evoEngineRoom.cards;
