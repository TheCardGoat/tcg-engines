import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/evo-steel-soul-memory.generated.ts";

import { temper } from "../shared/keywords.ts";

export const evoSteelSoulMemory = definePitchFamily(fabPitchFamilies["evo-steel-soul-memory"], {
  keywords: [temper],
  abilities: () => ({
    ifHaveBaseHeadEquippedTransformIntoThenEquip: {
      kind: "resolution",
      // Printed "base head" requires Base+Head, not any equipped Head.
      // Transform target is the equipped base (CR 8.5.36 put-under), not the
      // resolving Evo itself — engine under-zone / evo equip path still partial.
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Base", "Head"],
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
              zones: ["equipment-head"],
              filter: {
                typeBox: {
                  types: ["Equipment"],
                  subtypes: ["Base", "Head"],
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
    whenTransformsFromIntoEvoDifferentNameHeroGets: {
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
            type: "modify-numeric",
            property: "intellect",
            op: "add",
            amount: 1,
            target: {
              selector: "controller",
            },
            duration: "this-turn",
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
export const { blue: evoSteelSoulMemoryBlue } = evoSteelSoulMemory.cards;
