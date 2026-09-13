import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/malefic-incantation.generated.ts";
import { goAgain } from "../shared/keywords.ts";

/**
 * Model notes (hand-authored):
 * - Verse counters are removed from this aura, not from the attack that was played.
 */
export const maleficIncantation = definePitchFamily(fabPitchFamilies["malefic-incantation"], {
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
    triggeredCounterRemovedDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "counter-removed",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "object",
          },
          remaining: 0,
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
    triggeredPlayIfYouDoRemoveCountersVerseCreateTokenRunechant: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "played-card",
            relationship: {
              kind: "any",
            },
            filter: attackActionFilter(),
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "if-you-do",
          effect: {
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "verse",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
          then: {
            type: "create-token",
            token: "runechant",
            controller: "controller",
          },
        },
      },
      limit: {
        count: 1,
        per: "turn",
      },
    },
  }),
});

export const {
  red: maleficIncantationRed,
  yellow: maleficIncantationYellow,
  blue: maleficIncantationBlue,
} = maleficIncantation.cards;
