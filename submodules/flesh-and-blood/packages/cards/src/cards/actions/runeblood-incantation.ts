import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/runeblood-incantation.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const runebloodIncantation = definePitchFamily(fabPitchFamilies["runeblood-incantation"], {
  parameters: { red: 3, yellow: 2, blue: 1 },
  keywords: [goAgain],
  abilities: (count) => ({
    continuousReplacementEnterArenaAddCounterVerseWhileInArena: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "enter-arena",
          subject: "self",
        },
        modification: {
          type: "add-counter",
          counter: {
            kind: "named",
            name: "verse",
          },
          count,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    triggeredActionPhaseStartUnlessDestroyIfYouDoRemoveCountersVerseRunebloodIncantationCreateTokenRunechant:
      {
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
            type: "unless",
            effect: {
              type: "destroy",
              target: {
                selector: "self",
              },
            },
            escape: {
              type: "if-you-do",
              effect: {
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "verse",
                },
                count: 1,
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    name: "Runeblood Incantation",
                  },
                  count: 1,
                },
              },
              then: {
                type: "create-token",
                token: "runechant",
                controller: "controller",
              },
            },
          },
        },
      },
  }),
});

export const {
  red: runebloodIncantationRed,
  yellow: runebloodIncantationYellow,
  blue: runebloodIncantationBlue,
} = runebloodIncantation.cards;
