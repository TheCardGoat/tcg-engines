import type { LocationCard } from "@tcg/lorcana-types";
import { merlinsShopAndSmithyMagicalMarketI18n } from "./068-merlins-shop-and-smithy-magical-market.i18n";

export const merlinsShopAndSmithyMagicalMarket: LocationCard = {
  id: "12o",
  canonicalId: "ci_12o",
  slug: "lorcana-ci_12o",
  printings: [
    {
      id: "set14-068",
      artId: "set14-068",
      setCode: "set14",
      collectorNumber: "68",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-068"],
  cardType: "location",
  name: "Merlin's Shop and Smithy",
  version: "Magical Market",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 68,
  rarity: "uncommon",
  cost: 2,
  willpower: 6,
  moveCost: 2,
  lore: 0,
  inkable: true,
  text: [
    {
      title: "Open for Business",
      description:
        "Once during your turn, whenever a character moves here, draw a card and gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "12o-1",
      name: "Open for Business",
      text: "Open for Business Once during your turn, whenever a character moves here, draw a card and gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "move",
        on: "CHARACTERS_HERE",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-lore",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  classifications: ["Hyperia City"],
  i18n: merlinsShopAndSmithyMagicalMarketI18n,
};
