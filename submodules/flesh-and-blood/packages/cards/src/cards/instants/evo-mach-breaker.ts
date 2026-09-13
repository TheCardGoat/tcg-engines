import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-mach-breaker.generated.ts";

export const evoMachBreaker = definePitchFamily(fabPitchFamilies["evo-mach-breaker"], {
  abilities: () => ({
    ifHaveBaseLegsEquippedTransformXHyperDrivers: {
      kind: "resolution",
      condition: {
        type: "equipped-count",
        filter: {
          typeBox: {
            types: ["Equipment"],
            subtypes: ["Legs"],
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
                  selector: "self",
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
    wheneverBoostMayDestroyUnderIfDoCreateQuicken: {
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
            type: "create-token",
            token: "quicken",
            controller: "controller",
          },
        },
      },
      label: {
        name: "transform",
      },
    },
  }),
});

export const { red: evoMachBreakerRed } = evoMachBreaker.cards;
