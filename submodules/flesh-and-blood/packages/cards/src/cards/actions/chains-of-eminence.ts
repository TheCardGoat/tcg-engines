import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chains-of-eminence.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const chainsOfEminence = definePitchFamily(fabPitchFamilies["chains-of-eminence"], {
  keywords: [goAgain],
  abilities: () => ({
    whenChainsEminenceEntersArenaNameNamedCanT: {
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
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "name-card",
              suggestions: ["your-hand", "visible-cards"],
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "pitch",
                  filter: {
                    name: "chosen",
                  },
                  duration: "while-in-arena",
                },
                {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "play",
                  filter: {
                    name: "chosen",
                  },
                  duration: "while-in-arena",
                },
                {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "defend",
                  filter: {
                    name: "chosen",
                  },
                  duration: "while-in-arena",
                },
              ],
            },
          ],
        },
      },
    },
    atBeginningActionPhaseDestroyChainsEminence: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
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
});
export const { red: chainsOfEminenceRed } = chainsOfEminence.cards;
