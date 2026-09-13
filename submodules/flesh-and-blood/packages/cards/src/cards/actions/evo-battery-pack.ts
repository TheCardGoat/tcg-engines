import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-battery-pack.generated.ts";

import { bladeBreak } from "../shared/keywords.ts";

/**
 * EVO047 Evo Battery Pack (yellow) — Mechanologist Action Evo Chest d2.
 *
 * Printed:
 *   If you have a base chest equipped, transform it into this, then equip this.
 *   Once per Turn Instant - Destroy a card under this: Put a steam counter on an
 *   item you control with crank.
 *   Blade Break
 *
 * Model notes (hand-authored):
 * - Printed "base chest" → Base+Chest + transform equipped base (not self).
 * - a2 steam target: Item is FAB_SUBTYPES; hasKeyword crank is correct.
 * - Destroy-under cost + transform play blocked on under-zone (§7).
 */
export const evoBatteryPack = definePitchFamily(fabPitchFamilies["evo-battery-pack"], {
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
    oncePerTurnInstantDestroyUnderPutSteamCounter: {
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
        type: "add-counter",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: 1,
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["permanent"],
          filter: {
            typeBox: {
              subtypes: ["Item"],
            },
            hasKeyword: "crank",
          },
          count: 1,
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});
export const { yellow: evoBatteryPackYellow } = evoBatteryPack.cards;
