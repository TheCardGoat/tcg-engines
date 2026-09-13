import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mini-forcefield.generated.ts";
import { crank } from "../shared/keywords.ts";

export const miniForcefield = definePitchFamily(fabPitchFamilies["mini-forcefield"], {
  parameters: {
    red: { value1: 4, value2: 1 },
    yellow: { value1: 3, value2: 1 },
    blue: { value1: 2, value2: 1 },
  },
  keywords: [
    crank,
    {
      name: "ward",
      value: {
        type: "x",
      },
    },
  ],
  abilities: ({ value1, value2 }) => ({
    continuousReplacementEnterArenaAddCounterSteamWhileInArena: {
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
            name: "steam",
          },
          count: value1,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    triggeredStartPhaseUnlessDestroyRemoveCountersSteam: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "start-phase",
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
            type: "remove-counters",
            counter: {
              kind: "named",
              name: "steam",
            },
            count: value2,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    continuousGrantPropertyWardCountSteamWhileInArena: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "grant-property",
        property: {
          kind: "keyword",
          keyword: {
            name: "ward",
            value: {
              type: "count",
              what: "counters-on-source",
              counter: {
                kind: "named",
                name: "steam",
              },
            },
          },
        },
        target: {
          selector: "self",
        },
        duration: "while-in-arena",
      },
    },
  }),
});

export const {
  red: miniForcefieldRed,
  yellow: miniForcefieldYellow,
  blue: miniForcefieldBlue,
} = miniForcefield.cards;
