import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-atom-breaker.generated.ts";

export const evoAtomBreaker = definePitchFamily(fabPitchFamilies["evo-atom-breaker"], {
  abilities: () => ({
    ifHaveBaseChestEquippedTransformXHyperDrivers: {
      kind: "resolution",
      // CR 8.5.36d: choose X Drivers, then transform all sources atomically.
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
            type: "choose-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["permanent"],
              filter: { name: "Hyper Driver" },
              count: { type: "any-number" },
            },
            outputBinding: "evo-drivers",
          },
          {
            type: "transform-into-resolving-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["equipment-chest"],
              filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Chest"] } },
              count: 1,
            },
            additionalTargets: [
              { selector: "binding", binding: "evo-drivers", count: { type: "any-number" } },
            ],
          },
          {
            type: "if-you-do",
            effect: {
              type: "equip",
              target: {
                selector: "self",
              },
            },
            then: {
              type: "prevention",
              preventionKind: "fixed",
              times: 1,
              amount: {
                type: "double",
                operands: [
                  {
                    type: "count",
                    what: "objects-under-source",
                    filter: { name: "Hyper Driver" },
                  },
                ],
              },
              shielded: {
                selector: "controller",
              },
              duration: "this-turn",
            },
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
    wheneverBoostMayDestroyUnderIfDoGain: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "boost",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
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
            type: "gain-resources",
            amount: 2,
          },
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});

export const { red: evoAtomBreakerRed } = evoAtomBreaker.cards;
