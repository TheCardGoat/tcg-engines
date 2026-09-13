import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-steel-soul-controller.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { temper } from "../shared/keywords.ts";

/**
 * EVO028 Evo Steel Soul Controller (blue) — Mechanologist Action Evo Base Arms d3.
 *
 * Printed:
 *   If you have base arms equipped, transform it into this, then equip this.
 *   When this transforms from or into an Evo with a different name, you may put
 *   an attack action card with 6{p} from your graveyard into your deck fifth
 *   from the top. If that Evo is a hero, instead this triggers twice.
 *   Temper
 *
 * Model notes (hand-authored; EVO026 Memory / EVO027 Processor siblings):
 * - Prior a1 transformed self into this under fake has-status base-arms-equipped.
 *   Printed "base arms" requires Base+Arms; transform target is the equipped
 *   base (CR 8.5.36 put-under), not the resolving Evo itself.
 * - a2 optional GY AAC p6 → deck index 5; double when transformed-evo-is-hero.
 * - Play transform+equip and a2 GY tuck blocked on under-zone architecture.
 */
export const evoSteelSoulController = definePitchFamily(
  fabPitchFamilies["evo-steel-soul-controller"],
  {
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
      whenTransformsFromIntoEvoDifferentNameMayPut: {
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
              type: "optional",
              effect: {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["graveyard"],
                  filter: attackActionFilter({
                    power: {
                      op: "eq",
                      value: 6,
                    },
                  }),
                  count: 1,
                },
                to: {
                  zone: "deck",
                  position: {
                    index: 5,
                  },
                },
              },
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
  },
);
export const { blue: evoSteelSoulControllerBlue } = evoSteelSoulController.cards;
