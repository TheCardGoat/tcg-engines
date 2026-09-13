import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/inflame.generated.ts";

export const inflame = definePitchFamily(fabPitchFamilies["inflame"], {
  keywords: [goAgain],
  abilities: () => ({
    attackInflamePlayedAnotherRedTurnReturnPhoenixFlameGraveyardHand: {
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
              name: "Inflame",
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
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                name: "Phoenix Flame",
              },
              count: 1,
            },
            to: {
              zone: "hand",
            },
          },
        },
      },
    },
  }),
});

export const { red: inflameRed } = inflame.cards;
