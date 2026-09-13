import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-steel-soul-tower.generated.ts";

import { temper } from "../shared/keywords.ts";

/**
 * EVO029 Evo Steel Soul Tower (blue) — Mechanologist Action Evo Base Legs d3.
 *
 * Printed:
 *   If you have a base legs equipped, transform it into this, then equip this.
 *   When this transforms from or into an Evo with a different name, gain 1
 *   action point. If that Evo is a hero, instead this triggers twice.
 *   Temper
 *
 * Model notes (hand-authored; EVO026–028 Steel Soul siblings):
 * - Prior a1 transformed self into this under an Equipment+Legs count (any
 *   legs). Printed "base legs" requires Base+Legs; transform target is the
 *   equipped base (CR 8.5.36 put-under), not the resolving Evo itself.
 * - a2 is source-bound ("When THIS transforms", CR 8.5.36a) with the partner
 *   identity filtered via transformPartner. Release Notes — Bright Lights:
 *   does not trigger from a Base-only (non-Evo) partner; "triggers twice"
 *   when the partner Evo is a hero is modeled as the resolution repeat ×2.
 */
export const evoSteelSoulTower = definePitchFamily(fabPitchFamilies["evo-steel-soul-tower"], {
  keywords: [temper],
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
    whenTransformsFromIntoEvoDifferentNameGain1: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "transform",
              actor: { kind: "any" },
              observes: { kind: "source", selector: "object" },
              transformPartner: {
                typeBox: { subtypes: ["Evo"] },
                hasStatus: "different-name",
              },
            },
            {
              name: "transform",
              actor: { kind: "any" },
              observes: { kind: "source", selector: "incoming-object" },
              transformPartner: {
                typeBox: { subtypes: ["Evo"] },
                hasStatus: "different-name",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "repeat",
          effect: {
            type: "gain-action-points",
            amount: 1,
          },
          times: {
            type: "conditional",
            condition: {
              type: "has-status",
              status: "transformed-evo-is-hero",
            },
            then: 2,
            else: 1,
          },
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});
export const { blue: evoSteelSoulTowerBlue } = evoSteelSoulTower.cards;
