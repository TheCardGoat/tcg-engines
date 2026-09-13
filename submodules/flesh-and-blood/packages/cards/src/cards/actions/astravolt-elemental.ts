import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/astravolt-elemental.generated.ts";

export const astravoltElemental = definePitchFamily(fabPitchFamilies["astravolt-elemental"], {
  abilities: () => ({
    whenAttacksMayDiscardInstantIfDoDrawCreate: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {
                typeBox: {
                  types: ["Instant"],
                },
              },
              count: 1,
            },
            outputBinding: "it",
          },
          then: {
            type: "sequence",
            steps: [
              {
                type: "draw",
                count: 1,
                player: "controller",
              },
              {
                type: "create-token",
                token: "embodiment-of-lightning",
                controller: "controller",
              },
            ],
          },
        },
      },
    },
  }),
});
export const { red: astravoltElementalRed } = astravoltElemental.cards;
