import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-magneto.generated.ts";

import { temper } from "../shared/keywords.ts";

/**
 * HVY248 Evo Magneto (blue) — Mechanologist Action Evo Arms d2 Temper.
 *
 * Printed:
 *   If you have a base arms equipped, transform it into this, then equip this.
 *   When this defends, you may destroy a card under it. If you do, gain control
 *   of target item with cost 0 or 1 controlled by the attacking hero.
 *   Temper
 *
 * Model notes (hand-authored; case-by-case; EVO028 / EVO032 arms siblings):
 * - a1: printed "base arms" requires Base+Arms, not any Arms. Transform target
 *   is the equipped base (CR 8.5.36 put-under), not the resolving Evo itself.
 *   Prior model transformed self + equipped-count without Base.
 * - a2: "When this defends" needs subject:self so co-defenders do not fire.
 *   Destroy under uses zones:["under"] object (selector sub-cards throws).
 *   Item is a type (types:["Item"]), not a subtype; cost ≤1 on the filter.
 * - Play transform/equip and under-destroy → steal remain OPEN on under-zone
 *   architecture (§7 Hyper-X3 / Evo family).
 */
export const evoMagneto = definePitchFamily(fabPitchFamilies["evo-magneto"], {
  keywords: [temper],
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
    whenDefendsMayDestroyUnderIfDoGainControl: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["under"],
              count: 1,
            },
          },
          then: {
            type: "gain-control",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "attacking-hero",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Item"],
                },
                cost: {
                  op: "lte",
                  value: 1,
                },
              },
              count: 1,
            },
            controller: "controller",
          },
        },
      },
    },
  }),
});
export const { blue: evoMagnetoBlue } = evoMagneto.cards;
