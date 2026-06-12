import type { LocationCard } from "@tcg/lorcana-types";
import { sugarRushSpeedwayFinishLineI18n } from "./035-sugar-rush-speedway-finish-line.i18n";

export const sugarRushSpeedwayFinishLine: LocationCard = {
  id: "kh2",
  canonicalId: "ci_jO7",
  reprints: ["set6-035"],
  cardType: "location",
  name: "Sugar Rush Speedway",
  version: "Finish Line",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 35,
  rarity: "common",
  cost: 2,
  willpower: 7,
  moveCost: 6,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_60630688715e45079236d447087a9a83",
    tcgPlayer: 592001,
  },
  text: [
    {
      title: "BRING IT HOME, LITTLE ONE!",
      description:
        "When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
    },
  ],
  abilities: [
    {
      id: "cxj-1",
      name: "BRING IT HOME, LITTLE ONE!",
      trigger: {
        event: "move",
        on: "CHARACTERS_HERE",
        restrictions: [
          {
            type: "from-location",
          },
        ],
        timing: "when",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              target: {
                selector: "self",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["location"],
              },
              type: "banish",
            },
            {
              amount: 3,
              type: "gain-lore",
            },
            {
              amount: 3,
              target: "CONTROLLER",
              type: "draw",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
      type: "triggered",
    },
  ],
  i18n: sugarRushSpeedwayFinishLineI18n,
};
