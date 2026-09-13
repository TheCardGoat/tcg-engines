import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/assembly-module.generated.ts";

import { crank } from "../shared/keywords.ts";

export const assemblyModule = definePitchFamily(fabPitchFamilies["assembly-module"], {
  keywords: [crank],
  abilities: () => ({
    entersArenaStreamCounter: {
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
            name: "stream",
          },
          count: 1,
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
    actionSearchDeckHyperDriverPutIntoArenaThen: {
      kind: "activated",
      abilityType: "action",
      cost: {
        class: "effect",
        type: "tap-self",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "search",
            zones: ["deck"],
            filter: {
              name: "Hyper Driver",
            },
            mayFail: true,
            to: {
              zone: "permanent",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
  }),
});
export const { blue: assemblyModuleBlue } = assemblyModule.cards;
