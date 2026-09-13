import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/blocks/sunken-treasure.generated.ts";

export const sunkenTreasure = definePitchFamily(fabPitchFamilies["sunken-treasure"], {
  abilities: () => ({
    turnGraveyardCardFaceDownForGold: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
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
                type: "turn-face-down",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  zones: ["graveyard"],
                  count: 1,
                },
                outputBinding: "it",
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  color: ["yellow"],
                },
              },
              then: {
                type: "create-token",
                token: "gold",
                controller: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { blue: sunkenTreasureBlue } = sunkenTreasure.cards;
