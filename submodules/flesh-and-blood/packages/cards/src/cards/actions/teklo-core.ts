import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/teklo-core.generated.ts";

export const tekloCore = definePitchFamily(fabPitchFamilies["teklo-core"], {
  keywords: [
    {
      name: "specialization",
      hero: "Dash",
    },
  ],
  abilities: () => ({
    tekloCoreEntersArenaWithNumber2SteamCountersOn: {
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
    whenTekloCoreHasNoSteamCountersOnDestroy: {
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
    atBeginningActionPhaseRemoveSteamCounterFromTekloCoreGainResource: {
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
              amount: 2,
            },
          ],
        },
      },
    },
  }),
});

export const { blue: tekloCoreBlue } = tekloCore.cards;
