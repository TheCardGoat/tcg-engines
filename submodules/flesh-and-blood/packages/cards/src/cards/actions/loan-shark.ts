import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/loan-shark.generated.ts";

/**
 * Model notes (hand-authored): ETB creates 2 Gold; end-phase tax if you have not
 * created or stolen a Gold this turn (the ETB Gold itself pays the tax this turn).
 */
export const loanShark = definePitchFamily(fabPitchFamilies["loan-shark"], {
  keywords: [goAgain],
  abilities: () => ({
    entersArenaCreate2GoldTokens: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          token: "gold",
          controller: "controller",
          count: 2,
        },
      },
    },
    beginningEndPhaseHaventCreatedStolenGoldTurnDestroyThenLose2LifeUnlessDiscard: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "end-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
        state: {
          type: "not",
          condition: {
            type: "performed-this-turn",
            event: "create-or-steal-gold",
            player: "controller",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            {
              type: "unless",
              effect: {
                type: "lose-life",
                amount: 2,
                target: {
                  selector: "controller",
                },
              },
              escape: {
                type: "discard",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hand"],
                  count: 1,
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { yellow: loanSharkYellow } = loanShark.cards;
