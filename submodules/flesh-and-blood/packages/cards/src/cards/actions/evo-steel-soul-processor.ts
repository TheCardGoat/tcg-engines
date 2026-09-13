import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-steel-soul-processor.generated.ts";

import { temper } from "../shared/keywords.ts";

/**
 * EVO027 Evo Steel Soul Processor (blue) — Mechanologist Action Evo Base Chest d3.
 *
 * Printed:
 *   If you have a base chest equipped, transform it into this, then equip this.
 *   When this transforms from or into an Evo with a different name, gain
 *   {r}{r}{r}. If that Evo is a hero, instead this triggers twice.
 *   Temper
 *
 * Model notes (hand-authored, sibling of EVO026 Steel Soul Memory):
 * - Printed "base chest" requires Base+Chest, not any Chest.
 * - Transform target is the equipped base (CR 8.5.36 put-under), not self.
 * - Play transform+equip and a2 RP gain blocked on under-zone architecture.
 */
export const evoSteelSoulProcessor = definePitchFamily(
  fabPitchFamilies["evo-steel-soul-processor"],
  {
    keywords: [temper],
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
      whenTransformsFromIntoEvoDifferentNameGainIf: {
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
              type: "gain-resources",
              amount: 3,
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
export const { blue: evoSteelSoulProcessorBlue } = evoSteelSoulProcessor.cards;
