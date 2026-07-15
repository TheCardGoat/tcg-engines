import type { LocationCard } from "@tcg/lorcana-types";
import { sugarRushSpeedwayFinishLineEnchantedI18n } from "./207-sugar-rush-speedway-finish-line-enchanted.i18n";

export const sugarRushSpeedwayFinishLineEnchanted: LocationCard = {
  id: "R3f",
  canonicalId: "ci_jO7",
  slug: "lorcana-ci_jO7",
  printings: [
    {
      id: "set6-207-enchanted",
      artId: "ci_jO7-enchanted",
      setCode: "set6",
      collectorNumber: "207",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set6-035"],
  cardType: "location",
  name: "Sugar Rush Speedway",
  version: "Finish Line",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "006",
  cardNumber: 207,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  willpower: 7,
  moveCost: 6,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_60630688715e45079236d447087a9a83",
    tcgPlayer: "592001",
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
  i18n: sugarRushSpeedwayFinishLineEnchantedI18n,
};
