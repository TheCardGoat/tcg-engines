import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hack-to-reality.generated.ts";

export const hackToReality = definePitchFamily(fabPitchFamilies["hack-to-reality"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackTurnGets2Power: {
      kind: "resolution",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          selector: "this-attack",
        },
        duration: "this-turn",
        appliesTo: {
          next: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
      },
    },
    nextTimeHitTurnDestroyNonTokenAuraCostLessThanEqualDamageDealtWay: {
      kind: "resolution",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
            target: {
              kind: "hero",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                  excludeMetatypes: ["Token"],
                },
                cost: {
                  op: "lte",
                  value: {
                    type: "count",
                    what: "damage-dealt",
                    per: "chain-link",
                  },
                },
              },
              count: 1,
            },
          },
        },
      },
    },
  }),
});

export const { yellow: hackToRealityYellow } = hackToReality.cards;
