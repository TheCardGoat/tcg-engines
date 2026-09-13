import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bridge-of-damnation.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const bridgeOfDamnation = definePitchFamily(fabPitchFamilies["bridge-of-damnation"], {
  keywords: [goAgain],
  abilities: () => ({
    atStartEachTurnDestroyUnlessPutZombieFrom: {
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
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["banished"],
              filter: {
                typeBox: {
                  subtypes: ["Zombie"],
                },
              },
              count: 1,
            },
            to: {
              zone: "graveyard",
            },
          },
        },
      },
    },
  }),
});
export const { blue: bridgeOfDamnationBlue } = bridgeOfDamnation.cards;
