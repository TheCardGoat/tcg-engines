import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/sow-tomorrow.generated.ts";

export const sowTomorrow = definePitchFamily(fabPitchFamilies["sow-tomorrow"], {
  keywords: [goAgain],

  abilities: () => ({
    returnEarthOrElementalCardAndOpt: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "controller",
              zones: ["graveyard"],
              filter: {
                and: [
                  {
                    or: [
                      { typeBox: { supertypes: ["Earth"] } },
                      { typeBox: { supertypes: ["Elemental"] } },
                    ],
                  },
                  {
                    typeBox: { types: ["Action"] },
                  },
                  { cost: { op: "gte", value: 0 } },
                ],
              },
              count: 1,
            },
            to: {
              zone: "deck",
              position: "bottom",
            },
          },
          {
            type: "banish",
            target: {
              selector: "self",
            },
          },
        ],
      },
    },
    createEmbodimentOfEarthWhenPlayedFromArsenal: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "played-card",
          },
          from: ["arsenal"],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "draw",
          count: 1,
          player: "controller",
        },
      },
    },
  }),
});
export const {
  red: sowTomorrowRed,
  yellow: sowTomorrowYellow,
  blue: sowTomorrowBlue,
} = sowTomorrow.cards;
