import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/defense-reactions/blood-in-the-water.generated.ts";

export const bloodInTheWater = definePitchFamily(fabPitchFamilies["blood-in-the-water"], {
  abilities: () => ({
    defendWithWateryGrave: {
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
                type: "choice",
                options: [
                  {
                    type: "discard",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["hand"],
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                  {
                    type: "destroy",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "controller",
                      zones: ["deck"],
                      position: "top",
                      count: 1,
                    },
                    outputBinding: "it",
                  },
                ],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  hasKeyword: "watery-grave",
                },
              },
              then: {
                type: "modify-numeric",
                property: "defense",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: bloodInTheWaterRed } = bloodInTheWater.cards;
