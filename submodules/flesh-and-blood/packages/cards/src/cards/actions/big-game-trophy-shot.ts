import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/big-game-trophy-shot.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bigGameTrophyShot = definePitchFamily(fabPitchFamilies["big-game-trophy-shot"], {
  keywords: [goAgain],
  abilities: () => ({
    nextArrowAttackTurnGets4IfHasHarpoon: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 4,
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
                id: "whenHitsHeroCreateGoldToken",
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
                    type: "create-token",
                    token: "gold",
                    controller: "controller",
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
                nameContains: "Harpoon",
              },
            },
          },
        ],
      },
    },
    drawThenDiscard: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
            },
            outputBinding: "it",
          },
        ],
      },
    },
  }),
});
export const { yellow: bigGameTrophyShotYellow } = bigGameTrophyShot.cards;
