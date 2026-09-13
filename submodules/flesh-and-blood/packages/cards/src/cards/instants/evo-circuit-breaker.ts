import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-circuit-breaker.generated.ts";

export const evoCircuitBreaker = definePitchFamily(fabPitchFamilies["evo-circuit-breaker"], {
  abilities: () => ({
    ifHaveBaseHeadEquippedTransformXHyperDrivers: {
      kind: "resolution",
      // Printed base head + multi-object transform (CR 8.5.36d). Engine under-zone
      // / non-self transform still partial (§7). Prevention 2X rides successful equip.
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
                type: "transform",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    name: "Hyper Driver",
                  },
                  count: {
                    type: "x",
                  },
                },
                into: "this",
              },
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
              amount: {
                type: "double",
                operands: [
                  {
                    type: "x",
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
