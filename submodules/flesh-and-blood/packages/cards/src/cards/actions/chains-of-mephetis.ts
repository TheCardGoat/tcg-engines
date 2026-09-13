import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/chains-of-mephetis.generated.ts";

import { bloodDebt } from "../shared/keywords.ts";

export const chainsOfMephetis = definePitchFamily(fabPitchFamilies["chains-of-mephetis"], {
  keywords: [bloodDebt],
  abilities: () => ({
    mayPlayFromBanishedZoneIfDoEntersArena: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
        then: {
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
              name: "doom",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
          duration: "while-in-arena",
        },
      },
    },
    atStartTurnDestroyUnlessRemoveDoomCounterFrom: {
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
              name: "doom",
            },
            count: 1,
            target: {
              selector: "self",
            },
          },
        },
      },
    },
    ifHeroWouldDrawDuringActionPhaseInsteadThey: {
      kind: "static",
      staticKind: "continuous",
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: {
          name: "draw",
        },
        modification: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "it",
                },
                duration: "this-turn",
              },
            },
          ],
        },
        duration: "while-in-arena",
      },
    },
  }),
});
export const { blue: chainsOfMephetisBlue } = chainsOfMephetis.cards;
