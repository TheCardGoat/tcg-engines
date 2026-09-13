import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/evo-atom-breaker.generated.ts";

export const evoAtomBreaker = definePitchFamily(fabPitchFamilies["evo-atom-breaker"], {
  abilities: () => ({
    ifHaveBaseChestEquippedTransformXHyperDrivers: {
      kind: "resolution",
      // Printed base chest + multi-object transform (CR 8.5.36d). Engine under-zone
      // / non-self transform still partial (§7). Prevention 2X rides successful equip.
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
