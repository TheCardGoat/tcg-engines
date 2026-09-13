import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/remembrance.generated.ts";

export const remembrance = definePitchFamily(fabPitchFamilies["remembrance"], {
  abilities: () => ({
    shuffleUp3ActionFromGraveyardIntoDeck: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                typeBox: {
                  types: ["Action"],
                },
              },
              count: { type: "up-to", amount: 3 },
            },
            to: {
              zone: "deck",
            },
          },
          {
            type: "shuffle",
            zone: "deck",
          },
        ],
      },
    },
    banishRemembrance: {
      kind: "resolution",
      effect: {
        type: "banish",
        target: {
          selector: "self",
        },
      },
    },
  }),
});

export const { yellow: remembranceYellow } = remembrance.cards;
