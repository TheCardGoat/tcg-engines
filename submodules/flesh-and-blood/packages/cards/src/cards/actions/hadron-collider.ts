import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hadron-collider.generated.ts";
import { crank } from "../shared/keywords.ts";

export const hadronCollider = definePitchFamily(fabPitchFamilies["hadron-collider"], {
  parameters: {
    red: { value1: 4, value2: 1 },
    yellow: { value1: 3, value2: 1 },
    blue: { value1: 2, value2: 1 },
  },
  keywords: [crank],
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
    triggeredBoostIfYouDoDestroyModifyNumericPowerCountSteamThisTurn: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "boost",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "boosted-card",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                subtypes: ["Attack"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "if-you-do",
          effect: {
            type: "destroy",
            target: {
              selector: "self",
            },
          },
          then: {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: {
              type: "count",
              what: "counters-on-source",
              counter: {
                kind: "named",
                name: "steam",
              },
            },
            target: {
              selector: "this-attack",
            },
            duration: "this-turn",
          },
        },
      },
    },
  }),
});

export const {
  red: hadronColliderRed,
  yellow: hadronColliderYellow,
  blue: hadronColliderBlue,
} = hadronCollider.cards;
