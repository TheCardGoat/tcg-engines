import { crank } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/null-time-zone.generated.ts";

export const nullTimeZone = definePitchFamily(fabPitchFamilies["null-time-zone"], {
  keywords: [crank],
  abilities: () => ({
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
    startTurnDestroyUnlessRemoveSteamCounter: {
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
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    entersArenaNameNamedCantPitchedPlayedHandArena: {
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
            kind: "source",
            selector: "moved-object",
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
                    playedFromZones: ["hand"],
                  },
                  duration: "while-in-arena",
                },
                {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "play",
                  filter: {
                    name: "chosen",
                    playedFromZones: ["hand"],
                  },
                  duration: "while-in-arena",
                },
              ],
            },
          ],
        },
      },
    },
  }),
});

export const { blue: nullTimeZoneBlue } = nullTimeZone.cards;
