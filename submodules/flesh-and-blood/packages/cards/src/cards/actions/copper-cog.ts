import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/copper-cog.generated.ts";

import { crank, unlimited } from "../shared/keywords.ts";

export const copperCog = definePitchFamily(fabPitchFamilies["copper-cog"], {
  keywords: [unlimited, crank],
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
    atStartTurnDestroyUnlessRemoveSteamCounterFrom: {
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
  }),
});
export const { blue: copperCogBlue } = copperCog.cards;
