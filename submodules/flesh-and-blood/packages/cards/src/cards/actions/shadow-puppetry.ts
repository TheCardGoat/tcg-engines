import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/shadow-puppetry.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const shadowPuppetry = definePitchFamily(fabPitchFamilies["shadow-puppetry"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackActionPlayTurnGainsNumber1PowerGoAgainHitsLook: {
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
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: goAgain,
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
            appliesTo: nextAttackActionLatch(),
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsLookAtTopDeckBanish",
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
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: {
                    type: "sequence",
                    steps: [
                      {
                        type: "look",
                        target: {
                          selector: "object",
                          declared: "at-resolution",
                          player: "controller",
                          zones: ["deck"],
                          position: "top",
                          count: 1,
                        },
                        outputBinding: "it",
                      },
                      {
                        type: "optional",
                        effect: {
                          type: "banish",
                          target: {
                            selector: "binding",
                            binding: "it",
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
            appliesTo: nextAttackActionLatch(),
          },
        ],
      },
    },
  }),
});

export const { red: shadowPuppetryRed } = shadowPuppetry.cards;
