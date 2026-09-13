import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/excessive-bloodloss.generated.ts";
const abilities = {
  establishContract: {
    kind: "resolution",
    effect: {
      type: "contract-task",
      task: "banish opponents' red cards",
      completeOn: "banish",
      filter: {
        color: ["red"],
      },
    },
    label: {
      name: "contract",
    },
  },
  createSilverOnContractCompletion: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "complete-contract",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "none",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "create-token",
        token: "silver",
        controller: "controller",
      },
    },
    label: {
      name: "contract",
    },
  },
  onHitBanish: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "hit",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "attack",
        },
        target: {
          kind: "hero",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: {
                color: ["red"],
              },
            },
            then: {
              type: "repeat",
              effect: {
                type: "banish",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                outputBinding: "it",
              },
              times: 1,
            },
          },
        ],
      },
    },
  },
} as const;
export const excessiveBloodloss = definePitchFamily(fabPitchFamilies["excessive-bloodloss"], {
  abilities: () => ({ ...abilities }),
});
export const {
  red: excessiveBloodlossRed,
  yellow: excessiveBloodlossYellow,
  blue: excessiveBloodlossBlue,
} = excessiveBloodloss.cards;
