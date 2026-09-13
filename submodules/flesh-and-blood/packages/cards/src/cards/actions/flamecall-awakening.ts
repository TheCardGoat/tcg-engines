import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/flamecall-awakening.generated.ts";

import { goAgain } from "../shared/keywords.ts";

export const flamecallAwakening = definePitchFamily(fabPitchFamilies["flamecall-awakening"], {
  keywords: [goAgain],
  abilities: () => ({
    whenAttackFlamecallAwakeningIfVePlayedAnotherRed: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "attack",
            relationship: {
              kind: "any",
            },
            filter: {
              name: "Flamecall Awakening",
            },
          },
        },
        state: {
          type: "performed-this-turn",
          event: "play-another-red-card",
          player: "controller",
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
                  name: "Phoenix Flame",
                },
                mayFail: true,
                to: {
                  zone: "hand",
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
export const { red: flamecallAwakeningRed } = flamecallAwakening.cards;
