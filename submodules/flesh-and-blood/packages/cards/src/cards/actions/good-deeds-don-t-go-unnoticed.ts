import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/good-deeds-don-t-go-unnoticed.generated.ts";

/**
 * LSS006 Good Deeds Don't Go Unnoticed — Generic Yellow Action Aura 0-cost d3.
 *
 * Printed:
 *   At the start of each other hero's turn, choose 1; they draw a card, they
 *   gain {r}, they gain 1{h}, or their next attack this turn gains +1{p}.
 *   At the start of your turn, destroy this. If another hero drew a card from
 *   this, you draw a card, then repeat for {r}, {h}, and {p}.
 *
 * Model notes (hand-authored):
 * - 1v1 product scope: "each other hero" is the single opponent — start-phase
 *   actor "opponent" (Silver Palms EVR086 idiom).
 * - Unqualified "choose 1" is answered by the aura's controller (CR 1.7.5),
 *   the gift-giver; contrast ELE000 Korshem which prints "they choose".
 * - The mirror sentence ("If another hero drew a card from this, …") has no
 *   engine condition primitive (cross-turn causal history), so each chosen
 *   mode also schedules its mirror as a delayed-triggered effect (CR 6.6.3,
 *   one-shot trigger on the controller's next turn start. Equivalent in 1v1:
 *   exactly one opponent turn intervenes before the mandatory self-destroy,
 *   and a delayed trigger needs no arena source to fire.
 * - "Their next attack this turn gains +1{p}" observes the opponent's attacks
 *   via appliesTo.next hasStatus "another" (Heart of Ice ELE144 idiom); the
 *   controller-side mirror uses the own-side next-attack latch (ELE152).
 */
export const goodDeedsDonTGoUnnoticed = definePitchFamily(
  fabPitchFamilies["good-deeds-don-t-go-unnoticed"],
  {
    abilities: () => ({
      atStartEachOtherHeroSTurnChoose1: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "start-phase",
            actor: {
              kind: "player",
              player: "opponent",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: semanticTriggeredModalResolution({
          kind: "modal",
          choose: 1,
          modes: {
            theyDraw: {
              kind: "resolution",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "draw",
                    count: 1,
                    player: "opponent",
                  },
                  {
                    type: "delayed-trigger",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "start-phase",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "none",
                        },
                      },
                    },
                    policy: {
                      kind: "windowed",
                      duration: "until-start-of-own-next-turn",
                      matching: "first",
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "draw",
                        count: 1,
                        player: "controller",
                      },
                    },
                  },
                ],
              },
            },
            theyGain: {
              kind: "resolution",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "gain-resources",
                    amount: 1,
                    target: "opponent",
                  },
                  {
                    type: "delayed-trigger",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "start-phase",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "none",
                        },
                      },
                    },
                    policy: {
                      kind: "windowed",
                      duration: "until-start-of-own-next-turn",
                      matching: "first",
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "gain-resources",
                        amount: 1,
                        target: "controller",
                      },
                    },
                  },
                ],
              },
            },
            theyGain1: {
              kind: "resolution",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "gain-life",
                    amount: 1,
                    target: {
                      selector: "opponent",
                    },
                  },
                  {
                    type: "delayed-trigger",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "start-phase",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "none",
                        },
                      },
                    },
                    policy: {
                      kind: "windowed",
                      duration: "until-start-of-own-next-turn",
                      matching: "first",
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "gain-life",
                        amount: 1,
                        target: {
                          selector: "controller",
                        },
                      },
                    },
                  },
                ],
              },
            },
            theirNextAttackTurnGains1: {
              kind: "resolution",
              effect: {
                type: "sequence",
                steps: [
                  {
                    type: "modify-numeric",
                    property: "power",
                    op: "add",
                    amount: 1,
                    target: {
                      selector: "self",
                    },
                    duration: "this-turn",
                    appliesTo: {
                      next: {
                        and: [
                          {
                            typeBox: {
                              subtypes: ["Attack"],
                            },
                          },
                          {
                            hasStatus: "another",
                          },
                        ],
                      },
                    },
                  },
                  {
                    type: "delayed-trigger",
                    trigger: {
                      kind: "event",
                      event: {
                        name: "start-phase",
                        actor: {
                          kind: "player",
                          player: "ability-controller",
                        },
                        observes: {
                          kind: "none",
                        },
                      },
                    },
                    policy: {
                      kind: "windowed",
                      duration: "until-start-of-own-next-turn",
                      matching: "first",
                    },
                    resolution: {
                      kind: "effect",
                      effect: {
                        type: "modify-numeric",
                        property: "power",
                        op: "add",
                        amount: 1,
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
                  },
                ],
              },
            },
          },
        }),
      },
      atStartTurnDestroyIfAnotherHeroDrewFrom: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "start-phase",
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
            type: "destroy",
            target: {
              selector: "self",
            },
          },
        },
      },
    }),
  },
);
export const { yellow: goodDeedsDonTGoUnnoticedYellow } = goodDeedsDonTGoUnnoticed.cards;
