import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-circuit-breaker.generated.ts";

export const evoCircuitBreaker = definePitchFamily(fabPitchFamilies["evo-circuit-breaker"], {
  abilities: () => ({
    ifHaveBaseHeadEquippedTransformXHyperDrivers: {
      kind: "resolution",
      // CR 8.5.36d: choose X Drivers, then transform all sources atomically.
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
              zones: ["equipment-head"],
              filter: { typeBox: { types: ["Equipment"], subtypes: ["Base", "Head"] } },
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
    wheneverBoostMayDestroyUnderIfDoShuffle2: {
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
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["banished"],
                  // Attack action: Action is a type; Attack is the subtype.
                  filter: attackActionFilter(),
                  count: 2,
                },
                to: {
                  zone: "deck",
                },
              },
              {
                type: "shuffle",
                zone: "deck",
              },
            ],
          },
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});

export const { red: evoCircuitBreakerRed } = evoCircuitBreaker.cards;
