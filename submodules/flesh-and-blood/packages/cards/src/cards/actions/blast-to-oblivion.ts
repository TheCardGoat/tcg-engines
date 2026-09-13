import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blast-to-oblivion.generated.ts";

const abilities = {
  onAttackMoveCard: {
    kind: "static",
    staticKind: "triggered",
    trigger: {
      kind: "event",
      event: {
        name: "attack",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "attack",
        },
      },
    },
    resolution: {
      kind: "effect",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "play",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "event-object",
              selector: "played-card",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  types: ["Instant"],
                },
              },
              bindAs: "it",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-chain-link",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "on-stack",
                player: "any",
                zones: ["permanent"],
                filter: {
                  or: [
                    {
                      typeBox: {
                        subtypes: ["Aura"],
                      },
                      cost: {
                        op: "lte",
                        value: 1,
                      },
                    },
                    {
                      typeBox: {
                        metatypes: ["Token"],
                        subtypes: ["Aura"],
                      },
                    },
                  ],
                },
                count: 1,
              },
              to: {
                zone: "hand",
              },
            },
          },
        },
      },
    },
  },
} as const;

export const blastToOblivion = definePitchFamily(fabPitchFamilies["blast-to-oblivion"], {
  abilities: () => ({ ...abilities }),
});

export const {
  red: blastToOblivionRed,
  yellow: blastToOblivionYellow,
  blue: blastToOblivionBlue,
} = blastToOblivion.cards;
