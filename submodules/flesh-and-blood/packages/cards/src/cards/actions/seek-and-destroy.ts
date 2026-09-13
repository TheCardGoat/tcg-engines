import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/seek-and-destroy.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const seekAndDestroy = definePitchFamily(fabPitchFamilies["seek-and-destroy"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGainsNumber3PowerHitsHeroAtBeginningTheir: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 3,
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
              },
            },
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "hitsHeroAtBeginningTheirNextEndPhaseTheyDiscardAllIn",
                text: "",
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
                    type: "delayed-trigger",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "end-phase",
                        actor: {
                          kind: "player",
                          player: "opponent",
                        },
                        observes: {
                          kind: "none",
                        },
                      },
                    },
                    policy: {
                      kind: "windowed",
                      duration: "during-their-next-end-phase",
                      matching: "first",
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "sequence",
                        steps: [
                          {
                            type: "discard",
                            target: {
                              selector: "object",
                              declared: "at-resolution",
                              player: "attack-target",
                              zones: ["hand"],
                              count: {
                                type: "all",
                              },
                            },
                          },
                          {
                            type: "destroy",
                            target: {
                              selector: "object",
                              declared: "at-resolution",
                              player: "opponent",
                              zones: ["arsenal"],
                              count: {
                                type: "all",
                              },
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
              },
            },
          },
        ],
      },
    },
  }),
});

export const { red: seekAndDestroyRed } = seekAndDestroy.cards;
