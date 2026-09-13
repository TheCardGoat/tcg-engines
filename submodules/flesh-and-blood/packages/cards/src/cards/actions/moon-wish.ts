import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/moon-wish.generated.ts";

export const moonWish = definePitchFamily(fabPitchFamilies["moon-wish"], {
  abilities: () => ({
    playMoveToDeck: {
      kind: "static",
      staticKind: "play",
      playEffect: {
        role: "alternative-cost",
        cost: {
          class: "effect",
          type: "move-to-deck",
          from: "hand",
          position: "top",
          count: 1,
        },
        optional: true,
      },
    },
    triggeredHitSequenceSearchSunKissShuffle: {
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
              type: "search",
              zones: ["deck"],
              filter: {
                name: "Sun Kiss",
              },
              mayFail: true,
              to: {
                zone: "hand",
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

export const { red: moonWishRed, yellow: moonWishYellow, blue: moonWishBlue } = moonWish.cards;
