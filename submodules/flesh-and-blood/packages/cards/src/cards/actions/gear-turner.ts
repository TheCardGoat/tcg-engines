import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/gear-turner.generated.ts";

export const gearTurner = definePitchFamily(fabPitchFamilies["gear-turner"], {
  abilities: () => ({
    whenHitsMaySearchDeckCogPutIntoArena: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
          type: "sequence",
          steps: [
            {
              type: "optional",
              effect: {
                type: "search",
                zones: ["deck"],
                filter: {
                  typeBox: {
                    subtypes: ["Cog"],
                  },
                },
                mayFail: true,
                to: {
                  zone: "permanent",
                },
              },
            },
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
    },
  }),
});
export const { red: gearTurnerRed } = gearTurner.cards;
