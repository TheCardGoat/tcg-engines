import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/drop-the-anchor.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const dropTheAnchor = definePitchFamily(fabPitchFamilies["drop-the-anchor"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGets3WhenHitsHero: {
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
                id: "whenHitsHeroThemAllAlliesTheyControl",
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
                        type: "tap",
                        target: {
                          selector: "attack-target",
                        },
                      },
                      {
                        type: "tap",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "opponent",
                          zones: ["permanent"],
                          filter: {
                            typeBox: {
                              subtypes: ["Ally"],
                            },
                          },
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
export const { red: dropTheAnchorRed } = dropTheAnchor.cards;
