import { bloodDebt } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/deadwood-rumbler.generated.ts";

export const deadwoodRumbler = definePitchFamily(fabPitchFamilies["deadwood-rumbler"], {
  keywords: [bloodDebt],

  abilities: () => ({
    drawDiscardBanish: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "discard",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              count: 1,
              random: true,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "compare-amount",
              amount: {
                type: "count",
                what: "discarded-this-way",
                filter: { power: { op: "gte", value: 6 } },
              },
              comparison: { op: "gte", value: 1 },
            },
            then: {
              type: "banish",
              target: {
                selector: "object",
                declared: "at-resolution",
                zones: ["graveyard"],
                count: 1,
              },
            },
          },
        ],
      },
    },
  }),
});
export const {
  red: deadwoodRumblerRed,
  yellow: deadwoodRumblerYellow,
  blue: deadwoodRumblerBlue,
} = deadwoodRumbler.cards;
