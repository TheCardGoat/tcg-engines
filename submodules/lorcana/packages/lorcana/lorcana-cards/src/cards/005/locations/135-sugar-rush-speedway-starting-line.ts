import type { LocationCard } from "@tcg/lorcana-types";
import { sugarRushSpeedwayStartingLineI18n } from "./135-sugar-rush-speedway-starting-line.i18n";

export const sugarRushSpeedwayStartingLine: LocationCard = {
  id: "ibi",
  canonicalId: "ci_ibi",
  reprints: ["set5-135"],
  cardType: "location",
  name: "Sugar Rush Speedway",
  version: "Starting Line",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 135,
  rarity: "rare",
  cost: 1,
  willpower: 5,
  moveCost: 0,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_38b31e4f9b2043259a5d8909cb58b8d3",
    tcgPlayer: 559787,
  },
  text: [
    {
      title: "ON YOUR MARKS!",
      description:
        "Once per turn, you may {E} chosen character here and deal them 1 damage to move them to another location for free.",
    },
  ],
  abilities: [
    {
      id: "gzg-1",
      name: "ON YOUR MARKS!",
      text: "ON YOUR MARKS! Once per turn, you may exert chosen character here and deal them 1 damage to move them to another location for free.",
      type: "activated",
      cost: {},
      usesPerTurn: 1,
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "exert",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "same-location-as-source",
                  },
                ],
              },
            },
            {
              type: "deal-damage",
              amount: 1,
              target: {
                ref: "previous-target",
              },
            },
            {
              type: "move-to-location",
              character: {
                ref: "previous-target",
              },
              location: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
                excludeSelf: true,
              },
              cost: "free",
            },
          ],
        },
        type: "optional",
      },
    },
  ],
  i18n: sugarRushSpeedwayStartingLineI18n,
};
