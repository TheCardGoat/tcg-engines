import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hyper-driver.generated.ts";

export const hyperDriverFamily = definePitchFamily(fabPitchFamilies["hyper-driver"], {
  parameters: {
    blue: {
      entersArenaSteamCounters: {
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
            count: 1,
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
      boostRemoveSteamCounterGainResource: {
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
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "steam",
                },
                count: 1,
                target: {
                  selector: "self",
                },
              },
              {
                type: "gain-resources",
                amount: 1,
              },
            ],
          },
        },
        limit: {
          count: 1,
          per: "turn",
        },
      },
    },
    red: {
      entersArena3SteamCounters: {
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
            count: 3,
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
      },
      noneDestroy: {
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
      boostRemoveSteamCounterGainResource: {
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
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "steam",
                },
                count: 1,
                target: {
                  selector: "self",
                },
              },
              {
                type: "gain-resources",
                amount: 1,
              },
            ],
          },
        },
        limit: {
          count: 1,
          per: "turn",
        },
      },
    },
    yellow: {
      entersArena2SteamCounters: {
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
            count: 2,
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
      boostRemoveSteamCounterGainResource: {
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
                type: "remove-counters",
                counter: {
                  kind: "named",
                  name: "steam",
                },
                count: 1,
                target: {
                  selector: "self",
                },
              },
              {
                type: "gain-resources",
                amount: 1,
              },
            ],
          },
        },
        limit: {
          count: 1,
          per: "turn",
        },
      },
    },
  },
  abilities: (abilities) => abilities,
});

export const {
  blue: hyperDriverBlue,
  red: hyperDriverRed,
  yellow: hyperDriverYellow,
} = hyperDriverFamily.cards;
