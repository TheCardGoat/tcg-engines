import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/doomsaying.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const doomsaying = definePitchFamily(fabPitchFamilies["doomsaying"], {
  keywords: [goAgain],
  abilities: () => ({
    atBeginningEndPhasePutDoomCounterThenEach: {
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
          type: "sequence",
          steps: [
            {
              type: "add-counter",
              counter: {
                kind: "named",
                name: "doom",
              },
              count: 1,
              target: {
                selector: "self",
              },
            },
            {
              type: "destroy",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "each",
                zones: ["permanent"],
                filter: {
                  typeBox: {
                    subtypes: ["Aura"],
                  },
                },
                count: {
                  type: "count",
                  what: "counters-on-source",
                  counter: {
                    kind: "named",
                    name: "doom",
                  },
                },
              },
            },
          ],
        },
      },
    },
  }),
});
export const { red: doomsayingRed } = doomsaying.cards;
