import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/plasma-mainline.generated.ts";

export const plasmaMainline = definePitchFamily(fabPitchFamilies["plasma-mainline"], {
  abilities: () => ({
    plasmaMainlineEntersArena5SteamCounters: {
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
          count: 5,
          target: {
            selector: "self",
          },
        },
        duration: "while-in-arena",
      },
    },
    noSteamCountersDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "state",
        state: {
          type: "has-counter",
          counter: {
            kind: "named",
            name: "steam",
          },
          target: {
            selector: "self",
          },
          comparison: {
            op: "eq",
            value: 0,
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
    mechanologistItemCost2LessEntersArenaMoveSteamCounterPlasmaMainlineItem: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Mechanologist"],
                subtypes: ["Item"],
              },
              cost: {
                op: "lte",
                value: 2,
              },
            },
            bindAs: "it",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-counter",
            counter: {
              kind: "named",
              name: "steam",
            },
            from: {
              selector: "self",
            },
            to: {
              selector: "binding",
              binding: "it",
            },
          },
        },
      },
    },
  }),
});

export const { red: plasmaMainlineRed } = plasmaMainline.cards;
