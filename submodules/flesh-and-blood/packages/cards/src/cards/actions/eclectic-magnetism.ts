import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/eclectic-magnetism.generated.ts";

export const eclecticMagnetism = definePitchFamily(fabPitchFamilies["eclectic-magnetism"], {
  abilities: () => ({
    whenAttacksMayPlayNonAttackActionChainLink: {
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
            type: "play-card",
            fromZones: ["hand"],
            source: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              filter: {
                typeBox: {
                  types: ["Action"],
                  excludeSubtypes: ["Attack"],
                },
              },
            },
            duration: "this-chain-link",
            asType: "instant",
          },
        },
      },
    },
  }),
});
export const { red: eclecticMagnetismRed } = eclecticMagnetism.cards;
