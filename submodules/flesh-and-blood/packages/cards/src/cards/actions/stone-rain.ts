import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/stone-rain.generated.ts";
import { dominate } from "../shared/keywords.ts";

export const stoneRain = definePitchFamily(fabPitchFamilies["stone-rain"], {
  keywords: [dominate],
  abilities: () => ({
    hasAimCounterGetsDominateWhenHitsHeroTheyBanishFaceDown: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-counter",
        counter: {
          kind: "named",
          name: "aim",
        },
        target: {
          selector: "self",
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: dominate,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroTheyBanishFaceDownFromTheirHandAtBeginning",
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
                    type: "sequence",
                    steps: [
                      {
                        type: "banish",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "opponent",
                          zones: ["hand"],
                          count: 1,
                        },
                        faceDown: true,
                        outputBinding: "it",
                      },
                      {
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
                            type: "move-card",
                            target: {
                              selector: "binding",
                              binding: "it",
                            },
                            to: {
                              zone: "hand",
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});

export const { red: stoneRainRed } = stoneRain.cards;
