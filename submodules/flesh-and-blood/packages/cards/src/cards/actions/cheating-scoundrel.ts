import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/cheating-scoundrel.generated.ts";

import { nextAttackActionLatch } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const cheatingScoundrel = definePitchFamily(fabPitchFamilies["cheating-scoundrel"], {
  keywords: [goAgain],
  abilities: () => ({
    nextAttackActionPlayTurnGets3WhenAttacks: {
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
            appliesTo: nextAttackActionLatch(),
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenAttacksWagerDefendingHeroWinnerCreatesGoldToken",
                text: "",
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
                    type: "wager",
                    prize: {
                      type: "create-token",
                      token: "gold",
                      creator: "token-controller",
                      controller: "winner",
                    },
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
    nextTimeWouldLoseWagerTurnInsteadMayDiscard: {
      kind: "resolution",
      effect: {
        type: "replacement",
        replacementKind: "outcome",
        replaces: {
          name: "wager-loss",
        },
        modification: {
          type: "optional",
          effect: {
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
          then: {
            type: "win-wager",
          },
        },
        duration: "this-turn",
      },
    },
  }),
});
export const { red: cheatingScoundrelRed } = cheatingScoundrel.cards;
