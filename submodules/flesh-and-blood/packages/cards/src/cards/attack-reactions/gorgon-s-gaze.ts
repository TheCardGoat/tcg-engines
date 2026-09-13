import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/attack-reactions/gorgon-s-gaze.generated.ts";

export const gorgonSGaze = definePitchFamily(fabPitchFamilies["gorgon-s-gaze"], {
  abilities: () => ({
    createSlither: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "slither",
        controller: "controller",
        to: {
          zone: "hand",
        },
      },
    },
    banishAndReplayDefenders: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "any",
              zones: ["combat-chain"],
              filter: attackActionFilter({ defending: true }),
              count: {
                type: "all",
              },
            },
            outputBinding: "banished",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-numeric",
              binding: "pitched-this-way-chi-card",
              comparison: { op: "eq", value: 1 },
            },
            then: {
              type: "optional",
              effect: {
                type: "play-card",
                fromZones: ["banished"],
                source: {
                  selector: "binding",
                  binding: "banished",
                },
                costModification: "free",
                duration: "this-combat-chain",
              },
            },
          },
        ],
      },
    },
  }),
});

export const { yellow: gorgonSGazeYellow } = gorgonSGaze.cards;
