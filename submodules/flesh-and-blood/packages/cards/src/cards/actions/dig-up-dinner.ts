import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/dig-up-dinner.generated.ts";

import { attackActionFilter } from "@tcg/flesh-and-blood-types";

import { goAgain } from "../shared/keywords.ts";

export const digUpDinner = definePitchFamily(fabPitchFamilies["dig-up-dinner"], {
  keywords: [goAgain],
  abilities: () => ({
    choose3RandomGraveyardShuffleAllAttackAction6: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "choose-card",
            random: true,
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              count: 3,
            },
            outputBinding: "them",
          },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: attackActionFilter({
                inObjectBinding: "them",
                power: {
                  op: "gte",
                  value: 6,
                },
              }),
              count: {
                type: "all",
              },
            },
            to: {
              zone: "deck",
              shuffle: true,
            },
          },
          {
            type: "gain-life",
            amount: {
              type: "count",
              what: "shuffled-this-way",
            },
            target: {
              selector: "controller",
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
  }),
});
export const { blue: digUpDinnerBlue } = digUpDinner.cards;
