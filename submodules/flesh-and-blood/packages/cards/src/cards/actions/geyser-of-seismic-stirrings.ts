import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/geyser-of-seismic-stirrings.generated.ts";
import { goAgain } from "../shared/keywords.ts";
export const geyserOfSeismicStirrings = definePitchFamily(
  fabPitchFamilies["geyser-of-seismic-stirrings"],
  {
    parameters: pitchMap({ red: 3, yellow: 2, blue: 1 }),
    keywords: [goAgain],
    abilities: (amount) => ({
      staticContinuousReplacementAddCounter: {
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
              name: "energy",
            },
            count: amount,
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
      },
      staticTriggeredCounterRemovedDestroy: {
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
      staticTriggeredEndPhaseIfDoRemoveCountersCreateToken: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
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
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "if-you-do",
            effect: {
              type: "remove-counters",
              counter: {
                kind: "named",
                name: "energy",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            then: {
              type: "create-token",
              token: "seismic-surge",
              controller: "controller",
            },
          },
        },
      },
    }),
  },
);
export const {
  red: geyserOfSeismicStirringsRed,
  yellow: geyserOfSeismicStirringsYellow,
  blue: geyserOfSeismicStirringsBlue,
} = geyserOfSeismicStirrings.cards;
