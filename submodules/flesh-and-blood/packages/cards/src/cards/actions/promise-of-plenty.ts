import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/promise-of-plenty.generated.ts";
import { goAgain } from "../shared/keywords.ts";

export const promiseOfPlenty = definePitchFamily(fabPitchFamilies["promise-of-plenty"], {
  abilities: () => ({
    triggeredHitForEachConditionalZoneCountMoveCard: {
      kind: "static",
      staticKind: "triggered",
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
          type: "for-each",
          target: {
            selector: "each-hero",
          },
          effect: {
            type: "conditional",
            condition: {
              type: "zone-count",
              zone: "arsenal",
              // Printed "each hero … their arsenal": the iterated hero, not
              // the controller (for-each seat resolution).
              player: "iteration-subject",
              comparison: {
                op: "eq",
                value: 0,
              },
            },
            then: {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                // Printed "the top card of their deck": the iterated hero.
                player: "iteration-subject",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              to: {
                zone: "arsenal",
                visibility: "face-down",
              },
            },
          },
        },
      },
    },
    triggeredPlayGrantPropertyPermanent: {
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
            kind: "source",
            selector: "played-card",
          },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "grant-property",
          property: {
            kind: "keyword",
            keyword: goAgain,
          },
          target: {
            selector: "self",
          },
          duration: "permanent",
        },
      },
    },
  }),
});

export const {
  red: promiseOfPlentyRed,
  yellow: promiseOfPlentyYellow,
  blue: promiseOfPlentyBlue,
} = promiseOfPlenty.cards;
