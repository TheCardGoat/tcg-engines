import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-cogspitter.generated.ts";

import { bladeBreak } from "../shared/keywords.ts";

/**
 * EVO048 Evo Cogspitter (yellow) — Mechanologist Action Evo Arms d2.
 *
 * Printed:
 *   If you have a base arms equipped, transform it into this, then equip this.
 *   Once per Turn Instant - Destroy a card under this: Put an item with cost 0
 *   or 1 from your hand into the arena.
 *   Blade Break
 *
 * Model: Base+Arms transform object; Item filter uses types:["Item"] (subtype
 * Item also works; types path matches type-line). Play transform + Instant OPEN under-zone.
 */
export const evoCogspitter = definePitchFamily(fabPitchFamilies["evo-cogspitter"], {
  keywords: [bladeBreak],
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
    oncePerTurnInstantDestroyUnderPutItemCost: {
      kind: "activated",
      limit: { count: 1, per: "turn" },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "destroy",
        from: "under-this",
      },
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hand"],
          filter: {
            typeBox: {
              subtypes: ["Item"],
            },
            cost: { op: "lte", value: 1 },
          },
          count: 1,
        },
        to: { zone: "permanent" },
      },
      label: { name: "transform" },
    },
  }),
});
export const { yellow: evoCogspitterYellow } = evoCogspitter.cards;
